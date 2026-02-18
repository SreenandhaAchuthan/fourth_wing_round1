import React, { useState, useEffect, useCallback, useImperativeHandle } from 'react';
import '../styles/challenge7-reactive.css';

const ROWS = 15;
const COLS = 15;
const START_POS = { r: 0, c: 0 };
const EXIT_POS = { r: ROWS - 1, c: COLS - 1 };

const WALLS = [
    "1,1", "1,2", "1,3", "1,5", "1,6", "1,7", "1,8", "1,10", "1,11", "1,12",
    "2,5", "2,10",
    "3,1", "3,2", "3,3", "3,5", "3,7", "3,8", "3,10", "3,12", "3,13",
    "4,1", "4,12",
    "5,1", "5,3", "5,4", "5,5", "5,6", "5,7", "5,8", "5,9", "5,10", "5,12",
    "6,3", "6,12",
    "7,0", "7,1", "7,3", "7,5", "7,12", "7,14",
    "8,5", "8,7", "8,8", "8,9", "8,10", "8,11", "8,12",
    "9,1", "9,2", "9,3", "9,5",
    "10,1", "10,7", "10,9", "10,10", "10,11", "10,13",
    "11,1", "11,3", "11,4", "11,5", "11,7", "11,13",
    "12,1", "12,9", "12,13",
    "13,1", "13,2", "13,3", "13,4", "13,6", "13,7", "13,8", "13,9", "13,10", "13,11", "13,13",
    "14,6"
];
const WALL_SET = new Set(WALLS);

const VENINS = [
    {
        id: 'v1',
        path: [
            { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 3 }
        ]
    },
    {
        id: 'v2',
        path: [
            { r: 6, c: 6 }, { r: 6, c: 7 }, { r: 6, c: 8 }, { r: 7, c: 8 }, { r: 7, c: 7 }, { r: 7, c: 6 }
        ]
    },
    {
        id: 'v3',
        path: [
            { r: 10, c: 4 }, { r: 10, c: 5 }, { r: 10, c: 6 }, { r: 9, c: 6 }, { r: 9, c: 5 }, { r: 9, c: 4 }
        ]
    },
    {
        id: 'v4',
        path: [
            { r: 12, c: 11 }, { r: 12, c: 12 }, { r: 11, c: 12 }, { r: 11, c: 11 }
        ]
    },
    {
        id: 'v5',
        path: [
            { r: 4, c: 11 }, { r: 5, c: 11 }, { r: 6, c: 11 }, { r: 5, c: 11 }
        ]
    }
];

const INITIAL_SCORE = 2000;
const MOVE_PENALTY = 10;
const UNDO_PENALTY = 5;

