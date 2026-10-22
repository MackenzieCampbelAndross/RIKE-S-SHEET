import fs from 'fs';
import path from 'path';

// Parse raw spec string and output full typed JSON and TS
// We'll write the raw text blocks and construct full curriculum
const rawData = {
  1: {
    title: "C++ Foundations I",
    focus: "Programming fundamentals",
    tasks: [
      "Install and verify C++ compiler and IDE",
      "Learn variables and constants",
      "Learn int, long long, float, double, char, bool",
      "Learn input and output using cin and cout",
      "Learn arithmetic, relational and logical operators",
      "Write 5 tiny programs using input and output",
      "Solve 5 beginner programming problems",
      "Learn what time complexity means",
      "Learn O(1), O(n), O(n²)",
      "Create the placement-prep Git repository"
    ]
  },
  2: {
    title: "C++ Foundations II",
    focus: "Conditions and loops",
    tasks: [
      "Learn if, else if and else",
      "Learn switch",
      "Learn for, while and do while",
      "Learn break and continue",
      "Write 10 loop based programs",
      "Solve 5 number pattern problems",
      "Explain the complexity of 5 loop snippets",
      "Review Day 1"
    ]
  },
  3: {
    title: "Functions",
    focus: "Breaking problems into reusable logic",
    tasks: [
      "Learn function declaration and definition",
      "Learn parameters and return values",
      "Learn pass by value",
      "Learn local and global scope",
      "Write 10 functions",
      "Solve 5 function based problems",
      "Explain why functions improve code quality",
      "Review loops and complexity"
    ]
  },
  4: {
    title: "Arrays I",
    focus: "Array fundamentals",
    tasks: [
      "Learn one dimensional arrays",
      "Learn traversal",
      "Find maximum and minimum",
      "Calculate sum and average",
      "Reverse an array",
      "Find second largest element",
      "Solve 7 array problems",
      "Explain array time complexity"
    ]
  },
  5: {
    title: "Arrays II",
    focus: "Array problem solving",
    tasks: [
      "Learn insertion and deletion concepts",
      "Learn frequency counting",
      "Learn duplicate detection",
      "Solve 8 array problems",
      "Implement array reversal from scratch",
      "Implement left rotation",
      "Review Days 1 to 4"
    ]
  },
  6: {
    title: "Strings I",
    focus: "String fundamentals",
    tasks: [
      "Learn std::string",
      "Learn indexing and traversal",
      "Learn string length",
      "Learn substring",
      "Learn concatenation",
      "Learn character conversion",
      "Solve 7 string problems",
      "Practice palindrome checking"
    ]
  },
  7: {
    title: "Weekly Foundation Review",
    focus: "Consolidation",
    tasks: [
      "Revise C++ syntax",
      "Revise loops",
      "Revise functions",
      "Revise arrays",
      "Revise strings",
      "Solve 10 mixed beginner problems",
      "Take a 30 minute timed coding test",
      "Write down every mistake"
    ]
  },
  8: {
    title: "Pointers",
    focus: "Memory fundamentals",
    tasks: [
      "Understand memory addresses",
      "Learn pointers",
      "Learn dereferencing",
      "Learn pointer arithmetic",
      "Understand nullptr",
      "Understand pointer versus variable",
      "Write 8 pointer exercises",
      "Explain stack memory at a basic level"
    ]
  },
  9: {
    title: "References and Memory",
    focus: "C++ memory model",
    tasks: [
      "Learn references",
      "Compare pointers and references",
      "Learn pass by reference",
      "Understand stack versus heap",
      "Understand lifetime and scope",
      "Solve 6 pointer/reference problems",
      "Explain memory allocation conceptually",
      "Review Day 8"
    ]
  },
  10: {
    title: "Complexity",
    focus: "Big O mastery",
    tasks: [
      "Learn Big O",
      "Learn Big Omega",
      "Learn Big Theta",
      "Analyze loops",
      "Analyze nested loops",
      "Analyze logarithmic algorithms",
      "Analyze recursive complexity at a basic level",
      "Solve 15 complexity identification questions"
    ]
  },
  11: {
    title: "STL Vector",
    focus: "First major STL container",
    tasks: [
      "Learn vector",
      "push_back",
      "pop_back",
      "size",
      "front and back",
      "indexing",
      "iterators",
      "Solve 8 vector problems",
      "Rewrite 3 previous array problems using vector"
    ]
  },
  12: {
    title: "STL Strings and Pairs",
    focus: "Useful STL primitives",
    tasks: [
      "Learn pair",
      "Learn nested pairs",
      "Learn tuple basics",
      "Learn string utilities",
      "Practice vector of pairs",
      "Solve 8 problems using vector and pair",
      "Review STL syntax"
    ]
  },
  13: {
    title: "STL Stack and Queue",
    focus: "Linear data structures",
    tasks: [
      "Learn stack",
      "push, pop, top",
      "Learn queue",
      "push, pop, front",
      "Learn deque",
      "Implement stack conceptually",
      "Solve 8 stack and queue problems"
    ]
  },
  14: {
    title: "STL Set and Map",
    focus: "Ordered containers",
    tasks: [
      "Learn set",
      "Learn multiset",
      "Learn map",
      "Learn frequency maps",
      "Learn lower_bound",
      "Learn upper_bound",
      "Solve 10 problems",
      "Explain when map beats vector"
    ]
  },
  15: {
    title: "Unordered Containers",
    focus: "Hashing",
    tasks: [
      "Learn unordered_map",
      "Learn unordered_set",
      "Understand average O(1) lookup",
      "Compare map and unordered_map",
      "Solve Two Sum",
      "Solve frequency problems",
      "Solve 8 hashing problems"
    ]
  },
  16: {
    title: "Sorting",
    focus: "Ordering data efficiently",
    tasks: [
      "Learn std::sort",
      "Learn custom comparator",
      "Learn ascending and descending order",
      "Learn sorting pairs",
      "Understand O(n log n)",
      "Solve 8 sorting problems",
      "Implement bubble sort",
      "Implement selection sort"
    ]
  },
  17: {
    title: "Binary Search I",
    focus: "Core pattern",
    tasks: [
      "Understand search space",
      "Implement binary search from scratch",
      "Learn low, high and mid",
      "Handle edge cases",
      "Solve classic Binary Search",
      "Solve first occurrence",
      "Solve last occurrence",
      "Solve 7 binary search problems"
    ]
  },
  18: {
    title: "Binary Search II",
    focus: "STL and variants",
    tasks: [
      "Learn lower_bound",
      "Learn upper_bound",
      "Learn search in sorted arrays",
      "Learn binary search on answer concept",
      "Solve 8 problems",
      "Explain why binary search is O(log n)"
    ]
  },
  19: {
    title: "Basic OOP I",
    focus: "Classes and objects",
    tasks: [
      "Learn class",
      "Learn object",
      "Learn attributes",
      "Learn methods",
      "Learn access modifiers",
      "Learn constructors",
      "Build 3 simple classes",
      "Answer 10 OOP questions"
    ]
  },
  20: {
    title: "Basic OOP II",
    focus: "Core principles",
    tasks: [
      "Learn encapsulation",
      "Learn abstraction",
      "Learn inheritance",
      "Learn polymorphism",
      "Learn overloading",
      "Learn overriding",
      "Build a small OOP example",
      "Answer 15 OOP interview questions"
    ]
  },
  21: {
    title: "SQL I",
    focus: "Query fundamentals",
    tasks: [
      "Learn SELECT",
      "Learn WHERE",
      "Learn ORDER BY",
      "Learn LIMIT",
      "Learn DISTINCT",
      "Learn aggregate functions",
      "Solve 10 SQL problems",
      "Explain primary key"
    ]
  },
  22: {
    title: "SQL II",
    focus: "Grouping and filtering",
    tasks: [
      "Learn GROUP BY",
      "Learn HAVING",
      "Learn COUNT",
      "Learn SUM",
      "Learn AVG",
      "Learn MIN and MAX",
      "Solve 10 SQL problems",
      "Explain WHERE versus HAVING"
    ]
  },
  23: {
    title: "Aptitude I",
    focus: "Quantitative fundamentals",
    tasks: [
      "Percentages",
      "Ratios",
      "Averages",
      "Profit and loss",
      "Solve 30 aptitude questions",
      "Time yourself",
      "Record weak areas",
      "Review SQL"
    ]
  },
  24: {
    title: "C++ Interview Fundamentals",
    focus: "Common interview questions",
    tasks: [
      "Explain pointer versus reference",
      "Explain stack versus heap",
      "Explain pass by value versus reference",
      "Explain const",
      "Explain static",
      "Explain vector versus array",
      "Answer 20 C++ questions",
      "Solve 5 coding problems"
    ]
  },
  25: {
    title: "Array Patterns",
    focus: "Two pointers",
    tasks: [
      "Learn two pointers",
      "Learn left and right pointer movement",
      "Solve Two Sum II",
      "Solve container style problems",
      "Solve palindrome variations",
      "Solve 8 two pointer problems",
      "Explain when two pointers applies"
    ]
  },
  26: {
    title: "Sliding Window I",
    focus: "Fixed windows",
    tasks: [
      "Understand sliding window",
      "Learn fixed window",
      "Learn running sum",
      "Solve maximum sum subarray of size k",
      "Solve average window problems",
      "Solve 7 sliding window problems",
      "Explain O(n) sliding window"
    ]
  },
  27: {
    title: "Sliding Window II",
    focus: "Variable windows",
    tasks: [
      "Learn variable sliding window",
      "Learn frequency map inside window",
      "Solve Longest Substring Without Repeating Characters",
      "Solve minimum window style problems",
      "Solve 7 sliding window problems",
      "Review two pointers"
    ]
  },
  28: {
    title: "Prefix Sums",
    focus: "Range query thinking",
    tasks: [
      "Learn prefix sum",
      "Build prefix array",
      "Solve range sum",
      "Solve subarray sum problems",
      "Combine prefix sum with hashmap",
      "Solve 8 problems",
      "Explain the pattern"
    ]
  },
  29: {
    title: "Hashing Patterns",
    focus: "Frequency and lookup",
    tasks: [
      "Frequency counting",
      "Duplicate detection",
      "Pair lookup",
      "Prefix sum plus hashmap",
      "Grouping",
      "Solve 10 hashing problems",
      "Review Days 21 to 28"
    ]
  },
  30: {
    title: "Foundation Assessment",
    focus: "Test",
    tasks: [
      "Take 90 minute coding assessment",
      "Solve 3 Easy problems",
      "Solve 2 Medium problems",
      "Complete 10 SQL questions",
      "Complete 20 aptitude questions",
      "Answer 20 C++ and OOP questions",
      "Identify top 5 weaknesses",
      "Create revision list"
    ]
  },
  31: {
    title: "Linked Lists I",
    focus: "Fundamentals",
    tasks: [
      "Learn node structure",
      "Learn singly linked list",
      "Insert node",
      "Delete node",
      "Traverse list",
      "Search list",
      "Solve 6 linked list problems"
    ]
  },
  32: {
    title: "Linked Lists II",
    focus: "Reversal",
    tasks: [
      "Reverse linked list iteratively",
      "Reverse linked list recursively",
      "Understand previous, current and next",
      "Solve reverse list variants",
      "Solve 7 problems",
      "Explain O(n) reversal"
    ]
  },
  33: {
    title: "Fast and Slow Pointers",
    focus: "Linked list patterns",
    tasks: [
      "Learn tortoise and hare",
      "Detect cycle",
      "Find cycle entry",
      "Find middle node",
      "Solve palindrome linked list",
      "Solve 7 problems"
    ]
  },
  34: {
    title: "Linked List Interview Patterns",
    focus: "Advanced list operations",
    tasks: [
      "Merge sorted lists",
      "Find intersection",
      "Remove nth node",
      "Reorder list",
      "Solve 8 problems",
      "Review linked list patterns"
    ]
  },
  35: {
    title: "Stack I",
    focus: "Stack problems",
    tasks: [
      "Review stack STL",
      "Balanced parentheses",
      "Min stack concept",
      "Reverse stack concept",
      "Solve 8 stack problems",
      "Explain LIFO"
    ]
  },
  36: {
    title: "Monotonic Stack",
    focus: "Next greater patterns",
    tasks: [
      "Understand monotonic stack",
      "Next greater element",
      "Previous greater element",
      "Daily temperatures style problems",
      "Solve 7 problems",
      "Recognize monotonic stack patterns"
    ]
  },
  37: {
    title: "Queue and Deque",
    focus: "Queue patterns",
    tasks: [
      "Review queue",
      "Review deque",
      "Circular queue concept",
      "Sliding window maximum concept",
      "Solve 7 queue problems",
      "Review stack patterns"
    ]
  },
  38: {
    title: "Recursion I",
    focus: "Recursive thinking",
    tasks: [
      "Base case",
      "Recursive case",
      "Call stack",
      "Factorial",
      "Fibonacci",
      "Sum and traversal",
      "Write 10 recursive functions"
    ]
  },
  39: {
    title: "Recursion II",
    focus: "Backtracking introduction",
    tasks: [
      "Understand decision trees",
      "Learn choose and unchoose",
      "Generate subsets",
      "Generate combinations",
      "Solve 6 recursion problems",
      "Draw recursion trees"
    ]
  },
  40: {
    title: "Backtracking",
    focus: "Search space exploration",
    tasks: [
      "Permutations",
      "Combinations",
      "Subsets",
      "N Queens concept",
      "Sudoku concept",
      "Solve 6 backtracking problems",
      "Explain pruning"
    ]
  },
  41: {
    title: "Heap I",
    focus: "Priority queues",
    tasks: [
      "Learn min heap",
      "Learn max heap",
      "Learn priority_queue",
      "Insert and extract",
      "Understand heap complexity",
      "Solve 7 heap problems"
    ]
  },
  42: {
    title: "Heap II",
    focus: "Top K patterns",
    tasks: [
      "Kth largest",
      "Kth smallest",
      "Top K frequent",
      "Merge K sorted structures",
      "Solve 8 heap problems",
      "Recognize heap usage"
    ]
  },
  43: {
    title: "Intervals I",
    focus: "Interval patterns",
    tasks: [
      "Sort intervals",
      "Merge intervals",
      "Detect overlap",
      "Insert interval",
      "Solve 7 interval problems",
      "Explain why sorting is useful"
    ]
  },
  44: {
    title: "Intervals II",
    focus: "Scheduling",
    tasks: [
      "Meeting rooms",
      "Minimum rooms",
      "Interval scheduling",
      "Greedy interval selection",
      "Solve 7 problems",
      "Review intervals"
    ]
  },
  45: {
    title: "Greedy I",
    focus: "Greedy thinking",
    tasks: [
      "Understand greedy choice",
      "Understand local versus global optimum",
      "Activity selection",
      "Jump game",
      "Assign cookies",
      "Solve 8 greedy problems"
    ]
  },
  46: {
    title: "Greedy II",
    focus: "Interview patterns",
    tasks: [
      "Gas station",
      "Partition style greedy",
      "Scheduling",
      "Minimum jumps",
      "Solve 8 problems",
      "Explain why greedy works"
    ]
  },
  47: {
    title: "Binary Search on Answer",
    focus: "Advanced binary search",
    tasks: [
      "Understand feasibility function",
      "Identify monotonic answer space",
      "Capacity problems",
      "Allocation problems",
      "Speed problems",
      "Solve 8 problems"
    ]
  },
  48: {
    title: "Arrays Mixed",
    focus: "Pattern recognition",
    tasks: [
      "Solve 10 mixed array problems",
      "Identify pattern before coding",
      "Time every problem",
      "Write complexity for every solution",
      "Review weak patterns"
    ]
  },
  49: {
    title: "Strings Mixed",
    focus: "Pattern recognition",
    tasks: [
      "Solve 10 mixed string problems",
      "Hashing",
      "Sliding window",
      "Two pointers",
      "Palindrome patterns",
      "Review mistakes"
    ]
  },
  50: {
    title: "DSA Midpoint Test",
    focus: "Assessment",
    tasks: [
      "120 minute timed test",
      "4 coding problems",
      "5 SQL problems",
      "20 aptitude questions",
      "20 technical questions",
      "Analyze every mistake",
      "Update weakness list"
    ]
  },
  51: {
    title: "Trees I",
    focus: "Binary trees",
    tasks: [
      "Learn tree node",
      "Learn root, child, leaf",
      "Preorder",
      "Inorder",
      "Postorder",
      "Implement recursive DFS",
      "Solve 7 tree problems"
    ]
  },
  52: {
    title: "Trees II",
    focus: "BFS",
    tasks: [
      "Learn level order traversal",
      "Queue based BFS",
      "Height of tree",
      "Maximum depth",
      "Solve 7 problems",
      "Compare BFS and DFS"
    ]
  },
  53: {
    title: "Trees III",
    focus: "Tree recursion",
    tasks: [
      "Diameter",
      "Balanced tree",
      "Path sum",
      "Invert tree",
      "Same tree",
      "Solve 8 problems",
      "Practice recursive reasoning"
    ]
  },
  54: {
    title: "BST I",
    focus: "Binary search trees",
    tasks: [
      "BST property",
      "Search",
      "Insert",
      "Delete concept",
      "Validate BST",
      "Solve 7 BST problems"
    ]
  },
  55: {
    title: "BST II",
    focus: "BST interview problems",
    tasks: [
      "Kth smallest",
      "Lowest common ancestor",
      "Successor concept",
      "Range queries",
      "Solve 8 problems",
      "Review BST"
    ]
  },
  56: {
    title: "Tree Views",
    focus: "Interview patterns",
    tasks: [
      "Left view",
      "Right view",
      "Top view concept",
      "Bottom view concept",
      "Vertical traversal concept",
      "Solve 6 problems"
    ]
  },
  57: {
    title: "Tree Revision",
    focus: "Mixed trees",
    tasks: [
      "Solve 10 mixed tree problems",
      "Solve 2 timed Medium problems",
      "Explain every traversal without notes",
      "Review recursion"
    ]
  },
  58: {
    title: "Graphs I",
    focus: "Graph representation",
    tasks: [
      "Adjacency matrix",
      "Adjacency list",
      "Directed graph",
      "Undirected graph",
      "Weighted graph",
      "Implement graph structure",
      "Solve 5 basic graph problems"
    ]
  },
  59: {
    title: "Graphs II",
    focus: "DFS",
    tasks: [
      "Graph DFS",
      "Visited array",
      "Connected components",
      "Flood fill",
      "Number of islands",
      "Solve 7 DFS problems"
    ]
  },
  60: {
    title: "Graphs III",
    focus: "BFS",
    tasks: [
      "Graph BFS",
      "Shortest path in unweighted graph",
      "Multi source BFS",
      "Rotten oranges pattern",
      "Solve 7 BFS problems"
    ]
  },
  61: {
    title: "Graph Cycles",
    focus: "Cycle detection",
    tasks: [
      "Undirected cycle detection",
      "Directed cycle detection",
      "DFS based detection",
      "BFS based detection",
      "Solve 7 problems"
    ]
  },
  62: {
    title: "Topological Sort",
    focus: "Dependency graphs",
    tasks: [
      "Understand DAG",
      "DFS topological sort",
      "Kahn algorithm",
      "Course schedule",
      "Dependency ordering",
      "Solve 7 problems"
    ]
  },
  63: {
    title: "Shortest Paths I",
    focus: "Dijkstra",
    tasks: [
      "Understand shortest path",
      "Learn Dijkstra",
      "Priority queue implementation",
      "Complexity",
      "Solve 6 Dijkstra problems"
    ]
  },
  64: {
    title: "Shortest Paths II",
    focus: "Other algorithms",
    tasks: [
      "Bellman Ford concept",
      "Floyd Warshall concept",
      "Compare algorithms",
      "Understand negative edges",
      "Solve 5 shortest path problems"
    ]
  },
  65: {
    title: "DSU",
    focus: "Union Find",
    tasks: [
      "Parent array",
      "Find",
      "Union",
      "Path compression",
      "Union by rank or size",
      "Solve 6 DSU problems"
    ]
  },
  66: {
    title: "Minimum Spanning Tree",
    focus: "MST",
    tasks: [
      "Understand MST",
      "Prim",
      "Kruskal",
      "Compare Prim and Kruskal",
      "Solve 6 MST problems"
    ]
  },
  67: {
    title: "Graph Mixed",
    focus: "Pattern recognition",
    tasks: [
      "Solve 10 mixed graph problems",
      "Identify BFS versus DFS",
      "Identify shortest path algorithm",
      "Identify DSU use",
      "Review mistakes"
    ]
  },
  68: {
    title: "Dynamic Programming I",
    focus: "DP thinking",
    tasks: [
      "Understand overlapping subproblems",
      "Understand optimal substructure",
      "Memoization",
      "Tabulation",
      "Fibonacci DP",
      "Climbing stairs",
      "Solve 6 DP problems"
    ]
  },
  69: {
    title: "1D DP",
    focus: "State design",
    tasks: [
      "House robber",
      "Min cost climbing stairs",
      "Coin change introduction",
      "Define state",
      "Define transition",
      "Solve 7 problems"
    ]
  },
  70: {
    title: "2D DP",
    focus: "Grid DP",
    tasks: [
      "Grid paths",
      "Minimum path sum",
      "Obstacles",
      "Define two dimensional state",
      "Solve 7 problems"
    ]
  },
  71: {
    title: "Knapsack",
    focus: "Classic DP",
    tasks: [
      "0/1 knapsack",
      "Subset sum",
      "Partition equal subset",
      "Understand include/exclude",
      "Solve 7 problems"
    ]
  },
  72: {
    title: "LCS",
    focus: "Sequence DP",
    tasks: [
      "Longest common subsequence",
      "Longest common substring concept",
      "Edit distance concept",
      "Build recurrence",
      "Solve 6 problems"
    ]
  },
  73: {
    title: "LIS",
    focus: "Increasing subsequences",
    tasks: [
      "LIS O(n²)",
      "LIS O(n log n) concept",
      "Understand binary search optimization",
      "Solve 6 problems"
    ]
  },
  74: {
    title: "DP Mixed",
    focus: "Pattern recognition",
    tasks: [
      "Solve 10 mixed DP problems",
      "Identify state",
      "Identify transition",
      "Identify base cases",
      "Analyze complexity"
    ]
  },
  75: {
    title: "Core DSA Assessment",
    focus: "Full test",
    tasks: [
      "150 minute DSA assessment",
      "5 problems",
      "At least 3 Medium",
      "One graph problem",
      "One DP problem",
      "Analyze mistakes",
      "Revisit weakest 3 patterns"
    ]
  },
  76: {
    title: "DBMS I",
    focus: "Database foundations",
    tasks: [
      "Database versus DBMS",
      "Relational database",
      "Tables and records",
      "Primary key",
      "Foreign key",
      "Candidate key",
      "Super key",
      "Constraints",
      "Answer 20 DBMS questions"
    ]
  },
  77: {
    title: "DBMS II",
    focus: "Normalization",
    tasks: [
      "Functional dependency",
      "1NF",
      "2NF",
      "3NF",
      "BCNF",
      "Solve normalization examples",
      "Answer 15 questions"
    ]
  },
  78: {
    title: "DBMS III",
    focus: "Transactions",
    tasks: [
      "Transaction",
      "ACID",
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability",
      "Commit and rollback",
      "Answer 20 questions"
    ]
  },
  79: {
    title: "DBMS IV",
    focus: "Concurrency",
    tasks: [
      "Concurrency problems",
      "Race conditions",
      "Locks",
      "Shared lock",
      "Exclusive lock",
      "Deadlock",
      "Isolation levels",
      "Answer 20 questions"
    ]
  },
  80: {
    title: "DBMS V",
    focus: "Indexing",
    tasks: [
      "Why indexes exist",
      "B Tree",
      "B+ Tree",
      "Clustered index concept",
      "Non clustered index concept",
      "Index tradeoffs",
      "Answer 20 indexing questions"
    ]
  },
  81: {
    title: "SQL III",
    focus: "Joins",
    tasks: [
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "FULL JOIN concept",
      "Self join",
      "Solve 15 join problems",
      "Explain join behavior"
    ]
  },
  82: {
    title: "SQL IV",
    focus: "Subqueries and CTEs",
    tasks: [
      "Subquery",
      "Correlated subquery",
      "CTE",
      "WITH clause",
      "Solve 12 problems",
      "Rewrite 3 subqueries as CTEs"
    ]
  },
  83: {
    title: "SQL V",
    focus: "Window functions",
    tasks: [
      "ROW_NUMBER",
      "RANK",
      "DENSE_RANK",
      "LEAD",
      "LAG",
      "PARTITION BY",
      "Solve 12 window function problems"
    ]
  },
  84: {
    title: "SQL VI",
    focus: "Interview SQL",
    tasks: [
      "Top N per group",
      "Second highest salary",
      "Duplicate detection",
      "Consecutive records",
      "Running totals",
      "Solve 15 interview queries"
    ]
  },
  85: {
    title: "OOP Deep Dive",
    focus: "Interview mastery",
    tasks: [
      "Virtual functions",
      "Pure virtual functions",
      "Abstract classes",
      "Interfaces",
      "Constructor behavior",
      "Destructor behavior",
      "Composition",
      "Aggregation",
      "Answer 30 OOP questions"
    ]
  },
  86: {
    title: "C++ Memory",
    focus: "Advanced interview fundamentals",
    tasks: [
      "Stack memory",
      "Heap memory",
      "Dynamic allocation",
      "new and delete",
      "RAII",
      "Smart pointer concepts",
      "unique_ptr",
      "shared_ptr",
      "weak_ptr concept",
      "Answer 25 C++ questions"
    ]
  },
  87: {
    title: "C++ Advanced",
    focus: "Modern C++ interview topics",
    tasks: [
      "const correctness",
      "References",
      "Move semantics concept",
      "Copy constructor",
      "Assignment operator",
      "Rule of 3 concept",
      "Rule of 5 concept",
      "Answer 25 questions"
    ]
  },
  88: {
    title: "Java I",
    focus: "Java foundations",
    tasks: [
      "JDK",
      "JRE",
      "JVM",
      "Java syntax",
      "Classes",
      "Objects",
      "Constructors",
      "Inheritance",
      "Solve 5 Java problems"
    ]
  },
  89: {
    title: "Java II",
    focus: "Collections",
    tasks: [
      "ArrayList",
      "LinkedList",
      "HashMap",
      "HashSet",
      "PriorityQueue",
      "Comparator",
      "Comparable",
      "Solve 8 Java problems"
    ]
  },
  90: {
    title: "Java III",
    focus: "Java OOP",
    tasks: [
      "Interfaces",
      "Abstract classes",
      "Overriding",
      "Overloading",
      "Exceptions",
      "Generics",
      "StringBuilder",
      "Answer 25 Java questions"
    ]
  },
  91: {
    title: "Operating Systems I",
    focus: "Processes and threads",
    tasks: [
      "Process",
      "Thread",
      "Process versus thread",
      "Context switch",
      "User mode",
      "Kernel mode",
      "System calls",
      "Answer 25 OS questions"
    ]
  },
  92: {
    title: "Operating Systems II",
    focus: "Scheduling",
    tasks: [
      "FCFS",
      "SJF",
      "SRTF",
      "Round Robin",
      "Priority scheduling",
      "Waiting time",
      "Turnaround time",
      "Solve scheduling examples",
      "Answer 20 questions"
    ]
  },
  93: {
    title: "Operating Systems III",
    focus: "Synchronization",
    tasks: [
      "Race condition",
      "Critical section",
      "Mutex",
      "Semaphore",
      "Monitor concept",
      "Producer consumer",
      "Readers writers",
      "Answer 25 questions"
    ]
  },
  94: {
    title: "Operating Systems IV",
    focus: "Deadlocks",
    tasks: [
      "Deadlock conditions",
      "Prevention",
      "Avoidance",
      "Detection",
      "Banker's algorithm",
      "Solve 5 examples",
      "Answer 20 questions"
    ]
  },
  95: {
    title: "Operating Systems V",
    focus: "Memory",
    tasks: [
      "Virtual memory",
      "Paging",
      "Segmentation",
      "Page fault",
      "TLB",
      "Page replacement",
      "FIFO",
      "LRU",
      "Answer 25 questions"
    ]
  },
  96: {
    title: "Computer Networks I",
    focus: "Network fundamentals",
    tasks: [
      "OSI model",
      "TCP/IP model",
      "Layers",
      "Encapsulation",
      "Decapsulation",
      "IP addressing basics",
      "Answer 25 questions"
    ]
  },
  97: {
    title: "Computer Networks II",
    focus: "TCP and UDP",
    tasks: [
      "TCP",
      "UDP",
      "TCP versus UDP",
      "Three way handshake",
      "Connection termination",
      "Flow control",
      "Congestion control",
      "Answer 25 questions"
    ]
  },
  98: {
    title: "Computer Networks III",
    focus: "Web fundamentals",
    tasks: [
      "HTTP",
      "HTTPS",
      "DNS",
      "DHCP",
      "ARP",
      "HTTP methods",
      "HTTP status codes",
      "Answer 25 questions"
    ]
  },
  99: {
    title: "Computer Networks IV",
    focus: "Network architecture",
    tasks: [
      "NAT",
      "Firewall",
      "Proxy",
      "Reverse proxy",
      "CDN",
      "Routing",
      "IPv4 versus IPv6",
      "Answer 25 questions"
    ]
  },
  100: {
    title: "What Happens When You Type Google.com",
    focus: "End to end networking",
    tasks: [
      "DNS lookup",
      "TCP connection",
      "TLS handshake",
      "HTTP request",
      "Server processing",
      "Response",
      "Browser rendering",
      "Explain the entire flow without notes",
      "Record a 5 minute verbal explanation"
    ]
  },
  101: {
    title: "CS Core Review I",
    focus: "OOP and C++",
    tasks: [
      "Answer 40 OOP questions",
      "Answer 30 C++ questions",
      "Solve 5 DSA problems",
      "Explain memory model",
      "Explain polymorphism",
      "Review weak areas"
    ]
  },
  102: {
    title: "CS Core Review II",
    focus: "DBMS and SQL",
    tasks: [
      "Answer 40 DBMS questions",
      "Solve 10 SQL queries",
      "Explain ACID",
      "Explain normalization",
      "Explain indexing",
      "Review weak areas"
    ]
  },
  103: {
    title: "CS Core Review III",
    focus: "OS",
    tasks: [
      "Answer 40 OS questions",
      "Explain process versus thread",
      "Explain deadlocks",
      "Explain virtual memory",
      "Solve 5 OS numerical questions",
      "Review weak areas"
    ]
  },
  104: {
    title: "CS Core Review IV",
    focus: "Networks",
    tasks: [
      "Answer 40 CN questions",
      "Explain TCP handshake",
      "Explain DNS",
      "Explain HTTPS",
      "Explain Google.com flow",
      "Review weak areas"
    ]
  },
  105: {
    title: "DSA Mixed I",
    focus: "Pattern recognition",
    tasks: [
      "Solve 8 mixed Medium problems",
      "Identify pattern before coding",
      "No solution lookup for first 30 minutes",
      "Write complexity",
      "Review all mistakes"
    ]
  },
  106: {
    title: "DSA Mixed II",
    focus: "Timed solving",
    tasks: [
      "Solve 6 timed problems",
      "20 minutes each",
      "Record solve time",
      "Record hints required",
      "Review inefficient solutions"
    ]
  },
  107: {
    title: "DSA Mixed III",
    focus: "Trees and graphs",
    tasks: [
      "Solve 5 tree problems",
      "Solve 5 graph problems",
      "One timed Medium",
      "Explain BFS versus DFS",
      "Explain tree recursion"
    ]
  },
  108: {
    title: "DSA Mixed IV",
    focus: "DP",
    tasks: [
      "Solve 5 DP problems",
      "Solve 2 Medium DP problems",
      "Write state and transition before code",
      "Analyze complexity",
      "Review DP mistakes"
    ]
  },
  109: {
    title: "DSA Mixed V",
    focus: "Advanced patterns",
    tasks: [
      "Solve 2 binary search problems",
      "Solve 2 heap problems",
      "Solve 2 monotonic stack problems",
      "Solve 2 greedy problems",
      "Solve 2 interval problems"
    ]
  },
  110: {
    title: "SQL Assessment",
    focus: "SQL interview test",
    tasks: [
      "Complete 20 SQL queries",
      "60 minute limit",
      "Include joins",
      "Include CTE",
      "Include window functions",
      "Include subqueries",
      "Analyze every mistake"
    ]
  },
  111: {
    title: "OOP Assessment",
    focus: "Technical interview",
    tasks: [
      "Answer 50 OOP questions",
      "Explain SOLID basics",
      "Explain composition versus inheritance",
      "Explain virtual functions",
      "Design a small class hierarchy",
      "Conduct a 30 minute verbal interview"
    ]
  },
  112: {
    title: "DBMS Assessment",
    focus: "Technical interview",
    tasks: [
      "Answer 50 DBMS questions",
      "Explain normalization",
      "Explain ACID",
      "Explain indexes",
      "Explain isolation",
      "Explain deadlocks",
      "Conduct a 30 minute verbal interview"
    ]
  },
  113: {
    title: "OS Assessment",
    focus: "Technical interview",
    tasks: [
      "Answer 50 OS questions",
      "Explain scheduling",
      "Explain synchronization",
      "Explain deadlocks",
      "Explain paging",
      "Conduct a 30 minute verbal interview"
    ]
  },
  114: {
    title: "CN Assessment",
    focus: "Technical interview",
    tasks: [
      "Answer 50 CN questions",
      "Explain TCP",
      "Explain DNS",
      "Explain HTTPS",
      "Explain routing",
      "Conduct a 30 minute verbal interview"
    ]
  },
  115: {
    title: "Java Assessment",
    focus: "Java interview",
    tasks: [
      "Answer 40 Java questions",
      "Explain collections",
      "Explain JVM",
      "Explain garbage collection",
      "Explain OOP",
      "Solve 5 Java coding problems"
    ]
  },
  116: {
    title: "Aptitude II",
    focus: "Placement OA",
    tasks: [
      "Time and work",
      "Time speed distance",
      "Probability",
      "Permutations",
      "Combinations",
      "Solve 40 questions",
      "Complete under time limit"
    ]
  },
  117: {
    title: "Aptitude III",
    focus: "Logical reasoning",
    tasks: [
      "Number series",
      "Arrangements",
      "Blood relations",
      "Directions",
      "Coding and decoding",
      "Syllogisms",
      "Solve 40 questions"
    ]
  },
  118: {
    title: "Aptitude IV",
    focus: "Verbal",
    tasks: [
      "Reading comprehension",
      "Grammar",
      "Sentence correction",
      "Vocabulary",
      "Solve 30 questions",
      "Review mistakes"
    ]
  },
  119: {
    title: "Full OA Simulation",
    focus: "Assessment",
    tasks: [
      "30 aptitude questions",
      "3 coding problems",
      "10 SQL questions",
      "30 technical MCQs",
      "Complete under strict time",
      "Analyze score",
      "Create weakness report"
    ]
  },
  120: {
    title: "Advanced DSA Assessment",
    focus: "Major checkpoint",
    tasks: [
      "180 minute DSA assessment",
      "6 problems",
      "At least 4 Medium",
      "One graph",
      "One DP",
      "One tree",
      "Analyze all failures",
      "Update pattern mastery list"
    ]
  },
  121: {
    title: "System Design I",
    focus: "Architecture basics",
    tasks: [
      "Client server model",
      "API basics",
      "REST",
      "HTTP request lifecycle",
      "Authentication",
      "Authorization",
      "Design a basic backend architecture",
      "Answer 20 system design questions"
    ]
  },
  122: {
    title: "System Design II",
    focus: "Databases and scaling",
    tasks: [
      "SQL versus NoSQL concept",
      "Replication",
      "Sharding",
      "Vertical scaling",
      "Horizontal scaling",
      "Load balancing",
      "Caching",
      "Answer 20 questions"
    ]
  },
  123: {
    title: "System Design III",
    focus: "Distributed concepts",
    tasks: [
      "Redis concept",
      "Message queues",
      "Asynchronous processing",
      "CDN",
      "CAP theorem",
      "Consistency",
      "Availability",
      "Design a basic scalable API"
    ]
  },
  124: {
    title: "System Design IV",
    focus: "URL shortener",
    tasks: [
      "Define requirements",
      "Estimate scale",
      "API design",
      "Database design",
      "Short code generation",
      "Caching",
      "Scaling",
      "Explain architecture for 20 minutes"
    ]
  },
  125: {
    title: "System Design V",
    focus: "Chat application",
    tasks: [
      "Requirements",
      "WebSocket concept",
      "Message storage",
      "Presence",
      "Notifications",
      "Scaling",
      "Failure handling",
      "Explain architecture for 20 minutes"
    ]
  },
  126: {
    title: "Project Deep Dive I",
    focus: "Project ownership",
    tasks: [
      "Choose strongest project",
      "Write problem statement",
      "Explain why it exists",
      "Explain architecture",
      "Explain every technology",
      "Explain data flow",
      "Explain your personal contribution"
    ]
  },
  127: {
    title: "Project Deep Dive II",
    focus: "Technical defense",
    tasks: [
      "Explain algorithms",
      "Explain database",
      "Explain APIs",
      "Explain security",
      "Explain failure cases",
      "Explain performance",
      "Explain scalability",
      "Answer 30 project questions"
    ]
  },
  128: {
    title: "Project Deep Dive III",
    focus: "Difficult questions",
    tasks: [
      "Why this technology?",
      "Why not another technology?",
      "Biggest technical challenge",
      "Biggest bug",
      "Biggest tradeoff",
      "What would you change?",
      "How would you scale it?",
      "Conduct a 30 minute project interrogation"
    ]
  },
  129: {
    title: "Resume I",
    focus: "Resume construction",
    tasks: [
      "Build one page resume",
      "Strong headline",
      "Technical skills",
      "Projects",
      "Experience",
      "Achievements",
      "Quantify impact",
      "Remove weak filler"
    ]
  },
  130: {
    title: "Resume II",
    focus: "Resume defense",
    tasks: [
      "Read every resume line",
      "Prepare explanation for every technology",
      "Prepare project questions",
      "Prepare achievement questions",
      "Prepare experience questions",
      "Conduct 20 minute resume walkthrough"
    ]
  },
  131: {
    title: "C++ Interview Round I",
    focus: "Rapid fire",
    tasks: [
      "Answer 50 C++ questions",
      "Pointers",
      "References",
      "Memory",
      "STL",
      "OOP",
      "Complexity",
      "Modern C++ basics"
    ]
  },
  132: {
    title: "C++ Interview Round II",
    focus: "Coding",
    tasks: [
      "Solve 5 C++ Medium problems",
      "Explain while coding",
      "State brute force first",
      "State optimized solution",
      "State complexity",
      "Handle interviewer follow ups"
    ]
  },
  133: {
    title: "Java Interview Round",
    focus: "Java rapid fire",
    tasks: [
      "Answer 50 Java questions",
      "JVM",
      "Collections",
      "OOP",
      "Exceptions",
      "Generics",
      "Memory",
      "Threads"
    ]
  },
  134: {
    title: "DSA Interview I",
    focus: "Arrays and strings",
    tasks: [
      "Solve 4 interview problems",
      "30 minute limit each",
      "Explain pattern",
      "Explain complexity",
      "Handle edge cases",
      "Practice speaking while coding"
    ]
  },
  135: {
    title: "DSA Interview II",
    focus: "Linked lists and stacks",
    tasks: [
      "Solve 4 interview problems",
      "One linked list Medium",
      "One monotonic stack problem",
      "Explain pointer movement",
      "Explain complexity"
    ]
  },
  136: {
    title: "DSA Interview III",
    focus: "Trees and heaps",
    tasks: [
      "Solve 4 interview problems",
      "Tree Medium",
      "BST Medium",
      "Heap Medium",
      "Explain recursive thinking"
    ]
  },
  137: {
    title: "DSA Interview IV",
    focus: "Graphs",
    tasks: [
      "Solve 4 graph problems",
      "BFS",
      "DFS",
      "Shortest path",
      "Topological sort",
      "Explain algorithm choice"
    ]
  },
  138: {
    title: "DSA Interview V",
    focus: "DP",
    tasks: [
      "Solve 4 DP problems",
      "Explain state",
      "Explain transition",
      "Explain base case",
      "Optimize space where possible"
    ]
  },
  139: {
    title: "Technical Rapid Fire I",
    focus: "OOP + C++",
    tasks: [
      "25 OOP questions",
      "25 C++ questions",
      "10 follow up questions",
      "Explain without notes",
      "Mark weak answers"
    ]
  },
  140: {
    title: "Technical Rapid Fire II",
    focus: "DBMS + SQL",
    tasks: [
      "25 DBMS questions",
      "10 SQL queries",
      "Explain indexing",
      "Explain ACID",
      "Explain normalization",
      "Explain joins"
    ]
  },
  141: {
    title: "Technical Rapid Fire III",
    focus: "OS + CN",
    tasks: [
      "25 OS questions",
      "25 CN questions",
      "Explain process versus thread",
      "Explain TCP",
      "Explain DNS",
      "Explain virtual memory"
    ]
  },
  142: {
    title: "Technical Rapid Fire IV",
    focus: "Mixed CS",
    tasks: [
      "60 mixed CS questions",
      "No notes",
      "Maximum 60 seconds per answer",
      "Mark uncertain questions",
      "Review all weak questions"
    ]
  },
  143: {
    title: "DSA Contest Simulation",
    focus: "Competitive pressure",
    tasks: [
      "120 minute contest",
      "4 problems",
      "No external help",
      "Track solve time",
      "Track failed attempts",
      "Analyze strategy afterward"
    ]
  },
  144: {
    title: "OA Simulation II",
    focus: "Placement assessment",
    tasks: [
      "Coding",
      "Aptitude",
      "SQL",
      "Technical MCQs",
      "Strict timer",
      "Analyze score",
      "Compare with Day 119"
    ]
  },
  145: {
    title: "System Design VI",
    focus: "File storage",
    tasks: [
      "Design file upload system",
      "Object storage concept",
      "Metadata database",
      "CDN",
      "Upload/download APIs",
      "Scaling",
      "Failure handling"
    ]
  },
  146: {
    title: "System Design VII",
    focus: "Notification system",
    tasks: [
      "Push notifications",
      "Email",
      "SMS concept",
      "Queue",
      "Retry",
      "Idempotency",
      "Rate limiting",
      "Design for scale"
    ]
  },
  147: {
    title: "Behavioral Interview I",
    focus: "Story bank",
    tasks: [
      "Tell me about yourself",
      "Biggest achievement",
      "Biggest failure",
      "Difficult teammate",
      "Leadership story",
      "Conflict story",
      "Technical challenge",
      "Use STAR structure"
    ]
  },
  148: {
    title: "Behavioral Interview II",
    focus: "Company fit",
    tasks: [
      "Why this company?",
      "Why this role?",
      "Why should we hire you?",
      "Strengths",
      "Weaknesses",
      "Five year vision",
      "Prepare 3 thoughtful questions"
    ]
  },
  149: {
    title: "Project Interview Simulation",
    focus: "Full project defense",
    tasks: [
      "45 minute project interrogation",
      "Architecture",
      "Algorithms",
      "Database",
      "APIs",
      "Security",
      "Scaling",
      "Tradeoffs",
      "Personal contribution"
    ]
  },
  150: {
    title: "Interview Readiness Assessment",
    focus: "Major checkpoint",
    tasks: [
      "60 minute DSA round",
      "30 minute CS round",
      "30 minute project round",
      "20 minute HR round",
      "20 minute SQL round",
      "Analyze performance",
      "Identify final weaknesses"
    ]
  },
  151: {
    title: "Company Preparation I",
    focus: "Company research",
    tasks: [
      "Research target companies",
      "Record role requirements",
      "Record common OA topics",
      "Record common DSA topics",
      "Record CS topics",
      "Create company preparation matrix"
    ]
  },
  152: {
    title: "Company Preparation II",
    focus: "OA patterns",
    tasks: [
      "Practice company style coding",
      "Practice aptitude",
      "Practice SQL",
      "Practice MCQs",
      "Review previous question patterns",
      "Complete one timed OA"
    ]
  },
  153: {
    title: "Company Preparation III",
    focus: "Interview patterns",
    tasks: [
      "Research interview experiences",
      "Collect recurring DSA patterns",
      "Collect recurring CS questions",
      "Collect recurring project questions",
      "Build company question bank"
    ]
  },
  154: {
    title: "DSA Weakness Repair I",
    focus: "Personal weaknesses",
    tasks: [
      "Review personal DSA failure log",
      "Pick weakest 3 patterns",
      "Solve 5 problems per pattern",
      "Reattempt old failures without notes",
      "Update mastery status"
    ]
  },
  155: {
    title: "DSA Weakness Repair II",
    focus: "Personal weaknesses",
    tasks: [
      "Pick next weakest 3 patterns",
      "Solve 5 problems per pattern",
      "Reattempt failures",
      "Practice explaining solutions",
      "Update mastery status"
    ]
  },
  156: {
    title: "CS Weakness Repair",
    focus: "Core subjects",
    tasks: [
      "Identify weakest CS subject",
      "Answer 50 questions",
      "Explain 10 concepts aloud",
      "Complete one mock technical round",
      "Update weak question bank"
    ]
  },
  157: {
    title: "SQL Weakness Repair",
    focus: "Query fluency",
    tasks: [
      "Solve 20 SQL problems",
      "Joins",
      "CTE",
      "Window functions",
      "Subqueries",
      "Time every query",
      "Review mistakes"
    ]
  },
  158: {
    title: "C++ Weakness Repair",
    focus: "Interview fluency",
    tasks: [
      "Answer 50 C++ questions",
      "STL",
      "Memory",
      "OOP",
      "References",
      "Pointers",
      "Solve 5 coding problems"
    ]
  },
  159: {
    title: "Java Weakness Repair",
    focus: "Interview fluency",
    tasks: [
      "Answer 40 Java questions",
      "Collections",
      "JVM",
      "OOP",
      "Exceptions",
      "Memory",
      "Solve 5 Java problems"
    ]
  },
  160: {
    title: "Full Technical Mock I",
    focus: "Simulation",
    tasks: [
      "45 minute DSA",
      "30 minute C++",
      "30 minute CS",
      "30 minute project",
      "15 minute SQL",
      "Record weaknesses",
      "Review performance"
    ]
  },
  161: {
    title: "Full Technical Mock II",
    focus: "Simulation",
    tasks: [
      "60 minute DSA",
      "30 minute OOP",
      "30 minute DBMS",
      "30 minute OS",
      "30 minute CN",
      "Review performance"
    ]
  },
  162: {
    title: "Full Technical Mock III",
    focus: "Simulation",
    tasks: [
      "60 minute DSA",
      "30 minute Java",
      "30 minute SQL",
      "30 minute System Design",
      "30 minute project",
      "Review performance"
    ]
  },
  163: {
    title: "Full OA III",
    focus: "Pressure",
    tasks: [
      "Full aptitude section",
      "Full coding section",
      "Full SQL section",
      "Full technical MCQ section",
      "Strict timer",
      "No external help",
      "Analyze score"
    ]
  },
  164: {
    title: "Full Interview I",
    focus: "End to end",
    tasks: [
      "Self introduction",
      "DSA",
      "C++",
      "OOP",
      "DBMS",
      "Project",
      "HR",
      "Record every weak answer"
    ]
  },
  165: {
    title: "Full Interview II",
    focus: "End to end",
    tasks: [
      "Self introduction",
      "DSA",
      "OS",
      "CN",
      "SQL",
      "Project",
      "HR",
      "Record every weak answer"
    ]
  },
  166: {
    title: "Full Interview III",
    focus: "End to end",
    tasks: [
      "Self introduction",
      "DSA",
      "Java",
      "System Design",
      "DBMS",
      "Project",
      "HR",
      "Record every weak answer"
    ]
  },
  167: {
    title: "Rapid Revision I",
    focus: "C++ and DSA",
    tasks: [
      "Review STL",
      "Review complexity",
      "Review arrays",
      "Review strings",
      "Review hashing",
      "Review binary search",
      "Solve 5 timed problems"
    ]
  },
  168: {
    title: "Rapid Revision II",
    focus: "DSA advanced",
    tasks: [
      "Review linked lists",
      "Review stacks",
      "Review heaps",
      "Review trees",
      "Review graphs",
      "Review DP",
      "Solve 6 timed problems"
    ]
  },
  169: {
    title: "Rapid Revision III",
    focus: "CS core",
    tasks: [
      "Review OOP",
      "Review DBMS",
      "Review SQL",
      "Review OS",
      "Review CN",
      "Answer 100 rapid fire questions"
    ]
  },
  170: {
    title: "Rapid Revision IV",
    focus: "Interview answers",
    tasks: [
      "Tell me about yourself",
      "Why should we hire you?",
      "Project walkthrough",
      "Biggest challenge",
      "Biggest failure",
      "Leadership",
      "Conflict",
      "Why company?",
      "Practice aloud"
    ]
  },
  171: {
    title: "Final Simulation I",
    focus: "Coding assessment",
    tasks: [
      "180 minute DSA assessment",
      "6 problems",
      "Strict timer",
      "No help",
      "Full post test analysis",
      "Reattempt failed problems"
    ]
  },
  172: {
    title: "Final Simulation II",
    focus: "Technical interview",
    tasks: [
      "60 minute DSA interview",
      "30 minute C++",
      "30 minute OOP",
      "30 minute DBMS",
      "30 minute SQL",
      "Record all weak answers"
    ]
  },
  173: {
    title: "Final Simulation III",
    focus: "Technical interview",
    tasks: [
      "60 minute DSA interview",
      "30 minute OS",
      "30 minute CN",
      "30 minute Java",
      "30 minute System Design",
      "Record all weak answers"
    ]
  },
  174: {
    title: "Final Simulation IV",
    focus: "Project interview",
    tasks: [
      "60 minute project interrogation",
      "Architecture",
      "Algorithms",
      "Database",
      "APIs",
      "Security",
      "Scalability",
      "Tradeoffs",
      "Personal contribution"
    ]
  },
  175: {
    title: "Final Simulation V",
    focus: "Behavioral interview",
    tasks: [
      "Self introduction",
      "Achievement",
      "Failure",
      "Conflict",
      "Leadership",
      "Teamwork",
      "Weakness",
      "Why company?",
      "Why role?",
      "Practice concise answers"
    ]
  },
  176: {
    title: "Full Placement Simulation I",
    focus: "Complete process",
    tasks: [
      "Aptitude",
      "Coding",
      "SQL",
      "Technical MCQ",
      "DSA interview",
      "Project interview",
      "HR interview",
      "Complete under realistic conditions"
    ]
  },
  177: {
    title: "Full Placement Simulation II",
    focus: "Complete process",
    tasks: [
      "Repeat full placement simulation",
      "Change DSA problems",
      "Change CS questions",
      "Change project questions",
      "Compare performance with Day 176",
      "Fix remaining weaknesses"
    ]
  },
  178: {
    title: "Final Weakness Elimination",
    focus: "Personal gaps",
    tasks: [
      "Review entire 180 day mistake log",
      "Identify top 10 remaining weaknesses",
      "Fix every weakness",
      "Reattempt failed DSA problems",
      "Reanswer failed CS questions",
      "Rehearse project answers"
    ]
  },
  179: {
    title: "Final Revision",
    focus: "Everything",
    tasks: [
      "C++ rapid review",
      "DSA pattern review",
      "OOP review",
      "DBMS review",
      "SQL review",
      "OS review",
      "CN review",
      "Java review",
      "System Design review",
      "HR review",
      "Resume review"
    ]
  },
  180: {
    title: "FINAL PLACEMENT SIMULATION",
    focus: "Placement readiness",
    tasks: [
      "Full aptitude assessment",
      "Full coding assessment",
      "Full SQL assessment",
      "Full technical assessment",
      "Full DSA interview",
      "Full CS interview",
      "Full project interview",
      "Full system design interview",
      "Full HR interview",
      "Explain every resume line",
      "Solve at least one unfamiliar Medium problem",
      "Review final weakness list",
      "Write final placement strategy",
      "Mark the 180 day journey complete"
    ]
  }
};

