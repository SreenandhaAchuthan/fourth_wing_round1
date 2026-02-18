import React, { useState, useEffect, useCallback } from 'react';
import '../styles/challenge8-triage.css';

// --- Challenge Configuration ---
const SQUAD_SIZE = 6;
const INITIAL_POTIONS = 12; // K
const POTION_POWER = 25;   // H
const SURVIVAL_THRESHOLD = 50; // M
const MAX_HEALTH = 100;

// Random starting healths between 10 and 60
// Ensuring some are below threshold
const generateSquad = () => {
    return Array.from({ length: SQUAD_SIZE }, (_, i) => ({
        id: i,
        name: `Rider ${String.fromCharCode(65 + i)}`, // Rider A, B, C...
        health: Math.floor(Math.random() * 50) + 10,
        maxHealth: MAX_HEALTH,
        status: 'critical' // critical (< M), stable (>= M)
    }));
};

const Challenge8 = ({ onComplete, onBack }) => {
    const [squad, setSquad] = useState([]);
    const [potions, setPotions] = useState(INITIAL_POTIONS);
    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [feedbackMsg, setFeedbackMsg] = useState('');

    // Gamification State
    const [ironRain, setIronRain] = useState(0); // 0 to 100%
    const [floatingTexts, setFloatingTexts] = useState([]); // { id, x, y, value }

    // Initialize Game
    useEffect(() => {
        const initialSquad = generateSquad();
        // Update statuses immediately
        const squadWithStatus = initialSquad.map(m => ({
            ...m,
            status: m.health >= SURVIVAL_THRESHOLD ? 'stable' : 'critical'
        }));
        setSquad(squadWithStatus);
        setIronRain(0);
    }, []);

    // Iron Rain Timer
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setIronRain(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 0.5; // Fills up in ~20 seconds (0.5 * 200 ticks = 100)
            });
        }, 100);

        return () => clearInterval(timer);
    }, [gameState]);

    // Check Win/Loss Condition
    useEffect(() => {
        if (squad.length === 0) return;

        const allSurvived = squad.every(m => m.health >= SURVIVAL_THRESHOLD);

        if (allSurvived) {
            if (gameState !== 'won') {
                setGameState('won');
                setFeedbackMsg('MISSION SUCCESS: ALL RIDERS STABILIZED');
                setTimeout(onComplete, 2000);
            }
        } else if (potions === 0) {
            // No potions left, and someone is still critical
            if (gameState !== 'lost') {
                setGameState('lost');
                setFeedbackMsg('RESOURCES EXHAUSTED: SQUAD LOST');
            }
        } else if (ironRain >= 100) {
            // Time ran out
            if (gameState !== 'lost') {
                setGameState('lost');
                setFeedbackMsg('THE IRON RAIN HAS ARRIVED: BASE OVERRUN');
            }
        }
    }, [squad, potions, ironRain, gameState, onComplete]);

    const handleHeal = (id, e) => {
        if (gameState !== 'playing' || potions <= 0) return;

        // Visual FX: Floating Text
        const rect = e.currentTarget.getBoundingClientRect();
        const floatId = Date.now();
        setFloatingTexts(prev => [...prev, {
            id: floatId,
            x: e.clientX,
            y: e.clientY,
            value: `+${POTION_POWER}`
        }]);

        // Remove after animation
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(ft => ft.id !== floatId));
        }, 1000);

        setSquad(prevSquad => prevSquad.map(member => {
            if (member.id !== id) return member;

            const newHealth = Math.min(member.health + POTION_POWER, member.maxHealth);
            const newStatus = newHealth >= SURVIVAL_THRESHOLD ? 'stable' : 'critical';

            // Visual feedback triggered by CSS via key prop or class change?
            // React re-render will handle the bar width update.
            return {
                ...member,
                health: newHealth,
                status: newStatus
            };
        }));

        setPotions(prev => prev - 1);
    };

    const handleRestart = () => {
        const newSquad = generateSquad().map(m => ({
            ...m,
            status: m.health >= SURVIVAL_THRESHOLD ? 'stable' : 'critical'
        }));
        setSquad(newSquad);
        setPotions(INITIAL_POTIONS);
        setIronRain(0);
        setGameState('playing');
        setFeedbackMsg('');
    };

    return (
        <section id="challenge-8" className={`active ${gameState === 'lost' ? 'shake-screen' : ''}`}>
            {/* Floating Texts Layer */}
            {floatingTexts.map(ft => (
                <div
                    key={ft.id}
                    className="floating-text"
                    style={{ top: ft.y, left: ft.x }}
                >
                    {ft.value}
                </div>
            ))}

            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">The Medic’s Triage</h2>
                <p className="challenge-subtitle">Greedy Resource Allocation</p>
            </div>

            <div className="triage-hud">
                <div className="hud-metric">
                    <span className="scifi-label">POTIONS (K):</span>
                    <span className={`scifi-value ${potions === 0 ? 'critical' : ''}`}>{potions}</span>
                </div>
                <div className="hud-metric">
                    <span className="scifi-label">POWER (H):</span>
                    <span className="scifi-value">{POTION_POWER}</span>
                </div>
                <div className="hud-metric">
                    <span className="scifi-label">SURVIVAL (M):</span>
                    <span className="scifi-value">{SURVIVAL_THRESHOLD}</span>
                </div>
                <div className="hud-metric">
                    <span className="scifi-label">IRON RAIN:</span>
                    <div className="timer-bar-container">
                        <div
                            className="timer-bar-fill"
                            style={{ width: `${ironRain}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="squad-container">
                {squad.map(member => (
                    <div
                        key={member.id}
                        className={`squad-member ${member.status}`}
                        onClick={(e) => handleHeal(member.id, e)}
                    >
                        <div className="member-info">
                            <span className="member-name">{member.name}</span>
                            <span className="member-hp">{member.health}/{member.maxHealth}</span>
                        </div>

                        <div className="health-track">
                            <div
                                className="health-bar"
                                style={{ width: `${(member.health / MAX_HEALTH) * 100}%` }}
                            >
                                <div className="bar-glare"></div>
                            </div>
                            {/* Threshold Line */}
                            <div
                                className="threshold-line"
                                style={{ left: `${(SURVIVAL_THRESHOLD / MAX_HEALTH) * 100}%` }}
                                title={`Survival Threshold: ${SURVIVAL_THRESHOLD}`}
                            ></div>
                        </div>

                        {member.status === 'stable' && (
                            <div className="shield-icon">🛡️</div>
                        )}
                        {member.status === 'critical' && (
                            <div className="danger-pulse"></div>
                        )}
                    </div>
                ))}
            </div>

            {gameState === 'lost' && (
                <div className="overlay">
                    <div className="lost-msg">{feedbackMsg}</div>
                    <button className="restart-btn" onClick={handleRestart}>RETRY MISSION</button>
                </div>
            )}

            {gameState === 'won' && (
                <div className="overlay">
                    <div className="win-msg">{feedbackMsg}</div>
                </div>
            )}

            <div className="instructions">
                <p>Click a squad member to apply a Potion (+{POTION_POWER} HP).</p>
                <p>Ensure EVERYONE is above the dashed Survival Line ({SURVIVAL_THRESHOLD} HP).</p>
                <p>Don't waste potions! You have limited supply.</p>
            </div>
        </section>
    );
};

export default Challenge8;
