// Round 1 Exam Configuration
// Programming Proficiency Assessment

const ROUND1_CONFIG = {
    // Exam Details
    examTitle: "Programming Proficiency Assessment - Round 1",
    eventName: "Fourth Wing - Round 1",
    organizationName: "AMC FOSS",

    // Timing
    examDuration: 25,           // Duration in minutes
    warningTimeout: 5,          // Seconds before elimination when exiting fullscreen

    // Scoring
    totalQuestions: 30,
    passingPercentage: 50,
    negativeMarking: false,     // No negative marking
    negativeMarks: 0,

    // Security Settings
    allowKeyboard: false,       // Mouse navigation only
    allowCopyPaste: false,      // Disabled
    allowRightClick: false,     // Disabled
    detectTabSwitch: true,      // Eliminate on tab switch
    detectDevTools: true,       // Eliminate if dev tools opened
    requireFullscreen: true,    // Require fullscreen mode

    // Features
    showQuestionPalette: true,  // Show question navigation palette
    allowQuestionSkip: true,    // Allow skipping questions
    showTimer: true,            // Show countdown timer
    showProgress: true,         // Show progress indicator

    // UI Customization
    theme: {
        primaryColor: "#00ff88",    // FOSS accent color
        secondaryColor: "#00d4ff",
        successColor: "#2ecc71",
        warningColor: "#f59e0b",
        dangerColor: "#ef4444",
        darkBg: "#1a1a2e"
    },

    // Backend Integration
    backend: {
        enabled: false,
        apiUrl: "",
        endpoints: {
            startExam: "/exam/start",
            submitExam: "/exam/submit",
            logViolation: "/exam/violation"
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ROUND1_CONFIG;
}
