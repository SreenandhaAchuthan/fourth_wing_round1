// Round 1 Exam Questions - Programming Proficiency Assessment
// Total Questions: 30 | Duration: 25 minutes | Total Marks: 30

const EXAM_QUESTIONS = [
    // Section A: Core Programming Fundamentals (Q1-Q15)
    {
        id: 1,
        question: "What is the output of the following Python code?\nprint(2 ** 3 ** 2)",
        options: ["64", "512", "4096", "Error"],
        correctAnswer: 1  // Index 1 = "512"
    },
    {
        id: 2,
        question: "What will be printed by this code?\nprint(bool(\"False\"))",
        options: ["False", "True", "0", "Error"],
        correctAnswer: 1  // "True"
    },
    {
        id: 3,
        question: "What is the value of the slice expression?\ns = \"Python\"\nprint(s[1:4])",
        options: ["Pyth", "yth", "ytho", "Pyt"],
        correctAnswer: 1  // "yth"
    },
    {
        id: 4,
        question: "What is the output of the following expression?\nprint(10 // 3)",
        options: ["3.33", "3", "4", "1"],
        correctAnswer: 1  // "3"
    },
    {
        id: 5,
        question: "Which keyword is used to define a function in Python?",
        options: ["func", "define", "def", "function"],
        correctAnswer: 2  // "def"
    },
    {
        id: 6,
        question: "What is the value of x after execution?\nx = 5\nx &= 3",
        options: ["5", "3", "1", "0"],
        correctAnswer: 2  // "1"
    },
    {
        id: 7,
        question: "Which data type is used to store text in Java?",
        options: ["myString", "string", "String", "Text"],
        correctAnswer: 2  // "String"
    },
    {
        id: 8,
        question: "Which is the correct syntax for the main method in Java?",
        options: [
            "public static void main(String[] args)",
            "public void main(String args[])",
            "static main(String[] args)",
            "void main()"
        ],
        correctAnswer: 0  // "public static void main(String[] args)"
    },
    {
        id: 9,
        question: "Which keyword is used for inheritance in Java?",
        options: ["implements", "extends", "inherits", "super"],
        correctAnswer: 1  // "extends"
    },
    {
        id: 10,
        question: "What is the output of the following Java statement?\nMath.ceil(3.1)",
        options: ["3.0", "4.0", "3", "4"],
        correctAnswer: 1  // "4.0"
    },
    {
        id: 11,
        question: "Which keyword is used to call a parent class constructor in Java?",
        options: ["parent", "this", "super", "new"],
        correctAnswer: 2  // "super"
    },
    {
        id: 12,
        question: "Which access modifier restricts access to within the same class only?",
        options: ["public", "protected", "private", "default"],
        correctAnswer: 2  // "private"
    },
    {
        id: 13,
        question: "What is the size of int in C on a standard 32-bit system?",
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on compiler"],
        correctAnswer: 1  // "4 bytes"
    },
    {
        id: 14,
        question: "Which function is used for dynamic memory allocation in C?",
        options: ["alloc()", "malloc()", "new()", "create()"],
        correctAnswer: 1  // "malloc()"
    },
    {
        id: 15,
        question: "What is the result of the following expression?\n3 + 4 * 2 / (1 - 5)",
        options: ["1", "-1", "5", "2"],
        correctAnswer: 0  // "1"
    },

    // Section B: Code Analysis & Advanced Concepts (Q16-Q30)
    {
        id: 16,
        question: "What is the time complexity of the following code?\ndef check_list(data):\n    for i in range(len(data)):\n        for j in range(len(data)):\n            if data[i] == data[j] and i != j:\n                return True\n    return False",
        options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
        correctAnswer: 1  // "O(n²)"
    },
    {
        id: 17,
        question: "What is the output?\nx = 20\ndef f():\n    x = 10\n    return x\nf()\nprint(x)",
        options: ["10", "20", "Error", "None"],
        correctAnswer: 1  // "20"
    },
    {
        id: 18,
        question: "What will be printed?\nclass ScopeTest {\n    static int z = 100;\n    public static void main(String[] args) {\n        int z = 50;\n        System.out.println(z);\n    }\n}",
        options: ["100", "0", "50", "Compilation Error"],
        correctAnswer: 2  // "50"
    },
    {
        id: 19,
        question: "What is the output?\nint a = 10, b = 20;\nint res = (a > b) ? (a - b) : (b - a);\nprintf(\"%d\", res);",
        options: ["-10", "10", "0", "30"],
        correctAnswer: 1  // "10"
    },
    {
        id: 20,
        question: "What is the result of this code?\ndef check():\n    print(\"Checked\", end=\" \")\n    return True\nresult = False and check()",
        options: ["Checked", "False", "Nothing is printed", "Error"],
        correctAnswer: 2  // "Nothing is printed"
    },
    {
        id: 21,
        question: "What is the output of the function call fun(2)?\nint fun(int n) {\n    if (n == 4) return n;\n    return n + fun(n + 1);\n}",
        options: ["6", "9", "4", "2"],
        correctAnswer: 1  // "9"
    },
    {
        id: 22,
        question: "What will be printed?\nfor i in range(1, 5):\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    print(i, end=\" \")",
        options: ["1 3 4", "1 2 3", "1 3", "1 2 3 4"],
        correctAnswer: 2  // "1 3"
    },
    {
        id: 23,
        question: "Which OOP concept is demonstrated?\nclass Animal { void sound() { } }\nclass Dog extends Animal {\n    void sound() { System.out.print(\"Bark\"); }\n}",
        options: ["Encapsulation", "Method Overriding (Polymorphism)", "Abstraction", "Interface Implementation"],
        correctAnswer: 1  // "Method Overriding (Polymorphism)"
    },
    {
        id: 24,
        question: "What happens when this code is executed?\nmy_tuple = (1, 2, 3)\nmy_tuple[1] = 4",
        options: ["(1, 4, 3)", "Error: tuple does not support item assignment", "(1, 2, 3, 4)", "None"],
        correctAnswer: 1  // "Error: tuple does not support item assignment"
    },
    {
        id: 25,
        question: "Which operator precedence is followed?\nprint(not True or True and False)",
        options: ["not → and → or", "or → and → not", "Left to right", "and → or → not"],
        correctAnswer: 0  // "not → and → or"
    },
    {
        id: 26,
        question: "Which is the correct fix?\nlst = []\nif lst == None:\n    print(\"Empty\")",
        options: ["Replace with if not lst:", "Use lst.isEmpty()", "Use (lst)", "No change needed"],
        correctAnswer: 0  // "Replace with if not lst:"
    },
    {
        id: 27,
        question: "Which code produces the output [0, 2, 4]?",
        options: [
            "[i for i in range(5) if i % 2 == 0]",
            "[i for i in range(6) if i % 2 == 0]",
            "[i for i in range(3) if i % 2 == 0]",
            "[i * 2 for i in range(3)]"
        ],
        correctAnswer: 3  // "[i * 2 for i in range(3)]"
    },
    {
        id: 28,
        question: "What is the output?\nint x = 0, y = 5;\nif (x && ++y) {\n    printf(\"True \");\n}\nprintf(\"%d\", y);",
        options: ["True 6", "5", "True 5", "6"],
        correctAnswer: 1  // "5"
    },
    {
        id: 29,
        question: "What type of memory allocation is used?\nint *ptr = (int*)malloc(sizeof(int));",
        options: ["Static", "Dynamic", "Memory leak", "Recursive"],
        correctAnswer: 1  // "Dynamic"
    },
    {
        id: 30,
        question: "What will be printed?\ncount = 0\ndef increment():\n    global count\n    count += 1\nincrement()\nprint(count)",
        options: ["0", "1", "Error", "None"],
        correctAnswer: 1  // "1"
    }
];

// Export for use in exam system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXAM_QUESTIONS;
}
