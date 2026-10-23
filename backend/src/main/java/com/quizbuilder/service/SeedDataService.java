package com.quizbuilder.service;

import com.quizbuilder.entity.*;
import com.quizbuilder.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SeedDataService implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final PasswordEncoder passwordEncoder;

    public SeedDataService(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           QuestionRepository questionRepository,
                           AttemptRepository attemptRepository,
                           AttemptAnswerRepository attemptAnswerRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (categoryRepository.count() == 0 || userRepository.count() == 0) {
            populateSeedData();
        }
    }

    @Transactional
    public void resetSeedData() {
        attemptAnswerRepository.deleteAll();
        attemptRepository.deleteAll();
        questionRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        populateSeedData();
    }

    @Transactional
    public void populateSeedData() {
        // 1. Users
        User candidate = userRepository.findByEmail("user@omnix.com").orElseGet(() -> {
            User u = new User();
            u.setName("Candidate User");
            u.setEmail("user@omnix.com");
            u.setPassword(passwordEncoder.encode("user123"));
            u.setRole("ROLE_USER");
            u.setCreatedAt(LocalDateTime.now().minusDays(5));
            return userRepository.save(u);
        });

        User admin = userRepository.findByEmail("admin@omnix.com").orElseGet(() -> {
            User u = new User();
            u.setName("System Administrator");
            u.setEmail("admin@omnix.com");
            u.setPassword(passwordEncoder.encode("admin123"));
            u.setRole("ROLE_ADMIN");
            u.setCreatedAt(LocalDateTime.now().minusDays(10));
            return userRepository.save(u);
        });

        // 2. Categories
        Category javaCat = categoryRepository.save(new Category(
                "Java Core & Modern Features",
                "Fundamental OOP concepts, memory management, Java 8-17 features, and JVM internals.",
                "Medium",
                8
        ));

        Category webCat = categoryRepository.save(new Category(
                "Web Development & Architecture",
                "HTTP/HTTPS, RESTful APIs, DOM manipulation, state management, and modern browser APIs.",
                "Easy",
                6
        ));

        Category pythonCat = categoryRepository.save(new Category(
                "Python & Advanced Idioms",
                "Dynamic typing, list comprehensions, decorators, generators, and data model internals.",
                "Medium",
                7
        ));

        Category sqlCat = categoryRepository.save(new Category(
                "SQL & Relational Databases",
                "Queries, joins, indexing strategies, transactions, ACID properties, and query optimization.",
                "Hard",
                10
        ));

        Category dsaCat = categoryRepository.save(new Category(
                "Data Structures & Algorithms",
                "Arrays, Linked Lists, Trees, Heaps, Hash Tables, Big-O complexity, and traversal patterns.",
                "Hard",
                10
        ));

        Category logicCat = categoryRepository.save(new Category(
                "Analytical Logic & Problem Solving",
                "Formal propositional logic, deduction, algorithmic reasoning, and pattern identification.",
                "Easy",
                5
        ));

        // 3. Questions
        List<Question> questions = new ArrayList<>();

        // Java Questions
        Question j1 = new Question(javaCat,
                "What is the primary difference between String, StringBuilder, and StringBuffer in Java?",
                "String is immutable, StringBuffer is thread-safe and mutable, StringBuilder is non-thread-safe and mutable.",
                "String and StringBuilder are immutable, while StringBuffer is mutable.",
                "StringBuffer is faster than StringBuilder in single-threaded environments.",
                "All three are mutable, but String has synchronized methods.",
                "A",
                "String objects are immutable. StringBuffer methods are synchronized for thread-safety, whereas StringBuilder is unsynchronized and faster for single-threaded usage."
        );
        Question j2 = new Question(javaCat,
                "In Java memory management, where are objects dynamically created and where are method call frames stored?",
                "Objects in Stack, frames in Metaspace",
                "Objects in Heap, frames in Stack",
                "Objects in PermGen, frames in Heap",
                "Objects in Metaspace, frames in Heap",
                "B",
                "Dynamically allocated objects are stored on the JVM Heap, while local variables and method invocation frames are managed on the call Stack."
        );
        Question j3 = new Question(javaCat,
                "Which Java 8 feature allows passing behavior as an argument using a concise expression?",
                "Virtual Threads",
                "Lambda Expressions",
                "Records",
                "Pattern Matching",
                "B",
                "Lambda expressions enable treating functionality as method arguments or code as data, providing concise implementations for functional interfaces."
        );
        Question j4 = new Question(javaCat,
                "What happens if two objects return equal values for equals(), but different values for hashCode() when used in a HashSet?",
                "A compilation error is thrown immediately.",
                "The HashSet overwrites the duplicate entry.",
                "The HashSet may store both objects as distinct entries, violating the Set uniqueness contract.",
                "A NullPointerException is raised at runtime.",
                "C",
                "The Java contract states that equal objects must have equal hash codes. If violated, hash-based collections (HashSet, HashMap) place them in different buckets, leading to duplicate entries and lookup failures."
        );
        Question j5 = new Question(javaCat,
                "What is the purpose of the transient keyword in Java?",
                "It prevents a variable from being modified by concurrent threads.",
                "It indicates that a field should not be serialized during object serialization.",
                "It marks a method as non-overridable.",
                "It forces garbage collection on that specific variable immediately.",
                "B",
                "The transient modifier indicates that the field should be skipped by the JVM when serializing an instance of a Serializable class."
        );
        questions.addAll(List.of(j1, j2, j3, j4, j5));

        // Web Development Questions
        Question w1 = new Question(webCat,
                "Which HTTP method should be used to apply partial modifications to an existing resource in a RESTful API?",
                "PUT",
                "PATCH",
                "POST",
                "OPTIONS",
                "B",
                "PATCH is defined in RFC 5789 for applying partial modifications to a resource, whereas PUT typically replaces the entire resource representation."
        );
        Question w2 = new Question(webCat,
                "What mechanism prevents a web page from making AJAX requests to a different domain unless permitted by the server?",
                "Content Security Policy (CSP)",
                "Same-Origin Policy (SOP) via CORS",
                "HTTP Strict Transport Security (HSTS)",
                "Cross-Site Request Forgery (CSRF)",
                "B",
                "The browser Same-Origin Policy enforces origin boundaries. Cross-Origin Resource Sharing (CORS) headers allow servers to explicitly permit cross-origin access."
        );
        Question w3 = new Question(webCat,
                "In modern CSS, what does the Box Model consist of, ordered from inside out?",
                "Content, Margin, Border, Padding",
                "Content, Padding, Border, Margin",
                "Padding, Content, Border, Margin",
                "Margin, Border, Content, Padding",
                "B",
                "The CSS box model consists of the inner Content area, surrounded by Padding, then the Border, and finally the outer Margin."
        );
        Question w4 = new Question(webCat,
                "What is the primary role of the Event Loop in JavaScript runtimes?",
                "To run background multi-threaded CPU calculations directly.",
                "To monitor the Call Stack and Callback/Microtask Queues, pushing tasks onto the stack when empty.",
                "To compile TypeScript into JavaScript in the browser.",
                "To store DOM nodes in local storage memory.",
                "B",
                "JavaScript is single-threaded; the Event Loop continuously checks if the Call Stack is empty and moves callbacks from microtask and macrotask queues to execute."
        );
        Question w5 = new Question(webCat,
                "What HTTP status code represents a successful request that resulted in the creation of a new resource?",
                "200 OK",
                "201 Created",
                "204 No Content",
                "202 Accepted",
                "B",
                "HTTP 201 Created signifies that the request succeeded and led to the creation of a new resource, usually with a Location header pointing to it."
        );
        questions.addAll(List.of(w1, w2, w3, w4, w5));

        // Python Questions
        Question p1 = new Question(pythonCat,
                "In Python, what is the key difference between a List and a Tuple?",
                "Lists are immutable and use parentheses; Tuples are mutable and use brackets.",
                "Lists are mutable; Tuples are immutable and can be used as dictionary keys if hashable.",
                "Tuples cannot store heterogenous data types.",
                "Lists have O(1) worst-case search time; Tuples have O(N).",
                "B",
                "Lists are mutable sequences, whereas Tuples are immutable. Because of immutability, tuples containing only immutable objects can be hashed and used as dictionary keys."
        );
        Question p2 = new Question(pythonCat,
                "What does the Global Interpreter Lock (GIL) in CPython do?",
                "It locks global variables from being modified by functions.",
                "It prevents multiple native threads from executing Python bytecodes concurrently in a single process.",
                "It encrypts python scripts during bytecode compilation.",
                "It disables file I/O operations across asynchronous routines.",
                "B",
                "CPython uses the GIL as a mutex to prevent race conditions in its reference-counting memory management, allowing only one thread to execute Python bytecode at a time."
        );
        Question p3 = new Question(pythonCat,
                "What keyword is used in a Python function to turn it into a generator that yields values on demand?",
                "return",
                "yield",
                "async",
                "produce",
                "B",
                "The yield statement suspends function execution and returns a value to the caller, turning the function into an iterable generator without storing all items in memory."
        );
        Question p4 = new Question(pythonCat,
                "In Python dictionary operations, what is the average time complexity for key lookup and insertion?",
                "O(N)",
                "O(log N)",
                "O(1)",
                "O(N log N)",
                "C",
                "Python dictionaries are implemented as dynamic hash tables, providing average time complexity of O(1) for search, insert, and delete operations."
        );
        Question p5 = new Question(pythonCat,
                "What does the @classmethod decorator signify on a class method in Python?",
                "The method can only be invoked by subclass instances.",
                "The method receives the class (cls) as its first implicit parameter rather than an instance (self).",
                "The method is private to the class module.",
                "The method is static and cannot access class or instance variables.",
                "B",
                "A method decorated with @classmethod receives the class object as its first argument (usually named cls), allowing factory methods and class-level modifications."
        );
        questions.addAll(List.of(p1, p2, p3, p4, p5));

        // SQL Questions
        Question s1 = new Question(sqlCat,
                "Which SQL clause is used to filter the results of an aggregate function such as COUNT(), SUM(), or AVG()?",
                "WHERE",
                "HAVING",
                "ORDER BY",
                "GROUP BY",
                "B",
                "The WHERE clause filters individual rows before aggregation occurs, whereas the HAVING clause filters groups created by the GROUP BY aggregate operations."
        );
        Question s2 = new Question(sqlCat,
                "What does the 'I' stand for in the ACID transaction guarantees of relational databases?",
                "Indexed",
                "Immutable",
                "Isolation",
                "Idempotent",
                "C",
                "ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation ensures concurrent transactions do not interfere with each other."
        );
        Question s3 = new Question(sqlCat,
                "What is the primary difference between an INNER JOIN and a LEFT JOIN in SQL?",
                "INNER JOIN returns matching rows from both tables; LEFT JOIN returns all rows from the left table and matched rows from the right table.",
                "LEFT JOIN removes null values, while INNER JOIN keeps them.",
                "INNER JOIN performs a cartesian product; LEFT JOIN does not.",
                "LEFT JOIN can only join tables on primary keys.",
                "A",
                "An INNER JOIN filters out records that do not have a match in both tables, whereas a LEFT OUTER JOIN preserves all records from the left table, filling unmatched right attributes with NULL."
        );
        Question s4 = new Question(sqlCat,
                "What type of index is most commonly used by default in relational databases like MySQL InnoDB for range and equality searches?",
                "Hash Index",
                "B-Tree / B+Tree Index",
                "Bitmap Index",
                "R-Tree Index",
                "B",
                "B+Tree structures maintain sorted keys with linked leaf nodes, enabling efficient O(log N) lookups, range scans, and sorting operations in InnoDB."
        );
        Question s5 = new Question(sqlCat,
                "What is the phenomenon called when two transactions are each waiting for a lock held by the other, preventing either from progressing?",
                "Dirty Read",
                "Phantom Read",
                "Deadlock",
                "Cascade Failure",
                "C",
                "A deadlock occurs when two or more transactions hold locks on different resources and each attempts to acquire a lock held by the other, creating a circular dependency."
        );
        questions.addAll(List.of(s1, s2, s3, s4, s5));

        // Data Structures Questions
        Question d1 = new Question(dsaCat,
                "What is the worst-case time complexity of standard QuickSort when the pivot chosen is consistently the smallest or largest element?",
                "O(N)",
                "O(N log N)",
                "O(N^2)",
                "O(log N)",
                "C",
                "When the pivot partitions an array into an empty subarray and an N-1 subarray at each step, QuickSort degenerates to O(N^2) time complexity."
        );
        Question d2 = new Question(dsaCat,
                "Which data structure operates on a First-In, First-Out (FIFO) principle?",
                "Stack",
                "Queue",
                "Binary Search Tree",
                "Priority Heap",
                "B",
                "A Queue follows FIFO order: the first element enqueued is the first element dequeued. Stacks follow LIFO (Last-In, First-Out)."
        );
        Question d3 = new Question(dsaCat,
                "In a balanced Binary Search Tree (such as an AVL or Red-Black Tree) with N nodes, what is the worst-case time complexity for search, insert, and delete?",
                "O(1)",
                "O(log N)",
                "O(N)",
                "O(N log N)",
                "B",
                "Self-balancing binary search trees maintain a maximum height proportional to log2(N), guaranteeing O(log N) worst-case time for search, insertion, and deletion."
        );
        Question d4 = new Question(dsaCat,
                "What technique resolves hash table collisions by storing collided elements in a linked list or chain at the bucket address?",
                "Open Addressing with Linear Probing",
                "Separate Chaining",
                "Double Hashing",
                "Quadratic Probing",
                "B",
                "Separate Chaining maintains a linked list (or balanced tree) at each bucket in the hash table to store all key-value entries that hash to that index."
        );
        Question d5 = new Question(dsaCat,
                "Which graph traversal algorithm uses a Queue and explores neighbor nodes at the present depth level before moving deeper?",
                "Depth-First Search (DFS)",
                "Breadth-First Search (BFS)",
                "Dijkstra Algorithm with Min-Heap",
                "Kruskal Algorithm",
                "B",
                "Breadth-First Search (BFS) uses a FIFO queue to systematically explore all vertices at depth k before visiting vertices at depth k+1."
        );
        questions.addAll(List.of(d1, d2, d3, d4, d5));

        // Logic Questions
        Question l1 = new Question(logicCat,
                "If 'All developers drink coffee' and 'Alex is a developer', what logically sound conclusion follows?",
                "Alex owns a coffee machine.",
                "Alex drinks coffee.",
                "Everyone who drinks coffee is a developer.",
                "Alex drinks tea.",
                "B",
                "This is a classical syllogism (Modus Ponens): Major premise (All D are C) and minor premise (A is D) validly and soundly entail that Alex drinks coffee."
        );
        Question l2 = new Question(logicCat,
                "What is the logical negation of the statement: 'Every student passed the exam'?",
                "No student passed the exam.",
                "At least one student did not pass the exam.",
                "Every student failed the exam.",
                "Most students passed the exam.",
                "B",
                "The negation of a universal affirmative ('For all x, P(x)') is an existential statement ('There exists at least one x such that NOT P(x)')."
        );
        Question l3 = new Question(logicCat,
                "Complete the sequence: 2, 6, 12, 20, 30, ?",
                "40",
                "42",
                "44",
                "48",
                "B",
                "The pattern represents consecutive differences: +4, +6, +8, +10, so next is +12 (30 + 12 = 42). Alternately, n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42."
        );
        Question l4 = new Question(logicCat,
                "In boolean algebra, what is the equivalent of NOT(A AND B) according to De Morgan laws?",
                "(NOT A) AND (NOT B)",
                "(NOT A) OR (NOT B)",
                "A OR B",
                "NOT A XOR NOT B",
                "B",
                "De Morgan laws dictate that the negation of a conjunction is the disjunction of the negations: !(A && B) == (!A || !B)."
        );
        Question l5 = new Question(logicCat,
                "A clock shows 3:15. What is the angle between the hour hand and the minute hand?",
                "0 degrees",
                "7.5 degrees",
                "15 degrees",
                "30 degrees",
                "B",
                "At 3:15, the minute hand points directly at 3 (90 degrees). The hour hand has moved 15 minutes past 3: (15 / 60) * 30 degrees = 7.5 degrees."
        );
        questions.addAll(List.of(l1, l2, l3, l4, l5));

        questionRepository.saveAll(questions);

        // 4. Sample attempts for candidate user in Java category
        // Baseline Attempt 1 (Score: 3/5)
        Attempt attempt1 = new Attempt();
        attempt1.setUser(candidate);
        attempt1.setCategory(javaCat);
        attempt1.setAttemptNumber(1);
        attempt1.setScore(3);
        attempt1.setTotal(5);
        attempt1.setStatus("COMPLETED");
        attempt1.setStartedAt(LocalDateTime.now().minusHours(3));
        attempt1.setSubmittedAt(LocalDateTime.now().minusHours(3).plusMinutes(6));
        attemptRepository.save(attempt1);

        List<AttemptAnswer> answers1 = List.of(
                new AttemptAnswer(attempt1, j1, "A", true),
                new AttemptAnswer(attempt1, j2, "B", true),
                new AttemptAnswer(attempt1, j3, "A", false),
                new AttemptAnswer(attempt1, j4, "B", false),
                new AttemptAnswer(attempt1, j5, "B", true)
        );
        attemptAnswerRepository.saveAll(answers1);

        // Final Retake Attempt 2 (Score: 5/5 -> Delta = +2)
        Attempt attempt2 = new Attempt();
        attempt2.setUser(candidate);
        attempt2.setCategory(javaCat);
        attempt2.setAttemptNumber(2);
        attempt2.setScore(5);
        attempt2.setTotal(5);
        attempt2.setStatus("COMPLETED");
        attempt2.setStartedAt(LocalDateTime.now().minusHours(1));
        attempt2.setSubmittedAt(LocalDateTime.now().minusHours(1).plusMinutes(5));
        attemptRepository.save(attempt2);

        List<AttemptAnswer> answers2 = List.of(
                new AttemptAnswer(attempt2, j1, "A", true),
                new AttemptAnswer(attempt2, j2, "B", true),
                new AttemptAnswer(attempt2, j3, "B", true),
                new AttemptAnswer(attempt2, j4, "C", true),
                new AttemptAnswer(attempt2, j5, "B", true)
        );
        attemptAnswerRepository.saveAll(answers2);
    }
}
