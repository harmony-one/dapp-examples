const { getRandomWallet } = require('./keygen');
const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./keys/newpuzzle.json");
const { payout } = require('./contract/call')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://newpuzzle-35360.firebaseio.com"
});
const firestore = admin.firestore();

exports.play = functions.https.onRequest(async (req, res) => {
    switch (req.method) {
        case 'GET':
            // Good
            break;
        default:
            res.status(403).send('Forbidden!');
            return;
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    try {
        const { private_key, address } = getRandomWallet();
        let session = await firestore.collection('sessions').add({
            address,
            private_key,
            saved: false,
            tx: '',
        })
        res.status(200).json({
            session_id: session.id,
            address,
        })
    } catch (err) {
        // Bad request
        // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
        res.status(400).json({});
    }
});

const polishAddress = address =>  address.startsWith('0x') ? address : `0x${address}`;

exports.payout = functions.https.onRequest(async (req, res) => {
    switch (req.method) {
        case 'POST':
            // Good
            break;
        default:
            res.status(403).send('Forbidden!');
            return;
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    try {
        let { address, id, sequence, level }= req.query

        const doc = await firestore.collection('sessions').doc(id).get();
        if (doc.empty) {
            res.status(401).json({success: 'empty'});
        } else {
            const data = doc.data();
            const doc_address = data.address;

            if (doc_address != address) {
                console.log('unauthorized')
                res.status(401).json({ success: 1 })
            } else if (data.saved) {
                res.status(401).json({ success: 2 })
            } else {
                address = polishAddress(address)
                // Now call smart contract to payout
                console.log('before calling payout', address, 'level ', level, 'sequence', sequence)
                payout(address, level, sequence).then(
                    async r => {
                        console.log('after calling payout')
                        console.log('tx hash', r.transaction.receipt.transactionHash)
                        const doc = firestore.collection('sessions').doc(id);
                        await doc.update({
                            saved: true,
                            tx: r.transaction.receipt.transactionHash,
                        });
                        res.status(200).json({
                            tx: r.transaction.receipt.transactionHash,
                            success: 0,
                        })
                    }
                ).catch(
                    err => {
                        console.log('error when doing payout', err)
                        res.status(400).json({success: 10})
                    }
                )
            }
        }
    } catch (err) {
        // Bad request
        // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
        console.log(err);
        res.status(400).json({success: 4});
    }
});
