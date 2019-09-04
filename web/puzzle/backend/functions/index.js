const { getRandomWallet } = require('./keygen');
const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./keys/newpuzzle.json");
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
        const { address, id }= req.query
        console.log(address)
        console.log(id)
        const session = await firestore.collection('sessions').where('address', '==', address).get();
        if (session.empty) {
            res.status(401).json({});
        } else {
            let fail = false;
            session.forEach(async doc => {
                const {doc_id, doc_address, doc_private_key} = doc.data();
                if (doc_id != id) {
                    // Unauthorized.
                    fail = true;
                    return
                }

                // Now call smart contract to payout

                payout(address, level, sequence)
                res.status(200).json({
                    doc_address,
                    doc_private_key,
                    success: true,
                });
            });
            if (fail) {
                res.status(401).json({ success: false})
            }
        }
    } catch (err) {
        // Bad request
        // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
        res.status(400).json({});
        res.json({success: false});
    }
});
