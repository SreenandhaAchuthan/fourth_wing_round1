import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import './round2.css';

const Leaderboard = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const q = query(
                    collection(db, 'round2', 'leaderboard', 'entries'),
                    orderBy('score', 'desc'),
                    orderBy('completedAt', 'asc'),
                    limit(50)
                );

                const querySnapshot = await getDocs(q);
                const fetchedScores = [];
                querySnapshot.forEach((doc) => {
                    fetchedScores.push({ id: doc.id, ...doc.data() });
                });
                setScores(fetchedScores);
            } catch (error) {
                console.error("Error fetching leaderboard: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, []);

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-content">
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">
                        Fourth Wing - Leaderboard
                    </h1>
                    <Link to="/round2" className="play-btn">
                        Play Round 2
                    </Link>
                </div>

                <div className="leaderboard-table-wrapper">
                    {loading ? (
                        <div className="leaderboard-loading">Loading scores...</div>
                    ) : scores.length === 0 ? (
                        <div className="leaderboard-empty">No scores yet. Be the first!</div>
                    ) : (
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Roll No</th>
                                    <th className="text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((entry, index) => (
                                    <tr key={entry.id}>
                                        <td>
                                            {index === 0 && <span className="rank-icon">🥇</span>}
                                            {index === 1 && <span className="rank-icon">🥈</span>}
                                            {index === 2 && <span className="rank-icon">🥉</span>}
                                            <span className="rank-number">#{index + 1}</span>
                                        </td>
                                        <td>{entry.name}</td>
                                        <td>{entry.rollNo}</td>
                                        <td className="text-right score-val">{entry.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
