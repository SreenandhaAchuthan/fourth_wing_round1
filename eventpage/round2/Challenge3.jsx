import React, { useState, useEffect } from 'react';

const Challenge3 = ({ onComplete, onBack }) => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [slots, setSlots] = useState({ init: null, condition: null, body: null, increment: null });
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const cardData = [
        { id: 1, pair: 'init', code: 'int i = 0', icon: '🔄' },
        { id: 2, pair: 'init', code: 'int i = 0', icon: '🔄' },
        { id: 3, pair: 'condition', code: 'i < n', icon: '❓' },
        { id: 4, pair: 'condition', code: 'i < n', icon: '❓' },
        { id: 5, pair: 'body', code: 'sum += arr[i]', icon: '➕' },
        { id: 6, pair: 'body', code: 'sum += arr[i]', icon: '➕' },
        { id: 7, pair: 'increment', code: 'i++', icon: '⬆️' },
        { id: 8, pair: 'increment', code: 'i++', icon: '⬆️' },
    ];

    useEffect(() => {
        // Shuffle cards on mount
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
                // Match
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) =>
                        newFlipped.includes(i) ? { ...c, matched: true, flipped: true } : c
                    ));
                    setMatchedPairs(prev => prev + 1);
                    setSlots(prev => ({ ...prev, [card1.pair]: card1.code }));
                    setFlippedCards([]);
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) =>
                        newFlipped.includes(i) ? { ...c, flipped: false } : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    const checkComplete = () => {
        if (matchedPairs === 4) {
            setFeedback({ message: '🎉 PERFECT! Loop structure reconstructed!', type: 'success' });
            setTimeout(onComplete, 1500);
        } else {
            setFeedback({ message: 'Match 4 pairs first!', type: 'error' });
        }
    };

    return (
        <section id="challenge-3" className="screen challenge-screen active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">🟣 Challenge 3: Complete the Loop Structure!</h2>
                <p className="challenge-subtitle">"Match 4 pairs to reveal the complete for-loop!"</p>
            </div>

            <div className="challenge-content">
                <p className="instruction">🧩 <strong>Memory Match Challenge:</strong> Find pairs to complete the for-loop.</p>

                <div className="loop-skeleton">
                    {['init', 'condition', 'body', 'increment'].map(type => (
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

                <button className="submit-btn" onClick={checkComplete}>Check Loop Structure</button>
                {feedback.message && (
                    <div className={`feedback show ${feedback.type}`}>{feedback.message}</div>
                )}
            </div>
        </section>
    );
};

export default Challenge3;
