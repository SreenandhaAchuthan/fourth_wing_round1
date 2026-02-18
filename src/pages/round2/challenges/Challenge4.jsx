import React, { useState, useImperativeHandle } from 'react';

const Challenge4 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const [slots, setSlots] = useState({
        1: null, 2: null, 3: null, 4: null, 5: null,
        6: null, 7: null, 8: null, 9: null, 10: null
    });
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    const correctSequence = {
        '1': 'step1',
        '2': 'step2',
        '3': 'step3',
        '4': 'step4',
        '5': 'step5',
        '6': 'step6',
        '7': 'step7',
        '8': 'step8',
        '9': 'step9',
        '10': 'step10'
    };

    const codePiecesBase = [
        { id: 'step1', text: 'int i = 0', type: 'correct' },
        { id: 'step2', text: 'while (i < n)', type: 'correct' },
        { id: 'step3', text: 'if (arr[i] == target)', type: 'correct' },
        { id: 'step4', text: 'return i', type: 'correct' },
        { id: 'step5', text: 'else', type: 'correct' },
        { id: 'step6', text: 'i++', type: 'correct' },
        { id: 'step7', text: 'end while', type: 'correct' },
        { id: 'step8', text: 'return -1', type: 'correct' },
        { id: 'step9', text: 'int n = arr.length', type: 'correct' },
        { id: 'step10', text: 'int target = value', type: 'correct' },
        { id: 'wrong1', text: 'int i = 1', type: 'wrong' },
        { id: 'wrong2', text: 'while (i <= n)', type: 'wrong' },
        { id: 'wrong3', text: 'if (arr[i] != target)', type: 'wrong' },
        { id: 'wrong4', text: 'return 0', type: 'wrong' },
        { id: 'wrong5', text: 'i--', type: 'wrong' },
        { id: 'wrong6', text: 'break', type: 'wrong' },
        { id: 'wrong7', text: 'continue', type: 'wrong' },
        { id: 'wrong8', text: 'return null', type: 'wrong' },
    ];

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const [codePieces] = useState(() => shuffleArray(codePiecesBase));
    const [visualFeedback, setVisualFeedback] = useState('');

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            let correctCount = 0;
            for (let i = 1; i <= 10; i++) {
                if (slots[i.toString()] === correctSequence[i.toString()]) {
                    correctCount++;
                }
            }
            if (correctCount >= 5) return 5;
            return 0;
        }
    }));

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

    const breakSeal = () => {
        setSealBroken(true);
    };

    const checkSolution = () => {
        const filledSlots = Object.values(slots).filter(v => v !== null).length;

        setVisualFeedback('checking');

        setTimeout(() => {
            if (filledSlots < 10) {
                setVisualFeedback('incomplete');
                setFeedback({ message: '⚠️ Please fill all 10 steps!', type: 'error' });
                setTimeout(() => {
                    setVisualFeedback('');
                    setFeedback({ message: '', type: '' });
                }, 2000);
                return;
            }

            const isCorrect = Object.keys(correctSequence).every(key => slots[key] === correctSequence[key]);

            if (isCorrect) {
                setVisualFeedback('correct');
                setFeedback({ message: '🎉 The scroll is found! You escape the Archives!', type: 'success' });
                setTimeout(() => {
                    setVisualFeedback('');
                    onComplete();
                }, 1500);
            } else {
                setVisualFeedback('wrong');
                setFeedback({ message: '✗ Wrong sequence! The guards are getting closer!', type: 'error' });
                if (onWrongAnswer) onWrongAnswer();
                setTimeout(() => {
                    setVisualFeedback('');
                    setFeedback({ message: '', type: '' });
                }, 2000);
            }
        }, 300);
    };

    return (
        <section id="challenge-4" className="screen challenge-screen active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 4: The Search Sequence</h2>
                <p className="challenge-subtitle">"Arrange the steps before the guards arrive"</p>
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
                            <h3>📜 Scroll of the Forbidden Archives</h3>
                            <p className="scroll-story">
                                The central database is vast, and a critical data packet is hidden within. The system's
                                Linear Search protocol has been scrambled. You need to reorder the execution steps to
                                successfully locate the target value within the data stream.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="instructions-box">
                                <h4>🎯 Your Mission:</h4>
                                <p>
                                    Drag and drop <strong>10 code steps</strong> in the correct order to create a
                                    working Linear Search algorithm. Arrange them sequentially to find the target
                                    value before the guards arrive.
                                </p>
                            </div>

                            <div className="code-scroll">
                                <h4>The Search Algorithm:</h4>
                                <div className="sequence-display">
                                    <div className="sequence-header"><code>int linearSearch(int arr[], int n, int target) {'{'}</code></div>
                                    <div className="sequence-steps">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
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

                            <button
                                className={`submit-btn scroll-btn ${visualFeedback}`}
                                onClick={checkSolution}
                            >
                                Execute Search
                            </button>

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
                                    <strong>💡 Hint:</strong> A linear search checks elements one by one. Start at index 0.
                                    Loop while i &lt; n. If arr[i] matches the target, return the index. If the loop finishes
                                    without finding it, return -1.
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

export default Challenge4;
