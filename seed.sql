-- Quiz Builder Seed Data
USE `quiz_builder`;

-- 1. Insert Seed Users
-- Password for user@omnix.com is 'user123'
-- Password for admin@omnix.com is 'admin123'
-- BCrypt format: 10 rounds
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Candidate User', 'user@omnix.com', '$2a$10$wKzNn8k7kF7p0L2t8w.UaekR/OqR0mYp49V8ZpI4x18H6o.L4Wf6m', 'ROLE_USER', NOW()),
(2, 'System Administrator', 'admin@omnix.com', '$2a$10$4nflA4n0eYV/v1V0BsqWfOqKj7jO5F3t6O5vVq0t4Y4vW4Qj8jO5m', 'ROLE_ADMIN', NOW());

-- 2. Insert 6 Categories
INSERT INTO `categories` (`id`, `title`, `description`, `difficulty`, `timer_minutes`) VALUES
(1, 'Java Core & Modern Features', 'Fundamental OOP concepts, memory management, Java 8-17 features, and JVM internals.', 'Medium', 8),
(2, 'Web Development & Architecture', 'HTTP/HTTPS, RESTful APIs, DOM manipulation, state management, and modern browser APIs.', 'Easy', 6),
(3, 'Python & Advanced Idioms', 'Dynamic typing, list comprehensions, decorators, generators, and data model internals.', 'Medium', 7),
(4, 'SQL & Relational Databases', 'Queries, joins, indexing strategies, transactions, ACID properties, and query optimization.', 'Hard', 10),
(5, 'Data Structures & Algorithms', 'Arrays, Linked Lists, Trees, Heaps, Hash Tables, Big-O complexity, and traversal patterns.', 'Hard', 10),
(6, 'Analytical Logic & Problem Solving', 'Formal propositional logic, deduction, algorithmic reasoning, and pattern identification.', 'Easy', 5);

-- 3. Insert Questions (5+ for each category)

-- Category 1: Java (id: 1)
INSERT INTO `questions` (`id`, `category_id`, `text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`) VALUES
(1, 1, 'What is the primary difference between String, StringBuilder, and StringBuffer in Java?', 
 'String is immutable, StringBuffer is thread-safe and mutable, StringBuilder is non-thread-safe and mutable.', 
 'String and StringBuilder are immutable, while StringBuffer is mutable.', 
 'StringBuffer is faster than StringBuilder in single-threaded environments.', 
 'All three are mutable, but String has synchronized methods.', 
 'A', 'String objects are immutable. StringBuffer methods are synchronized for thread-safety, whereas StringBuilder is unsynchronized and faster for single-threaded usage.'),

(2, 1, 'In Java memory management, where are objects dynamically created and where are method call frames stored?', 
 'Objects in Stack, frames in Metaspace', 
 'Objects in Heap, frames in Stack', 
 'Objects in PermGen, frames in Heap', 
 'Objects in Metaspace, frames in Heap', 
 'B', 'Dynamically allocated objects are stored on the JVM Heap, while local variables and method invocation frames are managed on the call Stack.'),

(3, 1, 'Which Java 8 feature allows passing behavior as an argument using a concise expression?', 
 'Virtual Threads', 
 'Lambda Expressions', 
 'Records', 
 'Pattern Matching', 
 'B', 'Lambda expressions enable treating functionality as method arguments or code as data, providing concise implementations for functional interfaces.'),

(4, 1, 'What happens if two objects return equal values for equals(), but different values for hashCode() when used in a HashSet?', 
 'A compilation error is thrown immediately.', 
 'The HashSet overwrites the duplicate entry.', 
 'The HashSet may store both objects as distinct entries, violating the Set uniqueness contract.', 
 'A NullPointerException is raised at runtime.', 
 'C', 'The Java contract states that equal objects must have equal hash codes. If violated, hash-based collections (HashSet, HashMap) place them in different buckets, leading to duplicate entries and lookup failures.'),

(5, 1, 'What is the purpose of the transient keyword in Java?', 
 'It prevents a variable from being modified by concurrent threads.', 
 'It indicates that a field should not be serialized during object serialization.', 
 'It marks a method as non-overridable.', 
 'It forces garbage collection on that specific variable immediately.', 
 'B', 'The transient modifier indicates that the field should be skipped by the JVM when serializing an instance of a Serializable class.');

