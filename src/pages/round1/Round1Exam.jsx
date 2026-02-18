import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './round1.css';
import { questionData, examConfig } from './questionData';
import ExamResult from './components/ExamResult';
// import Leaderboard from './components/Leaderboard'; // Keeping for reference if needed later

// Update config locally if not modifying the imported file directly
// In a real app, modify questionData.js. Here we override.
const EXAM_DURATION = 1800; // 30 minutes

const Round1Exam = () => {
    const [examState, setExamState] = useState('entry'); // entry, exam, result
    const [userInfo, setUserInfo] = useState({ name: '', rollNo: '' });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
    const [examDocId, setExamDocId] = useState(null);

    // Fullscreen & Warning State
    const [isFullscreen, setIsFullscreen] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const [warningTime, setWarningTime] = useState(5);
    const warningTimerRef = useRef(null);

    const timerRef = useRef(null);

    // Timer countdown
    useEffect(() => {
        if (examState === 'exam' && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [examState, timeRemaining]);

    // Fullscreen Change Listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && examState === 'exam') {
                setIsFullscreen(false);
                setShowWarning(true);
                setWarningTime(5);
            } else {
                setIsFullscreen(true);
                setShowWarning(false);
                if (warningTimerRef.current) clearInterval(warningTimerRef.current);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [examState]);

    // Warning Timer
    useEffect(() => {
        if (showWarning && examState === 'exam') {
            warningTimerRef.current = setInterval(() => {
                setWarningTime(prev => {
                    if (prev <= 1) {
                        clearInterval(warningTimerRef.current);
                        alert("You failed to return to fullscreen. Exam Submitted.");
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (warningTimerRef.current) clearInterval(warningTimerRef.current);
        }

        return () => {
            if (warningTimerRef.current) clearInterval(warningTimerRef.current);
        };
    }, [showWarning, examState]);

    // Particles.js initialization
    useEffect(() => {
        const loadParticles = async () => {
            try {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
                script.async = true;
                script.onload = () => {
                    if (window.particlesJS) {
                        let particlesContainer = document.getElementById("particles-js-exam");
                        if (!particlesContainer) {
                            particlesContainer = document.createElement('div');
                            particlesContainer.id = "particles-js-exam";
                            particlesContainer.className = "particles-full-background";
                            const examContainer = document.querySelector('.exam-container');
                            if (examContainer) {
                                examContainer.insertBefore(particlesContainer, examContainer.firstChild);
                            }
                        }

                        window.particlesJS("particles-js-exam", {
                            particles: {
                                number: { value: 40 },
                                color: { value: "#00ff88" },
                                shape: { type: "circle" },
                                opacity: { value: 0.5, random: false },
                                size: { value: 3, random: true },
                                line_linked: { enable: true, distance: 150, color: "#00ff88", opacity: 0.4, width: 1 },
                                move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
                            }
                        });
                    }
                };
                document.body.appendChild(script);
            } catch (error) {
                console.warn("Failed to load particles.js:", error);
            }
        };

        loadParticles();
    }, []);

    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    };

    // Start exam
    const handleStartExam = async () => {
        if (!userInfo.name || !userInfo.rollNo) {
            alert('Please enter your name and roll number');
            return;
        }

        enterFullscreen();
        setExamState('exam');

        try {
            const docRef = await addDoc(collection(db, 'round1'), {
                name: userInfo.name,
                rollNo: userInfo.rollNo,
                startedAt: serverTimestamp(),
                status: 'in-progress'
            });
            setExamDocId(docRef.id);
            console.log('✅ Exam started, Document ID:', docRef.id);
        } catch (error) {
            console.error("❌ Error starting exam:", error);
            alert('Error connecting to database. Your answers will still be recorded locally. Error: ' + error.message);
        }
    };

    // Handle answer selection
    const handleSelectAnswer = (questionId, answer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Calculate score
    const calculateScore = () => {
        let correct = 0;
        questionData.forEach(q => {
            if (selectedAnswers[q.id] === q.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    // Submit exam
    const handleSubmit = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (warningTimerRef.current) clearInterval(warningTimerRef.current);
        if (document.fullscreenElement) document.exitFullscreen().catch(err => console.log(err));

        const score = calculateScore();
        const timeTaken = EXAM_DURATION - timeRemaining;

        if (examDocId) {
            try {
                const docRef = doc(db, 'round1', examDocId);
                await updateDoc(docRef, {
                    answers: selectedAnswers,
                    score: score,
                    totalQuestions: examConfig.totalQuestions,
                    percentage: ((score / examConfig.totalQuestions) * 100).toFixed(2),
                    timeTaken: timeTaken,
                    passed: score >= (examConfig.totalQuestions * 0.5),
                    completedAt: serverTimestamp(),
                    status: 'completed'
                });
                // Also save to dedicated leaderboard sub-collection
                // path: round1 (collection) -> leaderboard (doc) -> entries (sub-collection) -> {examDocId} (doc)
                const leaderboardRef = doc(db, 'round1', 'leaderboard', 'entries', examDocId);
                await setDoc(leaderboardRef, {
                    name: userInfo.name,
                    rollNo: userInfo.rollNo,
                    score: score,
                    timeTaken: timeTaken,
                    status: 'completed',
                    completedAt: serverTimestamp()
                });

                console.log('✅ Exam results saved to Firebase successfully!');
            } catch (error) {
                console.error("❌ Error submitting exam:", error);
                alert('Error saving results to database: ' + error.message);
            }
        } else {
            console.warn('⚠️ No exam document ID found. Results not saved to Firebase.');
        }

        setExamState('result');
    };

    const handleAutoSubmit = () => {
        handleSubmit();
    };

    const confirmSubmit = () => {
        const answered = Object.keys(selectedAnswers).length;
        const unanswered = examConfig.totalQuestions - answered;

        let message = "Are you sure you want to submit?";
        if (unanswered > 0) {
            message = `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`;
        }

        const confirm = window.confirm(message);
        if (!confirm) return;

        handleSubmit();
    };

    // Navigation
    const handleNext = () => {
        if (currentQuestionIndex < questionData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleQuestionJump = (index) => {
        setCurrentQuestionIndex(index);
    };

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer color class
    const getTimerClass = () => {
        if (timeRemaining <= 60) return 'timer-critical';
        if (timeRemaining <= 300) return 'timer-warning';
        return 'timer-normal';
    };

    const currentQuestion = questionData[currentQuestionIndex];
    const isAnswered = selectedAnswers[currentQuestion?.id] !== undefined;

    // Entry Screen
    if (examState === 'entry') {
        return (
            <div className="exam-container">
                <div className="entry-screen">
                    {/* ... (Existing Entry Screen code) ... */}
                    <div className="entry-card">
                        <h1>Programming Proficiency Assessment</h1>
                        <div className="exam-info">
                            <p><strong>Duration:</strong> 30 Minutes</p>
                            <p><strong>Total Questions:</strong> 30</p>
                            <p><strong>Total Marks:</strong> 30</p>
                            <p><strong>Negative Marking:</strong> No</p>
                        </div>
                        <div className="instructions">
                            <h3>Instructions:</h3>
                            <ol>
                                <li>Each question has only one correct answer.</li>
                                <li>Read the code snippet carefully before answering.</li>
                                <li>Questions test Python, Java, and C fundamentals.</li>
                                <li>No external help is allowed.</li>
                                <li><strong>Fullscreen Mode is Enforced.</strong> Do not switch tabs or exit fullscreen.</li>
                                <li>If you exit fullscreen, you will have <strong>5 seconds</strong> to return, otherwise the exam will initiate auto-submit.</li>
                            </ol>
                        </div>
                        <div className="user-form">
                            <input
                                type="text"
                                placeholder="Enter Your Name"
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                className="user-input"
                            />
                            <input
                                type="text"
                                placeholder="Enter Your Roll Number"
                                value={userInfo.rollNo}
                                onChange={(e) => setUserInfo({ ...userInfo, rollNo: e.target.value })}
                                className="user-input"
                            />
                            <button onClick={handleStartExam} className="start-btn">
                                Start Exam (Fullscreen)
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Result Screen
    if (examState === 'result') {
        return (
            <ExamResult
                score={calculateScore()}
                totalQuestions={examConfig.totalQuestions}
                timeTaken={EXAM_DURATION - timeRemaining}
                userInfo={userInfo}
                selectedAnswers={selectedAnswers}
                questionData={questionData}
            />
        );
    }

    // Exam Screen
    return (
        <div className="exam-container">
            {/* Warning Overlay */}
            {showWarning && (
                <div className="fullscreen-warning-overlay">
                    <div className="warning-box">
                        <h2>⚠️ WARNING ⚠️</h2>
                        <p>You have left fullscreen mode!</p>
                        <p className="warning-count">Returning in {warningTime}s</p>
                        <p>If the timer hits 0, your exam will be automatically submitted.</p>
                        <button className="start-btn" onClick={enterFullscreen}>
                            Return to Fullscreen
                        </button>
                    </div>
                </div>
            )}

            <div className="exam-header">
                <div className="exam-title">
                    <h2>Programming Proficiency Assessment</h2>
                    <p className="candidate-info">{userInfo.name} ({userInfo.rollNo})</p>
                </div>
                <div className={`timer ${getTimerClass()}`}>
                    <span className="timer-icon">⏱️</span>
                    <span className="timer-value">{formatTime(timeRemaining)}</span>
                </div>
            </div>

            <div className="exam-body">
                <div className="question-panel">
                    <div className="question-header">
                        <span className="question-number">Question {currentQuestionIndex + 1} of {examConfig.totalQuestions}</span>
                        <span className={`question-status ${isAnswered ? 'answered' : 'unanswered'}`}>
                            {isAnswered ? '✓ Answered' : '○ Not Answered'}
                        </span>
                    </div>

                    {currentQuestion && (
                        <div className="question-content">
                            <div className="question-section-tag">{currentQuestion.section}</div>
                            <pre className="question-text">{currentQuestion.question}</pre>

                            <div className="options-container">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.label}
                                        className={`option-btn ${selectedAnswers[currentQuestion.id] === option.label ? 'selected' : ''
                                            }`}
                                        onClick={() => handleSelectAnswer(currentQuestion.id, option.label)}
                                    >
                                        <span className="option-label">{option.label}</span>
                                        <span className="option-text">{option.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="navigation-controls">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="nav-btn prev-btn"
                        >
                            ← Previous
                        </button>

                        <button onClick={() => handleSelectAnswer(currentQuestion.id, null)} className="clear-btn">
                            Clear Answer
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={currentQuestionIndex === questionData.length - 1}
                            className="nav-btn next-btn"
                        >
                            Next →
                        </button>
                    </div>
                </div>

                <div className="sidebar-panel">
                    <div className="sidebar-header">
                        <h3>Question Navigator</h3>
                        <p className="answered-count">
                            {Object.keys(selectedAnswers).length} / {examConfig.totalQuestions} Answered
                        </p>
                    </div>

                    <div className="question-grid">
                        {questionData.map((q, index) => (
                            <button
                                key={q.id}
                                className={`grid-item ${currentQuestionIndex === index ? 'current' : ''
                                    } ${selectedAnswers[q.id] ? 'answered' : 'unanswered'}`}
                                onClick={() => handleQuestionJump(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="legend">
                        <div className="legend-item">
                            <span className="legend-box current"></span>
                            <span>Current</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-box answered"></span>
                            <span>Answered</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-box unanswered"></span>
                            <span>Not Answered</span>
                        </div>
                    </div>

                    <button onClick={confirmSubmit} className="submit-exam-btn">
                        Submit Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Round1Exam;
