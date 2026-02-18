import React, { useState } from 'react';

const Challenge2 = ({ onComplete, onBack }) => {
    const [locks, setLocks] = useState({
        declaration: null,
        init: null,
        condition: null,
        access: null,
        return: null
    });
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const correctKeys = {
        declaration: 'int arr[MAX]',
        init: 'int i = 0',
        condition: 'i < n',
        access: 'arr[i]',
        return: 'return sum'
    };

    const keys = [
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

    const handleDragStart = (e, text) => {
        e.dataTransfer.setData('text/plain', text);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, lockId) => {
        e.preventDefault();
        const text = e.dataTransfer.getData('text/plain');
        setLocks(prev => ({ ...prev, [lockId]: text }));
    };

    const checkSolution = () => {
        const filledLocks = Object.values(locks).filter(v => v !== null).length;

        if (filledLocks < 5) {
            setFeedback({ message: `❌ Please fill all 5 locks! (Currently: ${filledLocks}/5)`, type: 'error' });
            return;
        }

        const isCorrect = locks.declaration === correctKeys.declaration &&
            locks.init === correctKeys.init &&
            locks.condition === correctKeys.condition &&
            locks.access === correctKeys.access &&
            locks.return === correctKeys.return;

        if (isCorrect) {
            setFeedback({ message: '🎉 PERFECT! All locks opened!', type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: '❌ Wrong keys! The algorithm won\'t work.', type: 'error' });
        }
    };

    return (
        <section id="challenge-2" className="screen challenge-screen active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">🔵 Challenge 2: Unlock the Complete Algorithm!</h2>
                <p className="challenge-subtitle">"5 locks guard a powerful array sum algorithm. Match all keys!"</p>
            </div>

            <div className="challenge-content">
                <p className="instruction">🔐 <strong>Your Mission:</strong> Match <strong>5 keys to 5 locks</strong>.</p>

                <div className="algorithm-display">
                    <div className="code-line">
                        <span className="code-text">int sum = 0;</span>
                    </div>
                    <div className="code-line">
                        <div
                            className={`lock-inline ${locks.declaration ? 'filled' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'declaration')}
                        >
                            <span className="lock-icon-small">🔒1</span>
                            <div className="key-slot-inline">{locks.declaration || '?'}</div>
                        </div>
                    </div>
                    <div className="code-line">
                        <span className="code-text">for (</span>
                        <div
                            className={`lock-inline ${locks.init ? 'filled' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'init')}
                        >
                            <span className="lock-icon-small">🔒2</span>
                            <div className="key-slot-inline">{locks.init || '?'}</div>
                        </div>
                        <span className="code-text">;</span>
                        <div
                            className={`lock-inline ${locks.condition ? 'filled' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'condition')}
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
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'access')}
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
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'return')}
                        >
                            <span className="lock-icon-small">🔒5</span>
                            <div className="key-slot-inline">{locks.return || '?'}</div>
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
                                    onDragStart={(e) => handleDragStart(e, key.text)}
                                >
                                    <code>{key.text}</code>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <button className="submit-btn" onClick={checkSolution}>Unlock Algorithm</button>
                {feedback.message && (
                    <div className={`feedback show ${feedback.type}`}>{feedback.message}</div>
                )}
            </div>
        </section>
    );
};

export default Challenge2;
