import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import '../styles/challenge9-warp.css';

const NODE_COUNT = 6;
const INF = 999;
const START_NODE = 0;
const TARGET_NODE = NODE_COUNT - 1;

const generateGraph = () => {
    const nodes = [];
    const edges = [];
    const width = 600;
    const height = 400;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    for (let i = 0; i < NODE_COUNT; i++) {
        const angle = (i * 2 * Math.PI) / NODE_COUNT - Math.PI / 2;
        nodes.push({
            id: i,
            label: String.fromCharCode(65 + i),
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        });
    }

    for (let i = 0; i < NODE_COUNT; i++) {
        const target = (i + 1) % NODE_COUNT;
        const weight = Math.floor(Math.random() * 15) + 5;
        edges.push({ u: i, v: target, w: weight });
    }

    for (let i = 0; i < 5; i++) {
        const u = Math.floor(Math.random() * NODE_COUNT);
        let v = Math.floor(Math.random() * NODE_COUNT);
        while (u === v || Math.abs(u - v) === 1 || (u === 0 && v === NODE_COUNT - 1) || (v === 0 && u === NODE_COUNT - 1)) {
            v = Math.floor(Math.random() * NODE_COUNT);
        }

        if (!edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) {
            const weight = Math.floor(Math.random() * 15) + 5;
            edges.push({ u, v, w: weight });
        }
    }

    return { nodes, edges };
};

const solveDijkstra = (graph, startNode) => {
    const dist = Array(NODE_COUNT).fill(INF);
    const visited = Array(NODE_COUNT).fill(false);
    dist[startNode] = 0;

    for (let i = 0; i < NODE_COUNT; i++) {
        let u = -1;
        for (let j = 0; j < NODE_COUNT; j++) {
            if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
                u = j;
            }
        }

        if (dist[u] === INF) break;
        visited[u] = true;

        graph.edges.forEach(edge => {
            if (edge.u === u) {
                const v = edge.v;
                const weight = edge.w;
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                }
            }
        });
    }
    return dist;
};

