import React from 'react';

const WelcomeScreen = ({ completedChallenges, score, onStartChallenge }) => {
    return (
        <section id="welcome-screen" className="screen active">
            <div className="welcome-content">
                <h1 className="main-title">
                    <span className="fire-emoji">🔥</span>
                    Round 2: The Epic Puzzle Road
                </h1>
                <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#ffd700' }}>
                    Current Score: {score || 0}
                </div>
                <p className="subtitle">Alright teams, buckle up! You're about to face <strong>9 totally different
                    challenges</strong> that'll test your coding skills in ways you haven't seen yet.</p>
                <p className="description">You'll see <strong>9 glowing buttons</strong> below. Click each one to unlock a
                    unique brain teaser. Solve all seven, and then... well, you'll get to choose your own destiny. 😈</p>

                <div className="challenge-grid">
                    <button
                        className={`challenge-btn ${completedChallenges.has(1) ? 'completed' : ''}`}
                        onClick={() => onStartChallenge(1)}
                    >
                        <span className="challenge-icon">🟢</span>
                        <span className="challenge-name">Fix the Broken Bridge</span>
                        <span className="challenge-status">
                            {completedChallenges.has(1) ? '✓ Completed' : 'Active'}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(2) ? 'completed' : ''} ${!completedChallenges.has(1) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(2)}
                    >
                        <span className="challenge-icon">🔵</span>
                        <span className="challenge-name">Match the Keys</span>
                        <span className="challenge-status">
                            {completedChallenges.has(2) ? '✓ Completed' : (!completedChallenges.has(1) ? 'Locked' : 'Active')}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(3) ? 'completed' : ''} ${!completedChallenges.has(2) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(3)}
                    >
                        <span className="challenge-icon">🟣</span>
                        <span className="challenge-name">Reveal Loop Skeleton</span>
                        <span className="challenge-status">
                            {completedChallenges.has(3) ? '✓ Completed' : (!completedChallenges.has(2) ? 'Locked' : 'Active')}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(4) ? 'completed' : ''} ${!completedChallenges.has(3) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(4)}
                    >
                        <span className="challenge-icon">🔴</span>
                        <span className="challenge-name">Temporal Debugger</span>
                        <span className="challenge-status">
                            {completedChallenges.has(4) ? '✓ Completed' : (!completedChallenges.has(3) ? 'Locked' : 'Active')}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(5) ? 'completed' : ''} ${!completedChallenges.has(4) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(5)}
                    >
                        <span className="challenge-icon">🟡</span>
                        <span className="challenge-name">Signal Alignment</span>
                        <span className="challenge-status">
                            {completedChallenges.has(5) ? '✓ Completed' : (!completedChallenges.has(4) ? 'Locked' : 'Active')}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(6) ? 'completed' : ''} ${!completedChallenges.has(5) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(6)}
                    >
                        <span className="challenge-icon">🎒</span>
                        <span className="challenge-name">Dragon's Saddlebag</span>
                        <span className="challenge-status">
                            {completedChallenges.has(6) ? '✓ Completed' : (!completedChallenges.has(5) ? 'Locked' : 'Active')}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(7) ? 'completed' : ''} ${!completedChallenges.has(6) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(7)}
                    >
                        <span className="challenge-icon">🏃</span>
                        <span className="challenge-name">Reactive Outrun</span>
                        <span className="challenge-status">
                            {completedChallenges.has(7) ? '✓ Completed' : (!completedChallenges.has(6) ? 'Locked' : 'Active')}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(8) ? 'completed' : ''} ${!completedChallenges.has(7) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(8)}
                    >
                        <span className="challenge-icon">💊</span>
                        <span className="challenge-name">The Medic’s Triage</span>
                        <span className="challenge-status">
                            {completedChallenges.has(8) ? '✓ Completed' : (!completedChallenges.has(7) ? 'Locked' : 'Active')}
                        </span>
                    </button>

                    <button
                        className={`challenge-btn ${completedChallenges.has(9) ? 'completed' : ''} ${!completedChallenges.has(8) ? 'locked' : ''}`}
                        onClick={() => onStartChallenge(9)}
                    >
                        <span className="challenge-icon">🌌</span>
                        <span className="challenge-name">Warp-Gate Network</span>
                        <span className="challenge-status">
                            {completedChallenges.has(9) ? '✓ Completed' : (!completedChallenges.has(8) ? 'Locked' : 'Active')}
                        </span>
                    </button>
                </div>

                <div className="progress-indicator">
                    <span id="progress-text">Progress: {completedChallenges.size}/9 Challenges Completed</span>
                </div>
            </div>
        </section>
    );
};

export default WelcomeScreen;
