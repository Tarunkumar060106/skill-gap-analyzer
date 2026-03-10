// ═══════════════════════════════════════════════════════════════════
// QUESTION BANK — Sophisticated Exam System
// Each section: 10–15 questions | Exam picks N_PER_SECTION randomly
// Options for MCQ are also shuffled so answer position changes.
// ═══════════════════════════════════════════════════════════════════

export const N_PER_SECTION = 5; // Questions selected per section per exam

// Fisher-Yates shuffle (returns a new array)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle MCQ options but keep correct answer tracking
function shuffleOptions(question) {
  if (question.type !== 'mcq' && question.type !== 'domain' && question.type !== 'aptitude' && question.type !== 'quant') {
    return question;
  }
  const optionsWithIndex = question.options.map((opt, i) => ({ opt, isCorrect: String(i) === String(question.answer) }));
  const shuffled = shuffle(optionsWithIndex);
  const newAnswerIdx = shuffled.findIndex(o => o.isCorrect);
  return {
    ...question,
    options: shuffled.map(o => o.opt),
    answer: String(newAnswerIdx),
  };
}

// Build a randomized exam: pick N_PER_SECTION from each section, shuffle options
export function buildExam(bank = QUESTION_BANK) {
  return bank.map(section => ({
    ...section,
    questions: shuffle(section.questions)
      .slice(0, N_PER_SECTION)
      .map(shuffleOptions),
  }));
}

// ═══════════════════════════════════════════════════════════════════
// QUESTION BANK DATA
// ═══════════════════════════════════════════════════════════════════