function getPhase(day) {
  if (day <= 30) return { phase: 1, phaseName: "FOUNDATION" };
  if (day <= 75) return { phase: 2, phaseName: "CORE DSA" };
  if (day <= 120) return { phase: 3, phaseName: "ADVANCED DSA + CS CORE" };
  if (day <= 150) return { phase: 4, phaseName: "INTERVIEW LEVEL" };
  if (day <= 170) return { phase: 5, phaseName: "INTERVIEW SIMULATION" };
  return { phase: 6, phaseName: "PLACEMENT MODE" };
}

function categorizeTask(task, dayFocus, dayTitle) {
  const t = (task + " " + dayFocus + " " + dayTitle).toLowerCase();
  if (t.includes('sql') || t.includes('query') || t.includes('cte') || t.includes('join') || t.includes('group by') || t.includes('window function')) return 'SQL';
  if (t.includes('dbms') || t.includes('database') || t.includes('acid') || t.includes('normalization') || t.includes('b tree') || t.includes('indexing')) return 'DBMS';
  if (t.includes('operating systems') || t.includes('os ') || t.includes('deadlock') || t.includes('paging') || t.includes('scheduling') || t.includes('mutex') || t.includes('semaphore') || t.includes('process') || t.includes('thread') || t.includes('context switch')) return 'OS';
  if (t.includes('network') || t.includes('tcp') || t.includes('udp') || t.includes('osi') || t.includes('http') || t.includes('dns') || t.includes('routing') || t.includes('google.com')) return 'CN';
  if (t.includes('system design') || t.includes('architecture') || t.includes('scale') || t.includes('load balanc') || t.includes('caching') || t.includes('sharding') || t.includes('redis') || t.includes('websocket')) return 'SYSTEM DESIGN';
  if (t.includes('java') || t.includes('jvm') || t.includes('jdk') || t.includes('arraylist')) return 'JAVA';
  if (t.includes('oop') || t.includes('encapsulation') || t.includes('polymorphism') || t.includes('inheritance') || t.includes('virtual function') || t.includes('class')) return 'OOP';
  if (t.includes('aptitude') || t.includes('percentages') || t.includes('probability') || t.includes('syllogism') || t.includes('blood relation')) return 'APTITUDE';
  if (t.includes('resume')) return 'RESUME';
  if (t.includes('project') || t.includes('defense') || t.includes('interrogation')) return 'PROJECTS';
  if (t.includes('behavioral') || t.includes('hr ') || t.includes('star structure') || t.includes('tell me about yourself')) return 'INTERVIEW';
  if (t.includes('c++') || t.includes('pointer') || t.includes('reference') || t.includes('cin') || t.includes('cout') || t.includes('vector') || t.includes('raii') || t.includes('move semantic')) return 'C++';
  if (t.includes('revision') || t.includes('revise') || t.includes('repair') || t.includes('mistake')) return 'REVISION';
  if (t.includes('assessment') || t.includes('simulation') || t.includes('test') || t.includes('mock')) return 'ASSESSMENT';
  return 'DSA';
}

