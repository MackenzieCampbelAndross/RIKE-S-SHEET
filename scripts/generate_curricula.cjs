// Full generator for Java Heavy and Python 180-Day Curricula
const fs = require('fs');
const path = require('path');

const curriculaDir = path.join(__dirname, '..', 'src', 'data', 'curricula');
if (!fs.existsSync(curriculaDir)) {
  fs.mkdirSync(curriculaDir, { recursive: true });
}

// 1. Process and save C++ Heavy
const cppOriginal = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'curriculum.json'), 'utf8'));
const cppCurriculum = cppOriginal.map(day => ({
  ...day,
  courseId: 'cpp-heavy',
}));
fs.writeFileSync(path.join(curriculaDir, 'cpp.json'), JSON.stringify(cppCurriculum, null, 2), 'utf8');
console.log('Saved cpp.json with', cppCurriculum.length, 'days');

function getPhase(day) {
  if (day <= 30) return { phase: 1, name: 'FOUNDATION' };
  if (day <= 75) return { phase: 2, name: 'CORE DSA' };
  if (day <= 120) return { phase: 3, name: 'ADVANCED DSA + CS CORE' };
  if (day <= 150) return { phase: 4, name: 'INTERVIEW LEVEL' };
  if (day <= 170) return { phase: 5, name: 'INTERVIEW SIMULATION' };
  return { phase: 6, name: 'PLACEMENT MODE' };
}

// Helper to pad day number
const pad = (n) => String(n).padStart(3, '0');
const pad2 = (n) => String(n).padStart(2, '0');

// JAVA 180 DAYS DEFINITION
const javaDaysData = [
  // Phase 1: Days 1-30 (FOUNDATION)
  {
    day: 1,
    title: "Java Architecture and First Program",
    focus: "JDK, JRE, JVM internals, bytecode, javac, and executing HelloWorld",
    outcome: "Compile and execute Java programs via CLI and IDE and understand JVM internals",
    tasks: [
      { t: "Install JDK 21 LTS, verify java and javac in terminal", c: "JAVA" },
      { t: "Understand JVM, JRE, and JDK architecture & ClassLoader subsystem", c: "JAVA" },
      { t: "Write, compile, and run HelloWorld.java using terminal commands", c: "JAVA" },
      { t: "Understand public static void main(String[] args) anatomy", c: "JAVA" },
      { t: "Configure modern IDE (IntelliJ IDEA / VS Code) with JDK", c: "JAVA" },
      { t: "Learn Java comments (single-line, multi-line, Javadoc)", c: "JAVA" },
      { t: "Initialize Git repository for Java placement preparation", c: "CN" }
    ]
  },
  {
    day: 2,
    title: "Data Types, Variables, and Memory Sizes",
    focus: "Primitive types (byte, short, int, long, float, double, char, boolean) and constants",
    outcome: "Master primitive types, memory foot-print, literals, and variable declarations",
    tasks: [
      { t: "Study 8 primitive data types, bit-widths, and value ranges", c: "JAVA" },
      { t: "Declare and initialize variables following Java naming conventions", c: "JAVA" },
      { t: "Understand floating-point precision differences (float vs double)", c: "JAVA" },
      { t: "Learn the final keyword for declaring immutable constants", c: "JAVA" },
      { t: "Write programs verifying Integer.MIN_VALUE, MAX_VALUE and overflow", c: "JAVA" },
      { t: "Solve 5 arithmetic and variable manipulation problems", c: "JAVA" }
    ]
  },
  {
    day: 3,
    title: "Console I/O and Type Casting",
    focus: "Scanner vs BufferedReader, string parsing, implicit/explicit type casting",
    outcome: "Implement fast console I/O and safely handle primitive widening and narrowing",
    tasks: [
      { t: "Learn Scanner methods: nextInt(), nextDouble(), nextLine() pitfalls", c: "JAVA" },
      { t: "Use BufferedReader and StringTokenizer for competitive programming fast I/O", c: "JAVA" },
      { t: "Understand widening (implicit) casting and narrowing (explicit) casting", c: "JAVA" },
      { t: "Handle type casting truncation and precision loss edge cases", c: "JAVA" },
      { t: "Solve 6 beginner console I/O calculation problems", c: "JAVA" },
      { t: "Review Day 1 & 2 concepts", c: "REVISION" }
    ]
  },
  {
    day: 4,
    title: "Java Operators and Precedence",
    focus: "Arithmetic, relational, logical, bitwise, assignment, and ternary operators",
    outcome: "Evaluate complex expressions accurately using operator precedence rules",
    tasks: [
      { t: "Learn arithmetic operators, modulus behaviour with negative numbers", c: "JAVA" },
      { t: "Understand relational and boolean logical operators (&&, ||, !)", c: "JAVA" },
      { t: "Differentiate short-circuit (&&, ||) from non-short-circuit (&, |)", c: "JAVA" },
      { t: "Learn bitwise operators: AND, OR, XOR, NOT, left/right shifts (>>, >>>)", c: "JAVA" },
      { t: "Use ternary operator ? : for concise conditional assignments", c: "JAVA" },
      { t: "Solve 8 expression evaluation and bit-toggling exercises", c: "JAVA" }
    ]
  },
  {
    day: 5,
    title: "Conditional Statements and Switch Expressions",
    focus: "if, else if, else, nested conditions, traditional switch and modern switch expressions",
    outcome: "Construct robust branching logic and utilize modern Java enhanced switch",
    tasks: [
      { t: "Implement complex branching with if, else-if, and nested conditions", c: "JAVA" },
      { t: "Learn traditional switch-case with break and default statements", c: "JAVA" },
      { t: "Master Java 14+ switch expressions with arrow syntax (->) and yield", c: "JAVA" },
      { t: "Build a grade calculator and tax calculation console application", c: "JAVA" },
      { t: "Solve 6 conditional logic placement problems (leap year, triangle validity)", c: "JAVA" },
      { t: "Analyze time complexity of nested condition checks", c: "DSA" }
    ]
  },
  {
    day: 6,
    title: "Loops and Control Transfer",
    focus: "for, while, do-while, nested loops, break, continue, and labeled statements",
    outcome: "Write efficient iterative loops and manage control transfer cleanly",
    tasks: [
      { t: "Master for loop syntax, initialization, condition, and update expressions", c: "JAVA" },
      { t: "Implement while loops and do-while loops with termination safeguards", c: "JAVA" },
      { t: "Understand break and continue statements in single and nested loops", c: "JAVA" },
      { t: "Learn labeled break and labeled continue for multi-loop exits", c: "JAVA" },
      { t: "Solve 8 classic number pattern and star pyramid problems", c: "JAVA" },
      { t: "Calculate the exact iteration count and complexity of 5 loop snippets", c: "DSA" }
    ]
  },
  {
    day: 7,
    title: "Methods, Parameters, and Overloading",
    focus: "Method signatures, return types, pass-by-value, and method overloading",
    outcome: "Design modular methods with clean signatures and overload them appropriately",
    tasks: [
      { t: "Define static methods with parameters, return types, and void return", c: "JAVA" },
      { t: "Understand method signature and method overloading rules in Java", c: "JAVA" },
      { t: "Differentiate overloading by parameter count, type, and order", c: "JAVA" },
      { t: "Learn variable-length arguments (varargs) syntax and caveats", c: "JAVA" },
      { t: "Implement a math utility class with overloaded functions (add, multiply, max)", c: "JAVA" },
      { t: "Solve 5 modular arithmetic problems using methods", c: "JAVA" }
    ]
  },
  {
    day: 8,
    title: "Java Memory Model: Stack vs Heap",
    focus: "Stack memory, Heap memory, reference variables, garbage collection overview",
    outcome: "Trace memory allocation of primitives vs object references accurately",
    tasks: [
      { t: "Study Stack memory: method frames, local variables, LIFO lifecycle", c: "JAVA" },
      { t: "Study Heap memory: dynamic object storage, instance variables", c: "JAVA" },
      { t: "Prove that Java is strictly pass-by-value for both primitives and references", c: "JAVA" },
      { t: "Draw memory diagrams for method calls passing object references", c: "JAVA" },
      { t: "Understand dereferencing, null references, and NullPointerException", c: "JAVA" },
      { t: "Review Week 1: Write summaries of memory, types, and loops", c: "REVISION" }
    ]
  },
  {
    day: 9,
    title: "1D Arrays: Allocation and Traversal",
    focus: "Array instantiation, memory layout, default values, indexed traversal",
    outcome: "Manipulate 1D arrays, avoid ArrayIndexOutOfBoundsException, traverse with for-each",
    tasks: [
      { t: "Declare, instantiate, and initialize 1D arrays in Java", c: "JAVA" },
      { t: "Understand contiguous heap allocation and array length attribute", c: "JAVA" },
      { t: "Traverse arrays using index-based loop and enhanced for-each loop", c: "JAVA" },
      { t: "Implement linear search and compute min, max, sum, and average of array", c: "DSA" },
      { t: "Solve 5 array initialization and traversal interview problems", c: "DSA" }
    ]
  },
  {
    day: 10,
    title: "Array Operations and In-Place Mutations",
    focus: "In-place reversal, element rotation, prefix sums, and copying arrays",
    outcome: "Perform in-place array transformations with O(1) auxiliary space",
    tasks: [
      { t: "Implement in-place array reversal using two-pointer swap", c: "DSA" },
      { t: "Rotate array by K positions to the right (naive O(N*K) vs optimal O(N))", c: "DSA" },
      { t: "Learn System.arraycopy() and Arrays.copyOf() vs manual loop copying", c: "JAVA" },
      { t: "Check if an array is sorted and rotated", c: "DSA" },
      { t: "Solve LeetCode #189: Rotate Array in Java", c: "DSA" },
      { t: "Solve LeetCode #26: Remove Duplicates from Sorted Array", c: "DSA" }
    ]
  },
  {
    day: 11,
    title: "2D Arrays, Matrices, and Jagged Arrays",
    focus: "2D array allocation in heap, row-major traversal, jagged array structures",
    outcome: "Implement 2D matrix algorithms and handle arrays with non-uniform row lengths",
    tasks: [
      { t: "Understand 2D array representation as array of references in Java", c: "JAVA" },
      { t: "Traverse 2D arrays row-wise and column-wise", c: "JAVA" },
      { t: "Create and populate jagged arrays (varying column lengths per row)", c: "JAVA" },
      { t: "Implement matrix addition, scalar multiplication, and transpose in-place", c: "DSA" },
      { t: "Solve Pascal's Triangle (LeetCode #118) in Java", c: "DSA" },
      { t: "Compute diagonal sums and boundary element traversal of matrix", c: "DSA" }
    ]
  },
  {
    day: 12,
    title: "Time and Space Complexity Analysis",
    focus: "Asymptotic notation, Big-O, Big-Omega, Big-Theta, practical analysis",
    outcome: "Formally analyze runtime and auxiliary memory of Java algorithms",
    tasks: [
      { t: "Study asymptotic notations: Big-O (upper bound), Omega, Theta", c: "DSA" },
      { t: "Analyze common complexities: O(1), O(log N), O(N), O(N log N), O(N²), O(2^N)", c: "DSA" },
      { t: "Identify dominant terms and constant factor drop rules", c: "DSA" },
      { t: "Analyze auxiliary space vs total space complexity in Java", c: "DSA" },
      { t: "Analyze complexity for 8 different Java code snippets", c: "DSA" },
      { t: "Complete complexity comparison quiz", c: "ASSESSMENT" }
    ]
  },
  {
    day: 13,
    title: "Complexity of Nested Loops and Recursion",
    focus: "Mathematical series summation, logarithmic loops, recursive call stack space",
    outcome: "Calculate runtime of non-trivial nested loops and recursive equations",
    tasks: [
      { t: "Analyze loops with non-unit increments: i *= 2, i /= 2 -> O(log N)", c: "DSA" },
      { t: "Analyze dependent nested loops (sum of 1 to N -> O(N²))", c: "DSA" },
      { t: "Trace recursion tree space complexity on Java call stack", c: "DSA" },
      { t: "Solve Master Theorem basics for divide and conquer algorithms", c: "DSA" },
      { t: "Write analysis documentation for 5 placement DSA problems", c: "DSA" }
    ]
  },
  {
    day: 14,
    title: "String Fundamentals and Immutability",
    focus: "String Constant Pool (SCP), immutability, == vs .equals(), intern()",
    outcome: "Explain string pool mechanics and eliminate reference comparison bugs",
    tasks: [
      { t: "Understand how String objects are stored in heap and String Constant Pool", c: "JAVA" },
      { t: "Explain why Java Strings are immutable (security, caching, thread safety)", c: "JAVA" },
      { t: "Compare string literals vs new String() memory allocation", c: "JAVA" },
      { t: "Master difference between == (reference equality) and .equals() (content equality)", c: "JAVA" },
      { t: "Understand String.intern() method and pool interning", c: "JAVA" },
      { t: "Solve 6 tricky String equality output prediction questions", c: "JAVA" }
    ]
  },
  {
    day: 15,
    title: "String Methods and Manipulation Patterns",
    focus: "length(), charAt(), substring(), indexOf(), split(), toCharArray(), regex basics",
    outcome: "Manipulate strings proficiently and solve foundational string interview tasks",
    tasks: [
      { t: "Master core methods: charAt(), substring(), indexOf(), contains(), replace()", c: "JAVA" },
      { t: "Convert between String, char[], and byte[] efficiently", c: "JAVA" },
      { t: "Check for palindrome string ignoring non-alphanumeric characters (LeetCode #125)", c: "DSA" },
      { t: "Implement valid anagram check using frequency counting array (LeetCode #242)", c: "DSA" },
      { t: "Reverse words in a given string (LeetCode #151)", c: "DSA" },
      { t: "Implement string compression (run-length encoding)", c: "DSA" }
    ]
  },
  {
    day: 16,
    title: "StringBuilder and StringBuffer",
    focus: "Mutable sequences, capacity growth algorithm, thread safety vs performance",
    outcome: "Avoid O(N²) string concatenation anti-patterns using StringBuilder",
    tasks: [
      { t: "Study why String concatenation (+) in loops creates garbage and O(N²) overhead", c: "JAVA" },
      { t: "Master StringBuilder API: append(), insert(), delete(), reverse(), setCharAt()", c: "JAVA" },
      { t: "Compare StringBuilder (non-synchronized, fast) vs StringBuffer (synchronized)", c: "JAVA" },
      { t: "Understand internal buffer resizing: (oldCapacity * 2) + 2", c: "JAVA" },
      { t: "Benchmark String vs StringBuilder concatenation time with 100,000 iterations", c: "JAVA" },
      { t: "Solve 4 placement string mutation challenges using StringBuilder", c: "DSA" }
    ]
  },
  {
    day: 17,
    title: "Classes, Objects, and State",
    focus: "Class definitions, fields, methods, instantiation with new, reference variables",
    outcome: "Model real-world entities cleanly using Java classes and object instances",
    tasks: [
      { t: "Understand classes as blueprints and objects as heap instances", c: "OOP" },
      { t: "Define instance variables, instance methods, and identify default states", c: "OOP" },
      { t: "Create multiple objects and verify independent state in heap memory", c: "OOP" },
      { t: "Build a Student placement profile class with getters and validation", c: "OOP" },
      { t: "Trace reference aliasing when assigning object variables", c: "JAVA" },
      { t: "Solve 5 class design placement interview questions", c: "OOP" }
    ]
  },
  {
    day: 18,
    title: "Constructors and Object Initialization",
    focus: "Default constructor, parameterized constructors, constructor chaining with this()",
    outcome: "Initialize objects predictably and chain constructors cleanly using this()",
    tasks: [
      { t: "Understand default no-arg constructor injected by compiler", c: "JAVA" },
      { t: "Write parameterized constructors and initialize instance fields", c: "JAVA" },
      { t: "Use this keyword to resolve shadowing between parameters and fields", c: "JAVA" },
      { t: "Implement constructor chaining using this(...) as first line of constructor", c: "JAVA" },
      { t: "Understand initialization blocks: instance initializer vs static initializer", c: "JAVA" },
      { t: "Build a BankAccount class with overloaded constructors and validation", c: "OOP" }
    ]
  },
  {
    day: 19,
    title: "Encapsulation and Access Modifiers",
    focus: "private, default (package-private), protected, public, data hiding",
    outcome: "Apply data hiding and build tamper-proof encapsulated Java classes",
    tasks: [
      { t: "Study the four access levels: private, default, protected, and public", c: "OOP" },
      { t: "Understand data hiding principles and defense against invalid state mutations", c: "OOP" },
      { t: "Write standard getters and setters with business validation rules", c: "OOP" },
      { t: "Create immutable class in Java (final class, private final fields, defensive copying)", c: "OOP" },
      { t: "Build an Employee salary and designation management system", c: "OOP" },
      { t: "Solve 5 access modifier visibility interview teasers", c: "JAVA" }
    ]
  },
  {
    day: 20,
    title: "The static Keyword in Java",
    focus: "Static fields, static methods, static blocks, class loading lifecycle",
    outcome: "Differentiate class-level members from instance-level members correctly",
    tasks: [
      { t: "Understand static variables stored in Metaspace/Class area shared across instances", c: "JAVA" },
      { t: "Define static utility methods and explain why static methods cannot use this", c: "JAVA" },
      { t: "Master static initialization blocks and execution order during class loading", c: "JAVA" },
      { t: "Implement Singleton design pattern using static instance and private constructor", c: "OOP" },
      { t: "Trace execution order of static blocks vs instance blocks vs constructors", c: "JAVA" },
      { t: "Solve 6 tricky static keyword output questions", c: "JAVA" }
    ]
  },
  {
    day: 21,
    title: "Inheritance and the super Keyword",
    focus: "extends keyword, IS-A relationship, super keyword, constructor propagation",
    outcome: "Build reusable class hierarchies and invoke parent constructors using super()",
    tasks: [
      { t: "Understand IS-A relationship and single/multilevel inheritance in Java", c: "OOP" },
      { t: "Explain why multiple inheritance of classes is prohibited in Java (Diamond problem)", c: "OOP" },
      { t: "Use super() to invoke superclass constructor with parameters", c: "JAVA" },
      { t: "Access parent fields and methods using super reference", c: "JAVA" },
      { t: "Design a Vehicle -> Car -> ElectricCar inheritance hierarchy", c: "OOP" },
      { t: "Trace constructor call sequence from Object down to subclass", c: "JAVA" }
    ]
  },
  {
    day: 22,
    title: "Polymorphism and Dynamic Method Dispatch",
    focus: "Method overriding, @Override, runtime polymorphism, virtual method invocation",
    outcome: "Implement dynamic method dispatch and leverage polymorphic references",
    tasks: [
      { t: "Master method overriding rules: same name, parameters, return type (or covariant)", c: "OOP" },
      { t: "Use @Override annotation to catch compiler errors early", c: "JAVA" },
      { t: "Understand Dynamic Method Dispatch and virtual method invocation at runtime", c: "OOP" },
      { t: "Explain why private, static, and final methods cannot be overridden", c: "JAVA" },
      { t: "Demonstrate runtime polymorphism with Shape base class and Circle, Rectangle subclasses", c: "OOP" },
      { t: "Solve 5 runtime polymorphism output prediction problems", c: "OOP" }
    ]
  },
  {
    day: 23,
    title: "The final Keyword and Immutability",
    focus: "Final variables, blank final, final method parameters, final methods, final classes",
    outcome: "Protect classes and methods from unwanted inheritance and mutation",
    tasks: [
      { t: "Master final variables: compile-time constants vs blank final initialized in constructor", c: "JAVA" },
      { t: "Understand final reference variables: reference cannot change, object state may mutate", c: "JAVA" },
      { t: "Prevent method overriding using final methods for critical algorithms", c: "JAVA" },
      { t: "Prevent class inheritance using final classes (like String and System)", c: "JAVA" },
      { t: "Write a fully immutable Person class with deep copy of mutable date fields", c: "OOP" },
      { t: "Review final vs finally vs finalize differences for interviews", c: "JAVA" }
    ]
  },
  {
    day: 24,
    title: "Abstract Classes and Methods",
    focus: "abstract keyword, partial abstraction, abstract contracts vs concrete methods",
    outcome: "Define abstract base contracts and implement template method pattern",
    tasks: [
      { t: "Understand abstract classes: cannot be instantiated directly with new", c: "OOP" },
      { t: "Define abstract methods: signature with no body, mandatory subclass override", c: "OOP" },
      { t: "Mix concrete methods, instance fields, and constructors in abstract classes", c: "OOP" },
      { t: "Implement the Template Method design pattern using an abstract class PaymentProcessor", c: "OOP" },
      { t: "Compare abstract classes vs concrete classes in system architecture", c: "OOP" },
      { t: "Solve 5 abstract class design placement questions", c: "OOP" }
    ]
  },
  {
    day: 25,
    title: "Interfaces in Java",
    focus: "interface keyword, multiple interface inheritance, default and static methods",
    outcome: "Achieve complete abstraction and multiple inheritance of type via interfaces",
    tasks: [
      { t: "Declare interfaces, public static final constant fields, and public abstract methods", c: "OOP" },
      { t: "Implement multiple interfaces in a single class using implements keyword", c: "OOP" },
      { t: "Study Java 8 default methods for backwards compatibility and static interface methods", c: "JAVA" },
      { t: "Resolve default method conflict when implementing two interfaces with same method", c: "JAVA" },
      { t: "Build a PaymentGateway interface with CreditCard and UPI implementations", c: "OOP" },
      { t: "Compare Abstract Class vs Interface: when to use which in interviews", c: "INTERVIEW" }
    ]
  },
  {
    day: 26,
    title: "Packages, Classpath, and Access Boundaries",
    focus: "Package declarations, imports, static imports, JAR files, access matrix",
    outcome: "Organize enterprise Java codebases into packages and control visibility",
    tasks: [
      { t: "Understand package naming conventions (reverse domain name: com.company.app)", c: "JAVA" },
      { t: "Learn import statements and wildcard imports (* vs specific imports)", c: "JAVA" },
      { t: "Use static imports for constants and utility methods (Math.PI, Assertions)", c: "JAVA" },
      { t: "Verify protected modifier visibility across different packages through inheritance", c: "JAVA" },
      { t: "Package application into an executable JAR file using javac and jar tools", c: "JAVA" },
      { t: "Solve 5 package and access level interview questions", c: "JAVA" }
    ]
  },
  {
    day: 27,
    title: "The Object Class: equals() and hashCode() Contract",
    focus: "java.lang.Object methods, equals(), hashCode() contract, toString(), clone()",
    outcome: "Override equals and hashCode correctly to support hashing collections safely",
    tasks: [
      { t: "Examine java.lang.Object as root class of Java hierarchy", c: "JAVA" },
      { t: "Override toString() to provide meaningful JSON/text representations", c: "JAVA" },
      { t: "Study the formal equals() contract: reflexive, symmetric, transitive, consistent", c: "JAVA" },
      { t: "Understand the equals() and hashCode() contract: equal objects must have same hashCode", c: "JAVA" },
      { t: "Demonstrate hash bucket failure in HashMap when overriding equals without hashCode", c: "JAVA" },
      { t: "Implement equals() and hashCode() using Objects.hash() in an Employee class", c: "OOP" }
    ]
  },
  {
    day: 28,
    title: "Wrapper Classes and Autoboxing Pitfalls",
    focus: "Integer, Double, Boolean, Autoboxing, Unboxing, Integer Cache (-128 to 127)",
    outcome: "Navigate wrapper conversions safely without NullPointerExceptions or performance leaks",
    tasks: [
      { t: "Learn wrapper classes for all 8 primitive types", c: "JAVA" },
      { t: "Understand compiler autoboxing (int -> Integer) and unboxing (Integer -> int)", c: "JAVA" },
      { t: "Study Integer Cache range [-128, 127] and explain Integer a = 100 == Integer b = 100", c: "JAVA" },
      { t: "Avoid unboxing NullPointerExceptions on null wrapper references", c: "JAVA" },
      { t: "Understand performance penalties of autoboxing in high-throughput loops", c: "JAVA" },
      { t: "Solve 6 tricky autoboxing and caching output questions", c: "JAVA" }
    ]
  },
  {
    day: 29,
    title: "Introduction to Recursion in Java",
    focus: "Base conditions, call stack frames, recursive leap of faith, StackOverflowError",
    outcome: "Formulate recursive solutions and track stack frames on the JVM call stack",
    tasks: [
      { t: "Understand recursive anatomy: base case to stop, recursive case to progress", c: "DSA" },
      { t: "Trace JVM stack frames during factorial and Fibonacci computations", c: "DSA" },
      { t: "Understand StackOverflowError caused by missing base conditions", c: "JAVA" },
      { t: "Calculate sum of digits and power(x, n) recursively in O(log n)", c: "DSA" },
      { t: "Implement recursive binary search on sorted array", c: "DSA" },
      { t: "Solve LeetCode #50: Pow(x, n) recursively", c: "DSA" }
    ]
  },
  {
    day: 30,
    title: "Foundation Milestone Assessment",
    focus: "Comprehensive Phase 1 evaluation: Java syntax, OOP design, and basic DSA",
    outcome: "Verify mastery of core Java, memory model, and problem solving before Phase 2",
    tasks: [
      { t: "Complete 30-question Java fundamentals & OOP concepts diagnostic test", c: "ASSESSMENT" },
      { t: "Implement an end-to-end Student Course Registration OOP system in Java", c: "OOP" },
      { t: "Solve 3 timed coding problems on arrays, strings, and recursion", c: "DSA" },
      { t: "Review and fix incorrect questions from Phase 1 diagnostics", c: "REVISION" },
      { t: "Audit Git repository and document Phase 1 learning notes", c: "PROJECTS" }
    ]
  }
];

