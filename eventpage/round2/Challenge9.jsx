import React, { useState, useEffect, useRef } from 'react';
import '../styles/challenge9-warp.css';

// --- Configuration ---
const NODE_COUNT = 6;
const INF = 999;
const START_NODE = 0;
const TARGET_NODE = NODE_COUNT - 1;

// --- Helper: Generate Graph (Positive Weights Only) ---
const generateGraph = () => {
    const nodes = [];
    const edges = [];
    const width = 600;
    const height = 400;

    // Generate Nodes (Circular layout for clarity)
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    for (let i = 0; i < NODE_COUNT; i++) {
        const angle = (i * 2 * Math.PI) / NODE_COUNT - Math.PI / 2;
        nodes.push({
            id: i,
            label: String.fromCharCode(65 + i), // A, B, C...
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        });
    }

    // Generate Edges (Ring + Random Cross)
    for (let i = 0; i < NODE_COUNT; i++) {
        const target = (i + 1) % NODE_COUNT;
        const weight = Math.floor(Math.random() * 15) + 5; // 5 to 20
        edges.push({ u: i, v: target, w: weight });
    }

    // Add some random cross-edges
    for (let i = 0; i < 5; i++) {
        const u = Math.floor(Math.random() * NODE_COUNT);
        let v = Math.floor(Math.random() * NODE_COUNT);
        while (u === v || Math.abs(u - v) === 1 || (u === 0 && v === NODE_COUNT - 1) || (v === 0 && u === NODE_COUNT - 1)) {
            v = Math.floor(Math.random() * NODE_COUNT);
        }

        // Check duplicate
        if (!edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) {
            const weight = Math.floor(Math.random() * 15) + 5;
            edges.push({ u, v, w: weight });
        }
    }

    return { nodes, edges };
};

// --- Helper: Dijkstra Solver (for Validation) ---
const solveDijkstra = (graph, startNode) => {
    const dist = Array(NODE_COUNT).fill(INF);
    const visited = Array(NODE_COUNT).fill(false);
    dist[startNode] = 0;

    for (let i = 0; i < NODE_COUNT; i++) {
        // Find min dist node not visited
        let u = -1;
        for (let j = 0; j < NODE_COUNT; j++) {
            if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
                u = j;
            }
        }

        if (dist[u] === INF) break;
        visited[u] = true;

        // Relax neighbors
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

const Challenge9 = ({ onComplete, onBack }) => {
    const [graph, setGraph] = useState({ nodes: [], edges: [] });
    const [playerNode, setPlayerNode] = useState(START_NODE);
    const [userDistances, setUserDistances] = useState({}); // { 0: 0, 1: 20, ... }
    const [trueDistances, setTrueDistances] = useState([]);
    const [message, setMessage] = useState("Initialize warp sequence...");
    const [completed, setCompleted] = useState(false);

    // Init Graph
    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        const newGraph = generateGraph();
        setGraph(newGraph);

        // Solve for validation
        const solved = solveDijkstra(newGraph, START_NODE);
        setTrueDistances(solved);

        // Reset User State
        setPlayerNode(START_NODE);
        setUserDistances({ [START_NODE]: 0 }); // Start known as 0
        setMessage("Start at Node A. Check neighbors and update their distances!");
        setCompleted(false);
    };

    const handleNodeClick = (nodeId) => {
        // Allow move if distance is known (not INF)
        if (userDistances[nodeId] !== undefined && userDistances[nodeId] !== INF) {
            setPlayerNode(nodeId);

            // Check win condition if target
            if (nodeId === TARGET_NODE) {
                checkCompletion(nodeId, userDistances[nodeId]);
            } else {
                setMessage(`Moved to Node ${String.fromCharCode(65 + nodeId)}. Scanning neighbors...`);
            }
        } else {
            setMessage("Cannot warp there yet! Distance unknown.");
        }
    };

    const handleDistanceChange = (nodeId, value) => {
        const val = parseInt(value, 10);
        if (isNaN(val)) return;

        // Find edge from Player -> NodeId
        const edge = graph.edges.find(e => e.u === playerNode && e.v === nodeId);

        const currentDist = userDistances[playerNode];
        // Expected distance via current node
        const expectedViaCurrent = (edge) ? currentDist + edge.w : null;

        if (expectedViaCurrent !== null && val === expectedViaCurrent) {
            // Valid update via current node
            setUserDistances(prev => {
                const oldVal = prev[nodeId] || INF;
                if (val < oldVal) {
                    setMessage(`Updated Node ${String.fromCharCode(65 + nodeId)} distance to ${val}.`);
                    return { ...prev, [nodeId]: val };
                } else if (val === oldVal) {
                    return { ...prev, [nodeId]: val }; // No change
                } else {
                    setMessage(`New distance ${val} is worse than existing ${oldVal}. Keeping best.`);
                    return prev;
                }
            });

            // Check if this was the last step for target?
            if (nodeId === TARGET_NODE && val === trueDistances[TARGET_NODE]) {
                setMessage("Target reachable! Move there to complete.");
            }
        } else {
            // Invalid math based on current position
            if (expectedViaCurrent !== null) {
                setMessage(`Incorrect! Dist(${String.fromCharCode(65 + playerNode)}) + ${edge.w} should be ${expectedViaCurrent}.`);
            } else {
                setMessage(`Node ${String.fromCharCode(65 + nodeId)} is not a direct neighbor of ${String.fromCharCode(65 + playerNode)}.`);
            }
        }
    };

    const checkCompletion = (nodeId, dist) => {
        if (dist === trueDistances[TARGET_NODE]) {
            setCompleted(true);
            setMessage("OPTIMAL PATH ESTABLISHED. WARP GATES SYNCED.");
        } else {
            setMessage(`Reached Target, but distance ${dist} is not optimal (Expected: ${trueDistances[TARGET_NODE]}). Keep searching!`);
        }
    };

    return (
        <section id="challenge-9" className="active">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <div className="title-group">
                    <h2 className="challenge-title">Warp-Gate Synchronization</h2>
                    <p className="challenge-subtitle">Manual Shortest Path Calculation</p>
                </div>
            </div>

            <div className="game-container">
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

                                    {/* Distance Badge / Input Trigger */}
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

                    {/* Floating Inputs for Neighbors */}
                    {graph.nodes.map(node => {
                        // Check if this node is a neighbor of current player node
                        const edge = graph.edges.find(e => e.u === playerNode && e.v === node.id);
                        if (!edge) return null; // Only show inputs for direct neighbors

                        const currentVal = userDistances[node.id] !== undefined ? userDistances[node.id] : '';

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
                                    onChange={(e) => handleDistanceChange(node.id, e.target.value)}
                                // Don't bind value strictly to avoid fighting checks, or bind to temp state?
                                // Let's bind to empty if undefined
                                />
                                <div className="input-hint">+{edge.w}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="controls-panel">
                    <button className="control-btn secondary" onClick={resetGame}>RESET SYSTEM</button>
                    {completed && (
                        <button className="control-btn success" onClick={onComplete}>
                            SYSTEM RESTORED (NEXT LEVEL)
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Challenge9;
