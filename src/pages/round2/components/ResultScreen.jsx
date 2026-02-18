import React from 'react';
import { Link } from 'react-router-dom';

const ResultScreen = ({ score, userInfo }) => {
    return (
        <section id="result-screen" className="screen active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="result-content" style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px' }}>
                <h1 className="result-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉 Mission Accomplished!</h1>
                <p className="result-message" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Agent <strong>{userInfo.name}</strong> ({userInfo.rollNo}), you have successfully navigated the challenges.
                </p>

                <div className="score-display" style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '1.5rem', color: '#ccc' }}>Final Score</div>
                    <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#4ade80', textShadow: '0 0 20px rgba(74, 222, 128, 0.5)' }}>
                        {score}
                    </div>
                </div>

                <div className="choice-section" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>

                    <Link to="/" className="challenge-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                        Return to Base
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ResultScreen;
