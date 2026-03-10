import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Play, BookOpen, Settings, Zap, Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Editor from '@monaco-editor/react';

// Enhanced Mock Lesson Content
const LESSON_DATA = {
  title: "Array Mastery: Two Pointers",
  xpReward: 150,
  chunks: [
    {
      type: 'theory',
      title: 'The Two Pointer Technique',
      content: 'The two pointer technique is a foundational algorithmic pattern used to solve array problems efficiently, often reducing time complexity from O(n^2) to O(n).\n\nInstead of iterating with nested loops, we use two separate pointers (e.g., `left` and `right`) that traverse the array from different positions, typically meeting in the middle or moving in the same direction based on specific conditions.'
    },
    {
      type: 'quiz',
      title: 'Scenario: E-commerce Sorting',
      question: 'You are building an e-commerce platform. You have a sorted array of product prices. The marketing team wants to find two distinct products whose combined price exactly matches a given target budget to offer a "Bundle Deal". Which approach is the most efficient?',
      options: [
        'Iterate through every possible pair of prices and sum them (O(n^2)).',
        'Use the two-pointer technique: one pointer at the start, one at the end, moving them based on the sum compared to the target (O(n)).',
        'Use binary search for every element to find its complement (O(n log n)).',
        'Store all sums in a hash map first, then look up the target (O(n)).'
      ],
      correctAnswer: 1,
      explanation: 'Because the array is already sorted, the two-pointer technique is optimal. You place `left` at index 0 and `right` at the last index. If the sum is too small, move `left` up. If it is too large, move `right` down. This requires evaluating at most n pairs, achieving O(n) time and O(1) space.'
    },
    {
      type: 'coding',
      title: 'Algorithm Design: Two Sum II',
      description: 'You are given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order. Find two numbers such that they add up to a specific `target` number. Let these two numbers be `numbers[index1]` and `numbers[index2]`. Return the indices (1-indexed) as an integer array `[index1, index2]` of length 2.',
      scenario: 'You are building the backend for the "Bundle Deal" feature mentioned previously.',
      constraints: [
        '2 <= numbers.length <= 3 * 10^4',
        '-1000 <= numbers[i] <= 1000',
        'numbers is sorted in non-decreasing order.',
        'The tests are generated such that there is exactly one solution.'
      ],
      testCases: [
         { input: 'numbers = [2,7,11,15], target = 9', expected: '[1, 2]' },
         { input: 'numbers = [2,3,4], target = 6', expected: '[1, 3]' },
         { input: 'numbers = [-1,0], target = -1', expected: '[1, 2]' }
      ],
      solution: {
        javascript: 'function twoSum(numbers, target) {\n    let left = 0;\n    let right = numbers.length - 1;\n    \n    while (left < right) {\n        const sum = numbers[left] + numbers[right];\n        if (sum === target) {\n            return [left + 1, right + 1];\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    return [];\n}'
      }
    }
  ]
};