const Challenge9 = ({ onComplete, onBack, onWrongAnswer, ref }) => {
    const [graph, setGraph] = useState({ nodes: [], edges: [] });
    const [playerNode, setPlayerNode] = useState(START_NODE);
    const [userDistances, setUserDistances] = useState({});
    const [trueDistances, setTrueDistances] = useState([]);
    const [message, setMessage] = useState("Initialize warp sequence...");
    const [completed, setCompleted] = useState(false);
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    const [inputValues, setInputValues] = useState({});

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            let correctCount = 0;
            for (let i = 0; i < NODE_COUNT; i++) {
                if (userDistances[i] !== undefined && userDistances[i] === trueDistances[i]) {
                    correctCount++;
                }
            }
            if (correctCount >= 3) return 5;
            return 0;
        }
    }));

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const newGraph = generateGraph();
        setGraph(newGraph);

        const solved = solveDijkstra(newGraph, START_NODE);
        setTrueDistances(solved);

        setPlayerNode(START_NODE);
        setUserDistances({ [START_NODE]: 0 });
        setInputValues({});
        setMessage("Start at Node A. Check neighbors and update their distances!");
        setCompleted(false);
    };

    const resetGame = () => {
        initializeGame();
        if (onWrongAnswer) onWrongAnswer(); // Only penalty on manual reset
    };

    const handleNodeClick = (nodeId) => {
        if (userDistances[nodeId] !== undefined && userDistances[nodeId] !== INF) {
            setPlayerNode(nodeId);
            setInputValues({}); // Clear inputs on move

            if (nodeId === TARGET_NODE) {
                checkCompletion(nodeId, userDistances[nodeId]);
            } else {
                setMessage(`Moved to Node ${String.fromCharCode(65 + nodeId)}. Scanning neighbors...`);
            }
        } else {
            setMessage("Cannot warp there yet! Distance unknown.");
        }
    };

    const handleInputChange = (nodeId, value) => {
        setInputValues(prev => ({
            ...prev,
            [nodeId]: value
        }));
    };

    const verifyAnswers = () => {
        let anyCorrect = false;
        let anyWrong = false;

        // Find neighbors of current player node
        const neighbors = graph.edges
            .filter(e => e.u === playerNode)
            .map(e => ({ nodeId: e.v, weight: e.w }));

        neighbors.forEach(({ nodeId, weight }) => {
            const valStr = inputValues[nodeId];
            if (!valStr || valStr.trim() === '') return;

            const val = parseInt(valStr, 10);
            if (isNaN(val)) return;

            const currentDist = userDistances[playerNode];
            const expectedViaCurrent = currentDist + weight;

            if (val === expectedViaCurrent) {
                // Correct
                setUserDistances(prev => {
                    const oldVal = prev[nodeId] || INF;
                    if (val < oldVal) {
                        anyCorrect = true;
                        return { ...prev, [nodeId]: val };
                    } else if (val === oldVal) {
                        // Already found this path or equal path
                        return { ...prev, [nodeId]: val }; // Still mark as valid/visited
                    } else {
                        return prev;
                    }
                });

                // Clear input after correct submission? Optional.
                // setInputValues(prev => { const n = {...prev}; delete n[nodeId]; return n; });
            } else {
                // Wrong
                anyWrong = true;
            }
        });

        if (anyWrong) {
            setMessage(`Calculations unstable! Verify distances: Current Node (${userDistances[playerNode]}) + Edge Weight.`);
            if (onWrongAnswer) onWrongAnswer();
        } else if (anyCorrect) {
            setMessage("Warp coordinates synchronized. Distances updated.");
            // Check if target reached with optimal distance
            if (userDistances[TARGET_NODE] === trueDistances[TARGET_NODE]) {
                setMessage("Target reachable! Move there to complete.");
            }
        } else {
            setMessage("No valid updates found. Check your math.");
        }
    };

    const checkCompletion = (nodeId, dist) => {
        if (dist === trueDistances[TARGET_NODE]) {
            setCompleted(true);
            setMessage("OPTIMAL PATH ESTABLISHED. WARP GATES SYNCED.");
        } else {
            setMessage(`Reached Target, but distance ${dist} is not optimal (Expected: ${trueDistances[TARGET_NODE]}). Keep searching!`);
            if (onWrongAnswer) onWrongAnswer();
        }
    };

    const breakSeal = () => {
        setSealBroken(true);
    };

    return (
        <section id="challenge-9" className="active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 8: The Warp Gates</h2>
                <p className="challenge-subtitle">"Synchronize the warp gate network"</p>
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
                            <h3>📜 Scroll of the Warp Gates</h3>
                            <p className="scroll-story">
                                The final barrier is a network of Warp Gates. To escape, you must manually synchronize
                                the gate frequencies by calculating the shortest path through the node network. The distance
                                metrics must be precise to establish a stable wormhole.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="status-bar">
                                <div className="status-text">{message}</div>
                                <div className="target-info">Target: Node {String.fromCharCode(65 + TARGET_NODE)}</div>
                            </div>

                            <div className="graph-area">
                                <svg className="graph-svg" width="600" height="400">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
                                        </marker>
                                        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#FFC107" />
                                        </marker>
                                    </defs>
                                    {graph.edges.map((e, idx) => {
                                        const source = graph.nodes[e.u];
                                        const target = graph.nodes[e.v];
                                        const isNeighbor = e.u === playerNode;
                                        const color = isNeighbor ? '#FFC107' : '#555';
                                        const marker = isNeighbor ? "url(#arrowhead-active)" : "url(#arrowhead)";

                                        return (
                                            <g key={idx}>
                                                <line
                                                    x1={source.x} y1={source.y}
                                                    x2={target.x} y2={target.y}
                                                    stroke={color}
                                                    strokeWidth={isNeighbor ? "3" : "2"}
                                                    markerEnd={marker}
                                                />
                                                <text
                                                    x={(source.x + target.x) / 2}
                                                    y={(source.y + target.y) / 2}
                                                    fill={isNeighbor ? "#FFC107" : "#aaa"}
                                                    fontSize="14"
                                                    dy="-5"
                                                    textAnchor="middle"
                                                    style={{ background: '#000', fontWeight: 'bold' }}
                                                >
                                                    {e.w}
                                                </text>
                                            </g>
                                        );
                                    })}
                                    {graph.nodes.map(node => {
                                        const isPlayer = playerNode === node.id;
                                        const isTarget = node.id === TARGET_NODE;
                                        const dist = userDistances[node.id];
                                        const displayDist = dist !== undefined ? dist : '?';

                                        return (
                                            <g key={node.id} onClick={() => handleNodeClick(node.id)} style={{ cursor: 'pointer' }}>
                                                <circle
                                                    cx={node.x} cy={node.y} r="25"
                                                    fill={isPlayer ? '#28A745' : (isTarget ? '#dc3545' : '#007BFF')}
                                                    stroke={isPlayer ? '#fff' : '#333'}
                                                    strokeWidth={isPlayer ? "3" : "2"}
                                                    className="node-circle"
                                                />
                                                <text
                                                    x={node.x} y={node.y}
                                                    dy="5" textAnchor="middle"
                                                    fill="#fff" fontWeight="bold"
                                                    fontSize="16"
                                                    pointerEvents="none"
                                                >
                                                    {node.label}
                                                </text>

                                                <rect
                                                    x={node.x - 20} y={node.y + 30}
                                                    width="40" height="20"
                                                    rx="4" fill="#222" stroke="#444"
                                                />
                                                <text
                                                    x={node.x} y={node.y + 44}
                                                    textAnchor="middle"
                                                    fill="#fff" fontSize="12"
                                                    pointerEvents="none"
                                                >
                                                    {displayDist}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {graph.nodes.map(node => {
                                    const edge = graph.edges.find(e => e.u === playerNode && e.v === node.id);
                                    if (!edge) return null;

                                    return (
                                        <div
                                            key={node.id}
                                            className="distance-input-wrapper"
                                            style={{
                                                left: node.x + 20,
                                                top: node.y - 20
                                            }}
                                        >
                                            <input
                                                type="number"
                                                className="dist-input"
                                                placeholder="?"
                                                value={inputValues[node.id] || ''}
                                                onChange={(e) => handleInputChange(node.id, e.target.value)}
                                            />
                                            <div className="input-hint">+{edge.w}</div>
                                        </div>
                                    );
                                })}

                                {graph.edges.some(e => e.u === playerNode) && (
                                    <button
                                        className="control-btn primary scroll-btn"
                                        onClick={verifyAnswers}
                                        style={{
                                            position: 'absolute',
                                            bottom: '20px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            zIndex: 10
                                        }}
                                    >
                                        Verify Data (Submit)
                                    </button>
                                )}
                            </div>

                            <div className="controls-panel">
                                <button className="control-btn secondary scroll-btn" onClick={resetGame}>RESET SYSTEM</button>
                                {completed && (
                                    <button className="control-btn success scroll-btn" onClick={onComplete}>
                                        WARDS ESTABLISHED (NEXT LEVEL)
                                    </button>
                                )}
                            </div>

                            {!hintUsed ? (
                                <button className="hint-btn scroll-btn" onClick={() => setShowHintWarning(true)}>
                                    💡 Show Hint
                                </button>
                            ) : (
                                <div className="hint-box">
                                    <strong>💡 Strategy:</strong> Click nodes to move. For each neighbor, calculate the distance
                                    as: current_node_distance + edge_weight. Input this value to update the neighbor's distance.
                                    Always choose the node with the smallest known distance to explore next (Dijkstra's greedy choice).
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

export default Challenge9;
