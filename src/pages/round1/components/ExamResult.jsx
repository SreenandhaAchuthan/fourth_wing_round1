import React from 'react';
import '../round1.css';

const ExamResult = ({ timeTaken, userInfo, onShowLeaderboard }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="result-container">
            <div className="result-card">
                <div className="result-header passed">
                    <div className="result-icon">
                        ✅
                    </div>
                    <h1>Exam Submitted Successfully</h1>
                    <p className="result-subtitle">
                        Your response has been recorded.
                    </p>
                </div>

                <div className="result-details">
                    <div className="detail-row">
                        <span className="detail-label">Candidate Name:</span>
                        <span className="detail-value">{userInfo.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Roll Number:</span>
                        <span className="detail-value">{userInfo.rollNo}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Time Taken:</span>
                        <span className="detail-value">{formatTime(timeTaken)}</span>
                    </div>
                </div>

                <div className="result-footer" style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                    <p>You may close this window.</p>
                </div>
            </div>
        </div>
    );
};

export default ExamResult;
