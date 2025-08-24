const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIcpC_k_E0Jsq9RaWaIXimeS-SJ1CluNs",
  authDomain: "oppotranin-backend.firebaseapp.com",
  projectId: "oppotranin-backend",
  storageBucket: "oppotranin-backend.firebasestorage.app",
  messagingSenderId: "646145986849",
  appId: "1:646145986849:web:d55cafaa12b5e96e936e60",
  measurementId: "G-XCB210YE2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

module.exports = { db };