const LANGUAGE_TEMPLATES = {
  javascript: 'function twoSum(numbers, target) {\n  // Write your code here using the two-pointer technique\n  \n}',
  python: 'def twoSum(numbers, target):\n    # Write your code here\n    pass',
  cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& numbers, int target) {\n    // Write code here\n    return {};\n}',
  java: 'public class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        // Write code here\n        return new int[]{};\n    }\n}',
};

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // Explanation state
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Coding state
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const editorRef = useRef(null);

  const chunk = LESSON_DATA.chunks[currentChunkIndex];
  const progress = ((currentChunkIndex) / LESSON_DATA.chunks.length) * 100;

  const handleNext = () => {
    setIsChecking(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setOutput('');
    setTestResults([]);
    setShowExplanation(false);
    
    if (currentChunkIndex < LESSON_DATA.chunks.length - 1) {
      setCurrentChunkIndex(prev => prev + 1);
    } else {
      // Award XP & Complete
      navigate('/learn');
    }
  };

  const checkAnswer = () => {
    setIsChecking(true);
    if (chunk.type === 'quiz') {
      const correct = selectedAnswer === chunk.correctAnswer;
      setIsCorrect(correct);
      if (!correct) setShowExplanation(true);
    } else if (chunk.type === 'coding') {
      setOutput('Compiling and running test cases...');
      setTestResults([]);
      
      // Simulate real test execution with a delay
      setTimeout(() => {
        // Basic heuristic: did they use a while loop or for loop, and is it not the template?
        // Note: For demonstration, we just simulate passing if code > 80 chars.
        const passed = code.length > 80 && code.includes('left') && code.includes('right');
        
        setIsCorrect(passed);
        
        if (passed) {
          setOutput('Excellent! Your solution runs in O(n) time and passes all test cases.');
          setTestResults([
            { case: 1, status: 'pass', output: '[1, 2]' },
            { case: 2, status: 'pass', output: '[1, 3]' },
            { case: 3, status: 'pass', output: '[1, 2]' }
          ]);
        } else {
          setOutput('Execution Failed. Your logic did not satisfy the conditions or handled edge cases incorrectly.');
          setTestResults([
            { case: 1, status: 'pass', output: '[1, 2]', expected: '[1, 2]' },
            { case: 2, status: 'fail', output: 'undefined', expected: '[1, 3]' },
            { case: 3, status: 'fail', output: '[]', expected: '[1, 2]' }
          ]);
          setShowExplanation(true); // Show solution tab if failed
        }
      }, 1500);
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(LANGUAGE_TEMPLATES[lang]);
  };

  const applySolution = () => {
    setCode(chunk.solution.javascript);
    setLanguage('javascript');
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans z-[1000]">
      {/* Header */}
      <div className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-slate-200">
         <button onClick={() => navigate('/learn')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
         </button>
         <div className="flex-1 max-w-2xl mx-8">
            <Progress value={progress} className="h-4 rounded-full bg-slate-100 [&>div]:bg-green-500" />
         </div>
         <div className="flex font-bold text-slate-500 items-center gap-1">
            <Zap size={20} className="text-yellow-500 fill-yellow-500" /> <span className="text-slate-800">{LESSON_DATA.xpReward} XP</span>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full relative bg-slate-50">
        <div className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col justify-start md:justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChunkIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col gap-8"
              >
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">{chunk.title}</h1>
                 
                 {/* THEORY */}
                 {chunk.type === 'theory' && (
                   <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap bg-white p-10 rounded-3xl border-2 border-slate-200 shadow-sm">
                      {chunk.content}
                   </div>
                 )}

                 {/* QUIZ */}
                 {chunk.type === 'quiz' && (
                   <div className="flex flex-col gap-6 bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
                     <p className="text-xl font-medium text-slate-800 mb-2 leading-relaxed">{chunk.question}</p>
                     
                     <div className="flex flex-col gap-3">
                       {chunk.options.map((opt, i) => (
                         <button
                           key={i}
                           disabled={isChecking}
                           onClick={() => setSelectedAnswer(i)}
                           className={`p-5 rounded-2xl border-2 text-left font-bold text-[15px] transition-all flex items-center gap-4
                             ${selectedAnswer === i && !isChecking ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-[0_4px_0_0_rgba(96,165,250,1)]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}
                             ${isChecking && chunk.correctAnswer === i ? 'bg-green-100 border-green-500 text-green-800 shadow-[0_4px_0_0_rgba(34,197,94,1)]' : ''}
                             ${isChecking && selectedAnswer === i && selectedAnswer !== chunk.correctAnswer ? 'bg-red-100 border-red-500 text-red-800 shadow-[0_4px_0_0_rgba(239,68,68,1)]' : ''}
                           `}
                         >
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                              ${selectedAnswer === i ? 'border-current bg-current' : 'border-slate-300'}
                           `}>
                             {selectedAnswer === i && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                           </div>
                           {opt}
                         </button>
                       ))}
                     </div>

                     {/* Explanation Box */}
                     <AnimatePresence>
                       {showExplanation && (
                         <motion.div 
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl mt-4"
                         >
                            <h4 className="flex items-center gap-2 font-black text-blue-800 mb-2 uppercase tracking-wide text-sm">
                              <Lightbulb size={18} /> Detailed Explanation
                            </h4>
                            <p className="text-blue-900 leading-relaxed text-sm font-medium">{chunk.explanation}</p>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 )}

                 {/* CODING */}
                 {chunk.type === 'coding' && (
                   <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[70vh]">
                     
                     {/* Specifications Panel */}
                     <div className="flex-1 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm overflow-y-auto custom-scrollbar flex flex-col gap-6">
                        <div>
                          <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2"><BookOpen size={20}/> The Challenge</h3>
                          <p className="text-slate-600 text-[15px] leading-relaxed">{chunk.description}</p>
                        </div>
                        
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                          <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider"><Info size={16}/> Scenario</h3>
                          <p className="text-blue-900/80 text-sm font-medium">{chunk.scenario}</p>
                        </div>

                        <div>
                          <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-3">Constraints</h3>
                          <ul className="space-y-2">
                             {chunk.constraints.map((c, i) => (
                               <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                 <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 text-xs font-bold font-mono">{c}</code>
                               </li>
                             ))}
                          </ul>
                        </div>

                        <div>
                           <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-3">Examples</h3>
                           <div className="space-y-3">
                              {chunk.testCases.map((tc, i) => (
                                 <div key={i} className="bg-slate-900 rounded-xl p-4 text-[13px] font-mono leading-relaxed">
                                    <div className="text-slate-400 font-bold mb-1">Input: <span className="text-green-400 font-normal">{tc.input}</span></div>
                                    <div className="text-slate-400 font-bold">Output: <span className="text-blue-400 font-normal">{tc.expected}</span></div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Editor Panel */}
                     <div className="flex-[1.2] flex flex-col gap-4">
                       <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border-2 border-slate-200 shadow-sm">
                         <span className="font-bold text-slate-700 text-sm">Solution Code</span>
                         <select 
                           value={language} 
                           onChange={handleLanguageChange}
                           disabled={isChecking}
                           className="px-3 py-1.5 rounded-lg border-2 border-slate-200 bg-slate-50 font-bold text-sm text-slate-700 outline-none hover:border-blue-400 cursor-pointer transition-colors"
                         >
                           <option value="javascript">JavaScript</option>
                           <option value="python">Python</option>
                           <option value="cpp">C++</option>
                           <option value="java">Java</option>
                         </select>
                       </div>
                       
                       <div className="flex-1 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-sm relative bg-white">
                          <Editor
                            height="100%"
                            language={language}
                            theme="vs-light"
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 15,
                              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                              padding: { top: 24 },
                              roundedSelection: false,
                              scrollBeyondLastLine: false,
                            }}
                          />
                       </div>

                       {/* Execution Output Panel */}
                       {(output || isChecking) && (
                         <div className={`p-5 rounded-3xl font-mono text-[13px] font-bold border-2 transition-all
                           ${isChecking && isCorrect === null ? 'bg-slate-800 text-yellow-400 border-slate-900' : ''}
                           ${isCorrect ? 'bg-green-50 text-green-700 border-green-200' : ''}
                           ${isCorrect === false ? 'bg-red-50 border-red-200 text-slate-700' : ''}
                         `}>
                           <div className="mb-2 text-sm flex justify-between items-center">
                              <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>{output || 'Executing...'}</span>
                           </div>
                           
                           {testResults.length > 0 && (
                             <div className="space-y-2 mt-4">
                                {testResults.map((trObj, i) => (
                                   <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${trObj.status === 'pass' ? 'bg-green-100/50' : 'bg-red-100/50'}`}>
                                      <div className="flex items-center gap-2">
                                         {trObj.status === 'pass' ? <Check size={14} className="text-green-600"/> : <X size={14} className="text-red-600"/>}
                                         <span>Test Case {trObj.case}</span>
                                      </div>
                                      {trObj.status === 'fail' && (
                                         <span className="text-red-600">Got {trObj.output}, expected {trObj.expected}</span>
                                      )}
                                   </div>
                                ))}
                             </div>
                           )}

                           {showExplanation && (
                              <div className="mt-4 pt-4 border-t-2 border-red-200 flex flex-col items-start gap-3">
                                 <div className="flex items-center gap-2 text-red-800 font-sans">
                                    <Lightbulb size={16}/>
                                    Stuck? Remember to use two pointers. One starting at 0, one at length - 1.
                                 </div>
                                 <Button variant="outline" size="sm" onClick={applySolution} className="bg-white border-red-300 text-red-700 hover:bg-red-50">
                                   Reveal Solution (JS)
                                 </Button>
                              </div>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                 )}

              </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className={`h-32 border-t-2 flex items-center justify-center px-4 md:px-8 transition-colors duration-300 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10
        ${isChecking 
          ? (isCorrect || isCorrect === null ? 'bg-[#d7ffb8] border-[#b8f28b]' : 'bg-[#ffdfe0] border-[#fac7c8]') 
          : 'bg-white border-slate-200'}
      `}>
          <div className="w-full max-w-5xl flex justify-between items-center">
             
             {/* Feedback Area */}
             <div className="flex items-center gap-4">
                {isChecking && isCorrect !== null && (
                  <div className={`flex items-center gap-4 font-black text-[22px] tracking-tight ${isCorrect ? 'text-[#46a302]' : 'text-[#ea2b2b]'}`}>
                     <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm ${isCorrect ? 'bg-white text-[#58cc02]' : 'bg-white text-[#ff4b4b]'}`}>
                        {isCorrect ? <Check size={36} strokeWidth={4} /> : <X size={36} strokeWidth={4} />}
                     </div>
                     <div className="flex flex-col">
                        <span>{isCorrect ? 'Awesome!' : 'Not quite right.'}</span>
                        {!isCorrect && chunk.type === 'quiz' && <span className="text-sm font-bold opacity-80 uppercase mt-0.5 tracking-wider">Review the explanation</span>}
                     </div>
                  </div>
                )}
             </div>

             {/* Action Button */}
             <Button 
                size="lg" 
                onClick={isChecking && isCorrect !== false ? handleNext : (isChecking && !isCorrect ? () => setIsChecking(false) : checkAnswer)}
                disabled={(chunk.type === 'quiz' && selectedAnswer === null) || (chunk.type === 'coding' && code === LANGUAGE_TEMPLATES[language])}
                className={`px-12 py-8 text-xl font-black rounded-2xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wider
                  ${isChecking && isCorrect ? 'bg-[#58cc02] shadow-[#46a302] hover:bg-[#46a302] text-white' : ''}
                  ${isChecking && !isCorrect ? 'bg-[#ff4b4b] shadow-[#ea2b2b] hover:bg-[#ea2b2b] text-white' : ''}
                  ${!isChecking ? 'bg-[#1cb0f6] shadow-[#1899d6] hover:bg-[#1899d6] text-white' : ''}
                  ${(chunk.type === 'quiz' && selectedAnswer === null) ? 'bg-[#e5e5e5] shadow-[#e5e5e5] text-[#afafaf] hover:translate-y-0 cursor-not-allowed' : ''}
                `}
             >
                {isChecking 
                  ? (isCorrect || isCorrect === null ? (currentChunkIndex === LESSON_DATA.chunks.length - 1 ? 'FINISH LESSON' : 'CONTINUE') : 'GOT IT') 
                  : 'CHECK'}
             </Button>
          </div>
      </div>
    </div>
  );
}