const Challenge7 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const [playerPos, setPlayerPos] = useState(START_POS);
    const [turn, setTurn] = useState(0);
    const [history, setHistory] = useState([]);
    const [score, setScore] = useState(INITIAL_SCORE);
    const [status, setStatus] = useState('playing');
    const [sealBroken, setSealBroken] = useState(false);
    const [trapCount, setTrapCount] = useState(0);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            const dist = Math.abs(playerPos.r - EXIT_POS.r) + Math.abs(playerPos.c - EXIT_POS.c);
            const maxDist = ROWS + COLS - 2;
            const progress = 1 - (dist / maxDist);

            if (progress >= 0.5 && status !== 'lost') {
                return 5;
            }
            return 0;
        }
    }));

    const getVeninPositions = (currentTurn) => {
        return VENINS.map(v => {
            const index = currentTurn % v.path.length;
            const pos = v.path[index];
            return { id: v.id, ...pos };
        });
    };

    const currentVenins = getVeninPositions(turn);

    const isWall = (r, c) => WALL_SET.has(`${r},${c}`);
    const isVenin = (r, c, veninList) => veninList.some(v => v.r === r && v.c === c);
    const isValidMove = (r, c) => {
        return r >= 0 && r < ROWS && c >= 0 && c < COLS && !isWall(r, c);
    };

    const handleMove = useCallback((dr, dc) => {
        if (status !== 'playing') return;

        const newR = playerPos.r + dr;
        const newC = playerPos.c + dc;

        if (!isValidMove(newR, newC)) return;

        const snapshot = {
            playerPos: { ...playerPos },
            turn,
            score
        };
        const newHistory = [...history, snapshot];

        const newTurn = turn + 1;
        const newScore = score - MOVE_PENALTY;
        const nextVenins = getVeninPositions(newTurn);

        setHistory(newHistory);
        setPlayerPos({ r: newR, c: newC });
        setTurn(newTurn);
        setScore(newScore);

        if (isVenin(newR, newC, nextVenins)) {
            const newTrapCount = trapCount + 1;
            setTrapCount(newTrapCount);

            // If trapped more than twice, cancel all marks and skip
            if (newTrapCount > 2) {
                setStatus('failed');
                // Trigger skip with 0 points by calling onWrongAnswer multiple times
                // This will trigger the 3-attempt auto-skip in Round2Manager
                if (onWrongAnswer) {
                    onWrongAnswer();
                    setTimeout(() => onWrongAnswer(), 100);
                    setTimeout(() => onWrongAnswer(), 200);
                }
                return;
            }

            setStatus('lost');
            if (onWrongAnswer) onWrongAnswer();
            return;
        }

        if (newR === EXIT_POS.r && newC === EXIT_POS.c) {
            setStatus('won');
            setTimeout(onComplete, 2000);
        }

    }, [playerPos, turn, score, status, history, onComplete, onWrongAnswer]);

    const handleUndo = useCallback(() => {
        if (history.length === 0 || status === 'won') return;

        const prev = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        setPlayerPos(prev.playerPos);
        setTurn(prev.turn);
        setScore(prev.score - UNDO_PENALTY);
        setHistory(newHistory);
        setStatus('playing');

    }, [history, status]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            switch (e.key) {
                case 'ArrowUp': case 'w': handleMove(-1, 0); break;
                case 'ArrowDown': case 's': handleMove(1, 0); break;
                case 'ArrowLeft': case 'a': handleMove(0, -1); break;
                case 'ArrowRight': case 'd': handleMove(0, 1); break;
                case 'z': if (e.ctrlKey || e.metaKey) handleUndo(); break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove, handleUndo]);

    const renderGrid = () => {
        const cells = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const key = `${r}-${c}`;
                let classes = 'cell';
                if (isWall(r, c)) classes += ' wall';
                if (r === START_POS.r && c === START_POS.c) classes += ' start-zone';
                if (r === EXIT_POS.r && c === EXIT_POS.c) classes += ' exit-zone';

                const isPlayerHere = playerPos.r === r && playerPos.c === c;
                const isVeninHere = isVenin(r, c, currentVenins);

                cells.push(
                    <div key={key} className={classes}>
                        {isPlayerHere && <div className="dragon" title="You"></div>}
                        {isVeninHere && <div className="venin" title="Venin"></div>}
                    </div>
                );
            }
        }
        return cells;
    };

    const breakSeal = () => {
        setSealBroken(true);
    };

    return (
        <section id="challenge-7" className="active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 7: The Reactive Outrun</h2>
                <p className="challenge-subtitle">"Escape the canyon before the shadows consume you"</p>
            </div>

            {!sealBroken ? (
                <div className="scroll-container">
                    <div className="scroll-sealed">
                        <div className="wax-seal" onClick={breakSeal}>
                            <div className="seal-emblem">
                                <div className="seal-text">BASGIATH</div>
                                <div className="seal-subtext">WAR COLLEGE</div>
                            </div>
                            <div className="seal-instruction">Click to break seal</div>
                        </div>
                        <div className="scroll-preview">
                            <h3>📜 Scroll of the Shadow Flight</h3>
                            <p className="scroll-story">
                                You are trapped in a narrow canyon with "Reactive" Venin shadows closing in. These
                                enemies mirror your movements and try to cut off your escape to the extraction point.
                                You must be three steps ahead of their logic to survive.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="scroll-opened">
                    <div className="scroll-parchment">
                        <div className="hud-panel">
                            <div className="hud-item">
                                <span className="hud-label">SCORE:</span>
                                <span className="score-val">{score}</span>
                            </div>
                            <div className="hud-item">
                                <span className="hud-label">TURN:</span>
                                <span className="turn-val">{turn}</span>
                            </div>
                        </div>

                        <div className="game-container">
                            <div className="grid-board" style={{ gridTemplateColumns: `repeat(${COLS}, 30px)` }}>
                                {renderGrid()}
                            </div>

                            {status === 'lost' && (
                                <div className="overlay">
                                    <div className="lost-msg">TRAPPED BY SHADOWS!</div>
                                    <button className="restart-btn scroll-btn" onClick={handleUndo}>
                                        ↺ REWIND (Undo)
                                    </button>
                                </div>
                            )}

                            {status === 'won' && (
                                <div className="overlay">
                                    <div className="win-msg">EXTRACTION SUCCESSFUL!</div>
                                </div>
                            )}
                        </div>

                        <div className="controls-area">
                            <button
                                className="undo-btn scroll-btn"
                                onClick={handleUndo}
                                disabled={history.length === 0 || status === 'won'}
                                title="Rewind (Undo)"
                            >
                                ↺ Temporal Undo
                            </button>
                        </div>

                        {!hintUsed ? (
                            <button className="hint-btn scroll-btn" onClick={() => setShowHintWarning(true)}>
                                💡 Show Hint
                            </button>
                        ) : (
                            <div className="hint-box">
                                <strong>🎯 Controls:</strong> Use Arrow Keys or WASD to move. Avoid the Red Venin patrols—they
                                move when you move. Use the Temporal Undo button to backtrack if trapped (-5 pts per undo).
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
        </section>
    );
};

export default Challenge7;
