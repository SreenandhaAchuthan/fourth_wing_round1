// Firebase Configuration for Round 1
// This file initializes Firebase for the standalone Round 1 exam

// Firebase configuration - uses same credentials as main app
const firebaseConfig = {
    apiKey: "AIzaSyDhCJENFE7G7y_zIK7hb_Y2ZZFp_nxGsrI",
    authDomain: "amcfossclub.firebaseapp.com",
    projectId: "amcfossclub",
    storageBucket: "amcfossclub.firebasestorage.app",
    messagingSenderId: "773142678351",
    appId: "1:773142678351:web:14f8adaccea7a51d10133a"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log('✅ Firebase initialized successfully for Round 1');

    // Export for use in exam.js
    window.firebaseDB = db;
    window.firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp;
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.warn('⚠️ Exam will continue but results will not be saved to database');
}
