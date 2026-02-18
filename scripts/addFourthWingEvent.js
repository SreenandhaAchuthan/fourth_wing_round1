// Add Fourth Wing Event to Firebase
// Run this script once to add the event to your Firestore database

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your Firebase config (same as in src/firebase.js)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addFourthWingEvent() {
    try {
        const eventData = {
            title: "Fourth Wing",
            description: "Join us for an amazing event!",
            date: "2026-01-30",
            time: "00:00",
            participantLimit: 100,
            registrations: [],
            hasPrelims: false,
            eventLink: "", // Optional: external event link
            createdAt: new Date(),
            isEnded: true // Set to false if event is still active
        };

        const docRef = await addDoc(collection(db, "events"), eventData);
        console.log("✅ Fourth Wing event added successfully!");
        console.log("Document ID:", docRef.id);
        console.log("\nEvent details:");
        console.log(JSON.stringify(eventData, null, 2));
    } catch (error) {
        console.error("❌ Error adding event:", error);
    }
}

// Run the function
addFourthWingEvent()
    .then(() => {
        console.log("\n✅ Script completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Script failed:", error);
        process.exit(1);
    });
