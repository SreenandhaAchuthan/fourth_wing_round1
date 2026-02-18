import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import '../round1.css';

const Leaderboard = ({ onClose }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const q = query(
                    collection(db, 'round1', 'leaderboard', 'entries'),
                    where('status', '==', 'completed')
                );

                const querySnapshot = await getDocs(q);
                let data = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });

                // Client-side sorting because composite indexes might not be set up
                data.sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score; // Higher score first
                    }
                    return a.timeTaken - b.timeTaken; // Lower time first
                });

                setLeaders(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleMigration = async () => {
        if (window.confirm("Run migration to populate new leaderboard collection?")) {
            const { default: migrate } = await import('../../../utils/migrateLeaderboard');
            await migrate();
            alert("Migration done! Refresh to see results.");
        }
    };

    return (
        <div className="leaderboard-overlay">
            <div className="leaderboard-modal">
                <div className="leaderboard-header">
                    <h2>
                        🏆 Leaderboard
                        <span onClick={handleMigration} style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.1 }}> 🔄</span>
                    </h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="leaderboard-content">
                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : (
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Roll No</th>
                                    <th>Score</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaders.map((student, index) => (
                                    <tr key={student.id} className={index < 3 ? `top-${index + 1}` : ''}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.rollNo}</td>
                                        <td className="score-cell">{student.score}</td>
                                        <td>{formatTime(student.timeTaken)}</td>
                                    </tr>
                                ))}
                                {leaders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="no-data">No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
