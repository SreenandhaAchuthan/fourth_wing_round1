import React, { useState, useEffect, useImperativeHandle } from 'react';

const Challenge10 = React.forwardRef(({ onComplete, onBack, onWrongAnswer }, ref) => {
    const NODE_COUNT = 19; // 1 center + 6 inner + 6 mid + 6 outer
    const CANVAS_WIDTH = 1200;
    const CANVAS_HEIGHT = 700;

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mstEdges, setMstEdges] = useState([]);
    const [feedback, setFeedback] = useState({ message: 'Select low-cost Ley-Lines to form the Alliance.', type: 'info' });
    const [completed, setCompleted] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [sealBroken, setSealBroken] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintWarning, setShowHintWarning] = useState(false);

    useImperativeHandle(ref, () => ({
        getPartialScore: () => {
            return Math.max(0, score);
        }
    }));

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const cx = CANVAS_WIDTH / 2;
        const cy = CANVAS_HEIGHT / 2;
        const innerRadius = 140;
        const midRadius = 240;
        const outerRadius = 340;

        const newNodes = [
            { id: 0, label: 'A', x: cx, y: cy, type: 'source' },
            ...Array.from({ length: 6 }, (_, i) => ({
                id: i + 1,
                label: String.fromCharCode(66 + i), // B-G
                x: cx + innerRadius * Math.cos((i * 60) * (Math.PI / 180)),
                y: cy + innerRadius * Math.sin((i * 60) * (Math.PI / 180)),
                type: 'outpost'
            })),
            ...Array.from({ length: 6 }, (_, i) => ({
                id: i + 7,
                label: String.fromCharCode(72 + i), // H-M
                x: cx + midRadius * Math.cos(((i * 60) + 30) * (Math.PI / 180)),
                y: cy + midRadius * Math.sin(((i * 60) + 30) * (Math.PI / 180)),
                type: 'outpost'
            })),
            ...Array.from({ length: 6 }, (_, i) => ({
                id: i + 13,
                label: String.fromCharCode(78 + i), // N-S
                x: cx + outerRadius * Math.cos((i * 60) * (Math.PI / 180)),
                y: cy + outerRadius * Math.sin((i * 60) * (Math.PI / 180)),
                type: 'outpost'
            }))
        ];

        let newEdges = [];
        let edgeId = 0;
        const addEdge = (u, v, minW, maxW) => {
            newEdges.push({
                id: edgeId++,
                u, v,
                w: Math.floor(Math.random() * (maxW - minW + 1)) + minW
            });
        };

        // Center to Inner
        for (let i = 1; i <= 6; i++) addEdge(0, i, 10, 25);
        // Inner Ring
        for (let i = 1; i <= 6; i++) addEdge(i, i === 6 ? 1 : i + 1, 15, 30);

        // Inner to Mid
        for (let i = 0; i < 6; i++) {
            const innerId = i + 1;
            const midId1 = i + 7;
            const midId2 = ((i + 5) % 6) + 7;
            addEdge(innerId, midId1, 20, 40);
            addEdge(innerId, midId2, 20, 40);
        }

        // Mid Ring
        for (let i = 7; i <= 12; i++) addEdge(i, i === 12 ? 7 : i + 1, 25, 45);

        // Mid to Outer
        for (let i = 0; i < 6; i++) {
            const midId = i + 7;
            const outerId1 = i + 13;
            // Connect to nearby outer nodes
            addEdge(midId, outerId1, 30, 50);
            const nextOuter = (i + 1) % 6 + 13; // Connect to next outer 
            addEdge(midId, nextOuter, 30, 50);
        }

        newEdges.sort((a, b) => a.w - b.w);

        setNodes(newNodes);
        setEdges(newEdges);
        setMstEdges([]);
        setCompleted(false);
        setHasSubmitted(false);
        setFeedback({ message: 'Select edges to form a Minimum Spanning Tree across the expanded network.', type: 'info' });
    };

    class UnionFind {
        constructor(size) {
            this.parent = Array.from({ length: size }, (_, i) => i);
        }
        find(i) {
            if (this.parent[i] == i) return i;
            return this.find(this.parent[i]);
        }
        union(i, j) {
            const rootI = this.find(i);
            const rootJ = this.find(j);
            if (rootI !== rootJ) {
                this.parent[rootI] = rootJ;
                return true;
            }
            return false;
        }
    }

    const calculateOptimalMSTWeight = () => {
        const uf = new UnionFind(nodes.length);
        let weight = 0;
        for (let edge of edges) {
            if (uf.union(edge.u, edge.v)) {
                weight += edge.w;
            }
        }
        return weight;
    };

    const handleEdgeSelect = (edge) => {
        if (hasSubmitted) return;

        if (mstEdges.includes(edge.id)) {
            setMstEdges(mstEdges.filter(id => id !== edge.id));
        } else {
            setMstEdges([...mstEdges, edge.id]);
        }
    };

    const handleSubmit = () => {
        if (hasSubmitted) return;
        setHasSubmitted(true);

        const optimalWeight = calculateOptimalMSTWeight();

        const userEdges = edges.filter(e => mstEdges.includes(e.id));
        const userWeight = userEdges.reduce((sum, e) => sum + e.w, 0);

        const uf = new UnionFind(nodes.length);
        let cycles = 0;
        let connectedEdgesCount = 0;

        for (let edge of userEdges) {
            if (!uf.union(edge.u, edge.v)) {
                cycles++;
            } else {
                connectedEdgesCount++;
            }
        }

        let components = 0;
        for (let i = 0; i < nodes.length; i++) {
            if (uf.parent[i] === i) components++;
        }

        let calculatedScore = 10;
        const penalties = [];

        if (components > 1) {
            const disconnectedPenalty = (components - 1) * 2;
            calculatedScore -= disconnectedPenalty;
            penalties.push(`Disconnected Graph (-${disconnectedPenalty})`);
        }

        if (cycles > 0) {
            const cyclePenalty = cycles * 2;
            calculatedScore -= cyclePenalty;
            penalties.push(`Has Cycles (-${cyclePenalty})`);
        }

        if (userWeight > optimalWeight) {
            const diff = userWeight - optimalWeight;
            const weightPenalty = Math.ceil(diff / 5);
            calculatedScore -= weightPenalty;
            penalties.push(`Inefficient: ${diff} extra mana (-${weightPenalty})`);
        }

        setScore(calculatedScore);

        if (calculatedScore >= 10 && components === 1 && cycles === 0) {
            setCompleted(true);
            setFeedback({ message: `Perfect! Grand Alliance Formed. Score: 10/10`, type: 'success' });
            // Manual completion required now
        } else {
            setFeedback({
                message: `Analysis Complete. Score: ${calculatedScore}/10. ${penalties.join(', ')}`,
                type: calculatedScore > 5 ? 'warning' : 'error'
            });
            if (onWrongAnswer) onWrongAnswer();
        }
    };

    const breakSeal = () => {
        setSealBroken(true);
    };

    return (
        <section id="challenge-10" className="active scroll-challenge">
            <div className="challenge-header">
                <button className="back-btn" onClick={onBack}>← Back to Menu</button>
                <h2 className="challenge-title">📜 Challenge 9: The Grand Alliance</h2>
                <p className="challenge-subtitle">"Unite the fragmented resistance with minimum cost"</p>
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
                            <h3>📜 Scroll of the Grand Alliance</h3>
                            <p className="scroll-story">
                                The final stage of the war requires a global unification of fragmented resistance pockets.
                                You must bridge these fragments using the cheapest connections available across the entire
                                realm to form one unified alliance before the Venin cut your lines.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-opened">
                        <div className="scroll-parchment">
                            <div className="game-container-kruskal">
                                <div className="map-area">
                                    <div className="status-bar-kruskal">
                                        <div className={`status-text ${feedback.type}`}>
                                            {feedback.message}
                                        </div>
                                    </div>

                                    <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kruskal-svg">
                                        {edges.map(edge => {
                                            const uNode = nodes.find(n => n.id === edge.u);
                                            const vNode = nodes.find(n => n.id === edge.v);
                                            if (!uNode || !vNode) return null;

                                            const isSelected = mstEdges.includes(edge.id);

                                            let stroke = '#475569';
                                            if (isSelected) stroke = hasSubmitted ? (completed ? '#2ecc71' : '#f59e0b') : '#3b82f6';

                                            return (
                                                <g key={edge.id}
                                                    onClick={() => handleEdgeSelect(edge)}
                                                    className={`edge-group-kruskal ${isSelected ? 'selected' : ''} ${hasSubmitted ? 'submitted' : ''}`}
                                                    style={{ pointerEvents: hasSubmitted ? 'none' : 'auto' }}
                                                >
                                                    <line
                                                        x1={uNode.x} y1={uNode.y}
                                                        x2={vNode.x} y2={vNode.y}
                                                        className="edge-line"
                                                        style={{ stroke: stroke, strokeWidth: isSelected ? 4 : 2 }}
                                                    />
                                                    <circle
                                                        cx={(uNode.x + vNode.x) / 2} cy={(uNode.y + vNode.y) / 2}
                                                        r="10"
                                                        className="weight-bg"
                                                    />
                                                    <text
                                                        x={(uNode.x + vNode.x) / 2}
                                                        y={(uNode.y + vNode.y) / 2}
                                                        dy="4"
                                                        textAnchor="middle"
                                                        className="weight-text"
                                                        fill={isSelected ? '#fff' : '#94a3b8'}
                                                    >
                                                        {edge.w}
                                                    </text>
                                                </g>
                                            );
                                        })}

                                        {nodes.map(node => (
                                            <g key={node.id} className="node-group">
                                                <circle
                                                    cx={node.x} cy={node.y}
                                                    r={node.type === 'source' ? 25 : 20}
                                                    className="node-circle"
                                                    style={{ fill: '#0f172a', stroke: '#475569' }}
                                                />
                                                <text
                                                    x={node.x} y={node.y}
                                                    dy="5"
                                                    textAnchor="middle"
                                                    className="node-label"
                                                    style={{ fontSize: '16px' }}
                                                >
                                                    {node.label}
                                                </text>
                                            </g>
                                        ))}
                                    </svg>

                                    {!hasSubmitted && (
                                        <button className="submit-btn-kruskal scroll-btn" onClick={handleSubmit} style={{
                                            marginTop: '20px',
                                            padding: '12px 24px',
                                            fontSize: '1.1em'
                                        }}>
                                            Stabilize Alliance (Submit)
                                        </button>
                                    )}
                                    {hasSubmitted && !completed && (
                                        <div className="score-display" style={{ marginTop: '20px', fontSize: '1.5em', fontWeight: 'bold', color: '#f59e0b' }}>
                                            Score: {score}
                                        </div>
                                    )}
                                    {completed && (
                                        <button className="submit-btn-kruskal scroll-btn" onClick={onComplete} style={{
                                            marginTop: '20px',
                                            padding: '15px 30px',
                                            fontSize: '1.2em',
                                            background: '#2ecc71',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            boxShadow: '0 0 15px rgba(46, 204, 113, 0.5)'
                                        }}>
                                            🏆 Finish Round 2 & Save Score
                                        </button>
                                    )}
                                </div>

                                <div className="edge-sidebar">
                                    <h3>Available Paths</h3>
                                    <div className="edge-list">
                                        {edges.map(edge => {
                                            const isSelected = mstEdges.includes(edge.id);
                                            const uLabel = nodes.find(n => n.id === edge.u)?.label || '?';
                                            const vLabel = nodes.find(n => n.id === edge.v)?.label || '?';

                                            return (
                                                <div
                                                    key={edge.id}
                                                    className={`sidebar-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => handleEdgeSelect(edge)}
                                                    style={{
                                                        opacity: hasSubmitted && !isSelected ? 0.5 : 1,
                                                        cursor: hasSubmitted ? 'default' : 'pointer'
                                                    }}
                                                >
                                                    <span className="edge-id">{uLabel}-{vLabel}</span>
                                                    <span className="edge-cost">Cost: {edge.w}</span>
                                                    {isSelected && <span className="status-icon">🔹</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {!hintUsed ? (
                                <button className="hint-btn scroll-btn" onClick={() => setShowHintWarning(true)}>
                                    💡 Show Hint
                                </button>
                            ) : (
                                <div className="hint-box">
                                    <strong>💡 Strategy:</strong> Click edges to select them for your spanning tree. Use
                                    Kruskal's algorithm: sort edges by weight (already done in sidebar), then select the
                                    cheapest edges that don't create cycles. You need exactly {NODE_COUNT - 1} edges to
                                    connect {NODE_COUNT} nodes without cycles.
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
});

export default Challenge10;
