import React, { useState, useEffect } from 'react';

const Challenge5 = ({ onComplete, onBack }) => {
    const towerCount = 8;
    // Initial state: Randomize later if needed, for now start with some off
    const [towers, setTowers] = useState(Array(towerCount).fill(false));
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    useEffect(() => {
        resetTowers();
    }, []);

    const resetTowers = () => {
        // Create a solvable configuration by starting with all ON, then applying random clicks
        // This ensures reverse engineering is possible
        let initial = Array(towerCount).fill(true);
        // Apply 3-5 random moves to "mess it up"
        for (let i = 0; i < 4; i++) {
            const randomIdx = Math.floor(Math.random() * towerCount);
            toggleLogic(initial, randomIdx);
        }
        setTowers(initial);
        setFeedback({ message: '', type: '' });
    };

    const toggleLogic = (arr, index) => {
        // Toggle index, index-1, index+1
        arr[index] = !arr[index];
        if (index > 0) arr[index - 1] = !arr[index - 1];
        if (index < arr.length - 1) arr[index + 1] = !arr[index + 1];
    };

    const handleTowerClick = (index) => {
        const newTowers = [...towers];
        toggleLogic(newTowers, index);
        setTowers(newTowers);

        // Check win
        if (newTowers.every(t => t === true)) {
            setFeedback({ message: '🎉 SUCCESS! All towers are online!', type: 'success' });
            setTimeout(onComplete, 1500);
        }
    };

    return (
        <section id="challenge-5" className="screen challenge-screen active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">🟡 Challenge 5: Signal Tower Alignment!</h2>
                <p className="challenge-subtitle">"Can you turn all signal towers ON?"</p>
            </div>

            <div className="challenge-content">
                <p className="instruction">📡 <strong>Click towers to toggle them and their neighbors. Turn ALL green!</strong></p>

                <div className="tower-visualization">
                    <div className="tower-grid">
                        {towers.map((isOn, index) => (
                            <div
                                key={index}
                                className={`tower ${isOn ? 'on' : 'off'}`}
                                onClick={() => handleTowerClick(index)}
                            >
                                <div className="tower-icon">🗼</div>
                                <div className="tower-status">{isOn ? 'ON' : 'OFF'}</div>
                            </div>
                        ))}
                    </div>
                    <button className="check-solution-btn" onClick={resetTowers}>Reset Towers</button>
                </div>

                {feedback.message && (
                    <div className={`feedback show ${feedback.type}`}>{feedback.message}</div>
                )}
            </div>
        </section>
    );
};

export default Challenge5;
