import React, { useState } from 'react';

const Challenge6 = ({ onComplete, onBack }) => {
    const capacity = 20;
    const [bagItems, setBagItems] = useState([]);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const items = [
        { id: 1, name: 'Potion', weight: 2, value: 5, icon: '🧪' },
        { id: 2, name: 'Sword', weight: 8, value: 15, icon: '⚔️' },
        { id: 3, name: 'Shield', weight: 10, value: 12, icon: '🛡️' },
        { id: 4, name: 'Gem', weight: 1, value: 10, icon: '💎' },
        { id: 5, name: 'Food', weight: 4, value: 6, icon: '🍖' },
        { id: 6, name: 'Map', weight: 1, value: 3, icon: '🗺️' },
        { id: 7, name: 'Tent', weight: 12, value: 8, icon: '⛺' },
    ];

    // Calculate current stats
    const currentWeight = bagItems.reduce((sum, item) => sum + item.weight, 0);
    const currentValue = bagItems.reduce((sum, item) => sum + item.value, 0);

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData('application/json', JSON.stringify(item));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const item = JSON.parse(e.dataTransfer.getData('application/json'));

        // Check if already in bag
        if (bagItems.find(i => i.id === item.id)) return;

        // Check weight limit
        if (currentWeight + item.weight > capacity) {
            setFeedback({ message: '⚠️ Too heavy! Watch the capacity!', type: 'error' });
            setTimeout(() => setFeedback({ message: '', type: '' }), 2000);
            return;
        }

        setBagItems([...bagItems, item]);
    };

    const handleDragOver = (e) => e.preventDefault();

    const checkSolution = () => {
        // Optimal solution for knapsack (Values/Weights):
        // Gem(10/1), Potion(5/2), Sword(15/8), Food(6/4), Map(3/1) -> Total Weight: 1+2+8+4+1 = 16 <= 20. Total Value: 10+5+15+6+3 = 39.
        // Let's verify if the user found a "good enough" high value. 
        // Max possible using DP:
        // W=1, V=10 (Gem)
        // W=2, V=13 (Gem+Map) (Wait gem=1, map=1 -> w=2, val=13)
        // ...
        // Let's just hardcode a threshold for "success" or check mostly filled high value items.
        // Max value is 39.

        if (currentValue >= 35) { // Threshold for success
            setFeedback({ message: `🎉 Dragon is happy with Value: ${currentValue}!`, type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: `Current Value: ${currentValue}. You can do better!`, type: 'error' });
        }
    };

    const resetBag = () => setBagItems([]);

    return (
        <section id="challenge-6" className="screen challenge-screen active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">🎒 Challenge 6: The Dragon's Saddlebag!</h2>
                <p className="challenge-subtitle">"Maximize value without breaking the dragon's back!"</p>
            </div>

            <div className="challenge-content">
                <p className="instruction">⚖️ <strong>Fill the saddlebag to maximize value (Max Weight: {capacity}kg)</strong></p>

                <div className="knapsack-container">
                    <div className="inventory-section">
                        <h3>📦 Available Supplies</h3>
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
                            <button className="submit-btn" onClick={checkSolution}>Check Load</button>
                        </div>
                    </div>
                </div>

                {feedback.message && (
                    <div className={`feedback show ${feedback.type}`}>{feedback.message}</div>
                )}
            </div>
        </section>
    );
};

export default Challenge6;