// Helper to fill days 31-180 for Java
const javaCurriculum = [...javaDaysData];

// Define core DSA topics for Days 31-75
const javaPhase2Topics = [
  { day: 31, title: "Arrays: Prefix Sum Array and Range Queries", focus: "O(1) range sum queries, 1D prefix arrays", lc: "#303 Range Sum Query", t: "Prefix Sum" },
  { day: 32, title: "Arrays: Difference Array Technique", focus: "O(1) range updates, corporate flight bookings", lc: "#1109 Corporate Flight Bookings", t: "Difference Array" },
  { day: 33, title: "Arrays: Kadane's Algorithm for Max Subarray", focus: "Dynamic maximum contiguous sum, local vs global max", lc: "#53 Maximum Subarray", t: "Kadane's" },
  { day: 34, title: "Arrays: Dutch National Flag Algorithm", focus: "3-way partitioning, sorting colors 0, 1, 2 in O(N)", lc: "#75 Sort Colors", t: "3-Way Partition" },
  { day: 35, title: "Arrays: Boyer-Moore Voting Algorithm", focus: "Finding majority element in O(N) time and O(1) space", lc: "#169 Majority Element", t: "Voting Algorithm" },
  { day: 36, title: "Two Pointers: Sorted Two Sum and Triplet Search", focus: "Opposite end pointers on sorted arrays", lc: "#167 Two Sum II", t: "Two Pointers" },
  { day: 37, title: "Two Pointers: Trapping Rain Water", focus: "LeftMax, RightMax two-pointer elevation trapping", lc: "#42 Trapping Rain Water", t: "Trapping Water" },
  { day: 38, title: "Two Pointers: Container With Most Water", focus: "Greedy shrinking width two-pointer strategy", lc: "#11 Container With Most Water", t: "Most Water" },
  { day: 39, title: "Two Pointers: 3Sum and 4Sum Optimization", focus: "Sorted array fixed-pivot two-pointer with duplicate skips", lc: "#15 3Sum", t: "3Sum/4Sum" },
  { day: 40, title: "Two Pointers: Partitioning and In-Place Removal", focus: "Slow and fast pointers, removing elements in-place", lc: "#27 Remove Element", t: "In-Place Array" },
  { day: 41, title: "Sliding Window: Fixed Size Window Maximums", focus: "Window slides, adding new element and discarding old", lc: "#643 Max Average Subarray", t: "Fixed Window" },
  { day: 42, title: "Sliding Window: First Negative Number in Window K", focus: "Queue/pointer tracking inside fixed window size", lc: "GFG First Negative in Window", t: "Window Tracking" },
  { day: 43, title: "Sliding Window: Longest Substring Without Repeats", focus: "Variable window, HashSet/HashMap index jump", lc: "#3 Longest Substring Without Repeating", t: "Variable Window" },
  { day: 44, title: "Sliding Window: Minimum Window Substring", focus: "Character frequency map, match counts, window expansion", lc: "#76 Minimum Window Substring", t: "Min Window" },
  { day: 45, title: "Sliding Window: Character Replacement", focus: "Max frequency in window, K allowed flips", lc: "#424 Longest Repeating Character Replacement", t: "Window Flips" },
  { day: 46, title: "Binary Search: Core Iterative and Recursive Search", focus: "Mid calculation safe from integer overflow (low + (high-low)/2)", lc: "#704 Binary Search", t: "Binary Search" },
  { day: 47, title: "Binary Search: Lower Bound and Upper Bound", focus: "First index >= X and first index > X", lc: "#34 Find First and Last Position", t: "Bounds" },
  { day: 48, title: "Binary Search: Rotated Sorted Array Search", focus: "Identifying which half is sorted, boundary decisions", lc: "#33 Search in Rotated Sorted Array", t: "Rotated Array" },
  { day: 49, title: "Binary Search: Peak Element and Single Non-Duplicate", focus: "Searching in unsorted/partially sorted arrays", lc: "#162 Find Peak Element", t: "Peak Search" },
  { day: 50, title: "Binary Search on Answer: Koko Eating Bananas", focus: "Monotonic predicate search space [min, max]", lc: "#875 Koko Eating Bananas", t: "Search on Answer" },
  { day: 51, title: "Binary Search on Answer: Painter's Partition & Allocation", focus: "Capacity allocation with feasibility check function", lc: "#410 Split Array Largest Sum", t: "Capacity Search" },
  { day: 52, title: "2D Matrices: Spiral Order Traversal", focus: "Top, bottom, left, right boundary shrinkage", lc: "#54 Spiral Matrix", t: "Spiral Matrix" },
  { day: 53, title: "2D Matrices: Rotate Matrix 90 Degrees In-Place", focus: "Transpose then reverse each row", lc: "#48 Rotate Image", t: "Rotate Matrix" },
  { day: 54, title: "2D Matrices: Search in Row and Column Sorted Matrix", focus: "Top-right corner pointer elimination", lc: "#240 Search a 2D Matrix II", t: "Matrix Search" },
  { day: 55, title: "2D Matrices: Set Matrix Zeroes", focus: "Using first row and column as flags for O(1) space", lc: "#73 Set Matrix Zeroes", t: "Zero Matrix" },
  { day: 56, title: "Singly Linked List: Custom Node Class and Traversal", focus: "ListNode implementation, head reference, traversal loop", lc: "Build Custom SLL", t: "LinkedList Intro" },
  { day: 57, title: "Singly Linked List: Insertions and Deletions", focus: "Insert at head, tail, position; delete by key and position", lc: "SLL CRUD Operations", t: "LL Operations" },
  { day: 58, title: "Singly Linked List: Reversal (Iterative & Recursive)", focus: "Prev, curr, next pointer manipulation, recursive returns", lc: "#206 Reverse Linked List", t: "Reverse LL" },
  { day: 59, title: "Singly Linked List: Middle Node (Tortoise & Hare)", focus: "Slow and fast pointer technique", lc: "#876 Middle of the Linked List", t: "Slow Fast Pointers" },
  { day: 60, title: "Singly Linked List: Cycle Detection and Cycle Start", focus: "Floyd's Cycle Finding Algorithm, mathematical proof of meeting point", lc: "#141 & #142 Linked List Cycle", t: "Cycle Detection" },
  { day: 61, title: "Singly Linked List: Merge Two Sorted Lists", focus: "Dummy head node pattern, pointer progression", lc: "#21 Merge Two Sorted Lists", t: "Merge Lists" },
  { day: 62, title: "Singly Linked List: Remove Nth Node from End", focus: "Two-pointer gap of N nodes, single pass removal", lc: "#19 Remove Nth Node From End", t: "Remove Nth" },
  { day: 63, title: "Singly Linked List: Palindrome Linked List", focus: "Find middle, reverse second half, compare, restore", lc: "#234 Palindrome Linked List", t: "Palindrome LL" },
  { day: 64, title: "Doubly Linked List: Implementation and Operations", focus: "Prev and next pointers, bidirectional traversal", lc: "Build Custom DLL", t: "Doubly LL" },
  { day: 65, title: "Linked List: Reverse Nodes in K-Group", focus: "Counting nodes, reversing sub-lists, linking sub-chains", lc: "#25 Reverse Nodes in k-Group", t: "K-Group Reverse" },
  { day: 66, title: "Stacks: Implementation using Array and LinkedList", focus: "LIFO semantics, push, pop, peek, overflow/underflow", lc: "Custom Stack in Java", t: "Stack Intro" },
  { day: 67, title: "Stacks: Valid Parentheses Matching", focus: "Character stack, bracket matching, early mismatch exit", lc: "#20 Valid Parentheses", t: "Valid Parentheses" },
  { day: 68, title: "Stacks: Min Stack with O(1) Retrievals", focus: "Two stacks vs single stack encoded difference", lc: "#155 Min Stack", t: "Min Stack" },
  { day: 69, title: "Stacks: Next Greater Element (Monotonic Stack)", focus: "Monotonic decreasing stack for O(N) span calculations", lc: "#496 Next Greater Element I", t: "Monotonic Stack" },
  { day: 70, title: "Stacks: Largest Rectangle in Histogram", focus: "Previous smaller and next smaller bounds via stack", lc: "#84 Largest Rectangle in Histogram", t: "Histogram Rect" },
  { day: 71, title: "Queues: Implementation using Array and Deque", focus: "FIFO semantics, circular queue array wrapping", lc: "#622 Design Circular Queue", t: "Queue Intro" },
  { day: 72, title: "Queues: Implement Queue using Stacks", focus: "Amortized O(1) push and pop using two stacks", lc: "#232 Implement Queue using Stacks", t: "Queue using Stacks" },
  { day: 73, title: "Queues: Sliding Window Maximum via Monotonic Deque", focus: "Monotonic deque maintaining indices of maximum elements", lc: "#239 Sliding Window Maximum", t: "Deque Window Max" },
  { day: 74, title: "Queues: First Non-Repeating Character in Stream", focus: "Queue paired with frequency map for streaming data", lc: "First Non-Repeating Character", t: "Stream Queue" },
  { day: 75, title: "Phase 2 Milestone: Core DSA Comprehensive Assessment", focus: "Timed assessment on Arrays, Two Pointers, LL, Stacks, Queues", lc: "3-Problem Timed Test", t: "Phase 2 Exam" }
];

