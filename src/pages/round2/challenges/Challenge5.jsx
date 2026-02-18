import React, { useState, useEffect, useImperativeHandle } from 'react';

const Challenge5 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const towerCount = 8;
    const [towers, setTowers] = useState(Array(towerCount).fill(false));
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            const onCount = towers.filter(t => t === true).length;
            if (onCount >= 4) return 5;
            return 0;
        }
    }));

    useEffect(() => {
        resetTowers();
    }, []);

    const resetTowers = () => {
        let initial = Array(towerCount).fill(true);
        for (let i = 0; i < 4; i++) {
            const randomIdx = Math.floor(Math.random() * towerCount);
            toggleLogic(initial, randomIdx);
        }
        setTowers(initial);
        setFeedback({ message: '', type: '' });
    };

    const toggleLogic = (arr, index) => {
        arr[index] = !arr[index];
        if (index > 0) arr[index - 1] = !arr[index - 1];
        if (index < arr.length - 1) arr[index + 1] = !arr[index + 1];
    };

    const handleTowerClick = (index) => {
        const newTowers = [...towers];
        toggleLogic(newTowers, index);
        setTowers(newTowers);

        if (newTowers.every(t => t === true)) {
            setFeedback({ message: '🎉 All signal towers synchronized! The border defenses hold!', type: 'success' });
            setTimeout(onComplete, 1500);
        }
    };

    const breakSeal = () => {
        setSealBroken(true);
    };

    return (
        <section id="challenge-5" className="screen challenge-screen active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 5: The Signal Towers</h2>
                <p className="challenge-subtitle">"Synchronize the border watch before the Venin breach"</p>
            </div>

            <div className="challenge-content scroll-container">
                {!sealBroken ? (
                    <div className="scroll-sealed">
                        <div className="wax-seal" onClick={breakSeal}>
                            <div className="seal-emblem">
                                <div className="seal-text">BASGIATH</div>
                                <div className="seal-subtext">WAR COLLEGE</div>
                            </div>
                            <div className="seal-instruction">Click to break seal</div>
                        </div>
                        <div className="scroll-preview">
                            <h3>📜 Scroll of the Border Watch</h3>
                            <p className="scroll-story">
                                Outposts along the Navarrian border are flashing light signals across mountain peaks
                                to request reinforcements against a sudden Venin surge. The signal towers have fallen
                                out of sync, and you must restore their coordination before the defenses fail.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="instructions-box">
                                <h4>🎯 Your Mission:</h4>
                                <p>
                                    Click towers to toggle them and their neighbors. Turn <strong>ALL towers green (ON)</strong>
                                    to synchronize the border watch network.
                                </p>
                            </div>

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
                                <button className="check-solution-btn scroll-btn" onClick={() => {
                                    if (window.confirm("Resetting will cost 2 points. Proceed?")) {
                                        resetTowers();
                                        if (onWrongAnswer) onWrongAnswer();
                                    }
                                }}>Reset Towers</button>
                            </div>

                            {feedback.message && (
                                <div className={`feedback show ${feedback.type}`}>
                                    {feedback.message}
                                </div>
                            )}

                            {!hintUsed ? (
                                <button className="hint-btn scroll-btn" onClick={() => setShowHintWarning(true)}>
                                    💡 Show Hint
                                </button>
                            ) : (
                                <div className="hint-box">
                                    <strong>💡 Hint:</strong> Each tower affects its neighbors. Think about which towers
                                    to click to minimize cascading effects. Sometimes clicking edge towers is safer than
                                    middle ones.
                                </div>
                            )}

                            {showHintWarning && (
                                <div className="hint-warning-overlay">
                                    <div className="hint-warning-dialog">
                                        <h3>⚠️ Warning</h3>
                                        <p>5 marks will be deducted if you use the hint.</p>
                                        <div className="hint-warning-buttons">
                                            <button className="hint-cancel-btn" onClick={() => setShowHintWarning(false)}>
                                                Cancel
                                            </button>
                                            <button className="hint-confirm-btn" onClick={() => {
                                                setHintUsed(true);
                                                setShowHintWarning(false);
                                                if (onWrongAnswer) onWrongAnswer();
                                            }}>
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Challenge5;
