import React, { useState, useImperativeHandle } from 'react';

const Challenge6 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const capacity = 20;
    const [bagItems, setBagItems] = useState([]);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    const items = [
        { id: 1, name: 'Potion', weight: 2, value: 5, icon: '🧪' },
        { id: 2, name: 'Sword', weight: 8, value: 15, icon: '⚔️' },
        { id: 3, name: 'Shield', weight: 10, value: 12, icon: '🛡️' },
        { id: 4, name: 'Gem', weight: 1, value: 10, icon: '💎' },
        { id: 5, name: 'Food', weight: 4, value: 6, icon: '🍖' },
        { id: 6, name: 'Map', weight: 1, value: 3, icon: '🗺️' },
        { id: 7, name: 'Tent', weight: 12, value: 8, icon: '⛺' },
    ];

    const currentWeight = bagItems.reduce((sum, item) => sum + item.weight, 0);
    const currentValue = bagItems.reduce((sum, item) => sum + item.value, 0);

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            if (currentWeight <= capacity && currentValue >= 18) {
                return 5;
            }
            return 0;
        }
    }));

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData('application/json', JSON.stringify(item));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const item = JSON.parse(e.dataTransfer.getData('application/json'));

        if (bagItems.find(i => i.id === item.id)) return;

        if (currentWeight + item.weight > capacity) {
            setFeedback({ message: '⚠️ Too heavy! The dragon cannot carry more!', type: 'error' });
            setTimeout(() => setFeedback({ message: '', type: '' }), 2000);
            return;
        }

        setBagItems([...bagItems, item]);
    };

    const handleDragOver = (e) => e.preventDefault();

    const breakSeal = () => {
        setSealBroken(true);
    };

    const checkSolution = () => {
        if (currentValue >= 35) {
            setFeedback({ message: `🎉 The dragon is pleased! Optimal hoard value: ${currentValue}!`, type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: `Current Value: ${currentValue}. The dragon demands more treasure!`, type: 'error' });
            if (onWrongAnswer) onWrongAnswer();
        }
    };

    const resetBag = () => {
        setBagItems([]);
        if (onWrongAnswer) onWrongAnswer(); // Penalty only on manual reset
    };

    return (
        <section id="challenge-6" className="screen challenge-screen active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 6: The Dragon's Hoard</h2>
                <p className="challenge-subtitle">"Maximize treasure without breaking the dragon's back"</p>
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
                            <h3>📜 Scroll of the Dragon's Hoard</h3>
                            <p className="scroll-story">
                                Your dragon has returned from a successful raid, but its saddlebag capacity is limited.
                                You must choose which treasures to keep to maximize value without exceeding the weight
                                limit, or the dragon will refuse to fly.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="instructions-box">
                                <h4>🎯 Your Mission:</h4>
                                <p>
                                    Fill the saddlebag to <strong>maximize value</strong> without exceeding the
                                    <strong> {capacity}kg weight capacity</strong>. Drag items from the inventory
                                    into the saddlebag.
                                </p>
                            </div>

                            <div className="knapsack-container">
                                <div className="inventory-section">
                                    <h3>📦 Available Treasures</h3>
                                    <div className="inventory-grid">
                                        {items.map(item => {
                                            const inBag = bagItems.find(i => i.id === item.id);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`inventory-item ${inBag ? 'used' : ''}`}
                                                    draggable={!inBag}
                                                    onDragStart={(e) => handleDragStart(e, item)}
                                                >
                                                    <div className="item-icon">{item.icon}</div>
                                                    <div className="item-details">
                                                        <strong>{item.name}</strong>
                                                        <span>Wt: {item.weight} | Val: {item.value}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="saddlebag-section">
                                    <div className="dragon-avatar">🐉</div>
                                    <div className="capacity-indicator">
                                        <div className="capacity-bar-bg">
                                            <div
                                                className="capacity-bar-fill"
                                                style={{ width: `${(currentWeight / capacity) * 100}%`, backgroundColor: currentWeight > capacity ? 'red' : '#4CAF50' }}
                                            ></div>
                                        </div>
                                        <span>{currentWeight} / {capacity} kg</span>
                                    </div>

                                    <div
                                        className="saddlebag-dropzone"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        {bagItems.length === 0 ? <p className="dropzone-placeholder">Drag items here</p> :
                                            <div className="bag-items">
                                                {bagItems.map(item => (
                                                    <div key={item.id} className="bag-item">
                                                        {item.icon} {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    </div>

                                    <div className="stats-panel">
                                        <div>Total Value: {currentValue}</div>
                                    </div>

                                    <div className="controls">
                                        <button className="reset-btn" onClick={resetBag}>Reset</button>
                                        <button className="submit-btn scroll-btn" onClick={checkSolution}>Check Hoard</button>
                                    </div>
                                </div>
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
                                    <strong>💡 Hint:</strong> Use greedy logic! Calculate the value-to-weight ratio
                                    for each item. Items with higher ratios give more value per kilogram. Gems and
                                    lightweight items often provide the best return.
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

export default Challenge6;