for (const p of javaPhase2Topics) {
  javaCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Master ${p.t} and solve placement problems with optimal time/space complexity`,
    tasks: [
      { t: `Study algorithmic concepts: ${p.focus}`, c: "DSA" },
      { t: `Implement optimal solution in Java for ${p.lc}`, c: "DSA" },
      { t: `Analyze time and space complexity with dry runs on edge cases`, c: "DSA" },
      { t: `Solve 2 related variations from LeetCode / GeeksforGeeks`, c: "DSA" },
      { t: `Write clean, production-grade Java code with meaningful variable names`, c: "JAVA" }
    ]
  });
}

// Phase 3 Topics (Days 76-120): Advanced DSA + CS Core
const javaPhase3Topics = [
  { day: 76, title: "Recursion: Subsequence Generation Patterns", focus: "Pick / Don't Pick recursion tree, power set construction", lc: "#78 Subsets" },
  { day: 77, title: "Backtracking: Subsets II and Handling Duplicates", focus: "Sorting, skipping identical adjacent recursive branches", lc: "#90 Subsets II" },
  { day: 78, title: "Backtracking: Permutations and Combination Sum", focus: "State exploration, swapping, element frequency arrays", lc: "#46 Permutations & #39 Combination Sum" },
  { day: 79, title: "Backtracking: Word Search on 2D Grid", focus: "DFS path exploration, visited mark and unmark backtracking", lc: "#79 Word Search" },
  { day: 80, title: "Backtracking: N-Queens Problem and Sudoku Solver", focus: "Constraint satisfaction, row/column/diagonal hashing", lc: "#51 N-Queens & #37 Sudoku Solver" },
  { day: 81, title: "Binary Trees: Node Structure and Traversals", focus: "Inorder, Preorder, Postorder traversals (Recursive & Iterative)", lc: "#94, #144, #145 Tree Traversals" },
  { day: 82, title: "Binary Trees: Level Order Traversal (BFS)", focus: "Queue-based BFS, tracking levels, zigzag traversal", lc: "#102 Level Order & #103 Zigzag" },
  { day: 83, title: "Binary Trees: Height, Depth, and Balanced Tree Check", focus: "Maximum depth, minimum depth, height-balanced O(N) bottom-up", lc: "#104 Max Depth & #110 Balanced Binary Tree" },
  { day: 84, title: "Binary Trees: Diameter and Maximum Path Sum", focus: "Subtree height calculation with global diameter tracking", lc: "#543 Diameter & #124 Max Path Sum" },
  { day: 85, title: "Binary Trees: Symmetric, Inverted, and Same Trees", focus: "Mirrored recursion, structural equivalence validation", lc: "#101 Symmetric Tree & #226 Invert Tree" },
  { day: 86, title: "Binary Trees: Lowest Common Ancestor (LCA)", focus: "Root-to-node path intersection vs post-order recursion LCA", lc: "#236 Lowest Common Ancestor" },
  { day: 87, title: "Binary Trees: Vertical Order and Top/Bottom Views", focus: "Horizontal coordinate hashing, queue with coordinates", lc: "#987 Vertical Order Traversal" },
  { day: 88, title: "Binary Trees: Boundary Traversal and Views", focus: "Left boundary, leaf nodes, right boundary reverse collection", lc: "Boundary Traversal of Binary Tree" },
  { day: 89, title: "Binary Trees: Construct from Preorder and Inorder", focus: "Inorder index mapping via HashMap, recursive boundary partition", lc: "#105 Construct Binary Tree" },
  { day: 90, title: "Binary Trees: Serialization and Deserialization", focus: "String encoding of tree with delimiters, null markers", lc: "#297 Serialize and Deserialize Binary Tree" },
  { day: 91, title: "Binary Search Trees: Properties, Search, and Insert", focus: "BST invariant: left < root < right, logarithmic operations", lc: "#700 Search & #701 Insert in BST" },
  { day: 92, title: "Binary Search Trees: Validate BST and Deletion", focus: "Valid range bounds [min, max], 3 deletion cases (0, 1, 2 children)", lc: "#98 Validate BST & #450 Delete Node" },
  { day: 93, title: "Binary Search Trees: LCA and Sorted Array to BST", focus: "Directional branch pruning based on node values", lc: "#235 LCA of BST & #108 Convert Sorted Array" },
  { day: 94, title: "Binary Search Trees: Kth Smallest Element in BST", focus: "Inorder traversal property of BST, iterative counter", lc: "#230 Kth Smallest Element in BST" },
  { day: 95, title: "Binary Search Trees: Inorder Successor and Predecessor", focus: "Navigating left/right subtrees or tracking ancestor turns", lc: "Inorder Successor in BST" },
  { day: 96, title: "Heaps: Binary Heap Fundamentals and Heapify", focus: "Array representation of complete binary tree, sift-up, sift-down", lc: "Build MinHeap in Java" },
  { day: 97, title: "Heaps in Java: PriorityQueue and Custom Comparators", focus: "PriorityQueue internals, lambda comparators, max-heap creation", lc: "Java PriorityQueue Mastery" },
  { day: 98, title: "Heaps: Kth Largest Element and K Closest Points", focus: "Min-heap of size K for Kth largest, Euclidean distance heap", lc: "#215 Kth Largest & #973 K Closest Points" },
  { day: 99, title: "Heaps: Top K Frequent Elements", focus: "Frequency map combined with min-heap / bucket sort", lc: "#347 Top K Frequent Elements" },
  { day: 100, title: "Heaps: Merge K Sorted Lists and Median in Stream", focus: "K-way merge with PriorityQueue, dual heap (max-heap + min-heap)", lc: "#23 Merge k Lists & #295 Find Median" },
  { day: 101, title: "Greedy: Activity Selection and Fractional Knapsack", focus: "Sorting by finish time / value-to-weight ratio", lc: "Fractional Knapsack Problem" },
  { day: 102, title: "Greedy: Jump Game I and Jump Game II", focus: "Tracking furthest reachable index, BFS-style interval jumps", lc: "#55 Jump Game & #45 Jump Game II" },
  { day: 103, title: "Greedy: Gas Station Circular Tour", focus: "Net deficit tracking, resetting start position", lc: "#134 Gas Station" },
  { day: 104, title: "Greedy: Minimum Platforms for Trains", focus: "Arrival and departure timeline sorting, simultaneous occupancy", lc: "Minimum Platforms GFG" },
  { day: 105, title: "Greedy: Job Sequencing and Huffman Coding Basics", focus: "Deadline slot allocation with max profit greedily", lc: "Job Sequencing Problem" },
  { day: 106, title: "Intervals: Merge Overlapping Intervals", focus: "Sort by start time, merging overlapping end boundaries", lc: "#56 Merge Intervals" },
  { day: 107, title: "Intervals: Insert Interval into Sorted List", focus: "Three phase sweep: before overlap, overlapping merge, after overlap", lc: "#57 Insert Interval" },
  { day: 108, title: "Intervals: Non-overlapping Intervals & Meeting Rooms", focus: "Minimizing removals by greedily picking earliest ending interval", lc: "#435 Non-overlapping Intervals" },
  { day: 109, title: "Tries: Implementation of Prefix Tree", focus: "TrieNode array of 26 children, isEndOfWord flag, insert, search", lc: "#208 Implement Trie (Prefix Tree)" },
  { day: 110, title: "Tries: Longest Word with All Prefixes and Autocomplete", focus: "Traversing Trie nodes where every prefix is present", lc: "Longest Word with All Prefixes" },
  { day: 111, title: "Tries: Maximum XOR of Two Numbers in Array", focus: "Bitwise Trie (0 and 1 branches), maximizing opposite bit choices", lc: "#421 Maximum XOR of Two Numbers" },
  { day: 112, title: "Bit Manipulation: Bitwise Operators and Masks", focus: "AND, OR, XOR, NOT, left shift, right shift, check Kth bit", lc: "Bit Operations Cheatsheet" },
  { day: 113, title: "Bit Manipulation: Count Set Bits & Power of Two", focus: "Brian Kernighan's Algorithm (n & (n-1)), n & -n (lowest set bit)", lc: "#191 Number of 1 Bits & #231 Power of Two" },
  { day: 114, title: "Bit Manipulation: Single Number I, II, and III", focus: "XOR cancellation, 3N+1 bit counts, two unique numbers bucket split", lc: "#136 Single Number & #260 Single Number III" },
  { day: 115, title: "Bit Manipulation: Generating Subsets via Bitmask", focus: "Iterating from 0 to (2^N - 1), extracting set bits", lc: "#78 Subsets using Bitmask" },
  { day: 116, title: "Dynamic Programming: Memoization vs Tabulation", focus: "Overlapping subproblems, optimal substructure, 1D DP table", lc: "#509 Fibonacci Number" },
  { day: 117, title: "Dynamic Programming: Climbing Stairs & Frog Jump", focus: "State transitions dp[i] = dp[i-1] + dp[i-2], space optimization", lc: "#70 Climbing Stairs & #746 Min Cost Climbing" },
  { day: 118, title: "Dynamic Programming: House Robber I & II", focus: "Pick vs non-pick recurrence, circular array handling", lc: "#198 House Robber & #213 House Robber II" },
  { day: 119, title: "Dynamic Programming: Coin Change Problems", focus: "Fewest coins (min DP) and number of combinations (unbounded knapsack)", lc: "#322 Coin Change & #518 Coin Change II" },
  { day: 120, title: "Phase 3 Milestone: Advanced DSA Assessment", focus: "Mid-term comprehensive coding test on Trees, BST, Heaps, Greedy, DP", lc: "3-Problem Mid-Term Exam" }
];

for (const p of javaPhase3Topics) {
  javaCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Master advanced data structure topic and solve ${p.lc} in Java`,
    tasks: [
      { t: `Understand core concepts: ${p.focus}`, c: "DSA" },
      { t: `Implement optimal Java solution for ${p.lc}`, c: "DSA" },
      { t: `Analyze recurrence relation, time complexity, and recursion stack memory`, c: "DSA" },
      { t: `Solve 1 follow-up / hard variation problem`, c: "DSA" },
      { t: `Record placement notes and edge cases in preparation sheet`, c: "REVISION" }
    ]
  });
}

