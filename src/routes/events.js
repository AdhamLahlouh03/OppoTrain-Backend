const admin = require("firebase-admin");

// Load your service account key (download from Firebase Console → Project Settings → Service accounts)
const serviceAccount = require("../../serviceAccountKey.json");

// Initialize only once
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
module.exports = { admin, db };
