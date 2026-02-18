import React, { useState, useEffect, useImperativeHandle } from 'react';

const Challenge1 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const [slots, setSlots] = useState({ 1: null, 2: null, 3: null, 4: null });
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [shuffledTiles, setShuffledTiles] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    // Correct answers
    const correctAnswers = {
        '1': 'int i = 0',
        '2': 'i < rows',
        '3': 'int j = 0',
        '4': 'j < cols'
    };

    const initialTiles = [
        { id: 'outer-init', text: 'int i = 0', type: 'correct' },
        { id: 'outer-condition', text: 'i < rows', type: 'correct' },
        { id: 'inner-init', text: 'int j = 0', type: 'correct' },
        { id: 'inner-condition', text: 'j < cols', type: 'correct' },
        { id: 'wrong1', text: 'int j = 1', type: 'wrong' },
        { id: 'wrong2', text: 'i < cols', type: 'wrong' },
        { id: 'wrong3', text: 'j < rows', type: 'wrong' },
        { id: 'wrong4', text: 'int i = 1', type: 'wrong' }
    ];

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            let correctCount = 0;
            if (slots['1'] === correctAnswers['1']) correctCount++;
            if (slots['2'] === correctAnswers['2']) correctCount++;
            if (slots['3'] === correctAnswers['3']) correctCount++;
            if (slots['4'] === correctAnswers['4']) correctCount++;

            if (correctCount >= 2) return 5;
            return 0;
        }
    }));

    useEffect(() => {
        const shuffled = [...initialTiles].sort(() => Math.random() - 0.5);
        setShuffledTiles(shuffled);
    }, []);

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

    const breakSeal = () => {
        setSealBroken(true);
    };

    const checkSolution = () => {
        const filledSlots = Object.values(slots).filter(v => v !== null).length;
        if (filledSlots < 4) {
            setFeedback({ message: `⚠️ Please fill all 4 slots! (Currently: ${filledSlots}/4)`, type: 'error' });
            return;
        }

        const isCorrect = slots['1'] === correctAnswers['1'] &&
            slots['2'] === correctAnswers['2'] &&
            slots['3'] === correctAnswers['3'] &&
            slots['4'] === correctAnswers['4'];

        setShowResults(true);

        if (isCorrect) {
            setFeedback({ message: '🎉 The bridge is complete! You may cross safely!', type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: '✗ The bridge is unstable! Check your loop logic.', type: 'error' });
            if (onWrongAnswer) onWrongAnswer();
        }
    };

    return (
        <section id="challenge-1" className="screen challenge-screen active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 1: The Nested Loop Bridge</h2>
                <p className="challenge-subtitle">"Cross the Parapet by mastering the nested loops"</p>
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
                            <h3>📜 Scroll of the Parapet Crossing</h3>
                            <p className="scroll-story">
                                You are crossing the Parapet—a narrow, slick stone bridge hundreds of feet
                                above the valley floor. The wind doesn't just blow once; it comes in gusts
                                (outer loops), and each gust contains swirling eddies (inner loops) that
                                threaten your balance.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="instructions-box">
                                <h4>🎯 Your Mission:</h4>
                                <p>
                                    This nested loop bridge needs <strong>4 missing pieces</strong> to traverse a 2D array.
                                    Drag the correct code segments into the empty slots to complete the bridge structure.
                                </p>
                            </div>

                            <div className="code-scroll">
                                <h4>The Bridge Structure:</h4>
                                <div className="bridge-container">
                                    {/* Row 1 */}
                                    <div className="bridge-row">
                                        <div className="bridge-piece static">for (</div>
                                        <div
                                            className={`bridge-piece drop-slot ${slots[1] ? 'filled' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 1)}
                                        >
                                            <span className="placeholder-text">{slots[1] || '?'}</span>
                                        </div>
                                        <div className="bridge-piece static">;</div>
                                        <div
                                            className={`bridge-piece drop-slot ${slots[2] ? 'filled' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 2)}
                                        >
                                            <span className="placeholder-text">{slots[2] || '?'}</span>
                                        </div>
                                        <div className="bridge-piece static">; i++)</div>
                                        <div className="bridge-piece static">{'{'}</div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="bridge-row">
                                        <div className="bridge-piece static">for (</div>
                                        <div
                                            className={`bridge-piece drop-slot ${slots[3] ? 'filled' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 3)}
                                        >
                                            <span className="placeholder-text">{slots[3] || '?'}</span>
                                        </div>
                                        <div className="bridge-piece static">;</div>
                                        <div
                                            className={`bridge-piece drop-slot ${slots[4] ? 'filled' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 4)}
                                        >
                                            <span className="placeholder-text">{slots[4] || '?'}</span>
                                        </div>
                                        <div className="bridge-piece static">; j++)</div>
                                        <div className="bridge-piece static">{'{'}</div>
                                    </div>

                                    {/* Row 3 */}
                                    <div className="bridge-row">
                                        <div className="bridge-piece static">printf("%d", matrix[i][j]);</div>
                                        <div className="bridge-piece static">{'}'}</div>
                                        <div className="bridge-piece static">{'}'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="tiles-container">
                                <p className="tiles-label">Available Code Pieces:</p>
                                <div className="draggable-tiles">
                                    {shuffledTiles.map(tile => {
                                        const isUsed = Object.values(slots).includes(tile.text);
                                        const itemsClass = showResults && tile.type === 'wrong' ? 'wrong' : '';

                                        return (
                                            <div
                                                key={tile.id}
                                                className={`tile ${isUsed ? 'used' : ''} ${itemsClass}`}
                                                draggable={!isUsed}
                                                onDragStart={(e) => handleDragStart(e, tile.text)}
                                            >
                                                <code>{tile.text}</code>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button className="submit-btn scroll-btn" onClick={checkSolution}>
                                Test the Bridge
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
                                    <strong>💡 Hint:</strong> A nested loop for a 2D array typically uses an outer loop
                                    for rows (i) and an inner loop for columns (j). Remember to initialize your iterators
                                    to 0 and check against the array dimensions!
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

export default Challenge1;