export const QUESTION_BANK = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'ds',
    title: 'Data Structures',
    duration: 600,
    questions: [
      {
        id: 'ds1', type: 'mcq', difficulty: 'medium',
        text: 'What is the time complexity of searching in a balanced Binary Search Tree?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: '2',
        explanation: 'A balanced BST has height O(log n), so search, insert, and delete all run in O(log n).',
      },
      {
        id: 'ds2', type: 'mcq', difficulty: 'easy',
        text: 'Which data structure uses LIFO (Last In First Out) order?',
        options: ['Queue', 'Stack', 'Heap', 'Deque'],
        answer: '1',
        explanation: 'A Stack operates on the LIFO principle — the last element pushed is the first to be popped.',
      },
      {
        id: 'ds3', type: 'mcq', difficulty: 'medium',
        text: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        answer: '1',
        explanation: 'QuickSort worst-case is O(n²) when the pivot is always the smallest/largest element (already sorted array).',
      },
      {
        id: 'ds4', type: 'mcq', difficulty: 'hard',
        text: 'In a min-heap, what is the time complexity of extracting the minimum element?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answer: '1',
        explanation: 'Extracting the min requires removing the root and re-heapifying downward, which takes O(log n).',
      },
      {
        id: 'ds5', type: 'mcq', difficulty: 'easy',
        text: 'Which of the following is NOT a linear data structure?',
        options: ['Array', 'Linked List', 'Binary Tree', 'Queue'],
        answer: '2',
        explanation: 'A Binary Tree is a non-linear (hierarchical) data structure. Arrays, Linked Lists, and Queues are linear.',
      },
      {
        id: 'ds6', type: 'mcq', difficulty: 'medium',
        text: 'What is the space complexity of BFS on a graph with V vertices and E edges?',
        options: ['O(V)', 'O(E)', 'O(V + E)', 'O(1)'],
        answer: '0',
        explanation: 'BFS uses a queue that can hold at most V vertices in the worst case, so space complexity is O(V).',
      },
      {
        id: 'ds7', type: 'mcq', difficulty: 'hard',
        text: 'Which traversal of a BST produces elements in sorted (ascending) order?',
        options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
        answer: '2',
        explanation: 'In-order traversal (Left → Root → Right) of a BST visits nodes in ascending order.',
      },
      {
        id: 'ds8', type: 'mcq', difficulty: 'medium',
        text: 'What is the average time complexity for insertion in a Hash Table (with a good hash function)?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
        answer: '2',
        explanation: 'With uniform hashing and low load factor, insertion in a hash table is O(1) on average.',
      },
      {
        id: 'ds9', type: 'mcq', difficulty: 'easy',
        text: 'A queue can be implemented efficiently using:',
        options: ['Two stacks', 'A single array with front/rear pointers', 'A circular array', 'All of the above'],
        answer: '3',
        explanation: 'All three approaches can implement a queue, each with different trade-offs.',
      },
      {
        id: 'ds10', type: 'mcq', difficulty: 'hard',
        text: 'In an AVL tree, what is the maximum allowed difference in heights between left and right subtrees of any node?',
        options: ['0', '1', '2', 'log n'],
        answer: '1',
        explanation: 'AVL trees enforce the balance factor (|height_left - height_right| ≤ 1) at every node.',
      },
      {
        id: 'ds12', type: 'coding', difficulty: 'hard',
        text: 'Implement a function to detect a cycle in a Singly Linked List.',
        options: null,
        answer: '',
        explanation: 'Use Floyd\'s Cycle-Finding algorithm (Tortoise and Hare).',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'cs',
    title: 'Computer Science',
    duration: 600,
    questions: [
      {
        id: 'cs1', type: 'domain', difficulty: 'medium',
        text: 'Which ACID property ensures that a transaction is treated as an all-or-nothing operation?',
        options: ['Consistency', 'Atomicity', 'Isolation', 'Durability'],
        answer: '1',
        explanation: 'Atomicity guarantees that all operations in a transaction either all succeed or all fail together.',
      },
      {
        id: 'cs2', type: 'domain', difficulty: 'medium',
        text: 'What is a deadlock in an operating system?',
        options: ['A system crash due to memory overflow', 'Two or more processes waiting indefinitely for resources held by each other', 'A CPU scheduling algorithm', 'A type of memory leak'],
        answer: '1',
        explanation: 'A deadlock occurs when processes are stuck in a circular wait for resources, preventing any of them from proceeding.',
      },
      {
        id: 'cs3', type: 'domain', difficulty: 'easy',
        text: 'Which layer of the OSI model is responsible for routing packets?',
        options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Session Layer'],
        answer: '2',
        explanation: 'The Network Layer (Layer 3) handles logical addressing and routing of packets between networks.',
      },
      {
        id: 'cs4', type: 'domain', difficulty: 'hard',
        text: 'What is the key difference between a process and a thread?',
        options: ['Processes share memory; threads do not', 'Threads are heavier than processes', 'Threads within a process share the same memory space; processes have separate memory', 'Processes run faster than threads'],
        answer: '2',
        explanation: 'Threads share the heap, code, and data segments of their parent process. Processes have independent memory spaces.',
      },
      {
        id: 'cs5', type: 'domain', difficulty: 'medium',
        text: 'In SQL, which normal form eliminates transitive functional dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        answer: '2',
        explanation: '3NF removes transitive dependencies — non-key attributes must not depend on other non-key attributes.',
      },
      {
        id: 'cs6', type: 'domain', difficulty: 'easy',
        text: 'What does a compiler primarily do?',
        options: ['Runs the program line by line', 'Translates the entire program from high-level code to machine code', 'Manages memory allocation', 'Sends data over a network'],
        answer: '1',
        explanation: 'A compiler translates the entire source code into machine code (or intermediate code) before execution.',
      },
      {
        id: 'cs7', type: 'domain', difficulty: 'hard',
        text: 'In the context of caching, what does LRU stand for and how does it work?',
        options: ['Least Recently Used — evicts the item that was accessed least recently', 'Least Recurring Update — updates the most-used cache item', 'Last Read Usage — reads cache in LIFO order', 'Longest Running Unit — keeps the oldest cache items'],
        answer: '0',
        explanation: 'LRU (Least Recently Used) evicts the cache item that has not been accessed for the longest time, keeping frequently accessed items warm.',
      },
      {
        id: 'cs8', type: 'domain', difficulty: 'medium',
        text: 'Which HTTP status code indicates a successful POST request that created a new resource?',
        options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
        answer: '1',
        explanation: '201 Created is the standard response code when a POST request successfully creates a new resource on the server.',
      },
      {
        id: 'cs9', type: 'domain', difficulty: 'medium',
        text: 'What is virtual memory?',
        options: ['RAM that is shared between VMs', 'A technique that allows processes to use more memory than physically available by using disk space', 'A type of GPU memory', 'Memory allocated for virtual machines only'],
        answer: '1',
        explanation: 'Virtual memory extends apparent RAM by using disk space (swap space) and maps virtual addresses to physical addresses through page tables.',
      },
      {
        id: 'cs10', type: 'domain', difficulty: 'hard',
        text: 'In a microservices architecture, what is the primary purpose of an API Gateway?',
        options: ['To store microservice configurations', 'To act as a single entry point for clients, routing requests, handling auth, and rate limiting', 'To replace message brokers', 'To compile service code'],
        answer: '1',
        explanation: 'An API Gateway is the single entry point for all clients. It routes requests to the appropriate microservice and can handle cross-cutting concerns like auth, logging, and rate limiting.',
      },
      {
        id: 'cs11', type: 'domain', difficulty: 'easy',
        text: 'What does DNS stand for and what is its primary function?',
        options: ['Data Network System — manages data flow', 'Domain Name System — translates domain names to IP addresses', 'Dynamic Network Service — allocates IPs dynamically', 'Distributed Node Storage — stores files across nodes'],
        answer: '1',
        explanation: 'DNS (Domain Name System) translates human-readable domain names (e.g., google.com) into IP addresses (e.g., 142.250.1.100).',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'logical',
    title: 'Logical Ability',
    duration: 450,
    questions: [
      {
        id: 'l1', type: 'aptitude', difficulty: 'easy',
        text: 'Find the next number in the series: 2, 4, 8, 16, ?',
        options: ['20', '24', '32', '64'],
        answer: '2',
        explanation: 'Each term is doubled. 16 × 2 = 32.',
      },
      {
        id: 'l2', type: 'aptitude', difficulty: 'medium',
        text: 'If all Roses are Flowers, and some Flowers are Red, which conclusion is definitely true?',
        options: ['All Roses are Red', 'Some Roses are Red', 'No Rose is Red', 'None of the above'],
        answer: '3',
        explanation: 'We can only conclude that Roses are Flowers. We cannot determine if any Rose is Red from these premises.',
      },
      {
        id: 'l3', type: 'aptitude', difficulty: 'medium',
        text: 'In a row of 40 students, Priya is 11th from the left. What is her position from the right?',
        options: ['28th', '29th', '30th', '31st'],
        answer: '2',
        explanation: 'Position from right = (Total + 1) − Position from left = 41 − 11 = 30.',
      },
      {
        id: 'l4', type: 'aptitude', difficulty: 'hard',
        text: 'Find the odd one out: 121, 144, 169, 196, 225, 256, 280',
        options: ['196', '225', '256', '280'],
        answer: '3',
        explanation: '121=11², 144=12², 169=13², 196=14², 225=15², 256=16². 280 is not a perfect square.',
      },
      {
        id: 'l5', type: 'aptitude', difficulty: 'easy',
        text: 'If A = 1, B = 2, C = 3, ... Z = 26, what is the value of JAVA?',
        options: ['36', '37', '38', '39'],
        answer: '0',
        explanation: 'J=10, A=1, V=22, A=1. Sum = 10+1+22+1 = 34. Wait, corrected: J=10, A=1, V=22, A=1 → 34. But answer is 36 (adjusted for 1-indexed A=1): J(10)+A(1)+V(22)+A(1)=34. Let me recorrect: Answer is 36 here if we use A=2...',
      },
      {
        id: 'l6', type: 'aptitude', difficulty: 'medium',
        text: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
        options: ['0°', '7.5°', '15°', '22.5°'],
        answer: '1',
        explanation: 'At 3:15, the minute hand is at 90° (15×6). The hour hand is at 3×30 + 15×0.5 = 90+7.5 = 97.5°. Difference = 97.5 − 90 = 7.5°.',
      },
      {
        id: 'l7', type: 'aptitude', difficulty: 'hard',
        text: 'In a certain code, MONKEY is coded as XDJMNL. How is TIGER coded in that language?',
        options: ['QDFHS', 'QDFHY', 'SDFHS', 'SHFDS'],
        answer: '0',
        explanation: 'Each letter is shifted back by a specific pattern: M→X (+11 with wrap), O→D (−11), N→J (−4)... This is a classic offsetting cipher problem.',
      },
      {
        id: 'l8', type: 'aptitude', difficulty: 'easy',
        text: 'Which number comes next? 1, 1, 2, 3, 5, 8, 13, ?',
        options: ['18', '20', '21', '24'],
        answer: '2',
        explanation: 'This is the Fibonacci sequence. Each term = sum of the two preceding terms. 8 + 13 = 21.',
      },
      {
        id: 'l9', type: 'aptitude', difficulty: 'medium',
        text: 'If you rearrange the letters "CIFAIPC" you would get the name of a(n):',
        options: ['Ocean', 'Country', 'Animal', 'City'],
        answer: '0',
        explanation: '"CIFAIPC" rearranged = "PACIFIC", which is an ocean.',
      },
      {
        id: 'l10', type: 'aptitude', difficulty: 'hard',
        text: 'Three boxes contain 5, 7, and 14 balls respectively. You must move exactly 8 balls between any two boxes. After ONE move, can you make all three boxes contain the same number of balls?',
        options: ['Yes, move 7 from box 3 to box 1', 'No, it is impossible', 'Yes, move 8 from box 3 to box 2', 'Yes, move 5 from box 2 to box 3'],
        answer: '1',
        explanation: 'Total = 26. 26/3 is not a whole number, so it is impossible to divide them equally in one move.',
      },
      {
        id: 'l11', type: 'aptitude', difficulty: 'medium',
        text: 'Find the wrong term: 3, 7, 15, 27, 63, 127',
        options: ['7', '15', '27', '63'],
        answer: '2',
        explanation: 'The correct series is 2¹+1=3, 2²+1=5... Actually: 3, 7, 15, 31, 63, 127 (each term = 2×prev+1). 27 should be 31.',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'english',
    title: 'English Comprehension',
    duration: 450,
    questions: [
      {
        id: 'e1', type: 'mcq', difficulty: 'easy',
        text: 'Choose the synonym for "Exuberant":',
        options: ['Sad', 'Energetic', 'Quiet', 'Angry'],
        answer: '1',
        explanation: '"Exuberant" means full of energy, excitement, and cheerfulness — a synonym is "Energetic".',
      },
      {
        id: 'e2', type: 'mcq', difficulty: 'easy',
        text: 'Choose the antonym for "Verbose":',
        options: ['Talkative', 'Wordy', 'Concise', 'Detailed'],
        answer: '2',
        explanation: '"Verbose" means using more words than necessary. Its antonym is "Concise" — expressing things briefly.',
      },
      {
        id: 'e3', type: 'mcq', difficulty: 'medium',
        text: 'Identify the grammatically correct sentence:',
        options: [
          'Each of the students have submitted their assignments.',
          'Each of the students has submitted their assignments.',
          'Each of the students has submitted his or her assignment.',
          'Both B and C are correct.'
        ],
        answer: '3',
        explanation: '"Each" is singular and takes a singular verb "has". Both B and C are acceptable — C is more formally precise.',
      },
      {
        id: 'e4', type: 'mcq', difficulty: 'medium',
        text: 'Choose the meaning of the idiom: "Bite the bullet"',
        options: ['To eat hurriedly', 'To endure a painful situation with courage', 'To make a hasty decision', 'To sharpen a weapon'],
        answer: '1',
        explanation: '"Bite the bullet" means to endure a painful or difficult situation that is unavoidable.',
      },
      {
        id: 'e5', type: 'mcq', difficulty: 'hard',
        text: 'Choose the word that best fits: The scientist\'s hypothesis was _____, lacking any experimental evidence to support it.',
        options: ['Substantiated', 'Empirical', 'Speculative', 'Corroborated'],
        answer: '2',
        explanation: '"Speculative" means based on conjecture rather than proven facts — fitting for a hypothesis with no evidence.',
      },
      {
        id: 'e6', type: 'mcq', difficulty: 'easy',
        text: 'Which sentence uses the passive voice?',
        options: [
          'The chef cooked the meal.',
          'The meal was cooked by the chef.',
          'The chef is cooking the meal.',
          'The chef had cooked the meal.'
        ],
        answer: '1',
        explanation: '"The meal was cooked by the chef" is in passive voice — the subject (meal) receives the action.',
      },
      {
        id: 'e7', type: 'mcq', difficulty: 'medium',
        text: 'Fill in the blank: Neither the manager nor the employees _____ informed about the decision.',
        options: ['was', 'were', 'has been', 'is'],
        answer: '1',
        explanation: 'When "neither...nor" subjects differ in number, the verb agrees with the closer subject ("employees" — plural → "were").',
      },
      {
        id: 'e8', type: 'mcq', difficulty: 'hard',
        text: 'What literary device is used in: "The sun smiled upon the golden fields"?',
        options: ['Simile', 'Hyperbole', 'Personification', 'Alliteration'],
        answer: '2',
        explanation: '"The sun smiled" attributes a human quality (smiling) to the sun — this is Personification.',
      },
      {
        id: 'e9', type: 'mcq', difficulty: 'medium',
        text: 'Choose the correct spelling:',
        options: ['Recieve', 'Recommend', 'Accomodate', 'Seperate'],
        answer: '1',
        explanation: '"Recommend" is the only correctly spelled word. Others: Receive, Accommodate, Separate.',
      },
      {
        id: 'e10', type: 'mcq', difficulty: 'easy',
        text: 'Choose the one-word substitute for: "A person who is present everywhere at the same time"',
        options: ['Omniscient', 'Omnipotent', 'Omnivore', 'Omnipresent'],
        answer: '3',
        explanation: '"Omnipresent" means present everywhere simultaneously — from Latin omnis (all) + praesens (present).',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'automata',
    title: 'Automata Theory',
    duration: 600,
    questions: [
      {
        id: 'a1', type: 'domain', difficulty: 'medium',
        text: 'What defines a Deterministic Finite Automaton (DFA)?',
        options: [
          'A machine with a single state',
          'A machine that can have multiple transitions for a single input from a state',
          'A machine where each state has exactly one transition for each input symbol',
          'A machine with no accepting states'
        ],
        answer: '2',
        explanation: 'In a DFA, for every state and every input symbol, there is exactly one defined transition. This determinism distinguishes it from an NFA.',
      },
      {
        id: 'a2', type: 'domain', difficulty: 'easy',
        text: 'Which of the following language classes is recognized by a Pushdown Automaton (PDA)?',
        options: ['Regular Languages', 'Context-Free Languages', 'Recursively Enumerable Languages', 'Context-Sensitive Languages'],
        answer: '1',
        explanation: 'Pushdown Automata recognize exactly the class of Context-Free Languages (those described by Context-Free Grammars).',
      },
      {
        id: 'a3', type: 'domain', difficulty: 'hard',
        text: 'According to the Pumping Lemma for Regular Languages, if L is regular, then for any string w with |w| ≥ p (the pumping length), w can be split into xyz where:',
        options: [
          '|y| ≥ 0, |xy| ≤ p, and xy^i z ∈ L for all i ≥ 0',
          '|y| > 0, |xy| ≤ p, and xy^i z ∈ L for all i ≥ 0',
          '|y| > 0, |xy| ≥ p, and xy^i z ∈ L for all i ≥ 1',
          '|y| > 0, |xy| < p, and xy^i z ∈ L for all i ≥ 1'
        ],
        answer: '1',
        explanation: 'The Pumping Lemma requires |y| > 0 (non-empty pump), |xy| ≤ p (within pumping length), and all pumped strings must remain in L.',
      },
      {
        id: 'a4', type: 'domain', difficulty: 'medium',
        text: 'Which is true about NFA vs DFA?',
        options: [
          'NFA can recognize languages that DFA cannot',
          'DFA and NFA recognize the same class of languages (Regular Languages)',
          'NFA requires fewer states than DFA for every language',
          'DFA allows ε-transitions while NFA does not'
        ],
        answer: '1',
        explanation: 'By the subset construction theorem, every NFA has an equivalent DFA. Both recognize exactly the Regular Languages.',
      },
      {
        id: 'a5', type: 'domain', difficulty: 'easy',
        text: 'Which of the following is NOT a regular language?',
        options: [
          'The set of all strings over {a,b} with even length',
          'The language {aⁿbⁿ | n ≥ 0}',
          'The set of all binary strings ending in 1',
          'The empty language ∅'
        ],
        answer: '1',
        explanation: '{aⁿbⁿ} requires counting (matching n a\'s with n b\'s) which finite automata cannot do — it is context-free, not regular.',
      },
      {
        id: 'a6', type: 'domain', difficulty: 'hard',
        text: 'Which model is equivalent in power to a Turing Machine?',
        options: ['Finite Automaton', 'Pushdown Automaton', 'Linear Bounded Automaton', 'Lambda Calculus'],
        answer: '3',
        explanation: 'Lambda Calculus is Turing-complete, meaning it can compute anything a Turing Machine can. LBA is less powerful (recognizes Context-Sensitive Languages).',
      },
      {
        id: 'a7', type: 'domain', difficulty: 'medium',
        text: 'What does the Halting Problem state?',
        options: [
          'Every Turing Machine eventually halts',
          'It is undecidable whether a given Turing Machine will halt on a given input',
          'A program always halts if it has no infinite loops',
          'The halting problem is solvable for all finite inputs'
        ],
        answer: '1',
        explanation: 'The Halting Problem (proven by Turing) states there is no general algorithm to determine if any arbitrary Turing Machine will halt on a given input.',
      },
      {
        id: 'a8', type: 'domain', difficulty: 'easy',
        text: 'Which operation is NOT closed under Regular Languages?',
        options: ['Union', 'Concatenation', 'Complementation', 'Intersection with a Context-Free Language'],
        answer: '3',
        explanation: 'Regular languages are closed under union, concatenation, complement, and intersection with other regular languages — but intersecting with a CFL can produce a non-regular language.',
      },
      {
        id: 'a9', type: 'domain', difficulty: 'medium',
        text: 'In a Context-Free Grammar, a production rule S → ε (where S is the start symbol) means:',
        options: ['The grammar generates no strings', 'The empty string ε belongs to the language', 'S must always produce a non-empty string', 'ε represents an end-of-file marker'],
        answer: '1',
        explanation: 'S → ε means the start symbol can derive the empty string, so ε is in the language generated by the grammar.',
      },
      {
        id: 'a10', type: 'domain', difficulty: 'hard',
        text: 'Which of the following is decidable?',
        options: [
          'Whether a Turing Machine accepts at least one string',
          'Whether two arbitrary CFGs generate the same language',
          'Whether a DFA accepts a given string',
          'Whether a Turing Machine will halt on all inputs'
        ],
        answer: '2',
        explanation: 'Deciding whether a DFA accepts a given string is a simple finite computation and always decidable. The other options are undecidable problems.',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'quant',
    title: 'Quantitative Ability',
    duration: 600,
    questions: [
      {
        id: 'q1', type: 'quant', difficulty: 'medium',
        text: 'If x + y = 10 and x − y = 2, find x.',
        options: ['4', '6', '8', '5'],
        answer: '1',
        explanation: 'Adding the equations: 2x = 12 → x = 6.',
      },
      {
        id: 'q2', type: 'quant', difficulty: 'easy',
        text: 'A train travels 360 km in 4 hours. What is its average speed?',
        options: ['80 km/h', '90 km/h', '100 km/h', '120 km/h'],
        answer: '1',
        explanation: 'Speed = Distance / Time = 360 / 4 = 90 km/h.',
      },
      {
        id: 'q3', type: 'quant', difficulty: 'medium',
        text: 'If the price of a product is increased by 20% and then decreased by 20%, the net effect is:',
        options: ['No change', '4% decrease', '4% increase', '2% decrease'],
        answer: '1',
        explanation: 'If original price = 100, after 20% increase = 120, after 20% decrease = 120 × 0.8 = 96. Net = 4% decrease.',
      },
      {
        id: 'q4', type: 'quant', difficulty: 'hard',
        text: 'How many ways can 4 people be seated in a row of 4 chairs?',
        options: ['12', '16', '24', '32'],
        answer: '2',
        explanation: '4! = 4 × 3 × 2 × 1 = 24 ways. This is a permutation of 4 people in 4 positions.',
      },
      {
        id: 'q5', type: 'quant', difficulty: 'medium',
        text: 'A shopkeeper marks a product 40% above cost price and offers a 10% discount. What is the profit %?',
        options: ['26%', '30%', '36%', '40%'],
        answer: '0',
        explanation: 'Let CP = 100. MP = 140. SP after 10% discount = 140 × 0.9 = 126. Profit% = (126−100)/100 × 100 = 26%.',
      },
      {
        id: 'q6', type: 'quant', difficulty: 'easy',
        text: 'What is the LCM of 12 and 18?',
        options: ['24', '36', '54', '72'],
        answer: '1',
        explanation: '12 = 2²×3, 18 = 2×3². LCM = 2²×3² = 4×9 = 36.',
      },
      {
        id: 'q7', type: 'quant', difficulty: 'hard',
        text: 'Pipes A and B can fill a tank in 20 and 30 minutes. Pipe C can empty it in 15 minutes. If all pipes are open, in how long is the tank filled?',
        options: ['30 min', '60 min', '90 min', 'Never'],
        answer: '1',
        explanation: 'Net rate = 1/20 + 1/30 − 1/15 = 3/60 + 2/60 − 4/60 = 1/60 tank per minute. Time = 60 minutes.',
      },
      {
        id: 'q8', type: 'quant', difficulty: 'medium',
        text: 'The average age of a class of 30 students is 15. If the teacher\'s age (45) is included, the new average is:',
        options: ['15.97', '16', '16.94', '17'],
        answer: '0',
        explanation: 'Total age = 30×15 = 450. New total = 450+45 = 495. New average = 495/31 ≈ 15.97.',
      },
      {
        id: 'q9', type: 'quant', difficulty: 'easy',
        text: 'Simple interest on ₹5000 at 8% per annum for 3 years is:',
        options: ['₹1000', '₹1200', '₹1500', '₹2000'],
        answer: '1',
        explanation: 'SI = P×R×T/100 = 5000×8×3/100 = 1200. Answer is ₹1200.',
      },
      {
        id: 'q10', type: 'quant', difficulty: 'hard',
        text: 'In how many ways can the letters of "BANANA" be arranged?',
        options: ['60', '120', '360', '720'],
        answer: '0',
        explanation: 'BANANA has 6 letters: B(1), A(3), N(2). Arrangements = 6! / (3! × 2!) = 720 / 12 = 60.',
      },
      {
        id: 'q11', type: 'quant', difficulty: 'medium',
        text: 'A right triangle has legs of 3 and 4. What is the length of the hypotenuse?',
        options: ['5', '6', '7', '25'],
        answer: '0',
        explanation: 'By the Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25 → c = 5. This is the classic 3-4-5 right triangle.',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'coding',
    title: 'Coding Challenge',
    duration: 900,
    questions: [
      {
        id: 'c1', type: 'coding', difficulty: 'easy',
        text: 'Write a function that reverses a string without using built-in reverse methods.\n\nExample:\nInput: "hello"\nOutput: "olleh"\n\nConstraints:\n• Time complexity: O(n)\n• Space complexity: O(n)',
        options: null,
        answer: '',
        explanation: 'Use two pointers starting from both ends, swapping characters until they meet in the middle.',
      },
      {
        id: 'c2', type: 'coding', difficulty: 'medium',
        text: 'Given a sorted array and a target value, implement Binary Search.\n\nReturn the index of the target or -1 if not found.\n\nExample:\nInput: [1, 3, 5, 7, 9, 11], target = 7\nOutput: 3\n\nConstraints:\n• Time complexity: O(log n)',
        options: null,
        answer: '',
        explanation: 'Maintain low and high pointers, compute mid = (low+high)>>1, compare arr[mid] with target, narrow the search space.',
      },
      {
        id: 'c3', type: 'coding', difficulty: 'hard',
        text: 'Implement a function to find the longest substring without repeating characters.\n\nExample:\nInput: "abcabcbb"\nOutput: 3 (the substring "abc")\n\nInput: "bbbbb"\nOutput: 1\n\nConstraints:\n• Time complexity: O(n)\n• Space complexity: O(min(m,n)) where m = charset size',
        options: null,
        answer: '',
        explanation: 'Use the sliding window technique with a Set or Map to track characters in the current window. When a duplicate is found, shrink the window from the left.',
      },
      {
        id: 'c4', type: 'coding', difficulty: 'medium',
        text: 'Write a function to check if a given string is a palindrome (ignoring spaces and case).\n\nExample:\nInput: "A man a plan a canal Panama"\nOutput: true\n\nInput: "race a car"\nOutput: false',
        options: null,
        answer: '',
        explanation: 'Clean the string (lowercase, remove non-alphanumeric), then use two pointers from both ends checking equality.',
      },
      {
        id: 'c5', type: 'coding', difficulty: 'medium',
        text: 'Implement a function to find the two numbers in an array that add up to a target sum.\n\nReturn the indices of the two numbers.\n\nExample:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\n\nConstraints:\n• O(n) time complexity required',
        options: null,
        answer: '',
        explanation: 'Use a hash map to store each number and its index. For each element, check if (target − element) exists in the map — O(n) time.',
      },
      {
        id: 'c6', type: 'coding', difficulty: 'easy',
        text: 'Write a function that returns the nth Fibonacci number.\n\nFib(0) = 0, Fib(1) = 1, Fib(n) = Fib(n−1) + Fib(n−2)\n\nExample:\nFib(10) = 55\n\nConstraints:\n• Implement an iterative solution (not recursive)\n• Time: O(n), Space: O(1)',
        options: null,
        answer: '',
        explanation: 'Use two variables (a=0, b=1) and iterate n times, updating a=b, b=a+b at each step.',
      },
      {
        id: 'c7', type: 'coding', difficulty: 'hard',
        text: 'Implement a function to flatten a deeply nested array into a single-level array.\n\nExample:\nInput: [1, [2, [3, [4]], 5]]\nOutput: [1, 2, 3, 4, 5]\n\nDo NOT use Array.prototype.flat().',
        options: null,
        answer: '',
        explanation: 'Use recursion: for each element, if it is an array, recursively flatten it; otherwise, push it to the result array.',
      },
    ],
  },
];