// Phase 4 Topics (Days 121-150): Interview Level & CS Core
const javaPhase4Topics = [
  { day: 121, title: "Graphs: Graph Representation (Adjacency Matrix & List)", focus: "Building ArrayList<ArrayList<Integer>> and weighted edge classes", cat: "DSA" },
  { day: 122, title: "Graphs: Breadth First Search (BFS) and Depth First Search (DFS)", focus: "Queue-based BFS, recursion-based DFS, visited array", cat: "DSA" },
  { day: 123, title: "Graphs: Cycle Detection in Undirected Graph", focus: "Parent tracking in BFS and DFS for undirected cycles", cat: "DSA" },
  { day: 124, title: "Graphs: Cycle Detection in Directed Graph", focus: "Recursion call stack array and in-degree Kahn's algorithm", cat: "DSA" },
  { day: 125, title: "Graphs: Topological Sorting (DFS & Kahn's BFS)", focus: "DAG ordering, in-degree calculation, Course Schedule problem", cat: "DSA" },
  { day: 126, title: "Graphs: Shortest Path in Undirected and DAGs", focus: "Unit weight BFS shortest path, topological sort DAG relaxation", cat: "DSA" },
  { day: 127, title: "Graphs: Dijkstra's Algorithm", focus: "PriorityQueue with distance array, greedy edge relaxation", cat: "DSA" },
  { day: 128, title: "Graphs: Bellman-Ford and Floyd-Warshall Algorithms", focus: "Negative weight cycle detection, all-pairs shortest path", cat: "DSA" },
  { day: 129, title: "Graphs: Disjoint Set Union (Union-Find)", focus: "Find with path compression, union by rank/size, cycle detection", cat: "DSA" },
  { day: 130, title: "Graphs: Minimum Spanning Tree (Kruskal's & Prim's)", focus: "Greedy edge sorting with DSU, PriorityQueue Prim's algorithm", cat: "DSA" },
  { day: 131, title: "2D Dynamic Programming: Unique Paths on Grid", focus: "Grid transition dp[i][j] = dp[i-1][j] + dp[i][j-1], obstacle handling", cat: "DSA" },
  { day: 132, title: "2D Dynamic Programming: Minimum Path Sum", focus: "Matrix DP boundary filling, path reconstruction", cat: "DSA" },
  { day: 133, title: "2D Dynamic Programming: 0/1 Knapsack & Subset Sum", focus: "Capacity vs items 2D table, 1D space optimization backward loop", cat: "DSA" },
  { day: 134, title: "2D Dynamic Programming: Longest Common Subsequence", focus: "String matching matrix, Edit Distance operations (insert, delete, replace)", cat: "DSA" },
  { day: 135, title: "Dynamic Programming: Longest Increasing Subsequence (LIS)", focus: "O(N²) DP vs O(N log N) patience sorting with binary search", cat: "DSA" },
  { day: 136, title: "DBMS: Architecture, Relational Model, and ER Diagrams", focus: "Entity-Relationship model, keys (candidate, primary, foreign), 3-tier architecture", cat: "DBMS" },
  { day: 137, title: "DBMS: Functional Dependencies and Normalization", focus: "1NF, 2NF, 3NF, BCNF anomalies, lossless decomposition", cat: "DBMS" },
  { day: 138, title: "DBMS: Transactions, ACID Properties, and Concurrency", focus: "Atomicity, Consistency, Isolation, Durability, 2PL, Deadlocks, Isolation levels", cat: "DBMS" },
  { day: 139, title: "SQL: DDL, DML, DQL and Aggregate Grouping", focus: "CREATE, ALTER, DROP, SELECT, WHERE vs HAVING, GROUP BY, aggregates", cat: "SQL" },
  { day: 140, title: "SQL: Complex Table Joins and Set Operations", focus: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER, CROSS JOIN, UNION", cat: "SQL" },
  { day: 141, title: "SQL: Subqueries, Correlated Subqueries, and Window Functions", focus: "ROW_NUMBER(), RANK(), DENSE_RANK(), PARTITION BY, Nth highest salary", cat: "SQL" },
  { day: 142, title: "Operating Systems: Process, Threads, and States", focus: "PCB, user vs kernel threads, context switching, CPU bound vs I/O bound", cat: "OS" },
  { day: 143, title: "Operating Systems: CPU Scheduling Algorithms", focus: "FCFS, SJF, Priority, Round Robin with Gantt charts and turnaround times", cat: "OS" },
  { day: 144, title: "Operating Systems: Process Synchronization and Deadlocks", focus: "Race conditions, Critical Section, Mutex, Semaphores, Banker's algorithm", cat: "OS" },
  { day: 145, title: "Operating Systems: Memory Management and Virtual Memory", focus: "Paging, Page Tables, TLB, Page Faults, Page Replacement (FIFO, LRU, Optimal)", cat: "OS" },
  { day: 146, title: "Computer Networks: OSI and TCP/IP Architecture", focus: "7 layers of OSI vs 4 layers of TCP/IP, encapsulation, devices per layer", cat: "CN" },
  { day: 147, title: "Computer Networks: Transport Layer (TCP vs UDP)", focus: "TCP 3-way handshake, 4-way termination, sliding window, congestion control", cat: "CN" },
  { day: 148, title: "Computer Networks: Application Layer Protocols and IP Subnetting", focus: "HTTP/HTTPS, DNS, DHCP, SSL/TLS handshake, IPv4 classes and CIDR subnetting", cat: "CN" },
  { day: 149, title: "Java Deep Dive: Collections Framework Internals", focus: "HashMap internal table, hash buckets, collision chaining to red-black trees, ArrayList resize", cat: "JAVA" },
  { day: 150, title: "Java Deep Dive: JVM Memory, Garbage Collection & Concurrency", focus: "Heap generations (Young, Old), GC algorithms (G1, ZGC), Thread, Runnable, synchronized", cat: "JAVA" }
];

for (const p of javaPhase4Topics) {
  javaCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Master ${p.title} and answer technical interview questions accurately`,
    tasks: [
      { t: `Deep dive study: ${p.focus}`, c: p.cat },
      { t: `Implement code / query drills demonstrating core principles`, c: p.cat },
      { t: `Answer 10 high-frequency placement interview questions on this topic`, c: "INTERVIEW" },
      { t: `Create summary cheatsheet / diagram for quick pre-interview revision`, c: "REVISION" }
    ]
  });
}

// Phase 5 Topics (Days 151-170): Interview Simulation
const javaPhase5Topics = [
  { day: 151, title: "Java Technical Interview: Core Language Rapid-Fire", focus: "String pool, immutability, equals/hashcode, collections, generics", cat: "JAVA" },
  { day: 152, title: "Company Problem Drill: Top Tier Arrays & Strings", focus: "Amazon & Microsoft high-frequency array problems", cat: "DSA" },
  { day: 153, title: "Company Problem Drill: Two Pointers & Sliding Window", focus: "Google & Uber high-frequency sliding window challenges", cat: "DSA" },
  { day: 154, title: "Company Problem Drill: Binary Trees & Graphs", focus: "Meta & Atlassian high-frequency tree and graph problems", cat: "DSA" },
  { day: 155, title: "Company Problem Drill: Dynamic Programming Placement Set", focus: "Goldman Sachs & Adobe high-frequency DP problems", cat: "DSA" },
  { day: 156, title: "Object-Oriented Design: SOLID Principles in Java", focus: "Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion", cat: "OOP" },
  { day: 157, title: "Design Patterns: Creational Patterns in Java", focus: "Singleton (thread-safe double check), Factory Method, Builder pattern", cat: "OOP" },
  { day: 158, title: "Design Patterns: Structural & Behavioral Patterns", focus: "Observer pattern, Strategy pattern, Decorator pattern with Java code", cat: "OOP" },
  { day: 159, title: "System Design: Scalability, Load Balancers, and Caching", focus: "Horizontal vs vertical scaling, Round-robin LB, Redis caching, Cache-aside", cat: "SYSTEM DESIGN" },
  { day: 160, title: "System Design: Databases, Sharding, and CAP Theorem", focus: "SQL vs NoSQL, master-slave replication, sharding keys, CAP theorem", cat: "SYSTEM DESIGN" },
  { day: 161, title: "Project Architectural Walkthrough & Tech Stack", focus: "Explaining system architecture, database schema, design decisions", cat: "PROJECTS" },
  { day: 162, title: "Project Deep Dive: Java Backend / API Design", focus: "REST API endpoints, status codes, JWT authentication, error handling", cat: "PROJECTS" },
  { day: 163, title: "Resume Polish: STAR Method & Project Bullet Points", focus: "Quantifying impact, technical keyword optimization, resume formatting", cat: "RESUME" },
  { day: 164, title: "Quantitative Aptitude: Numbers, Percentages, and Profit/Loss", focus: "HCF/LCM, divisibility, percentage shortcuts, profit-loss margins", cat: "APTITUDE" },
  { day: 165, title: "Quantitative Aptitude: Time, Speed, Distance, and Work", focus: "Relative speed, trains, pipes and cisterns, work-time ratios", cat: "APTITUDE" },
  { day: 166, title: "Logical Reasoning: Syllogisms, Blood Relations, Arrangements", focus: "Venn diagrams, family trees, circular and linear seating", cat: "APTITUDE" },
  { day: 167, title: "Verbal Ability: Reading Comprehension and Error Spotting", focus: "Grammar rules, sentence corrections, vocabulary for campus drives", cat: "APTITUDE" },
  { day: 168, title: "Rapid-Fire Core CS: 50 High-Frequency OS, DBMS, CN Questions", focus: "Fast recall of ACID, Paging, TCP vs UDP, Normalization, Deadlocks", cat: "INTERVIEW" },
  { day: 169, title: "Java Output Prediction & Tricky Snippets", focus: "50 tricky Java questions: autoboxing, polymorphism, exception flows", cat: "JAVA" },
  { day: 170, title: "Placement Diagnostic: Multi-Section Mock Assessment", focus: "90-minute timed test: 2 DSA questions + 15 Core CS + 10 Aptitude", cat: "ASSESSMENT" }
];

for (const p of javaPhase5Topics) {
  javaCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Complete placement interview prep task: ${p.title}`,
    tasks: [
      { t: `Review placement target concepts: ${p.focus}`, c: p.cat },
      { t: `Solve timed practice questions under interview conditions`, c: p.cat },
      { t: `Practice explaining solution logic aloud clearly and concisely`, c: "INTERVIEW" },
      { t: `Identify and document any knowledge gaps for final revision`, c: "REVISION" }
    ]
  });
}

// Phase 6 Topics (Days 171-180): Placement Mode
const javaPhase6Topics = [
  { day: 171, title: "Full-Length Online Assessment 1 (OA Simulation)", focus: "Timed 90-minute 3-question coding assessment under platform rules", cat: "ASSESSMENT" },
  { day: 172, title: "Full-Length Online Assessment 2 (OA Simulation)", focus: "Timed 90-minute mixed problem set (DSA + SQL + Core CS MCQs)", cat: "ASSESSMENT" },
  { day: 173, title: "Technical Mock Interview 1: Data Structures & Algorithms", focus: "Live coding simulation: think aloud, clarify constraints, optimize", cat: "INTERVIEW" },
  { day: 174, title: "Technical Mock Interview 2: Java Internals & Core CS", focus: "Deep dive questioning on Java memory, Collections, OS, and DBMS", cat: "INTERVIEW" },
  { day: 175, title: "Technical Mock Interview 3: Project & System Design", focus: "Defending resume projects, database design, scalability trade-offs", cat: "INTERVIEW" },
  { day: 176, title: "HR and Behavioral Round Mastery", focus: "Tell me about yourself, strengths, conflict resolution, company values", cat: "INTERVIEW" },
  { day: 177, title: "Targeted Weakness Remediation", focus: "Re-solving hardest problems missed throughout the 180-day journey", cat: "REVISION" },
  { day: 178, title: "High-Yield Formulae and Core CS Cheatsheet Review", focus: "Rapid revision of top 100 algorithms, complexity bounds, and SQL queries", cat: "REVISION" },
  { day: 179, title: "Final Placement War-Room Simulation", focus: "Complete mock recruitment drive from OA to final HR round", cat: "ASSESSMENT" },
  { day: 180, title: "Placement Day Readiness and Journey Completion", focus: "Final strategy, mindset calibration, resume ready, marking 180 days complete", cat: "ASSESSMENT" }
];

