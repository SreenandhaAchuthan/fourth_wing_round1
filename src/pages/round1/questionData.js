export const questionData = [
    // Section A: Core Programming Fundamentals (Q1-Q15)
    {
        id: 1,
        section: "Programming Fundamentals",
        question: "What is the output of the following Python code?\nprint(2 ** 3 ** 2)",
        options: [
            { label: "A", text: "64" },
            { label: "B", text: "512" },
            { label: "C", text: "4096" },
            { label: "D", text: "Error" }
        ],
        correctAnswer: "B"
    },
    {
        id: 2,
        section: "Programming Fundamentals",
        question: "What will be printed by this code?\nprint(bool(\"False\"))",
        options: [
            { label: "A", text: "False" },
            { label: "B", text: "True" },
            { label: "C", text: "0" },
            { label: "D", text: "Error" }
        ],
        correctAnswer: "B"
    },
    {
        id: 3,
        section: "Programming Fundamentals",
        question: "What is the value of the slice expression?\ns = \"Python\"\nprint(s[1:4])",
        options: [
            { label: "A", text: "Pyth" },
            { label: "B", text: "yth" },
            { label: "C", text: "ytho" },
            { label: "D", text: "Pyt" }
        ],
        correctAnswer: "B"
    },
    {
        id: 4,
        section: "Programming Fundamentals",
        question: "What is the output of the following expression?\nprint(10 // 3)",
        options: [
            { label: "A", text: "3.33" },
            { label: "B", text: "3" },
            { label: "C", text: "4" },
            { label: "D", text: "1" }
        ],
        correctAnswer: "B"
    },
    {
        id: 5,
        section: "Programming Fundamentals",
        question: "Which keyword is used to define a function in Python?",
        options: [
            { label: "A", text: "func" },
            { label: "B", text: "define" },
            { label: "C", text: "def" },
            { label: "D", text: "function" }
        ],
        correctAnswer: "C"
    },
    {
        id: 6,
        section: "Programming Fundamentals",
        question: "What is the value of x after execution?\nx = 5\nx &= 3",
        options: [
            { label: "A", text: "5" },
            { label: "B", text: "3" },
            { label: "C", text: "1" },
            { label: "D", text: "0" }
        ],
        correctAnswer: "C"
    },
    {
        id: 7,
        section: "Programming Fundamentals",
        question: "Which data type is used to store text in Java?",
        options: [
            { label: "A", text: "myString" },
            { label: "B", text: "string" },
            { label: "C", text: "String" },
            { label: "D", text: "Text" }
        ],
        correctAnswer: "C"
    },
    {
        id: 8,
        section: "Programming Fundamentals",
        question: "Which is the correct syntax for the main method in Java?",
        options: [
            { label: "A", text: "public static void main(String[] args)" },
            { label: "B", text: "public void main(String args[])" },
            { label: "C", text: "static main(String[] args)" },
            { label: "D", text: "void main()" }
        ],
        correctAnswer: "A"
    },
    {
        id: 9,
        section: "Programming Fundamentals",
        question: "Which keyword is used for inheritance in Java?",
        options: [
            { label: "A", text: "implements" },
            { label: "B", text: "extends" },
            { label: "C", text: "inherits" },
            { label: "D", text: "super" }
        ],
        correctAnswer: "B"
    },
    {
        id: 10,
        section: "Programming Fundamentals",
        question: "What is the output of the following Java statement?\nMath.ceil(3.1)",
        options: [
            { label: "A", text: "3.0" },
            { label: "B", text: "4.0" },
            { label: "C", text: "3" },
            { label: "D", text: "4" }
        ],
        correctAnswer: "B"
    },
    {
        id: 11,
        section: "Programming Fundamentals",
        question: "Which keyword is used to call a parent class constructor in Java?",
        options: [
            { label: "A", text: "parent" },
            { label: "B", text: "this" },
            { label: "C", text: "super" },
            { label: "D", text: "new" }
        ],
        correctAnswer: "C"
    },
    {
        id: 12,
        section: "Programming Fundamentals",
        question: "Which access modifier restricts access to within the same class only?",
        options: [
            { label: "A", text: "public" },
            { label: "B", text: "protected" },
            { label: "C", text: "private" },
            { label: "D", text: "default" }
        ],
        correctAnswer: "C"
    },
    {
        id: 13,
        section: "Programming Fundamentals",
        question: "What is the size of int in C on a standard 32-bit system?",
        options: [
            { label: "A", text: "2 bytes" },
            { label: "B", text: "4 bytes" },
            { label: "C", text: "8 bytes" },
            { label: "D", text: "Depends on compiler" }
        ],
        correctAnswer: "B"
    },
    {
        id: 14,
        section: "Programming Fundamentals",
        question: "Which function is used for dynamic memory allocation in C?",
        options: [
            { label: "A", text: "alloc()" },
            { label: "B", text: "malloc()" },
            { label: "C", text: "new()" },
            { label: "D", text: "create()" }
        ],
        correctAnswer: "B"
    },
    {
        id: 15,
        section: "Programming Fundamentals",
        question: "What is the result of the following expression?\n3 + 4 * 2 / (1 - 5)",
        options: [
            { label: "A", text: "1" },
            { label: "B", text: "-1" },
            { label: "C", text: "5" },
            { label: "D", text: "2" }
        ],
        correctAnswer: "A"
    },

    // Section B: Code Analysis & Advanced Concepts (Q16-Q30)
    {
        id: 16,
        section: "Code Analysis & Concepts",
        question: "What is the time complexity of the following code?\ndef check_list(data):\n    for i in range(len(data)):\n        for j in range(len(data)):\n            if data[i] == data[j] and i != j:\n                return True\n    return False",
        options: [
            { label: "A", text: "O(n)" },
            { label: "B", text: "O(n²)" },
            { label: "C", text: "O(log n)" },
            { label: "D", text: "O(n log n)" }
        ],
        correctAnswer: "B"
    },
    {
        id: 17,
        section: "Code Analysis & Concepts",
        question: "What is the output?\nx = 20\ndef f():\n    x = 10\n    return x\nf()\nprint(x)",
        options: [
            { label: "A", text: "10" },
            { label: "B", text: "20" },
            { label: "C", text: "Error" },
            { label: "D", text: "None" }
        ],
        correctAnswer: "B"
    },
    {
        id: 18,
        section: "Code Analysis & Concepts",
        question: "What will be printed?\nclass ScopeTest {\n    static int z = 100;\n    public static void main(String[] args) {\n        int z = 50;\n        System.out.println(z);\n    }\n}",
        options: [
            { label: "A", text: "100" },
            { label: "B", text: "0" },
            { label: "C", text: "50" },
            { label: "D", text: "Compilation Error" }
        ],
        correctAnswer: "C"
    },
    {
        id: 19,
        section: "Code Analysis & Concepts",
        question: "What is the output?\nint a = 10, b = 20;\nint res = (a > b) ? (a - b) : (b - a);\nprintf(\"%d\", res);",
        options: [
            { label: "A", text: "-10" },
            { label: "B", text: "10" },
            { label: "C", text: "0" },
            { label: "D", text: "30" }
        ],
        correctAnswer: "B"
    },
    {
        id: 20,
        section: "Code Analysis & Concepts",
        question: "What is the result of this code?\ndef check():\n    print(\"Checked\", end=\" \")\n    return True\nresult = False and check()",
        options: [
            { label: "A", text: "Checked" },
            { label: "B", text: "False" },
            { label: "C", text: "Nothing is printed" },
            { label: "D", text: "Error" }
        ],
        correctAnswer: "C"
    },
    {
        id: 21,
        section: "Code Analysis & Concepts",
        question: "What is the output of the function call fun(2)?\nint fun(int n) {\n    if (n == 4) return n;\n    return n + fun(n + 1);\n}",
        options: [
            { label: "A", text: "6" },
            { label: "B", text: "9" },
            { label: "C", text: "4" },
            { label: "D", text: "2" }
        ],
        correctAnswer: "B"
    },
    {
        id: 22,
        section: "Code Analysis & Concepts",
        question: "What will be printed?\nfor i in range(1, 5):\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    print(i, end=\" \")",
        options: [
            { label: "A", text: "1 3 4" },
            { label: "B", text: "1 2 3" },
            { label: "C", text: "1 3" },
            { label: "D", text: "1 2 3 4" }
        ],
        correctAnswer: "C"
    },
    {
        id: 23,
        section: "Code Analysis & Concepts",
        question: "Which OOP concept is demonstrated?\nclass Animal { void sound() { } }\nclass Dog extends Animal {\n    void sound() { System.out.print(\"Bark\"); }\n}",
        options: [
            { label: "A", text: "Encapsulation" },
            { label: "B", text: "Method Overriding (Polymorphism)" },
            { label: "C", text: "Abstraction" },
            { label: "D", text: "Interface Implementation" }
        ],
        correctAnswer: "B"
    },
    {
        id: 24,
        section: "Code Analysis & Concepts",
        question: "What happens when this code is executed?\nmy_tuple = (1, 2, 3)\nmy_tuple[1] = 4",
        options: [
            { label: "A", text: "(1, 4, 3)" },
            { label: "B", text: "Error: tuple does not support item assignment" },
            { label: "C", text: "(1, 2, 3, 4)" },
            { label: "D", text: "None" }
        ],
        correctAnswer: "B"
    },
    {
        id: 25,
        section: "Code Analysis & Concepts",
        question: "Which operator precedence is followed?\nprint(not True or True and False)",
        options: [
            { label: "A", text: "not → and → or" },
            { label: "B", text: "or → and → not" },
            { label: "C", text: "Left to right" },
            { label: "D", text: "and → or → not" }
        ],
        correctAnswer: "A"
    },
    {
        id: 26,
        section: "Code Analysis & Concepts",
        question: "Which is the correct fix?\nlst = []\nif lst == None:\n    print(\"Empty\")",
        options: [
            { label: "A", text: "Replace with if not lst:" },
            { label: "B", text: "Use lst.isEmpty()" },
            { label: "C", text: "Use (lst)" },
            { label: "D", text: "No change needed" }
        ],
        correctAnswer: "A"
    },
    {
        id: 27,
        section: "Code Analysis & Concepts",
        question: "Which code produces the output [0, 2, 4]?",
        options: [
            { label: "A", text: "[i for i in range(5) if i % 2 == 0]" },
            { label: "B", text: "[i for i in range(6) if i % 2 == 0]" },
            { label: "C", text: "[i for i in range(3) if i % 2 == 0]" },
            { label: "D", text: "[i * 2 for i in range(3)]" }
        ],
        correctAnswer: "D"
    },
    {
        id: 28,
        section: "Code Analysis & Concepts",
        question: "What is the output?\nint x = 0, y = 5;\nif (x && ++y) {\n    printf(\"True \");\n}\nprintf(\"%d\", y);",
        options: [
            { label: "A", text: "True 6" },
            { label: "B", text: "5" },
            { label: "C", text: "True 5" },
            { label: "D", text: "6" }
        ],
        correctAnswer: "B"
    },
    {
        id: 29,
        section: "Code Analysis & Concepts",
        question: "What type of memory allocation is used?\nint *ptr = (int*)malloc(sizeof(int));",
        options: [
            { label: "A", text: "Static" },
            { label: "B", text: "Dynamic" },
            { label: "C", text: "Memory leak" },
            { label: "D", text: "Recursive" }
        ],
        correctAnswer: "B"
    },
    {
        id: 30,
        section: "Code Analysis & Concepts",
        question: "What will be printed?\ncount = 0\ndef increment():\n    global count\n    count += 1\nincrement()\nprint(count)",
        options: [
            { label: "A", text: "0" },
            { label: "B", text: "1" },
            { label: "C", text: "Error" },
            { label: "D", text: "None" }
        ],
        correctAnswer: "B"
    }
];

// Exam configuration
export const examConfig = {
    totalQuestions: 30,
    duration: 25 * 60, // 25 minutes in seconds
    totalMarks: 30,
    passingMarks: 15,
    negativeMarking: false
};
