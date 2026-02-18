// Round 1 Exam Logic
// Programming Proficiency Assessment

// Load questions from separate file
const questions = EXAM_QUESTIONS || [];
const config = ROUND1_CONFIG || {
    examDuration: 25,
    totalQuestions: 30,
    passingPercentage: 50
};

// Exam State
let currentQuestionIndex = 0;
let answers = new Array(questions.length).fill(null);
let examStartTime = null;
let examTimerInterval = null;
let candidateInfo = {
    name: '',
    id: ''
};

// Start Exam
function startExam() {
    const name = document.getElementById('candidateName').value.trim();
    const id = document.getElementById('candidateId').value.trim();

    if (!name || !id) {
        alert('Please enter your name and roll number');
        return;
    }

    candidateInfo.name = name;
    candidateInfo.id = id;

    // Hide welcome screen
    document.getElementById('welcomeScreen').classList.add('hidden');

    // Show exam screen
    document.getElementById('examScreen').classList.remove('hidden');

    // Set candidate details
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayId').textContent = id;

    // Initialize exam
    examStartTime = Date.now();
    startTimer();
    renderQuestion();
    renderPalette();
    updateNavigationButtons();

    // Enter fullscreen
    enterFullscreen().then(() => {
        console.log('Fullscreen activated successfully');
    }).catch((error) => {
        console.warn('Fullscreen failed:', error);
        alert('⚠️ Please press F11 to enter fullscreen mode manually, or allow fullscreen when prompted.');
    });

    console.log('Round 1 Exam started for:', name, id);
}

// Timer
function startTimer() {
    let timeLeft = config.examDuration * 60; // Convert to seconds

    updateTimerDisplay(timeLeft);

    examTimerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            autoSubmitExam();
        }
    }, 1000);

    window.examTimerInterval = examTimerInterval;
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('examTimer').textContent = display;

    // Change color when time is running out
    const timerElement = document.querySelector('.timer-display');
    if (seconds <= 60) {
        timerElement.style.color = '#ff5252';
        timerElement.style.fontWeight = 'bold';
    } else if (seconds <= 300) {
        timerElement.style.color = '#f59e0b';
    } else {
        timerElement.style.color = '#00ff88';
    }
}

// Render Question
function renderQuestion() {
    const question = questions[currentQuestionIndex];

    document.getElementById('questionText').textContent = question.question;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (answers[currentQuestionIndex] === index) {
            optionDiv.classList.add('selected');
        }

        optionDiv.innerHTML = `
            <div class="option-label">${String.fromCharCode(65 + index)}</div>
            <div class="option-text">${option}</div>
        `;

        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });

    // Update question counter
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('totalQuestionsNav').textContent = questions.length;
}

// Select Option
function selectOption(optionIndex) {
    answers[currentQuestionIndex] = optionIndex;
    renderQuestion();
    renderPalette();
    updateAnsweredCount();
}

// Clear Answer
function clearAnswer() {
    answers[currentQuestionIndex] = null;
    renderQuestion();
    renderPalette();
    updateAnsweredCount();
}

// Update Answered Count
function updateAnsweredCount() {
    const answeredCount = answers.filter(a => a !== null).length;
    document.getElementById('answeredCount').textContent = answeredCount;
}

// Navigation
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        renderPalette();
        updateNavigationButtons();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        renderPalette();
        updateNavigationButtons();
    }
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    renderQuestion();
    renderPalette();
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.disabled = currentQuestionIndex === 0;
    prevBtn.style.opacity = currentQuestionIndex === 0 ? '0.5' : '1';

    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

// Question Palette
function renderPalette() {
    const palette = document.getElementById('palette');
    palette.innerHTML = '';

    questions.forEach((q, index) => {
        const paletteItem = document.createElement('div');
        paletteItem.className = 'palette-item';
        paletteItem.textContent = index + 1;

        if (answers[index] !== null) {
            paletteItem.classList.add('answered');
        }

        if (index === currentQuestionIndex) {
            paletteItem.classList.add('current');
        }

        paletteItem.addEventListener('click', () => goToQuestion(index));
        palette.appendChild(paletteItem);
    });
}

