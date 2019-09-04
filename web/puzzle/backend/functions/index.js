// const axios = require('axios');
const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./keys/newpuzzle.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://newpuzzle-35360.firebaseio.com"
});
const firestore = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