const curriculum = [];

for (let d = 1; d <= 180; d++) {
  const data = rawData[d];
  if (!data) {
    console.error("Missing Day:", d);
    process.exit(1);
  }
  const { phase, phaseName } = getPhase(d);
  const dayPad = String(d).padStart(3, '0');
  
  const tasks = data.tasks.map((taskText, idx) => {
    const taskPad = String(idx + 1).padStart(2, '0');
    return {
      id: `d${dayPad}_t${taskPad}`,
      title: taskText,
      category: categorizeTask(taskText, data.focus, data.title),
    };
  });

  curriculum.push({
    id: d,
    dayNumber: d,
    phase,
    phaseName,
    title: data.title,
    focus: data.focus,
    tasks
  });
}

console.log(`Successfully parsed ${curriculum.length} days.`);

const outputPath = path.resolve('src/data/curriculum.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(curriculum, null, 2), 'utf-8');

const tsOutputPath = path.resolve('src/data/curriculum.ts');
fs.writeFileSync(
  tsOutputPath,
  `import { DayPlan } from '../types/curriculum';\nimport curriculumJson from './curriculum.json';\n\nexport const CURRICULUM: DayPlan[] = curriculumJson as DayPlan[];\n\nexport const TOTAL_DAYS = 180;\n\nexport const PHASES = [\n  { phase: 1, name: 'FOUNDATION', start: 1, end: 30, desc: 'C++, STL, Basic SQL, OOP, Complexity' },\n  { phase: 2, name: 'CORE DSA', start: 31, end: 75, desc: 'Pointers, Lists, Stacks, Trees, Graphs, DP' },\n  { phase: 3, name: 'ADVANCED DSA + CS CORE', start: 76, end: 120, desc: 'Graphs, DP, DBMS, OS, Networks, Java' },\n  { phase: 4, name: 'INTERVIEW LEVEL', start: 121, end: 150, desc: 'System Design, Projects, Resume, Rapid Fire' },\n  { phase: 5, name: 'INTERVIEW SIMULATION', start: 151, end: 170, desc: 'Company Prep, Weakness Repair, Full Mocks' },\n  { phase: 6, name: 'PLACEMENT MODE', start: 171, end: 180, desc: 'Full Assessments, Final Placement Readiness' },\n];\n`,
  'utf-8'
);

console.log('Generated curriculum.json and curriculum.ts successfully.');