for (const p of javaPhase6Topics) {
  javaCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Attain placement readiness milestone: ${p.title}`,
    tasks: [
      { t: `Perform full simulation drill: ${p.focus}`, c: p.cat },
      { t: `Analyze score, speed, and accuracy metrics`, c: "ASSESSMENT" },
      { t: `Refine communication style and problem breakdown framework`, c: "INTERVIEW" },
      { t: `Lock in final placement notes and checklist`, c: "REVISION" }
    ]
  });
}

// Format each Java day with exact fields and unique task IDs
const finalJavaCurriculum = javaCurriculum.map(d => {
  const p = getPhase(d.day);
  return {
    id: d.day,
    dayNumber: d.day,
    courseId: 'java-heavy',
    phase: p.phase,
    phaseName: p.name,
    title: d.title,
    focus: d.focus,
    outcome: d.outcome,
    tasks: d.tasks.map((task, idx) => ({
      id: `java_d${pad(d.day)}_t${pad2(idx + 1)}`,
      title: task.t,
      category: task.c
    }))
  };
});

fs.writeFileSync(path.join(curriculaDir, 'java.json'), JSON.stringify(finalJavaCurriculum, null, 2), 'utf8');
console.log('Saved java.json with', finalJavaCurriculum.length, 'days');

// PYTHON 180 DAYS DEFINITION
const pythonDaysData = [
  // Phase 1: Days 1-30 (FOUNDATION)
  {
    day: 1,
    title: "Python Execution Model and First Script",
    focus: "CPython, interpreter vs compiler, bytecode (.pyc), PVM, executing main.py",
    outcome: "Install Python 3, understand bytecode and the PVM, and execute scripts via CLI and IDE",
    tasks: [
      { t: "Install Python 3.12+ LTS, verify python and pip in terminal", c: "PYTHON" },
      { t: "Understand CPython architecture: source code -> bytecode -> PVM", c: "PYTHON" },
      { t: "Write, save, and run hello_world.py using terminal command line", c: "PYTHON" },
      { t: "Explore Python interactive REPL and IDLE / VS Code environment", c: "PYTHON" },
      { t: "Learn Python comments (# and multi-line docstrings)", c: "PYTHON" },
      { t: "Initialize Git repository for Python placement preparation", c: "CN" }
    ]
  },
  {
    day: 2,
    title: "Variables, Dynamic Typing, and PEP 8",
    focus: "Dynamic typing, variables as references, id(), type(), PEP 8 style guide",
    outcome: "Master variable naming, object identity, dynamic types, and clean PEP 8 styling",
    tasks: [
      { t: "Declare variables without type annotations and understand dynamic typing", c: "PYTHON" },
      { t: "Examine memory identity using id() and check types with type() and isinstance()", c: "PYTHON" },
      { t: "Understand variable references pointing to objects in memory", c: "PYTHON" },
      { t: "Study PEP 8 conventions: snake_case, constants in UPPER_CASE, indentation", c: "PYTHON" },
      { t: "Write 6 variable assignment and identity check snippets", c: "PYTHON" }
    ]
  },
  {
    day: 3,
    title: "Numeric Types and Arithmetic Precision",
    focus: "int (arbitrary precision), float, complex, math module, float rounding",
    outcome: "Perform high-precision numeric computations and understand floating point representation",
    tasks: [
      { t: "Learn int arbitrary precision handling in Python without integer overflow", c: "PYTHON" },
      { t: "Study float precision and the IEEE 754 floating-point issue (0.1 + 0.2 != 0.3)", c: "PYTHON" },
      { t: "Use arithmetic operators: +, -, *, /, // (floor div), % (modulus), ** (power)", c: "PYTHON" },
      { t: "Use math module functions: ceil(), floor(), sqrt(), gcd(), pow()", c: "PYTHON" },
      { t: "Solve 6 numeric calculation and precision placement exercises", c: "PYTHON" }
    ]
  },
  {
    day: 4,
    title: "Booleans and Logical Evaluation",
    focus: "bool type, truthy vs falsy values, logical operators (and, or, not), short-circuiting",
    outcome: "Evaluate complex boolean expressions accurately using short-circuit logic",
    tasks: [
      { t: "Understand True and False as subclasses of int in Python", c: "PYTHON" },
      { t: "Identify falsy values: None, False, 0, 0.0, '', [], (), {}, set()", c: "PYTHON" },
      { t: "Master logical operators and, or, not and short-circuit evaluation", c: "PYTHON" },
      { t: "Compare == (value equality) vs is (reference identity)", c: "PYTHON" },
      { t: "Solve 8 boolean evaluation and condition checking problems", c: "PYTHON" }
    ]
  },
  {
    day: 5,
    title: "Strings in Python: Indexing and Slicing",
    focus: "String literals, single/double/triple quotes, positive/negative indexing, slice notation",
    outcome: "Extract and manipulate string slices using [start:stop:step] syntax effortlessly",
    tasks: [
      { t: "Understand string immutability and memory storage in Python", c: "PYTHON" },
      { t: "Use positive indexing (0 to N-1) and negative indexing (-1 to -N)", c: "PYTHON" },
      { t: "Master slicing syntax: s[start:stop:step], including reversing s[::-1]", c: "PYTHON" },
      { t: "Calculate string length with len() and iterate characters", c: "PYTHON" },
      { t: "Solve 6 string slicing and indexing placement problems", c: "PYTHON" }
    ]
  },
  {
    day: 6,
    title: "String Methods and Formatting",
    focus: "split(), join(), strip(), find(), replace(), f-strings, str.format()",
    outcome: "Format complex strings and parse textual data cleanly using modern f-strings",
    tasks: [
      { t: "Master string trimming and case methods: strip(), lower(), upper(), title()", c: "PYTHON" },
      { t: "Use split() and join() for tokenization and string reconstruction", c: "PYTHON" },
      { t: "Search and replace with find(), index(), count(), and replace()", c: "PYTHON" },
      { t: "Master formatted string literals (f-strings) with expressions and format specifiers", c: "PYTHON" },
      { t: "Solve 6 practical string formatting and parsing challenges", c: "PYTHON" }
    ]
  },
  {
    day: 7,
    title: "Conditionals: if, elif, else, and Match-Case",
    focus: "Branching with if, elif, else, nested conditions, Python 3.10+ match-case statement",
    outcome: "Build clean decision trees and utilize modern structural pattern matching",
    tasks: [
      { t: "Write multi-way decision branches with if, elif, and else blocks", c: "PYTHON" },
      { t: "Use ternary conditional expressions: x if condition else y", c: "PYTHON" },
      { t: "Learn modern structural pattern matching (match-case syntax in Python 3.10+)", c: "PYTHON" },
      { t: "Build a unit conversion and tax calculation program", c: "PYTHON" },
      { t: "Solve 6 conditional logic placement interview questions", c: "PYTHON" }
    ]
  },
  {
    day: 8,
    title: "While Loops and Sentinel Iteration",
    focus: "while loop mechanics, infinite loops, break, continue, while-else clause",
    outcome: "Control execution loops and leverage Python's unique loop-else construct",
    tasks: [
      { t: "Write while loops with proper loop variable updates to prevent infinite loops", c: "PYTHON" },
      { t: "Use break to exit loops early and continue to skip current iteration", c: "PYTHON" },
      { t: "Understand the unique while-else clause (runs if no break encountered)", c: "PYTHON" },
      { t: "Implement digit reversal and palindrome number verification using while loops", c: "DSA" },
      { t: "Solve 6 loop-based mathematical interview problems (GCD, Armstrong number)", c: "PYTHON" }
    ]
  },
  {
    day: 9,
    title: "For Loops, Iterables, and Ranges",
    focus: "for loops, iterables, range(start, stop, step), enumerate(), zip()",
    outcome: "Iterate across sequences pythonically using range, enumerate, and zip",
    tasks: [
      { t: "Understand how for loops iterate over iterable objects in Python", c: "PYTHON" },
      { t: "Use range(start, stop, step) with positive and negative steps", c: "PYTHON" },
      { t: "Use enumerate() to access index and element simultaneously", c: "PYTHON" },
      { t: "Use zip() to iterate through multiple sequences in parallel", c: "PYTHON" },
      { t: "Generate number patterns and matrix rows using nested for loops", c: "PYTHON" },
      { t: "Analyze time complexity of single and nested for loops", c: "DSA" }
    ]
  },
  {
    day: 10,
    title: "Loop Patterns and Code Optimization",
    focus: "Nested loops, breaking out of nested loops, early returns, performance tips",
    outcome: "Eliminate inefficient nested loops and write clean loop structures",
    tasks: [
      { t: "Handle nested loop exits using flags and functions with early returns", c: "PYTHON" },
      { t: "Study for-else construct for linear search validation", c: "PYTHON" },
      { t: "Solve 6 pattern printing and matrix coordinate problems", c: "PYTHON" },
      { t: "Benchmark loop execution times using time module", c: "PYTHON" },
      { t: "Review Week 1 concepts and write code summaries", c: "REVISION" }
    ]
  },
  {
    day: 11,
    title: "Functions: Definition, Arguments, and Docstrings",
    focus: "def keyword, parameters, return statements, docstrings, type hinting",
    outcome: "Write well-documented, reusable functions with modern type annotations",
    tasks: [
      { t: "Define functions with def, parameters, and multiple return values (tuples)", c: "PYTHON" },
      { t: "Write professional docstrings following Google / Sphinx style guides", c: "PYTHON" },
      { t: "Use Python type hinting (e.g., def add(a: int, b: int) -> int:)", c: "PYTHON" },
      { t: "Understand None return when no explicit return statement exists", c: "PYTHON" },
      { t: "Build a utility module containing 5 reusable mathematical functions", c: "PYTHON" }
    ]
  },
  {
    day: 12,
    title: "Advanced Arguments: *args, **kwargs, and Defaults",
    focus: "Positional-only, keyword-only, *args, **kwargs, mutable default argument trap",
    outcome: "Master flexible function signatures and avoid the mutable default argument bug",
    tasks: [
      { t: "Use *args to accept arbitrary positional arguments as a tuple", c: "PYTHON" },
      { t: "Use **kwargs to accept arbitrary keyword arguments as a dictionary", c: "PYTHON" },
      { t: "Explain the mutable default argument trap (e.g., def f(lst=[])) and fix with None", c: "PYTHON" },
      { t: "Use positional-only (/) and keyword-only (*) parameters in function headers", c: "PYTHON" },
      { t: "Solve 5 tricky argument passing and unpacking interview questions", c: "PYTHON" }
    ]
  },
  {
    day: 13,
    title: "Scope and the LEGB Rule",
    focus: "Local, Enclosing, Global, Built-in scopes, global and nonlocal keywords",
    outcome: "Trace variable resolution accurately and manage enclosing scopes safely",
    tasks: [
      { t: "Study the LEGB rule for Python variable resolution order", c: "PYTHON" },
      { t: "Differentiate local variables from global variables", c: "PYTHON" },
      { t: "Use global keyword to modify module-level variables inside functions", c: "PYTHON" },
      { t: "Use nonlocal keyword in nested functions to modify outer enclosing variables", c: "PYTHON" },
      { t: "Solve 6 scope and variable shadowing interview teasers", c: "PYTHON" }
    ]
  },
  {
    day: 14,
    title: "Lambda Functions and Functional Built-ins",
    focus: "Anonymous lambda functions, map(), filter(), functools.reduce, key sorting",
    outcome: "Write concise functional expressions and custom sort keys for placement tasks",
    tasks: [
      { t: "Define anonymous lambda functions for inline logic", c: "PYTHON" },
      { t: "Transform iterables using map() and filter() with lambdas", c: "PYTHON" },
      { t: "Aggregate sequence data using functools.reduce", c: "PYTHON" },
      { t: "Use lambda as key function in sorted() and list.sort() (multi-attribute sort)", c: "PYTHON" },
      { t: "Solve 5 complex list sorting and filtering interview tasks using lambdas", c: "PYTHON" }
    ]
  },
  {
    day: 15,
    title: "Lists: Operations and Memory Growth",
    focus: "Dynamic array implementation in CPython, append(), extend(), insert(), pop()",
    outcome: "Explain dynamic array overallocation and manipulate lists in O(1) amortized time",
    tasks: [
      { t: "Understand Python lists as arrays of contiguous pointers in CPython", c: "PYTHON" },
      { t: "Study over-allocation growth pattern of lists during append()", c: "PYTHON" },
      { t: "Compare append() vs extend() vs insert() time complexities", c: "PYTHON" },
      { t: "Implement in-place list reversal and element counting", c: "DSA" },
      { t: "Solve 5 array manipulation problems using Python lists", c: "DSA" }
    ]
  },
  {
    day: 16,
    title: "List Slicing, Copying, and References",
    focus: "Reference assignment, shallow copy (list.copy(), [:], copy.copy), deepcopy",
    outcome: "Prevent unintended side-effects when duplicating nested data structures",
    tasks: [
      { t: "Demonstrate reference assignment: a = b points to the same heap object", c: "PYTHON" },
      { t: "Create shallow copies using list.copy() or [:] and examine limitation with nested lists", c: "PYTHON" },
      { t: "Use copy.deepcopy() for true independent copies of nested data structures", c: "PYTHON" },
      { t: "Identify mutating methods (sort, reverse) vs non-mutating functions (sorted, reversed)", c: "PYTHON" },
      { t: "Solve 5 list mutation and reference quiz questions", c: "PYTHON" }
    ]
  },
  {
    day: 17,
    title: "List Comprehensions and Filtering",
    focus: "List comprehension syntax [expr for x in iterable if condition], nested comprehensions",
    outcome: "Write fast, readable list comprehensions to replace verbose for loops",
    tasks: [
      { t: "Convert standard for-loop transformations into single-line list comprehensions", c: "PYTHON" },
      { t: "Apply conditional filtering inside list comprehensions", c: "PYTHON" },
      { t: "Flatten 2D matrices into 1D lists using nested comprehensions", c: "PYTHON" },
      { t: "Benchmark list comprehension speed vs for-loop append()", c: "PYTHON" },
      { t: "Solve 6 placement string and number processing problems using comprehensions", c: "PYTHON" }
    ]
  },
  {
    day: 18,
    title: "Tuples: Immutability and Named Tuples",
    focus: "Tuple packing, unpacking, tuple as dict keys, collections.namedtuple",
    outcome: "Use tuples for immutable records and leverage named tuples for clean data models",
    tasks: [
      { t: "Understand tuple immutability and memory efficiency compared to lists", c: "PYTHON" },
      { t: "Master tuple packing and unpacking: a, b = b, a; *rest unpacking", c: "PYTHON" },
      { t: "Explain why tuples containing only hashable items can serve as dict keys", c: "PYTHON" },
      { t: "Create self-documenting data models using collections.namedtuple", c: "PYTHON" },
      { t: "Solve 5 tuple unpacking and coordinate data modeling exercises", c: "PYTHON" }
    ]
  },
  {
    day: 19,
    title: "Dictionaries: Hash Tables and Key Access",
    focus: "Hash table internals, O(1) average lookup, dict keys, .get(), .keys(), .values(), .items()",
    outcome: "Implement dictionary lookups and frequency mappings with optimal O(1) complexity",
    tasks: [
      { t: "Understand how Python dictionaries use hash tables for O(1) average lookup", c: "PYTHON" },
      { t: "Requirements for dictionary keys: must be hashable and implement __hash__", c: "PYTHON" },
      { t: "Access keys safely using .get(key, default) to avoid KeyError", c: "PYTHON" },
      { t: "Iterate across .keys(), .values(), and .items() unpacking key and value", c: "PYTHON" },
      { t: "Build a character frequency counter using standard dictionary", c: "DSA" },
      { t: "Solve LeetCode #1: Two Sum using dictionary in O(N) time", c: "DSA" }
    ]
  },
  {
    day: 20,
    title: "Dictionary Comprehensions and collections Module",
    focus: "Dict comprehensions, defaultdict, Counter, OrderedDict, setdefault()",
    outcome: "Streamline algorithmic code using collections.Counter and defaultdict",
    tasks: [
      { t: "Write dictionary comprehensions: {k: v for ... in ...}", c: "PYTHON" },
      { t: "Use collections.defaultdict to eliminate manual key initialization", c: "PYTHON" },
      { t: "Master collections.Counter for element counting and most_common() queries", c: "PYTHON" },
      { t: "Solve Valid Anagram (LeetCode #242) in 2 lines using Counter", c: "DSA" },
      { t: "Group Anagrams (LeetCode #49) using defaultdict and sorted tuple keys", c: "DSA" }
    ]
  },
  {
    day: 21,
    title: "Sets and Hash Sets",
    focus: "set type, frozenset, uniqueness, set operations (union, intersection, difference)",
    outcome: "Solve membership testing and deduplication problems in O(1) average time",
    tasks: [
      { t: "Understand set implementation as hash table with keys and dummy values", c: "PYTHON" },
      { t: "Perform set operations: union (|), intersection (&), difference (-), symmetric diff (^)", c: "PYTHON" },
      { t: "Remove duplicates from lists in O(N) time using set(lst)", c: "PYTHON" },
      { t: "Understand frozenset for immutable sets usable as dictionary keys", c: "PYTHON" },
      { t: "Solve Intersection of Two Arrays (LeetCode #349)", c: "DSA" },
      { t: "Solve Contains Duplicate (LeetCode #217)", c: "DSA" }
    ]
  },
  {
    day: 22,
    title: "Complexity of Python Built-ins",
    focus: "Time and space complexity of list, dict, set, and string operations in Python",
    outcome: "Choose optimal Python data structures based on Big-O operation costs",
    tasks: [
      { t: "Analyze list operation complexities: append vs insert(0) vs pop() vs in operator", c: "DSA" },
      { t: "Analyze dict and set operation complexities: average O(1) vs worst-case O(N)", c: "DSA" },
      { t: "Understand in operator cost: O(1) in set/dict vs O(N) in list/tuple/string", c: "DSA" },
      { t: "Analyze Timsort complexity: O(N log N) worst-case, O(N) best-case for sorted data", c: "DSA" },
      { t: "Complete Python data structure complexity comparison sheet", c: "ASSESSMENT" }
    ]
  },
  {
    day: 23,
    title: "File I/O and Context Managers",
    focus: "open(), read(), readline(), readlines(), write(), with statement context managers",
    outcome: "Read and write external files safely using Python with statements",
    tasks: [
      { t: "Open files in read ('r'), write ('w'), and append ('a') modes", c: "PYTHON" },
      { t: "Understand why with statement ensures file handles close automatically", c: "PYTHON" },
      { t: "Read large files line-by-line using file iterator without memory blowup", c: "PYTHON" },
      { t: "Parse CSV and JSON files using built-in csv and json modules", c: "PYTHON" },
      { t: "Build a student grade record reader and aggregator", c: "PYTHON" }
    ]
  },
  {
    day: 24,
    title: "Modules, Packages, and __name__",
    focus: "import, from ... import, sys.path, __name__ == '__main__', creating custom packages",
    outcome: "Structure modular Python projects and write reusable multi-file programs",
    tasks: [
      { t: "Import standard libraries and use module aliases (import math as m)", c: "PYTHON" },
      { t: "Understand __name__ variable and the if __name__ == '__main__': idiom", c: "PYTHON" },
      { t: "Create multi-file project with __init__.py defining custom package", c: "PYTHON" },
      { t: "Inspect module search paths using sys.path and PYTHONPATH", c: "PYTHON" },
      { t: "Solve 5 module importing and namespace placement questions", c: "PYTHON" }
    ]
  },
  {
    day: 25,
    title: "Exception Handling: try, except, else, finally",
    focus: "try, except, else, finally blocks, catching specific exceptions, raise keyword",
    outcome: "Handle runtime errors gracefully and guarantee resource cleanup",
    tasks: [
      { t: "Wrap risky code in try-except blocks and catch specific exceptions (ValueError, ZeroDivision)", c: "PYTHON" },
      { t: "Understand the else block (runs only if NO exception occurred)", c: "PYTHON" },
      { t: "Understand the finally block (guaranteed cleanup execution)", c: "PYTHON" },
      { t: "Raise explicit exceptions using raise ValueError('Invalid input')", c: "PYTHON" },
      { t: "Avoid bare except: anti-pattern and catch Exception properly", c: "PYTHON" },
      { t: "Solve 5 exception flow and output prediction questions", c: "PYTHON" }
    ]
  },
  {
    day: 26,
    title: "Custom Exceptions and Hierarchy",
    focus: "Inheriting from Exception, creating custom domain exceptions, exception chaining",
    outcome: "Design custom domain exception hierarchies for software projects",
    tasks: [
      { t: "Study Python built-in exception hierarchy: BaseException -> Exception", c: "PYTHON" },
      { t: "Create custom exception classes inheriting from Exception with custom messages", c: "PYTHON" },
      { t: "Implement exception chaining using raise NewException from original_error", c: "PYTHON" },
      { t: "Build a Banking system raising InsufficientBalanceError and InvalidAccountError", c: "PYTHON" },
      { t: "Write unit tests verifying exceptions are properly raised", c: "PYTHON" }
    ]
  },
  {
    day: 27,
    title: "Classes, Objects, and __init__ in Python",
    focus: "class keyword, __init__ constructor, self parameter, instance attributes",
    outcome: "Design object-oriented classes and model entities using Python conventions",
    tasks: [
      { t: "Define classes and instantiate object instances in Python", c: "OOP" },
      { t: "Understand __init__() as the object initialization hook", c: "OOP" },
      { t: "Explain the explicit self parameter and instance method invocation", c: "OOP" },
      { t: "Create instance variables and understand __dict__ attribute storage", c: "OOP" },
      { t: "Build a BankAccount class with deposit, withdraw, and balance methods", c: "OOP" },
      { t: "Solve 5 Python OOP class design interview questions", c: "OOP" }
    ]
  },
  {
    day: 28,
    title: "Class Attributes, @classmethod, and @staticmethod",
    focus: "Class variables vs instance variables, @classmethod with cls, @staticmethod",
    outcome: "Choose between instance methods, class methods, and static methods appropriately",
    tasks: [
      { t: "Define class variables shared across all instances", c: "OOP" },
      { t: "Use @classmethod with cls parameter as alternative constructors", c: "OOP" },
      { t: "Use @staticmethod for utility functions that don't access self or cls", c: "OOP" },
      { t: "Demonstrate class variable shadowing when assigning to self.var", c: "OOP" },
      { t: "Build a User class with a classmethod to parse user strings from CSV", c: "OOP" },
      { t: "Solve 6 tricky class attribute mutation output questions", c: "OOP" }
    ]
  },
  {
    day: 29,
    title: "Recursion in Python and Recursion Limit",
    focus: "Recursive call stack, base cases, sys.getrecursionlimit(), sys.setrecursionlimit()",
    outcome: "Formulate recursive solutions and understand Python's default stack recursion limits",
    tasks: [
      { t: "Write recursive functions with clear base conditions and progress step", c: "DSA" },
      { t: "Understand Python's default recursion limit (1000) and sys.setrecursionlimit()", c: "PYTHON" },
      { t: "Compute factorial, Fibonacci, and power(x, n) recursively", c: "DSA" },
      { t: "Implement recursive binary search on sorted Python list", c: "DSA" },
      { t: "Trace call stack frames and identify potential RecursionError pitfalls", c: "DSA" }
    ]
  },
  {
    day: 30,
    title: "Foundation Milestone Assessment",
    focus: "Comprehensive Phase 1 evaluation: Python syntax, OOP design, and basic DSA",
    outcome: "Validate complete mastery of Python fundamentals before progressing to Core DSA",
    tasks: [
      { t: "Complete 30-question Python fundamentals & OOP diagnostic assessment", c: "ASSESSMENT" },
      { t: "Implement a complete Student Placement Management OOP application in Python", c: "OOP" },
      { t: "Solve 3 timed coding problems on strings, lists, and recursion", c: "DSA" },
      { t: "Review and remediate all missed questions from Phase 1 test", c: "REVISION" },
      { t: "Commit code and update placement preparation documentation", c: "PROJECTS" }
    ]
  }
];

const pythonCurriculum = [...pythonDaysData];

// Phase 2 Topics for Python (Days 31-75)
const pythonPhase2Topics = [
  { day: 31, title: "Arrays: Prefix Sum Array and Range Sums", focus: "O(1) range queries, prefix arrays with itertools.accumulate", lc: "#303 Range Sum Query", t: "Prefix Sum" },
  { day: 32, title: "Arrays: Difference Array for Range Updates", focus: "O(1) range updates, flight bookings allocation", lc: "#1109 Corporate Flight Bookings", t: "Difference Array" },
  { day: 33, title: "Arrays: Kadane's Algorithm for Max Subarray", focus: "Tracking current max and global max in O(N) time", lc: "#53 Maximum Subarray", t: "Kadane's" },
  { day: 34, title: "Arrays: Dutch National Flag Algorithm", focus: "3-way partitioning of 0s, 1s, and 2s in-place", lc: "#75 Sort Colors", t: "DNF Partition" },
  { day: 35, title: "Arrays: Boyer-Moore Voting Algorithm", focus: "Finding majority element with O(N) time and O(1) auxiliary space", lc: "#169 Majority Element", t: "Voting Algorithm" },
  { day: 36, title: "Two Pointers: Sorted Two Sum and Pair Difference", focus: "Two pointers from ends on sorted list", lc: "#167 Two Sum II", t: "Two Pointers" },
  { day: 37, title: "Two Pointers: Trapping Rain Water", focus: "Left max and right max two-pointer elevation trapping", lc: "#42 Trapping Rain Water", t: "Trapping Rain Water" },
  { day: 38, title: "Two Pointers: Container With Most Water", focus: "Greedy shrinking width two-pointer strategy", lc: "#11 Container With Most Water", t: "Most Water" },
  { day: 39, title: "Two Pointers: 3Sum and 4Sum Optimization", focus: "Sorting, fixed pivot, two pointers with duplicate skips", lc: "#15 3Sum", t: "3Sum/4Sum" },
  { day: 40, title: "Two Pointers: In-Place Duplicates Removal", focus: "Slow and fast write pointers in-place", lc: "#26 Remove Duplicates", t: "In-Place List" },
  { day: 41, title: "Sliding Window: Fixed Size Window Maximums", focus: "Sliding window sum with fixed width K", lc: "#643 Max Average Subarray", t: "Fixed Window" },
  { day: 42, title: "Sliding Window: First Negative Number in Window K", focus: "Queue-based tracking of negative indices", lc: "First Negative in Window K", t: "Negative Window" },
  { day: 43, title: "Sliding Window: Longest Substring Without Repeats", focus: "Dynamic window size, dictionary of last seen indices", lc: "#3 Longest Substring Without Repeating", t: "Variable Window" },
  { day: 44, title: "Sliding Window: Minimum Window Substring", focus: "Counter frequency tracking, expanding and shrinking window", lc: "#76 Minimum Window Substring", t: "Min Window" },
  { day: 45, title: "Sliding Window: Longest Repeating Character Replacement", focus: "Window size minus max frequency <= K flips", lc: "#424 Longest Repeating Character", t: "Window Flips" },
  { day: 46, title: "Binary Search: Core Implementation in Python", focus: "Iterative search, mid calculation, boundary updates", lc: "#704 Binary Search", t: "Binary Search" },
  { day: 47, title: "Binary Search: bisect Module & Bounds", focus: "bisect.bisect_left and bisect_right, manual bounds implementation", lc: "#34 Find First and Last Position", t: "Bisect Module" },
  { day: 48, title: "Binary Search: Rotated Sorted Array Search", focus: "Determining sorted half and binary search condition", lc: "#33 Search in Rotated Sorted Array", t: "Rotated Array" },
  { day: 49, title: "Binary Search: Peak Element and Single Non-Duplicate", focus: "Binary search on unsorted / duplicate paired arrays", lc: "#162 Find Peak Element", t: "Peak Search" },
  { day: 50, title: "Binary Search on Answer: Koko Eating Bananas", focus: "Search on answer range [1, max(piles)] with helper function", lc: "#875 Koko Eating Bananas", t: "Search on Answer" },
  { day: 51, title: "Binary Search on Answer: Capacity to Ship Packages", focus: "Monotonic condition feasibility check for allocation", lc: "#1011 Capacity to Ship Packages", t: "Capacity Search" },
  { day: 52, title: "2D Matrices: Spiral Order Traversal", focus: "Boundary manipulation in 2D lists", lc: "#54 Spiral Matrix", t: "Spiral Matrix" },
  { day: 53, title: "2D Matrices: Rotate Matrix 90 Degrees In-Place", focus: "Matrix transpose using zip(*matrix) vs in-place swap", lc: "#48 Rotate Image", t: "Rotate Matrix" },
  { day: 54, title: "2D Matrices: Search in 2D Sorted Matrix", focus: "Staircase search from top-right corner in O(M+N)", lc: "#240 Search a 2D Matrix II", t: "Matrix Search" },
  { day: 55, title: "2D Matrices: Set Matrix Zeroes", focus: "O(1) auxiliary space using first row and column as flags", lc: "#73 Set Matrix Zeroes", t: "Zero Matrix" },
  { day: 56, title: "Singly Linked List: ListNode Class and Traversal", focus: "Python ListNode implementation, linking nodes, traversal loop", lc: "Custom SLL in Python", t: "LinkedList Intro" },
  { day: 57, title: "Singly Linked List: Insertion and Deletion", focus: "Head, tail, position insertions and node deletions", lc: "SLL CRUD Methods", t: "LL Operations" },
  { day: 58, title: "Singly Linked List: Reversal (Iterative & Recursive)", focus: "Prev, curr, next pointer manipulation in Python", lc: "#206 Reverse Linked List", t: "Reverse LL" },
  { day: 59, title: "Singly Linked List: Middle Node (Tortoise & Hare)", focus: "Slow and fast pointer traversal", lc: "#876 Middle of the Linked List", t: "Slow Fast Pointers" },
  { day: 60, title: "Singly Linked List: Cycle Detection and Cycle Start", focus: "Floyd's Tortoise and Hare algorithm in Python", lc: "#141 & #142 Linked List Cycle", t: "Cycle Detection" },
  { day: 61, title: "Singly Linked List: Merge Two Sorted Lists", focus: "Dummy head node pattern in Python", lc: "#21 Merge Two Sorted Lists", t: "Merge Lists" },
  { day: 62, title: "Singly Linked List: Remove Nth Node from End", focus: "Two-pointer gap approach for single-pass deletion", lc: "#19 Remove Nth Node From End", t: "Remove Nth" },
  { day: 63, title: "Singly Linked List: Palindrome Linked List", focus: "Find middle, reverse right half, compare values", lc: "#234 Palindrome Linked List", t: "Palindrome LL" },
  { day: 64, title: "Doubly Linked List: Implementation in Python", focus: "Bidirectional pointers prev and next", lc: "Custom DLL in Python", t: "Doubly LL" },
  { day: 65, title: "Linked List: Reverse Nodes in K-Group", focus: "Counting nodes, reversing sub-lists, reconnecting heads", lc: "#25 Reverse Nodes in k-Group", t: "K-Group Reverse" },
  { day: 66, title: "Stacks: Implementation using List and deque", focus: "LIFO semantics, append() and pop(), deque thread safety", lc: "Stack in Python", t: "Stack Intro" },
  { day: 67, title: "Stacks: Valid Parentheses Matching", focus: "Dictionary mapping closing to opening brackets", lc: "#20 Valid Parentheses", t: "Valid Parentheses" },
  { day: 68, title: "Stacks: Min Stack with O(1) Retrievals", focus: "Tracking minimums with dual stack or paired values", lc: "#155 Min Stack", t: "Min Stack" },
  { day: 69, title: "Stacks: Next Greater Element (Monotonic Stack)", focus: "Monotonic decreasing stack for next greater problem", lc: "#496 Next Greater Element I", t: "Monotonic Stack" },
  { day: 70, title: "Stacks: Largest Rectangle in Histogram", focus: "Monotonic increasing stack tracking indices and heights", lc: "#84 Largest Rectangle in Histogram", t: "Histogram Rect" },
  { day: 71, title: "Queues: Implementation using collections.deque", focus: "FIFO semantics, append() and popleft() in O(1) time", lc: "#622 Design Circular Queue", t: "Queue Intro" },
  { day: 72, title: "Queues: Implement Queue using Stacks", focus: "Two stack simulation with amortized O(1) pop", lc: "#232 Implement Queue using Stacks", t: "Queue using Stacks" },
  { day: 73, title: "Queues: Sliding Window Maximum via Monotonic Deque", focus: "deque maintaining decreasing indices of values", lc: "#239 Sliding Window Maximum", t: "Deque Window Max" },
  { day: 74, title: "Queues: First Non-Repeating Character in Stream", focus: "deque paired with frequency Counter", lc: "First Non-Repeating Character", t: "Stream Queue" },
  { day: 75, title: "Phase 2 Milestone: Core DSA Comprehensive Assessment", focus: "Timed 3-problem assessment covering Arrays, LL, Stacks, Queues", lc: "3-Problem Timed Test", t: "Phase 2 Exam" }
];

for (const p of pythonPhase2Topics) {
  pythonCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Master ${p.t} in Python and solve placement problems with optimal time/space complexity`,
    tasks: [
      { t: `Study algorithmic concepts: ${p.focus}`, c: "DSA" },
      { t: `Implement optimal solution in Python for ${p.lc}`, c: "DSA" },
      { t: `Analyze time and space complexity with edge cases`, c: "DSA" },
      { t: `Solve 2 related variations from LeetCode / GeeksforGeeks`, c: "DSA" },
      { t: `Write idiomatic Python code with type annotations and docstrings`, c: "PYTHON" }
    ]
  });
}

