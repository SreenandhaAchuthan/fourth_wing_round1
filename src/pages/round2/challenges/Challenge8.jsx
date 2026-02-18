import React, { useState, useEffect, useImperativeHandle } from 'react';
import '../styles/challenge8-triage.css';

const SQUAD_SIZE = 6;
const INITIAL_POTIONS = 12;
const POTION_POWER = 25;
const SURVIVAL_THRESHOLD = 50;
const MAX_HEALTH = 100;

const generateSquad = () => {
    return Array.from({ length: SQUAD_SIZE }, (_, i) => ({
        id: i,
        name: `Rider ${String.fromCharCode(65 + i)}`,
        health: Math.floor(Math.random() * 50) + 10,
        maxHealth: MAX_HEALTH,
        status: 'critical'
    }));
};

const Challenge8 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const [squad, setSquad] = useState([]);
    const [potions, setPotions] = useState(INITIAL_POTIONS);
    const [gameState, setGameState] = useState('playing');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const [ironRain, setIronRain] = useState(0);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            const stableCount = squad.filter(m => m.health >= SURVIVAL_THRESHOLD).length;
            if (stableCount >= 3) return 5;
            return 0;
        }
    }));

    useEffect(() => {
        const initialSquad = generateSquad();
        const squadWithStatus = initialSquad.map(m => ({
            ...m,
            status: m.health >= SURVIVAL_THRESHOLD ? 'stable' : 'critical'
        }));
        setSquad(squadWithStatus);
        setIronRain(0);
    }, []);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setIronRain(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 0.5;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [gameState]);

    useEffect(() => {
        if (squad.length === 0) return;

        const allSurvived = squad.every(m => m.health >= SURVIVAL_THRESHOLD);

        if (allSurvived) {
            if (gameState !== 'won') {
                setGameState('won');
                setFeedbackMsg('ALL RIDERS STABILIZED! The squad survives the night!');
                setTimeout(onComplete, 2000);
            }
        } else if (potions === 0) {
            if (gameState !== 'lost') {
                setGameState('lost');
                setFeedbackMsg('POTIONS EXHAUSTED: Some riders will not survive');
                if (onWrongAnswer) onWrongAnswer();
            }
        } else if (ironRain >= 100) {
            if (gameState !== 'lost') {
                setGameState('lost');
                setFeedbackMsg('TIME EXPIRED: The night claims the wounded');
                if (onWrongAnswer) onWrongAnswer();
            }
        }
    }, [squad, potions, ironRain, gameState, onComplete, onWrongAnswer]);

    const handleHeal = (id, e) => {
        if (gameState !== 'playing' || potions <= 0) return;

        const floatId = Date.now();
        setFloatingTexts(prev => [...prev, {
            id: floatId,
            x: e.clientX,
            y: e.clientY,
            value: `+${POTION_POWER}`
        }]);

        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(ft => ft.id !== floatId));
        }, 1000);

        setSquad(prevSquad => prevSquad.map(member => {
            if (member.id !== id) return member;

            const newHealth = Math.min(member.health + POTION_POWER, member.maxHealth);
            const newStatus = newHealth >= SURVIVAL_THRESHOLD ? 'stable' : 'critical';

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

    const breakSeal = () => {
        setSealBroken(true);
    };

    return (
        <section id="challenge-8" className={`active scroll-challenge ${gameState === 'lost' ? 'shake-screen' : ''}`}>
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
                <h2 className="challenge-title">📜 Challenge 8: The Medic's Triage</h2>
                <p className="challenge-subtitle">"Save your squad with greedy resource allocation"</p>
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
                            <h3>📜 Scroll of the Medic's Triage</h3>
                            <p className="scroll-story">
                                Your squad has returned from a skirmish, exhausted and injured. Many will not survive
                                the night unless their health is restored to a stable threshold. You have limited
                                healing potions—use greedy logic to save everyone before time runs out.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
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
                                    <span className="scifi-label">TIME REMAINING:</span>
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
                                    <button className="restart-btn scroll-btn" onClick={handleRestart}>RETRY MISSION</button>
                                </div>
                            )}

                            {gameState === 'won' && (
                                <div className="overlay">
                                    <div className="win-msg">{feedbackMsg}</div>
                                </div>
                            )}

                            {!hintUsed ? (
                                <button className="hint-btn scroll-btn" onClick={() => setShowHintWarning(true)}>
                                    💡 Show Hint
                                </button>
                            ) : (
                                <div className="hint-box">
                                    <strong>💡 Strategy:</strong> Click a squad member to apply a Potion (+{POTION_POWER} HP).
                                    Ensure EVERYONE reaches the survival threshold ({SURVIVAL_THRESHOLD} HP). Use the greedy
                                    formula: potions_needed = (threshold - current_health + {POTION_POWER} - 1) / {POTION_POWER}
                                    to minimize waste.
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

export default Challenge8;