-- Category 2: Web Development (id: 2)
INSERT INTO `questions` (`id`, `category_id`, `text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`) VALUES
(6, 2, 'Which HTTP method should be used to apply partial modifications to an existing resource in a RESTful API?', 
 'PUT', 
 'PATCH', 
 'POST', 
 'OPTIONS', 
 'B', 'PATCH is defined in RFC 5789 for applying partial modifications to a resource, whereas PUT typically replaces the entire resource representation.'),

(7, 2, 'What mechanism prevents a web page from making AJAX requests to a different domain unless permitted by the server?', 
 'Content Security Policy (CSP)', 
 'Same-Origin Policy (SOP) via CORS', 
 'HTTP Strict Transport Security (HSTS)', 
 'Cross-Site Request Forgery (CSRF)', 
 'B', 'The browser Same-Origin Policy enforces origin boundaries. Cross-Origin Resource Sharing (CORS) headers allow servers to explicitly permit cross-origin access.'),

(8, 2, 'In modern CSS, what does the Box Model consist of, ordered from inside out?', 
 'Content, Margin, Border, Padding', 
 'Content, Padding, Border, Margin', 
 'Padding, Content, Border, Margin', 
 'Margin, Border, Content, Padding', 
 'B', 'The CSS box model consists of the inner Content area, surrounded by Padding, then the Border, and finally the outer Margin.'),

(9, 2, 'What is the primary role of the Event Loop in JavaScript runtimes?', 
 'To run background multi-threaded CPU calculations directly.', 
 'To monitor the Call Stack and Callback/Microtask Queues, pushing tasks onto the stack when empty.', 
 'To compile TypeScript into JavaScript in the browser.', 
 'To store DOM nodes in local storage memory.', 
 'B', 'JavaScript is single-threaded; the Event Loop continuously checks if the Call Stack is empty and moves callbacks from microtask and macrotask queues to execute.'),

(10, 2, 'What HTTP status code represents a successful request that resulted in the creation of a new resource?', 
 '200 OK', 
 '201 Created', 
 '204 No Content', 
 '202 Accepted', 
 'B', 'HTTP 201 Created signifies that the request succeeded and led to the creation of a new resource, usually with a Location header pointing to it.');

-- Category 3: Python (id: 3)
INSERT INTO `questions` (`id`, `category_id`, `text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`) VALUES
(11, 3, 'In Python, what is the key difference between a List and a Tuple?', 
 'Lists are immutable and use parentheses; Tuples are mutable and use brackets.', 
 'Lists are mutable; Tuples are immutable and can be used as dictionary keys if hashable.', 
 'Tuples cannot store heterogenous data types.', 
 'Lists have O(1) worst-case search time; Tuples have O(N).', 
 'B', 'Lists are mutable sequences, whereas Tuples are immutable. Because of immutability, tuples containing only immutable objects can be hashed and used as dictionary keys.'),

(12, 3, 'What does the Global Interpreter Lock (GIL) in CPython do?', 
 'It locks global variables from being modified by functions.', 
 'It prevents multiple native threads from executing Python bytecodes concurrently in a single process.', 
 'It encrypts python scripts during bytecode compilation.', 
 'It disables file I/O operations across asynchronous routines.', 
 'B', 'CPython uses the GIL as a mutex to prevent race conditions in its reference-counting memory management, allowing only one thread to execute Python bytecode at a time.'),

(13, 3, 'What keyword is used in a Python function to turn it into a generator that yields values on demand?', 
 'return', 
 'yield', 
 'async', 
 'produce', 
 'B', 'The yield statement suspends function execution and returns a value to the caller, turning the function into an iterable generator without storing all items in memory.'),

(14, 3, 'In Python dictionary operations, what is the average time complexity for key lookup and insertion?', 
 'O(N)', 
 'O(log N)', 
 'O(1)', 
 'O(N log N)', 
 'C', 'Python dictionaries are implemented as dynamic hash tables, providing average time complexity of O(1) for search, insert, and delete operations.'),