// Phase 3 Topics for Python (Days 76-120)
const pythonPhase3Topics = [
  { day: 76, title: "Recursion: Subsequence Generation Patterns", focus: "Pick / Don't Pick recursion tree, generating power set", lc: "#78 Subsets" },
  { day: 77, title: "Backtracking: Subsets II and Handling Duplicates", focus: "Sorting list, skipping duplicate elements in recursion", lc: "#90 Subsets II" },
  { day: 78, title: "Backtracking: Permutations and Combination Sum", focus: "State exploration, swapping, element frequency counters", lc: "#46 Permutations & #39 Combination Sum" },
  { day: 79, title: "Backtracking: Word Search on 2D Grid", focus: "DFS path exploration, visited set or in-place character mutation", lc: "#79 Word Search" },
  { day: 80, title: "Backtracking: N-Queens Problem and Sudoku Solver", focus: "Constraint satisfaction, column and diagonal sets", lc: "#51 N-Queens & #37 Sudoku Solver" },
  { day: 81, title: "Binary Trees: TreeNode Structure and Traversals", focus: "Recursive & iterative inorder, preorder, postorder traversals", lc: "#94, #144, #145 Tree Traversals" },
  { day: 82, title: "Binary Trees: Level Order Traversal (BFS)", focus: "collections.deque based level order and zigzag traversals", lc: "#102 Level Order & #103 Zigzag" },
  { day: 83, title: "Binary Trees: Height, Depth, and Balanced Tree Check", focus: "Maximum depth, minimum depth, O(N) bottom-up height check", lc: "#104 Max Depth & #110 Balanced Binary Tree" },
  { day: 84, title: "Binary Trees: Diameter and Maximum Path Sum", focus: "Subtree height recursion with global max update", lc: "#543 Diameter & #124 Max Path Sum" },
  { day: 85, title: "Binary Trees: Symmetric, Inverted, and Same Trees", focus: "Mirrored recursion and structural equivalence check", lc: "#101 Symmetric Tree & #226 Invert Tree" },
  { day: 86, title: "Binary Trees: Lowest Common Ancestor (LCA)", focus: "Post-order recursive search for target nodes in binary tree", lc: "#236 Lowest Common Ancestor" },
  { day: 87, title: "Binary Trees: Vertical Order and Top/Bottom Views", focus: "Column coordinates with defaultdict(list) and queue", lc: "#987 Vertical Order Traversal" },
  { day: 88, title: "Binary Trees: Boundary Traversal and Views", focus: "Left boundary, leaf nodes, right boundary reversed in Python", lc: "Boundary Traversal of Binary Tree" },
  { day: 89, title: "Binary Trees: Construct from Preorder and Inorder", focus: "Inorder index mapping via dictionary, recursive partition", lc: "#105 Construct Binary Tree" },
  { day: 90, title: "Binary Trees: Serialization and Deserialization", focus: "String serialization with delimiters, recursive deserialization", lc: "#297 Serialize and Deserialize Binary Tree" },
  { day: 91, title: "Binary Search Trees: Properties, Search, and Insert", focus: "BST invariant: left < root < right, logarithmic operations", lc: "#700 Search & #701 Insert in BST" },
  { day: 92, title: "Binary Search Trees: Validate BST and Deletion", focus: "Valid range bounds [min, max], handling 3 deletion cases", lc: "#98 Validate BST & #450 Delete Node" },
  { day: 93, title: "Binary Search Trees: LCA and Sorted Array to BST", focus: "Directional branch pruning based on node values", lc: "#235 LCA of BST & #108 Convert Sorted Array" },
  { day: 94, title: "Binary Search Trees: Kth Smallest Element in BST", focus: "Inorder traversal property of BST, iterative stack traversal", lc: "#230 Kth Smallest Element in BST" },
  { day: 95, title: "Binary Search Trees: Inorder Successor and Predecessor", focus: "BST navigation using property to find successor/predecessor", lc: "Inorder Successor in BST" },
  { day: 96, title: "Heaps: Binary Heap Fundamentals and heapq Module", focus: "heapq.heappush, heapq.heappop, heapq.heapify (Min-Heap by default)", lc: "Python heapq Module Mastery" },
  { day: 97, title: "Heaps: Implementing Max-Heap and Custom Priority", focus: "Inverting values (-val) and using priority tuples (priority, item)", lc: "Max-Heap and Custom Comparators" },
  { day: 98, title: "Heaps: Kth Largest Element and K Closest Points", focus: "Min-heap of size K, Euclidean distance sorting with heapq", lc: "#215 Kth Largest & #973 K Closest Points" },
  { day: 99, title: "Heaps: Top K Frequent Elements", focus: "Counter combined with heapq.nlargest / min-heap", lc: "#347 Top K Frequent Elements" },
  { day: 100, title: "Heaps: Merge K Sorted Lists and Median in Stream", focus: "heapq for K-way merge, dual heaps (small max-heap, large min-heap)", lc: "#23 Merge k Lists & #295 Find Median" },
  { day: 101, title: "Greedy: Activity Selection and Fractional Knapsack", focus: "Sorting by finish time and value/weight ratio", lc: "Fractional Knapsack Problem" },
  { day: 102, title: "Greedy: Jump Game I and Jump Game II", focus: "Tracking max reachable index, BFS-style interval jump count", lc: "#55 Jump Game & #45 Jump Game II" },
  { day: 103, title: "Greedy: Gas Station Circular Tour", focus: "Net gas deficit tracking, resetting start station", lc: "#134 Gas Station" },
  { day: 104, title: "Greedy: Minimum Platforms for Trains", focus: "Sorting arrival and departure timelines, tracking simultaneous trains", lc: "Minimum Platforms GFG" },
  { day: 105, title: "Greedy: Job Sequencing and Huffman Coding Basics", focus: "Slot allocation with max profit greedily in Python", lc: "Job Sequencing Problem" },
  { day: 106, title: "Intervals: Merge Overlapping Intervals", focus: "Sort by start time, merging overlapping end intervals", lc: "#56 Merge Intervals" },
  { day: 107, title: "Intervals: Insert Interval into Sorted List", focus: "Three-phase interval sweep: before, overlap merge, after", lc: "#57 Insert Interval" },
  { day: 108, title: "Intervals: Non-overlapping Intervals & Meeting Rooms", focus: "Minimizing removals by choosing earliest ending intervals", lc: "#435 Non-overlapping Intervals" },
  { day: 109, title: "Tries: Implementation of Prefix Tree", focus: "TrieNode with dictionary children, is_end flag, insert and search", lc: "#208 Implement Trie (Prefix Tree)" },
  { day: 110, title: "Tries: Word Search II and Autocomplete", focus: "Backtracking on 2D grid combined with Trie prefix pruning", lc: "#212 Word Search II" },
  { day: 111, title: "Tries: Maximum XOR of Two Numbers in Array", focus: "Bitwise Trie (branches 0 and 1), maximizing opposite bit choices", lc: "#421 Maximum XOR of Two Numbers" },
  { day: 112, title: "Bit Manipulation: Bitwise Operators in Python", focus: "AND (&), OR (|), XOR (^), NOT (~), shifts (<<, >>) in Python", lc: "Bit Operations Cheatsheet" },
  { day: 113, title: "Bit Manipulation: Count Set Bits & Power of Two", focus: "Brian Kernighan's Algorithm (n & (n-1)), n & -n (lowest set bit)", lc: "#191 Number of 1 Bits & #231 Power of Two" },
  { day: 114, title: "Bit Manipulation: Single Number I, II, and III", focus: "XOR cancellation, bit position sums modulo 3, bucket partition", lc: "#136 Single Number & #260 Single Number III" },
  { day: 115, title: "Bit Manipulation: Subsets Generation via Bitmask", focus: "Iterating bitmasks from 0 to 2^N - 1 to generate power set", lc: "#78 Subsets using Bitmask" },
  { day: 116, title: "Dynamic Programming: Memoization with @lru_cache", focus: "functools.lru_cache / @cache for automatic top-down memoization", lc: "#509 Fibonacci Number" },
  { day: 117, title: "Dynamic Programming: Climbing Stairs & Min Cost", focus: "State recurrence dp[i] = dp[i-1] + dp[i-2], space optimization", lc: "#70 Climbing Stairs & #746 Min Cost" },
  { day: 118, title: "Dynamic Programming: House Robber I & II", focus: "Pick vs skip recurrence, handling circular street arrays", lc: "#198 House Robber & #213 House Robber II" },
  { day: 119, title: "Dynamic Programming: Coin Change Problems", focus: "Min coins (fewest) and combination count (unbounded knapsack)", lc: "#322 Coin Change & #518 Coin Change II" },
  { day: 120, title: "Phase 3 Milestone: Advanced DSA Assessment", focus: "Mid-term comprehensive coding test on Trees, BST, Heaps, Greedy, DP", lc: "3-Problem Mid-Term Exam" }
];

