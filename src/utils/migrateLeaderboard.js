import { db } from '../firebase'; // Correct path from src/utils
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

// Note: This script is intended to be run within the context of the React app 
// or requires a Node environment with 'firebase' configured. 
// For this environment, we will create a temporary component or use the console.

const migrateLeaderboard = async () => {
    console.log("Starting migration...");
    try {
        const round1Ref = collection(db, 'round1');
        const snapshot = await getDocs(round1Ref);

        let count = 0;
        for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            if (data.status === 'completed') {
                // New path: round1/leaderboard/entries/{docId}
                const leaderboardRef = doc(db, 'round1', 'leaderboard', 'entries', docSnapshot.id);
                await setDoc(leaderboardRef, {
                    name: data.name,
                    rollNo: data.rollNo,
                    score: data.score,
                    timeTaken: data.timeTaken,
                    status: 'completed',
                    completedAt: data.completedAt
                });
                count++;
            }
        }

        if (count === 0) {
            alert("Migration finished, but NO completed exams were found in 'round1'. The 'round1_leaderboard' collection will NOT appear until there is data.");

            if (window.confirm("Do you want to create a TEST record so the collection appears?")) {
                await setDoc(doc(db, 'round1', 'leaderboard', 'entries', 'test_record'), {
                    name: "Test User",
                    rollNo: "TEST001",
                    score: 10,
                    timeTaken: 120,
                    status: 'completed',
                    completedAt: new Date()
                });
                alert("Test record created! Refresh Firebase Console now.");
            }
        } else {
            alert(`Migration Success! Copied ${count} records to 'round1_leaderboard'. Refresh Firebase Console.`);
        }

        console.log(`Migration completed. ${count} records copied to 'round1_leaderboard'.`);
    } catch (error) {
        console.error("Migration failed:", error);
        alert("Migration Error: " + error.message);
    }
};

export default migrateLeaderboard;
