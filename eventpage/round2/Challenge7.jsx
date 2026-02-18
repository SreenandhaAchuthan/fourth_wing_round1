import React, { useState, useEffect, useCallback } from 'react';
import '../styles/challenge7-reactive.css';

// --- Level Configuration ---
// 15x15 Grid
const ROWS = 15;
const COLS = 15;
const START_POS = { r: 0, c: 0 };
const EXIT_POS = { r: ROWS - 1, c: COLS - 1 };

// Define Walls (Simple Maze Layout)
const WALLS = [
    // Outer boundary implied by grid check, but let's add some internal structure
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

// Define Venin Paths (Circular)
// Each venin has a path of coordinates. They loop through them.
const VENINS = [
    {
        id: 'v1',
        path: [
            { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 3 } // Patrols a short line
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
        id: 'v4', // Guarding near exit
        path: [
            { r: 12, c: 11 }, { r: 12, c: 12 }, { r: 11, c: 12 }, { r: 11, c: 11 }
        ]
    },
    {
        id: 'v5', // Roaming middle
        path: [
            { r: 4, c: 11 }, { r: 5, c: 11 }, { r: 6, c: 11 }, { r: 5, c: 11 }
        ]
    }
];

const INITIAL_SCORE = 2000;
const MOVE_PENALTY = 10;
const UNDO_PENALTY = 5;

const Challenge7 = ({ onComplete, onBack }) => {
    // Game State
    const [playerPos, setPlayerPos] = useState(START_POS);
    const [turn, setTurn] = useState(0);
    const [history, setHistory] = useState([]); // Stack of { turn, playerPos, score }
    const [score, setScore] = useState(INITIAL_SCORE);
    const [status, setStatus] = useState('playing'); // 'playing', 'won', 'lost'

    // Derived Venin positions based on turn
    const getVeninPositions = (currentTurn) => {
        return VENINS.map(v => {
            const index = currentTurn % v.path.length;
            const pos = v.path[index];
            return { id: v.id, ...pos };
        });
    };

    const currentVenins = getVeninPositions(turn);

    // Helpers
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

        // 1. Snapshot State for Undo
        const snapshot = {
            playerPos: { ...playerPos },
            turn,
            score
        };
        const newHistory = [...history, snapshot];

        // 2. Advance Game
        const newTurn = turn + 1;
        const newScore = score - MOVE_PENALTY;
        const nextVenins = getVeninPositions(newTurn);

        // 3. Updates
        setHistory(newHistory);
        setPlayerPos({ r: newR, c: newC });
        setTurn(newTurn);
        setScore(newScore);

        // 4. Check Collision & Win
        // Did we move into a venin?
        if (isVenin(newR, newC, nextVenins)) {
            setStatus('lost');
            return;
        }

        // Did we reach exit?
        if (newR === EXIT_POS.r && newC === EXIT_POS.c) {
            setStatus('won');
            // Give Final Score Bonus maybe? Or just freeze it.
            setTimeout(onComplete, 2000);
        }

    }, [playerPos, turn, score, status, history, onComplete]);

    const handleUndo = useCallback(() => {
        if (history.length === 0 || status === 'won') return;

        // Determine if we are just backing up or reviving from death
        // If we are lost, we can still undo to try again
        // However, the current status is derived independently, so explicit reset needed if 'lost'

        const prev = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        setPlayerPos(prev.playerPos);
        setTurn(prev.turn);
        // Apply undo penalty: We pay 5 points to go back.
        // The score stored in 'prev' was the score BEFORE the move.
        // So restores score = prev.score - UNDO_PENALTY.
        setScore(prev.score - UNDO_PENALTY);
        setHistory(newHistory);
        setStatus('playing'); // Reset status if we were dead

    }, [history, status]);

    // Keyboard support
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
                case 'z': if (e.ctrlKey || e.metaKey) handleUndo(); break; // Optional Ctrl+Z
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove, handleUndo]);

    // Render Grid
    const renderGrid = () => {
        const cells = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const key = `${r}-${c}`;
                let classes = 'cell';
                if (isWall(r, c)) classes += ' wall';
                if (r === START_POS.r && c === START_POS.c) classes += ' start-zone';
                if (r === EXIT_POS.r && c === EXIT_POS.c) classes += ' exit-zone';

                // Entities
                const isPlayerHere = playerPos.r === r && playerPos.c === c;
                const isVeninHere = isVenin(r, c, currentVenins);

                cells.push(
                    <div key={key} className={classes}>
                        {isPlayerHere && <div className="dragon" title="You"></div>}
                        {isVeninHere && <div className="venin" title="Venin"></div>}
                        {/* Collision visual if both roughly same time? (Though logic handles it) */}
                    </div>
                );
            }
        }
        return cells;
    };

    return (
        <section id="challenge-7" className="active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">The Reactive Outrun</h2>
            </div>

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
                        <div className="lost-msg">TRAPPED!</div>
                        <button className="restart-btn" onClick={handleUndo}>
                            REWIND (Undo)
                        </button>
                    </div>
                )}

                {status === 'won' && (
                    <div className="overlay">
                        <div className="win-msg">EXTRACTED!</div>
                    </div>
                )}
            </div>

            <div className="controls-area">
                <button
                    className="undo-btn"
                    onClick={handleUndo}
                    disabled={history.length === 0 || status === 'won'}
                    title="Rewind (Undo)"
                >
                    ↺
                </button>
            </div>

            <div className="instructions">
                <p>Use Arrow Keys or WASD to move.</p>
                <p>Avoid the Red Venin patrols. They move when you move.</p>
                <p>Use Undo button to backtrack if trapped (-5 pts).</p>
            </div>
        </section>
    );
};

export default Challenge7;