(15, 3, 'What does the @classmethod decorator signify on a class method in Python?', 
 'The method can only be invoked by subclass instances.', 
 'The method receives the class (cls) as its first implicit parameter rather than an instance (self).', 
 'The method is private to the class module.', 
 'The method is static and cannot access class or instance variables.', 
 'B', 'A method decorated with @classmethod receives the class object as its first argument (usually named cls), allowing factory methods and class-level modifications.');

-- Category 4: SQL & Relational Databases (id: 4)
INSERT INTO `questions` (`id`, `category_id`, `text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`) VALUES
(16, 4, 'Which SQL clause is used to filter the results of an aggregate function such as COUNT(), SUM(), or AVG()?', 
 'WHERE', 
 'HAVING', 
 'ORDER BY', 
 'GROUP BY', 
 'B', 'The WHERE clause filters individual rows before aggregation occurs, whereas the HAVING clause filters groups created by the GROUP BY aggregate operations.'),

(17, 4, 'What does the "I" stand for in the ACID transaction guarantees of relational databases?', 
 'Indexed', 
 'Immutable', 
 'Isolation', 
 'Idempotent', 
 'C', 'ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation ensures concurrent transactions do not interfere with each other.'),

(18, 4, 'What is the primary difference between an INNER JOIN and a LEFT JOIN in SQL?', 
 'INNER JOIN returns matching rows from both tables; LEFT JOIN returns all rows from the left table and matched rows from the right table.', 
 'LEFT JOIN removes null values, while INNER JOIN keeps them.', 
 'INNER JOIN performs a cartesian product; LEFT JOIN does not.', 
 'LEFT JOIN can only join tables on primary keys.', 
 'A', 'An INNER JOIN filters out records that do not have a match in both tables, whereas a LEFT OUTER JOIN preserves all records from the left table, filling unmatched right attributes with NULL.'),

(19, 4, 'What type of index is most commonly used by default in relational databases like MySQL InnoDB for range and equality searches?', 
 'Hash Index', 
 'B-Tree / B+Tree Index', 
 'Bitmap Index', 
 'R-Tree Index', 
 'B', 'B+Tree structures maintain sorted keys with linked leaf nodes, enabling efficient O(log N) lookups, range scans, and sorting operations in InnoDB.'),

(20, 4, 'What is the phenomenon called when two transactions are each waiting for a lock held by the other, preventing either from progressing?', 
 'Dirty Read', 
 'Phantom Read', 
 'Deadlock', 
 'Cascade Failure', 
 'C', 'A deadlock occurs when two or more transactions hold locks on different resources and each attempts to acquire a lock held by the other, creating a circular dependency.');

-- Category 5: Data Structures & Algorithms (id: 5)
INSERT INTO `questions` (`id`, `category_id`, `text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`) VALUES
(21, 5, 'What is the worst-case time complexity of standard QuickSort when the pivot chosen is consistently the smallest or largest element?', 
 'O(N)', 
 'O(N log N)', 
 'O(N^2)', 
 'O(log N)', 
 'C', 'When the pivot partitions an array into an empty subarray and an N-1 subarray at each step, QuickSort degenerates to O(N^2) time complexity.'),

(22, 5, 'Which data structure operates on a First-In, First-Out (FIFO) principle?', 
 'Stack', 
 'Queue', 
 'Binary Search Tree', 
 'Priority Heap', 
 'B', 'A Queue follows FIFO order: the first element enqueued is the first element dequeued. Stacks follow LIFO (Last-In, First-Out).'),

(23, 5, 'In a balanced Binary Search Tree (such as an AVL or Red-Black Tree) with N nodes, what is the worst-case time complexity for search, insert, and delete?', 
 'O(1)', 
 'O(log N)', 
 'O(N)', 
 'O(N log N)', 
 'B', 'Self-balancing binary search trees maintain a maximum height proportional to log2(N), guaranteeing O(log N) worst-case time for search, insertion, and deletion.'),

