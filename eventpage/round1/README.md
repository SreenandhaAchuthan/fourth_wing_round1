# Round 1 - Programming Proficiency Assessment

This is the standalone proctored exam system for Round 1 of Fourth Wing.

## 📁 Files Structure

```
round1/
├── index.html       - Main exam page with FOSS theme
├── exam.js          - Exam logic and timer
├── questions.js     - 30 MCQ questions
├── config.js        - Exam configuration
└── styles.css       - FOSS dark theme styling
```

## 🎯 Exam Details

- **Duration**: 25 minutes
- **Questions**: 30 MCQs
- **Total Marks**: 30
- **Passing**: 50%
- **Negative Marking**: No

## 🚀 How to Use

1. Open `index.html` in a web browser
2. Enter candidate name and roll number
3. Click "Start Exam"
4. Answer all questions
5. Submit when complete or time expires

## 🎨 Features

- **FOSS Theme**: Dark background with particles.js animation
- **Proctoring**: Fullscreen mode required, tab switching disabled
- **Timer**: 25-minute countdown with color-coded warnings
- **Question Navigator**: Grid view of all questions
- **Auto-save**: Answers saved in browser memory
- **Results**: Immediate score and percentage display

## 🔒 Security Features

- Mouse navigation only (keyboard disabled)
- Copy/Paste disabled
- Right-click disabled
- Fullscreen enforcement
- Tab switch detection
- Dev tools detection

## 📝 Question Topics

**Section A: Core Programming Fundamentals (Q1-Q15)**
- Python basics
- Java fundamentals
- C programming

**Section B: Code Analysis & Advanced Concepts (Q16-Q30)**
- Time complexity
- Scope and variable handling
- Recursion
- OOP concepts
- Memory management

## 🎨 FOSS Theme

The exam interface uses the AMC FOSS color scheme:
- Primary: `#00ff88` (accent green)
- Secondary: `#00d4ff` (cyan)
- Background: `#1a1a2e` (dark blue)
- Glassmorphism effects with backdrop blur

## 🔧 Configuration

Edit `config.js` to customize:
- Exam duration
- Passing percentage
- Security settings
- UI theme colors

## 📦 Dependencies

- particles.js (CDN) - For animated background
- No build process required - Pure HTML/CSS/JS

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Fullscreen API support required

---

**Created for**: Fourth Wing - Round 1  
**Organization**: AMC FOSS
