import React, { useState } from 'react';

const Challenge1 = ({ onComplete, onBack }) => {
    const [slots, setSlots] = useState({ 1: null, 2: null, 3: null, 4: null });
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    // Correct answers
    const correctAnswers = {
        '1': 'int i = 0',
        '2': 'i < rows',
        '3': 'int j = 0',
        '4': 'j < cols'
    };

    const tiles = [
        { id: 'outer-init', text: 'int i = 0', type: 'correct' },
        { id: 'outer-condition', text: 'i < rows', type: 'correct' },
        { id: 'inner-init', text: 'int j = 0', type: 'correct' },
        { id: 'inner-condition', text: 'j < cols', type: 'correct' },
        { id: 'wrong1', text: 'int j = 1', type: 'wrong' },
        { id: 'wrong2', text: 'i < cols', type: 'wrong' },
        { id: 'wrong3', text: 'j < rows', type: 'wrong' },
        { id: 'wrong4', text: 'int i = 1', type: 'wrong' }
    ];

    const handleDragStart = (e, text) => {
        e.dataTransfer.setData('text/plain', text);
    };

    const handleDrop = (e, slotId) => {
        e.preventDefault();
        const text = e.dataTransfer.getData('text/plain');
        setSlots(prev => ({ ...prev, [slotId]: text }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const checkSolution = () => {
        const filledSlots = Object.values(slots).filter(v => v !== null).length;
        if (filledSlots < 4) {
            setFeedback({ message: `❌ Please fill all 4 slots! (Currently: ${filledSlots}/4)`, type: 'error' });
            return;
        }

        const isCorrect = slots['1'] === correctAnswers['1'] &&
            slots['2'] === correctAnswers['2'] &&
            slots['3'] === correctAnswers['3'] &&
            slots['4'] === correctAnswers['4'];

        if (isCorrect) {
            setFeedback({ message: '🎉 PERFECT! The bridge is complete!', type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: '❌ Not quite right! Check your loop logic.', type: 'error' });
            // Optional: reset slots or let user fix specific ones
        }
    };

    return (
        <section id="challenge-1" className="screen challenge-screen active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">🟢 Challenge 1: Rebuild the Nested Loop Bridge!</h2>
                <p className="challenge-subtitle">"A complex 2D array traversal bridge needs 4 critical pieces!"</p>
            </div>

            <div className="challenge-content">
                <p className="instruction">🔨 <strong>Your Mission:</strong> This nested loop bridge needs <strong>4 missing pieces</strong> to traverse a 2D array.</p>

                <div className="bridge-container">
                    <div className="bridge-piece filled">for (</div>
                    <div
                        className={`bridge-piece empty ${slots[1] ? 'filled' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 1)}
                    >
                        <span className="placeholder-text">{slots[1] || '?'}</span>
                    </div>
                    <div className="bridge-piece filled">;</div>
                    <div
                        className={`bridge-piece empty ${slots[2] ? 'filled' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 2)}
                    >
                        <span className="placeholder-text">{slots[2] || '?'}</span>
                    </div>
                    <div className="bridge-piece filled">; i++)</div>
                    <div className="bridge-piece filled">{'{'}</div>
                    <div className="bridge-piece filled">for (</div>
                    <div
                        className={`bridge-piece empty ${slots[3] ? 'filled' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 3)}
                    >
                        <span className="placeholder-text">{slots[3] || '?'}</span>
                    </div>
                    <div className="bridge-piece filled">;</div>
                    <div
                        className={`bridge-piece empty ${slots[4] ? 'filled' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 4)}
                    >
                        <span className="placeholder-text">{slots[4] || '?'}</span>
                    </div>
                    <div className="bridge-piece filled">; j++)</div>
                    <div className="bridge-piece filled">{'{'}</div>
                    <div className="bridge-piece filled">printf("%d", matrix[i][j]);</div>
                    <div className="bridge-piece filled">{'}'}</div>
                    <div className="bridge-piece filled">{'}'}</div>
                </div>

                <div className="tiles-container">
                    <p className="tiles-label">Available Code Pieces:</p>
                    <div className="draggable-tiles">
                        {tiles.map(tile => {
                            // Check if this tile is already used in a slot
                            const isUsed = Object.values(slots).includes(tile.text);
                            return (
                                <div
                                    key={tile.id}
                                    className={`tile ${isUsed ? 'used' : ''} ${tile.type === 'wrong' ? 'wrong' : ''}`}
                                    draggable={!isUsed}
                                    onDragStart={(e) => handleDragStart(e, tile.text)}
                                >
                                    <code>{tile.text}</code>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="submit-btn" onClick={checkSolution}>Check Bridge</button>
                {feedback.message && (
                    <div className={`feedback show ${feedback.type}`}>{feedback.message}</div>
                )}
            </div>
        </section>
    );
};

export default Challenge1;