(24, 5, 'What technique resolves hash table collisions by storing collided elements in a linked list or chain at the bucket address?', 
 'Open Addressing with Linear Probing', 
 'Separate Chaining', 
 'Double Hashing', 
 'Quadratic Probing', 
 'B', 'Separate Chaining maintains a linked list (or balanced tree) at each bucket in the hash table to store all key-value entries that hash to that index.'),

(25, 5, 'Which graph traversal algorithm uses a Queue and explores neighbor nodes at the present depth level before moving deeper?', 
 'Depth-First Search (DFS)', 
 'Breadth-First Search (BFS)', 
 'Dijkstra Algorithm with Min-Heap', 
 'Kruskal Algorithm', 
 'B', 'Breadth-First Search (BFS) uses a FIFO queue to systematically explore all vertices at depth k before visiting vertices at depth k+1.');

-- Category 6: Analytical Logic & Reasoning (id: 6)
INSERT INTO `questions` (`id`, `category_id`, `text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`) VALUES
(26, 6, 'If "All developers drink coffee" and "Alex is a developer", what logically sound conclusion follows?', 
 'Alex owns a coffee machine.', 
 'Alex drinks coffee.', 
 'Everyone who drinks coffee is a developer.', 
 'Alex drinks tea.', 
 'B', 'This is a classical syllogism (Modus Ponens): Major premise (All D are C) and minor premise (A is D) validly and soundly entail that Alex drinks coffee.'),

(27, 6, 'What is the logical negation of the statement: "Every student passed the exam"?', 
 'No student passed the exam.', 
 'At least one student did not pass the exam.', 
 'Every student failed the exam.', 
 'Most students passed the exam.', 
 'B', 'The negation of a universal affirmative ("For all x, P(x)") is an existential statement ("There exists at least one x such that NOT P(x)").'),

(28, 6, 'Complete the sequence: 2, 6, 12, 20, 30, ?', 
 '40', 
 '42', 
 '44', 
 '48', 
 'B', 'The pattern represents consecutive differences: +4, +6, +8, +10, so next is +12 (30 + 12 = 42). Alternately, n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42.'),

(29, 6, 'In boolean algebra, what is the equivalent of NOT(A AND B) according to De Morgan laws?', 
 '(NOT A) AND (NOT B)', 
 '(NOT A) OR (NOT B)', 
 'A OR B', 
 'NOT A XOR NOT B', 
 'B', 'De Morgan laws dictate that the negation of a conjunction is the disjunction of the negations: !(A && B) == (!A || !B).'),

(30, 6, 'A clock shows 3:15. What is the angle between the hour hand and the minute hand?', 
 '0 degrees', 
 '7.5 degrees', 
 '15 degrees', 
 '30 degrees', 
 'B', 'At 3:15, the minute hand points directly at 3 (90 degrees). The hour hand has moved 15 minutes past 3: (15 / 60) * 30 degrees = 7.5 degrees.');

-- 4. Sample Completed Attempts for Candidate User (id: 1) on Java (id: 1)
-- Attempt 1 (Baseline): Score 3/5
INSERT INTO `attempts` (`id`, `user_id`, `category_id`, `attempt_number`, `score`, `total`, `started_at`, `submitted_at`, `status`) VALUES
(1, 1, 1, 1, 3, 5, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR 53 MINUTE), 'COMPLETED'),
-- Attempt 2 (Retake): Score 5/5 -> Delta = +2 (+40%)
(2, 1, 1, 2, 5, 5, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 54 MINUTE), 'COMPLETED');

-- Answers for Attempt 1
INSERT INTO `attempt_answers` (`id`, `attempt_id`, `question_id`, `selected_option`, `is_correct`) VALUES
(1, 1, 1, 'A', TRUE),
(2, 1, 2, 'B', TRUE),
(3, 1, 3, 'A', FALSE),
(4, 1, 4, 'B', FALSE),
(5, 1, 5, 'B', TRUE);

-- Answers for Attempt 2
INSERT INTO `attempt_answers` (`id`, `attempt_id`, `question_id`, `selected_option`, `is_correct`) VALUES
(6, 2, 1, 'A', TRUE),
(7, 2, 2, 'B', TRUE),
(8, 2, 3, 'B', TRUE),
(9, 2, 4, 'C', TRUE),
(10, 2, 5, 'B', TRUE);