// Submit Exam
function submitExam() {
    const unanswered = answers.filter(a => a === null).length;

    if (unanswered > 0) {
        const confirmSubmit = confirm(
            `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
        );
        if (!confirmSubmit) return;
    }

    finishExam();
}

function autoSubmitExam() {
    alert('Time is up! Your exam will be submitted automatically.');
    finishExam();
}

function finishExam() {
    // Stop timer
    if (examTimerInterval) {
        clearInterval(examTimerInterval);
    }

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
            correctAnswers++;
        }
    });

    const percentage = (correctAnswers / questions.length) * 100;
    const timeTaken = Math.floor((Date.now() - examStartTime) / 1000);
    const passed = percentage >= config.passingPercentage;

    // Hide exam screen
    document.getElementById('examScreen').classList.add('hidden');

    // Exit fullscreen
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
    }

    // Save to Firebase
    saveResultsToFirebase({
        name: candidateInfo.name,
        rollNo: candidateInfo.id,
        score: correctAnswers,
        totalQuestions: questions.length,
        percentage: parseFloat(percentage.toFixed(2)),
        timeTaken: timeTaken,
        answers: answers,
        passed: passed,
        completedAt: window.firebaseTimestamp ? window.firebaseTimestamp() : new Date(),
        examDate: new Date().toISOString().split('T')[0]
    }).then(() => {
        console.log('✅ Results saved to Firebase successfully');
    }).catch((error) => {
        console.error('❌ Error saving to Firebase:', error);
        // Continue showing results even if Firebase fails
    });

    // Show results
    showResults(correctAnswers, percentage);

    // Log results (keep for debugging)
    console.log('Round 1 Exam completed:', {
        name: candidateInfo.name,
        id: candidateInfo.id,
        score: correctAnswers,
        total: questions.length,
        percentage: percentage.toFixed(2),
        timeTaken: timeTaken,
        answers: answers,
        timestamp: new Date().toISOString()
    });
}

// Save results to Firebase
async function saveResultsToFirebase(data) {
    if (!window.firebaseDB) {
        throw new Error('Firebase not initialized');
    }
    return await window.firebaseDB.collection('round1').add(data);
}

function showResults(score, percentage) {
    const resultsScreen = document.getElementById('resultsScreen');
    const passed = percentage >= config.passingPercentage;

    document.getElementById('resultName').textContent = candidateInfo.name;
    document.getElementById('resultId').textContent = candidateInfo.id;
    document.getElementById('resultScore').textContent = `${score} / ${questions.length}`;
    document.getElementById('resultPercentage').textContent = percentage.toFixed(2);

    // Update emoji and title based on pass/fail
    if (passed) {
        document.getElementById('resultEmoji').textContent = '🎉';
        document.getElementById('resultTitle').textContent = 'Congratulations!';
        document.getElementById('resultStatus').textContent = 'PASSED';
        document.getElementById('resultStatus').style.color = '#00ff88';
    } else {
        document.getElementById('resultEmoji').textContent = '📝';
        document.getElementById('resultTitle').textContent = 'Exam Completed';
        document.getElementById('resultStatus').textContent = 'FAILED';
        document.getElementById('resultStatus').style.color = '#ef4444';
    }

    resultsScreen.classList.remove('hidden');
    resultsScreen.classList.add('active');
}

// Fullscreen helpers
function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        return elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        return elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        return elem.msRequestFullscreen();
    }
    return Promise.reject('Fullscreen not supported');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Initialize
console.log('Round 1 Exam system initialized');
console.log(`Total questions: ${questions.length}`);
console.log(`Duration: ${config.examDuration} minutes`);
console.log(`Passing percentage: ${config.passingPercentage}%`);