for (const p of pythonPhase3Topics) {
  pythonCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Master advanced data structure topic and solve ${p.lc} in Python`,
    tasks: [
      { t: `Understand core concepts: ${p.focus}`, c: "DSA" },
      { t: `Implement optimal Python solution for ${p.lc}`, c: "DSA" },
      { t: `Analyze recurrence relation, time complexity, and call stack memory`, c: "DSA" },
      { t: `Solve 1 follow-up / hard variation problem`, c: "DSA" },
      { t: `Record placement notes and edge cases in preparation sheet`, c: "REVISION" }
    ]
  });
}

// Phase 4 Topics for Python (Days 121-150): Interview Level & CS Core
const pythonPhase4Topics = [
  { day: 121, title: "Graphs: Graph Representation with defaultdict", focus: "Adjacency list using collections.defaultdict(list), weighted graphs", cat: "DSA" },
  { day: 122, title: "Graphs: Breadth First Search (BFS) and Depth First Search (DFS)", focus: "Queue-based BFS with deque, recursion-based DFS with visited set", cat: "DSA" },
  { day: 123, title: "Graphs: Cycle Detection in Undirected Graph", focus: "Parent tracking in BFS and DFS for undirected cycle detection", cat: "DSA" },
  { day: 124, title: "Graphs: Cycle Detection in Directed Graph", focus: "Recursion call stack set and in-degree Kahn's algorithm", cat: "DSA" },
  { day: 125, title: "Graphs: Topological Sorting (DFS & Kahn's BFS)", focus: "DAG ordering, in-degree calculation, Course Schedule problem", cat: "DSA" },
  { day: 126, title: "Graphs: Shortest Path in Undirected and DAGs", focus: "Unit weight BFS shortest path, topological sort DAG relaxation", cat: "DSA" },
  { day: 127, title: "Graphs: Dijkstra's Algorithm using heapq", focus: "Min-heap priority queue with distance map, edge relaxation", cat: "DSA" },
  { day: 128, title: "Graphs: Bellman-Ford and Floyd-Warshall Algorithms", focus: "Negative weight cycle detection, all-pairs shortest path matrix", cat: "DSA" },
  { day: 129, title: "Graphs: Disjoint Set Union (Union-Find)", focus: "Find with path compression, union by rank, cycle detection", cat: "DSA" },
  { day: 130, title: "Graphs: Minimum Spanning Tree (Kruskal's & Prim's)", focus: "Greedy edge sorting with DSU, heapq Prim's algorithm", cat: "DSA" },
  { day: 131, title: "2D Dynamic Programming: Unique Paths on Grid", focus: "Grid transition dp[i][j] = dp[i-1][j] + dp[i][j-1], obstacle handling", cat: "DSA" },
  { day: 132, title: "2D Dynamic Programming: Minimum Path Sum", focus: "Matrix DP boundary filling, path reconstruction", cat: "DSA" },
  { day: 133, title: "2D Dynamic Programming: 0/1 Knapsack & Subset Sum", focus: "Capacity vs items 2D table, 1D space optimization backward loop", cat: "DSA" },
  { day: 134, title: "2D Dynamic Programming: Longest Common Subsequence", focus: "String matching matrix, Edit Distance operations (insert, delete, replace)", cat: "DSA" },
  { day: 135, title: "Dynamic Programming: Longest Increasing Subsequence (LIS)", focus: "O(N²) DP vs O(N log N) patience sorting using bisect", cat: "DSA" },
  { day: 136, title: "DBMS: Architecture, Relational Model, and ER Diagrams", focus: "Entity-Relationship model, keys (candidate, primary, foreign), 3-tier architecture", cat: "DBMS" },
  { day: 137, title: "DBMS: Functional Dependencies and Normalization", focus: "1NF, 2NF, 3NF, BCNF anomalies, lossless decomposition", cat: "DBMS" },
  { day: 138, title: "DBMS: Transactions, ACID Properties, and Concurrency", focus: "Atomicity, Consistency, Isolation, Durability, 2PL, Deadlocks, Isolation levels", cat: "DBMS" },
  { day: 139, title: "SQL: DDL, DML, DQL and Aggregate Grouping", focus: "CREATE, ALTER, DROP, SELECT, WHERE vs HAVING, GROUP BY, aggregates", cat: "SQL" },
  { day: 140, title: "SQL: Complex Table Joins and Set Operations", focus: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER, CROSS JOIN, UNION", cat: "SQL" },
  { day: 141, title: "SQL: Subqueries, Correlated Subqueries, and Window Functions", focus: "ROW_NUMBER(), RANK(), DENSE_RANK(), PARTITION BY, Nth highest salary", cat: "SQL" },
  { day: 142, title: "Operating Systems: Process, Threads, and States", focus: "PCB, user vs kernel threads, context switching, CPU bound vs I/O bound", cat: "OS" },
  { day: 143, title: "Operating Systems: CPU Scheduling Algorithms", focus: "FCFS, SJF, Priority, Round Robin with Gantt charts and turnaround times", cat: "OS" },
  { day: 144, title: "Operating Systems: Process Synchronization and Deadlocks", focus: "Race conditions, Critical Section, Mutex, Semaphores, Banker's algorithm", cat: "OS" },
  { day: 145, title: "Operating Systems: Memory Management and Virtual Memory", focus: "Paging, Page Tables, TLB, Page Faults, Page Replacement (FIFO, LRU, Optimal)", cat: "OS" },
  { day: 146, title: "Computer Networks: OSI and TCP/IP Architecture", focus: "7 layers of OSI vs 4 layers of TCP/IP, encapsulation, devices per layer", cat: "CN" },
  { day: 147, title: "Computer Networks: Transport Layer (TCP vs UDP)", focus: "TCP 3-way handshake, 4-way termination, sliding window, congestion control", cat: "CN" },
  { day: 148, title: "Computer Networks: Application Layer Protocols and IP Subnetting", focus: "HTTP/HTTPS, DNS, DHCP, SSL/TLS handshake, IPv4 classes and CIDR subnetting", cat: "CN" },
  { day: 149, title: "Python Deep Dive: Iterators, Generators, and Closures", focus: "__iter__, __next__, yield keyword, generator expressions, closure functions", cat: "PYTHON" },
  { day: 150, title: "Python Deep Dive: Decorators, Dunder Methods & GIL", focus: "Function decorators, @functools.wraps, __repr__, __eq__, __len__, Global Interpreter Lock", cat: "PYTHON" }
];

for (const p of pythonPhase4Topics) {
  pythonCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Master ${p.title} and answer technical interview questions accurately`,
    tasks: [
      { t: `Deep dive study: ${p.focus}`, c: p.cat },
      { t: `Implement code / query drills demonstrating core principles`, c: p.cat },
      { t: `Answer 10 high-frequency placement interview questions on this topic`, c: "INTERVIEW" },
      { t: `Create summary cheatsheet / diagram for quick pre-interview revision`, c: "REVISION" }
    ]
  });
}

