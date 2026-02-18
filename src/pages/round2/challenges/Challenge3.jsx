import React, { useState, useEffect, useImperativeHandle } from 'react';

const Challenge3 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [slots, setSlots] = useState({
        init: null,
        condition: null,
        body: null,
        increment: null,
        length: null,
        guard: null,
        step: null,
        earlyExit: null,
        nested: null,
        bounds: null
    });
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    const cardData = [
        { id: 1, pair: 'init', code: 'int i = 0', icon: '🔄' },
        { id: 2, pair: 'init', code: 'int i = 0', icon: '🔄' },
        { id: 3, pair: 'condition', code: 'i < n', icon: '❓' },
        { id: 4, pair: 'condition', code: 'i < n', icon: '❓' },
        { id: 5, pair: 'body', code: 'sum += arr[i]', icon: '➕' },
        { id: 6, pair: 'body', code: 'sum += arr[i]', icon: '➕' },
        { id: 7, pair: 'increment', code: 'i++', icon: '⬆️' },
        { id: 8, pair: 'increment', code: 'i++', icon: '⬆️' },
        { id: 9, pair: 'length', code: 'int n = arr.length', icon: '📏' },
        { id: 10, pair: 'length', code: 'int n = arr.length', icon: '📏' },
        { id: 11, pair: 'guard', code: 'if (arr[i] != 0)', icon: '🛡️' },
        { id: 12, pair: 'guard', code: 'if (arr[i] != 0)', icon: '🛡️' },
        { id: 13, pair: 'step', code: 'i += 2', icon: '⏭️' },
        { id: 14, pair: 'step', code: 'i += 2', icon: '⏭️' },
        { id: 15, pair: 'earlyExit', code: 'break', icon: '🚪' },
        { id: 16, pair: 'earlyExit', code: 'break', icon: '🚪' },
        { id: 17, pair: 'nested', code: 'for (int j = 0; j < m; j++)', icon: '🔁' },
        { id: 18, pair: 'nested', code: 'for (int j = 0; j < m; j++)', icon: '🔁' },
        { id: 19, pair: 'bounds', code: 'i < arr.length - 1', icon: '🎯' },
        { id: 20, pair: 'bounds', code: 'i < arr.length - 1', icon: '🎯' },
    ];

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            if (matchedPairs >= 5) return 5;
            return 0;
        }
    }));

    useEffect(() => {
        const shuffled = [...cardData].sort(() => Math.random() - 0.5);
        setCards(shuffled.map(c => ({ ...c, flipped: false, matched: false })));
    }, []);

    const handleCardClick = (index) => {
        if (flippedCards.length >= 2 || cards[index].flipped || cards[index].matched) return;

        const newCards = [...cards];
        newCards[index].flipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            const card1 = newCards[newFlipped[0]];
            const card2 = newCards[newFlipped[1]];

            if (card1.pair === card2.pair) {
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) =>
                        newFlipped.includes(i) ? { ...c, matched: true, flipped: true } : c
                    ));
                    setMatchedPairs(prev => prev + 1);
                    setSlots(prev => ({ ...prev, [card1.pair]: card1.code }));
                    setFlippedCards([]);
                }, 500);
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) =>
                        newFlipped.includes(i) ? { ...c, flipped: false } : c
                    ));
                    setFlippedCards([]);
                }, 1000);
                if (onWrongAnswer) onWrongAnswer();
            }
        }
    };

    const breakSeal = () => {
        setSealBroken(true);
    };

    const checkComplete = () => {
        if (matchedPairs === 10) {
            setFeedback({ message: '🎉 The Memory Core is stabilized! All fragments restored!', type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: `⚠️ Match all 10 pairs first! (Currently: ${matchedPairs}/10)`, type: 'error' });
        }
    };

    return (
        <section id="challenge-3" className="screen challenge-screen active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 3: The Memory Core</h2>
                <p className="challenge-subtitle">"Restore the fragmented memory to stabilize the core"</p>
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
                            <h3>📜 Scroll of the Memory Core</h3>
                            <p className="scroll-story">
                                Deep within the fortress, you encounter a corrupted memory core. Data fragments are
                                floating in flux. To restore the system's processing loop, you must pair the scattered
                                code instructions with their functional descriptions.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="instructions-box">
                                <h4>🎯 Your Mission:</h4>
                                <p>
                                    Find all <strong>10 matching pairs</strong> of code fragments to complete the
                                    complex loop structure. Click cards to flip them and match identical code segments.
                                </p>
                            </div>

                            <div className="loop-skeleton">
                                {['init', 'condition', 'body', 'increment', 'length', 'guard', 'step', 'earlyExit', 'nested', 'bounds'].map(type => (
                                    <div key={type} className={`skeleton-slot ${slots[type] ? 'filled' : ''}`}>
                                        <div className="slot-header">
                                            <span className="slot-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                        </div>
                                        <div className="slot-content">
                                            {slots[type] ? <code>{slots[type]}</code> : <span className="slot-placeholder">Find pair</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="memory-cards-grid-4">
                                {cards.map((card, index) => (
                                    <div
                                        key={index}
                                        className={`memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                                        onClick={() => handleCardClick(index)}
                                    >
                                        <div className="card-inner">
                                            <div className="card-front">?</div>
                                            <div className="card-back">
                                                <span className="card-icon">{card.icon}</span>
                                                <code>{card.code}</code>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="submit-btn scroll-btn" onClick={checkComplete}>
                                Stabilize Memory Core
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
                                    <strong>💡 Hint:</strong> Match the code syntax to its purpose. 'int i = 0' is
                                    initialization. 'i &lt; n' is a condition. 'i++' is an increment. 'sum += arr[i]' is
                                    the loop body.
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

export default Challenge3;
