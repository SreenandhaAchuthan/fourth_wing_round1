import React, { useState } from 'react';

const Challenge4 = ({ onComplete, onBack }) => {
    const [slots, setSlots] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const correctSequence = {
        '1': 'step1',
        '2': 'step2',
        '3': 'step3',
        '4': 'step4',
        '5': 'step5',
        '6': 'step6'
    };

    const codePieces = [
        { id: 'step1', text: 'int i = 0', type: 'correct' },
        { id: 'step2', text: 'while (i < n)', type: 'correct' },
        { id: 'step3', text: 'if (arr[i] == target)', type: 'correct' },
        { id: 'step4', text: 'return i', type: 'correct' },
        { id: 'step5', text: 'i++', type: 'correct' },
        { id: 'step6', text: 'return -1', type: 'correct' },
        { id: 'wrong1', text: 'int i = 1', type: 'wrong' },
        { id: 'wrong2', text: 'while (i <= n)', type: 'wrong' },
        { id: 'wrong3', text: 'if (arr[i] != target)', type: 'wrong' },
        { id: 'wrong4', text: 'return 0', type: 'wrong' }
    ];

    const getPieceText = (id) => codePieces.find(p => p.id === id)?.text;

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDrop = (e, slotId) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        setSlots(prev => ({ ...prev, [slotId]: id }));
    };

    const handleDragOver = (e) => e.preventDefault();

    const checkSolution = () => {
        const filledSlots = Object.values(slots).filter(v => v !== null).length;
        if (filledSlots < 6) {
            setFeedback({ message: `❌ Please fill all 6 steps!`, type: 'error' });
            return;
        }

        const isCorrect = Object.keys(correctSequence).every(key => slots[key] === correctSequence[key]);

        if (isCorrect) {
            setFeedback({ message: '🎉 PERFECT! Linear search algorithm complete!', type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: '❌ Wrong sequence!', type: 'error' });
        }
    };

    return (
        <section id="challenge-4" className="screen challenge-screen active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">🔴 Challenge 4: Build the Search Algorithm!</h2>
                <p className="challenge-subtitle">"Arrange 6 steps to create a working array search function!"</p>
            </div>

            <div className="challenge-content">
                <p className="instruction">🔍 <strong>Drag and drop 6 code steps used in Linear Search.</strong></p>

                <div className="sequence-display">
                    <div className="sequence-header"><code>int linearSearch(int arr[], int n, int target) {'{'}</code></div>
                    <div className="sequence-steps">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <div
                                key={num}
                                className={`sequence-slot ${slots[num] ? 'filled' : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, num)}
                            >
                                <span className="step-number">Step {num}</span>
                                <div className="step-content">
                                    {slots[num] ? <code>{getPieceText(slots[num])}</code> : 'Drop code here'}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="sequence-footer"><code>{'}'}</code></div>
                </div>

                <div className="code-pieces-container">
                    <p className="tiles-label">Available Code Pieces:</p>
                    <div className="code-pieces">
                        {codePieces.map(piece => {
                            const isUsed = Object.values(slots).includes(piece.id);
                            return (
                                <div
                                    key={piece.id}
                                    className={`code-piece ${isUsed ? 'used' : ''} ${piece.type === 'wrong' ? 'wrong' : ''}`}
                                    draggable={!isUsed}
                                    onDragStart={(e) => handleDragStart(e, piece.id)}
                                >
                                    <code>{piece.text}</code>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <button className="submit-btn" onClick={checkSolution}>Check Algorithm</button>
                {feedback.message && (
                    <div className={`feedback show ${feedback.type}`}>{feedback.message}</div>
                )}
            </div>
        </section>
    );
};

export default Challenge4;
