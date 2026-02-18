import React, { useState, useImperativeHandle } from 'react';

const Challenge2 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const [locks, setLocks] = useState({
        declaration: null,
        init: null,
        condition: null,
        access: null,
        return: null
    });
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    const correctKeys = {
        declaration: 'int arr[MAX]',
        init: 'int i = 0',
        condition: 'i < n',
        access: 'arr[i]',
        return: 'return sum'
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const keysBase = [
        { id: 'declaration', text: 'int arr[MAX]', type: 'correct' },
        { id: 'init', text: 'int i = 0', type: 'correct' },
        { id: 'condition', text: 'i < n', type: 'correct' },
        { id: 'access', text: 'arr[i]', type: 'correct' },
        { id: 'return', text: 'return sum', type: 'correct' },
        { id: 'wrong1', text: 'int arr[]', type: 'wrong' },
        { id: 'wrong2', text: 'int i = 1', type: 'wrong' },
        { id: 'wrong3', text: 'i <= n', type: 'wrong' },
        { id: 'wrong4', text: 'arr[i+1]', type: 'wrong' },
        { id: 'wrong5', text: 'return i', type: 'wrong' }
    ];

    const [keys] = useState(() => shuffleArray(keysBase));

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            let correctCount = 0;
            if (locks.declaration === correctKeys.declaration) correctCount++;
            if (locks.init === correctKeys.init) correctCount++;
            if (locks.condition === correctKeys.condition) correctCount++;
            if (locks.access === correctKeys.access) correctCount++;
            if (locks.return === correctKeys.return) correctCount++;

            if (correctCount >= 3) return 5;
            return 0;
        }
    }));

    const handleDragStart = (e, text, source) => {
        e.dataTransfer.setData('text/plain', text);
        e.dataTransfer.setData('source', source);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, lockId) => {
        e.preventDefault();
        const text = e.dataTransfer.getData('text/plain');

        if (lockId) {
            setLocks(prev => ({ ...prev, [lockId]: text }));
        }
    };

    const handleLockDragStart = (e, lockId) => {
        const text = locks[lockId];
        if (text) {
            e.dataTransfer.setData('text/plain', text);
            e.dataTransfer.setData('source', 'lock');
            e.dataTransfer.setData('lockId', lockId);
        }
    };

    const handleLockDrop = (e, targetLockId) => {
        e.preventDefault();
        const text = e.dataTransfer.getData('text/plain');
        const source = e.dataTransfer.getData('source');
        const sourceLockId = e.dataTransfer.getData('lockId');

        if (source === 'lock' && sourceLockId) {
            setLocks(prev => ({
                ...prev,
                [sourceLockId]: null,
                [targetLockId]: text
            }));
        } else {
            setLocks(prev => ({ ...prev, [targetLockId]: text }));
        }
    };

    const breakSeal = () => {
        setSealBroken(true);
    };

    const checkSolution = () => {
        const filledLocks = Object.values(locks).filter(v => v !== null).length;

        if (filledLocks < 5) {
            setFeedback({ message: `⚠️ Please fill all 5 locks! (Currently: ${filledLocks}/5)`, type: 'error' });
            return;
        }

        const isCorrect = locks.declaration === correctKeys.declaration &&
            locks.init === correctKeys.init &&
            locks.condition === correctKeys.condition &&
            locks.access === correctKeys.access &&
            locks.return === correctKeys.return;

        if (isCorrect) {
            setFeedback({ message: '🎉 The Gauntlet mechanism unlocks! The gate opens!', type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: '✗ Wrong keys! The mechanism grinds but does not open.', type: 'error' });
            if (onWrongAnswer) onWrongAnswer();
        }
    };

    return (
        <section id="challenge-2" className="screen challenge-screen active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 2: The Algorithm Locator</h2>
                <p className="challenge-subtitle">"Find the Master Gears to unlock the Gauntlet"</p>
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
                            <h3>📜 Scroll of the Gauntlet's Mechanism</h3>
                            <p className="scroll-story">
                                You reach the Fortress of Algorithms, but the main gate is sealed by five cryptographic
                                locks. These locks are synchronized to a specific array summation algorithm. Only by
                                placing the correct code segments into the key slots can you satisfy the logic gates
                                and unseal the entrance.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="instructions-box">
                                <h4>🎯 Your Mission:</h4>
                                <p>
                                    Match <strong>5 keys to 5 locks</strong> to complete the array sum algorithm.
                                    Drag the correct code segments into each lock slot to unlock the mechanism.
                                </p>
                            </div>

                            <div className="code-scroll">
                                <h4>The Algorithm Mechanism:</h4>
                                <div className="algorithm-display">
                                    <div className="code-line">
                                        <span className="code-text">int sum = 0;</span>
                                    </div>
                                    <div className="code-line">
                                        <div
                                            className={`lock-inline ${locks.declaration ? 'filled' : ''}`}
                                            draggable={!!locks.declaration}
                                            onDragStart={(e) => handleLockDragStart(e, 'declaration')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleLockDrop(e, 'declaration')}
                                        >
                                            <span className="lock-icon-small">🔒1</span>
                                            <div className="key-slot-inline">{locks.declaration || '?'}</div>
                                        </div>
                                    </div>
                                    <div className="code-line">
                                        <span className="code-text">for (</span>
                                        <div
                                            className={`lock-inline ${locks.init ? 'filled' : ''}`}
                                            draggable={!!locks.init}
                                            onDragStart={(e) => handleLockDragStart(e, 'init')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleLockDrop(e, 'init')}
                                        >
                                            <span className="lock-icon-small">🔒2</span>
                                            <div className="key-slot-inline">{locks.init || '?'}</div>
                                        </div>
                                        <span className="code-text">;</span>
                                        <div
                                            className={`lock-inline ${locks.condition ? 'filled' : ''}`}
                                            draggable={!!locks.condition}
                                            onDragStart={(e) => handleLockDragStart(e, 'condition')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleLockDrop(e, 'condition')}
                                        >
                                            <span className="lock-icon-small">🔒3</span>
                                            <div className="key-slot-inline">{locks.condition || '?'}</div>
                                        </div>
                                        <span className="code-text">; i++) {'{'}</span>
                                    </div>
                                    <div className="code-line indent">
                                        <span className="code-text">sum +=</span>
                                        <div
                                            className={`lock-inline ${locks.access ? 'filled' : ''}`}
                                            draggable={!!locks.access}
                                            onDragStart={(e) => handleLockDragStart(e, 'access')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleLockDrop(e, 'access')}
                                        >
                                            <span className="lock-icon-small">🔒4</span>
                                            <div className="key-slot-inline">{locks.access || '?'}</div>
                                        </div>
                                        <span className="code-text">;</span>
                                    </div>
                                    <div className="code-line">
                                        <span className="code-text">{'}'}</span>
                                    </div>
                                    <div className="code-line">
                                        <div
                                            className={`lock-inline ${locks.return ? 'filled' : ''}`}
                                            draggable={!!locks.return}
                                            onDragStart={(e) => handleLockDragStart(e, 'return')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleLockDrop(e, 'return')}
                                        >
                                            <span className="lock-icon-small">🔒5</span>
                                            <div className="key-slot-inline">{locks.return || '?'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="keys-container">
                                <p className="tiles-label">Available Keys:</p>
                                <div className="draggable-keys">
                                    {keys.map(key => {
                                        const isUsed = Object.values(locks).includes(key.text);
                                        return (
                                            <div
                                                key={key.id}
                                                className={`key ${isUsed ? 'used' : ''} ${key.type === 'wrong' ? 'wrong' : ''}`}
                                                draggable={!isUsed}
                                                onDragStart={(e) => handleDragStart(e, key.text, 'key')}
                                            >
                                                <code>{key.text}</code>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <button className="submit-btn scroll-btn" onClick={checkSolution}>
                                Unlock the Gate
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
                                    <strong>💡 Hint:</strong> To sum an array, you need to declare a sum variable initialized
                                    to 0. Then, loop through the array adding each element (arr[i]) to the sum. Finally,
                                    return the calculated sum.
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

export default Challenge2;