// Phase 5 Topics for Python (Days 151-170): Interview Simulation
const pythonPhase5Topics = [
  { day: 151, title: "Python Technical Interview: Language Features Rapid-Fire", focus: "GIL, mutability, copy vs deepcopy, decorators, generators, dict internals", cat: "PYTHON" },
  { day: 152, title: "Company Problem Drill: Top Tier Arrays & Strings", focus: "Amazon & Microsoft high-frequency array problems in Python", cat: "DSA" },
  { day: 153, title: "Company Problem Drill: Two Pointers & Sliding Window", focus: "Google & Uber high-frequency sliding window challenges", cat: "DSA" },
  { day: 154, title: "Company Problem Drill: Binary Trees & Graphs", focus: "Meta & Atlassian high-frequency tree and graph problems", cat: "DSA" },
  { day: 155, title: "Company Problem Drill: Dynamic Programming Placement Set", focus: "Goldman Sachs & Adobe high-frequency DP problems", cat: "DSA" },
  { day: 156, title: "Object-Oriented Design: SOLID Principles in Python", focus: "Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion", cat: "OOP" },
  { day: 157, title: "Design Patterns: Creational Patterns in Python", focus: "Singleton, Factory Method, Builder pattern using Python idioms", cat: "OOP" },
  { day: 158, title: "Design Patterns: Structural & Behavioral Patterns", focus: "Observer pattern, Strategy pattern, Adapter pattern in Python", cat: "OOP" },
  { day: 159, title: "System Design: Scalability, Load Balancers, and Caching", focus: "Horizontal vs vertical scaling, Round-robin LB, Redis caching, Cache-aside", cat: "SYSTEM DESIGN" },
  { day: 160, title: "System Design: Databases, Sharding, and CAP Theorem", focus: "SQL vs NoSQL, master-slave replication, sharding keys, CAP theorem", cat: "SYSTEM DESIGN" },
  { day: 161, title: "Project Architectural Walkthrough & Tech Stack", focus: "Explaining system architecture, database schema, design decisions", cat: "PROJECTS" },
  { day: 162, title: "Project Deep Dive: Python Backend (FastAPI / Django / Flask)", focus: "REST API endpoints, status codes, Pydantic schemas, JWT authentication", cat: "PROJECTS" },
  { day: 163, title: "Resume Polish: STAR Method & Project Bullet Points", focus: "Quantifying impact, technical keyword optimization, resume formatting", cat: "RESUME" },
  { day: 164, title: "Quantitative Aptitude: Numbers, Percentages, and Profit/Loss", focus: "HCF/LCM, divisibility, percentage shortcuts, profit-loss margins", cat: "APTITUDE" },
  { day: 165, title: "Quantitative Aptitude: Time, Speed, Distance, and Work", focus: "Relative speed, trains, pipes and cisterns, work-time ratios", cat: "APTITUDE" },
  { day: 166, title: "Logical Reasoning: Syllogisms, Blood Relations, Arrangements", focus: "Venn diagrams, family trees, circular and linear seating", cat: "APTITUDE" },
  { day: 167, title: "Verbal Ability: Reading Comprehension and Error Spotting", focus: "Grammar rules, sentence corrections, vocabulary for campus drives", cat: "APTITUDE" },
  { day: 168, title: "Rapid-Fire Core CS: 50 High-Frequency OS, DBMS, CN Questions", focus: "Fast recall of ACID, Paging, TCP vs UDP, Normalization, Deadlocks", cat: "INTERVIEW" },
  { day: 169, title: "Python Output Prediction & Tricky Snippets", focus: "50 tricky Python questions: mutable defaults, closures, LEGB scope, generator state", cat: "PYTHON" },
  { day: 170, title: "Placement Diagnostic: Multi-Section Mock Assessment", focus: "90-minute timed test: 2 DSA questions + 15 Core CS + 10 Aptitude", cat: "ASSESSMENT" }
];

for (const p of pythonPhase5Topics) {
  pythonCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Complete placement interview prep task: ${p.title}`,
    tasks: [
      { t: `Review placement target concepts: ${p.focus}`, c: p.cat },
      { t: `Solve timed practice questions under interview conditions`, c: p.cat },
      { t: `Practice explaining solution logic aloud clearly and concisely`, c: "INTERVIEW" },
      { t: `Identify and document any knowledge gaps for final revision`, c: "REVISION" }
    ]
  });
}

// Phase 6 Topics for Python (Days 171-180): Placement Mode
const pythonPhase6Topics = [
  { day: 171, title: "Full-Length Online Assessment 1 (OA Simulation)", focus: "Timed 90-minute 3-question coding assessment under platform rules", cat: "ASSESSMENT" },
  { day: 172, title: "Full-Length Online Assessment 2 (OA Simulation)", focus: "Timed 90-minute mixed problem set (DSA + SQL + Core CS MCQs)", cat: "ASSESSMENT" },
  { day: 173, title: "Technical Mock Interview 1: Data Structures & Algorithms", focus: "Live coding simulation in Python: think aloud, clarify constraints, optimize", cat: "INTERVIEW" },
  { day: 174, title: "Technical Mock Interview 2: Python Advanced Concepts & Core CS", focus: "Deep dive questioning on Python memory, GIL, Collections, OS, and DBMS", cat: "INTERVIEW" },
  { day: 175, title: "Technical Mock Interview 3: Project & System Design", focus: "Defending resume projects, API design, scalability trade-offs", cat: "INTERVIEW" },
  { day: 176, title: "HR and Behavioral Round Mastery", focus: "Tell me about yourself, strengths, conflict resolution, company values", cat: "INTERVIEW" },
  { day: 177, title: "Targeted Weakness Remediation", focus: "Re-solving hardest problems missed throughout the 180-day journey", cat: "REVISION" },
  { day: 178, title: "High-Yield Formulae and Core CS Cheatsheet Review", focus: "Rapid revision of top 100 algorithms, complexity bounds, and SQL queries", cat: "REVISION" },
  { day: 179, title: "Final Placement War-Room Simulation", focus: "Complete mock recruitment drive from OA to final HR round", cat: "ASSESSMENT" },
  { day: 180, title: "Placement Day Readiness and Journey Completion", focus: "Final strategy, mindset calibration, resume ready, marking 180 days complete", cat: "ASSESSMENT" }
];

for (const p of pythonPhase6Topics) {
  pythonCurriculum.push({
    day: p.day,
    title: p.title,
    focus: p.focus,
    outcome: `Attain placement readiness milestone: ${p.title}`,
    tasks: [
      { t: `Perform full simulation drill: ${p.focus}`, c: p.cat },
      { t: `Analyze score, speed, and accuracy metrics`, c: "ASSESSMENT" },
      { t: `Refine communication style and problem breakdown framework`, c: "INTERVIEW" },
      { t: `Lock in final placement notes and checklist`, c: "REVISION" }
    ]
  });
}

// Format each Python day with exact fields and unique task IDs
const finalPythonCurriculum = pythonCurriculum.map(d => {
  const p = getPhase(d.day);
  return {
    id: d.day,
    dayNumber: d.day,
    courseId: 'python',
    phase: p.phase,
    phaseName: p.name,
    title: d.title,
    focus: d.focus,
    outcome: d.outcome,
    tasks: d.tasks.map((task, idx) => ({
      id: `py_d${pad(d.day)}_t${pad2(idx + 1)}`,
      title: task.t,
      category: task.c
    }))
  };
});

fs.writeFileSync(path.join(curriculaDir, 'python.json'), JSON.stringify(finalPythonCurriculum, null, 2), 'utf8');
console.log('Saved python.json with', finalPythonCurriculum.length, 'days');

console.log('All 3 curricula generated successfully!');
