import React from 'react';

const ResultScreen = () => {
    return (
        <section id="result-screen" className="screen active">
            <div className="result-content">
                <h1 className="result-title">🎉 All Challenges Complete!</h1>
                <p className="result-message">Congratulations! You've successfully completed all 6 coding challenges.</p>
                <div className="choice-section">
                    <h2>🐉 Your Final Destiny Awaits...</h2>
                    <p>You have proven your worth.</p>
                    {/* Choice logic can be added here if needed */}
                </div>
            </div>
        </section>
    );
};

export default ResultScreen;
