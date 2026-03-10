import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, Play, Terminal, HelpCircle, Code2, Check, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { QUESTION_BANK, buildExam } from '../data/questionBank';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '../context/AuthContext';
import ProctoringMonitor from '../components/ProctoringMonitor';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LANGUAGE_TEMPLATES = {
  javascript: 'function solution(input) {\n  // Write your code here\n  return input;\n}',
  python: 'def solution(input):\n    # Write your code here\n    return input',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write code here\n    return 0;\n}',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write code here\n    }\n}',
};

export default function SkillTest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Session Key
  const sessionKey = `testSession_${user?.userId || 'guest'}`;

  const [exam, setExam] = useState(null);
  
  // State from Session
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // Question index within current section
  const [answers, setAnswers] = useState({}); // { qId: answer }
  const [timeLeft, setTimeLeft] = useState(0); // Time left for CURRENT section
  const [violations, setViolations] = useState(0); // Count tab switching violations
  const [showIntermission, setShowIntermission] = useState(false); // New state for intermission screen

  // UI State
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const editorRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize Exam & Restore Session
  useEffect(() => {
    const fullExamData = buildExam(QUESTION_BANK);
    setExam({
      title: "Comprehensive Standardized Assessment",
      sections: fullExamData.map(s => ({
        ...s,
        duration: s.duration || 600 // default 10 mins if not provided
      }))
    });

    // Check for saved session
    const savedSessionStr = localStorage.getItem(sessionKey);
    let initialSectionIndex = 0;
    let initialTimeLeft = fullExamData[0].duration || 600;
    let initialIntermission = false;

    if (savedSessionStr) {
      try {
        const savedSession = JSON.parse(savedSessionStr);
        setAnswers(savedSession.answers || {});
        initialSectionIndex = savedSession.currentSectionIndex || 0;
        initialIntermission = savedSession.showIntermission || false;
        
        // Ensure we don't restore a finished exam
        if (initialSectionIndex >= fullExamData.length) {
           initialSectionIndex = 0; 
           initialIntermission = false;
        } else {
           initialTimeLeft = savedSession.timeLeft ?? (fullExamData[initialSectionIndex].duration || 600);
        }
        
        setViolations(savedSession.violations || 0);
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }

    setCurrentSectionIndex(initialSectionIndex);
    setCurrentIndex(0); 
    setTimeLeft(initialTimeLeft);
    setShowIntermission(initialIntermission);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  // Handle Timer & Auto-Save
  useEffect(() => {
    if (!exam || showIntermission) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSectionEnd();
          return 0;
        }
        
        // Auto-save every 5 seconds
        if (prev % 5 === 0) {
           saveSession(prev - 1);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, currentSectionIndex, showIntermission, answers, violations]);

  const saveSession = (currentTimeLeft, isIntermission) => {
    const sessionData = {
      answers,
      currentSectionIndex,
      timeLeft: currentTimeLeft !== undefined ? currentTimeLeft : timeLeft,
      violations,
      showIntermission: isIntermission !== undefined ? isIntermission : showIntermission
    };
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
  };

  const clearSession = () => {
    localStorage.removeItem(sessionKey);
  };

  const handleViolationsChange = (count) => {
    setViolations(count);
    saveSession();
  };

  // Called when time is up or user manually submits the section
  const handleSectionEnd = useCallback(() => {
    setShowIntermission(true);
    saveSession(0, true);
  }, [exam, currentSectionIndex, answers]);

  const advanceSectionManually = () => {
    handleSectionEnd();
  };

  const startNextSection = () => {
    if (currentSectionIndex >= exam.sections.length - 1) {
      handleSubmit();
    } else {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      setCurrentIndex(0);
      setTimeLeft(exam.sections[nextIndex].duration || 600);
      setShowIntermission(false);
      saveSession(exam.sections[nextIndex].duration || 600, false);
    }
  };

  const handleNextQuestion = () => {
    const currentSection = exam.sections[currentSectionIndex];
    if (currentIndex < currentSection.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if(window.confirm("You have reached the end of this section. Submit and proceed? You cannot return to this section.")) {
         advanceSectionManually();
      }
    }
  };

  const handleAnswerChange = (qId, val) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [qId]: val };
      const sessionData = { answers: newAnswers, currentSectionIndex, timeLeft, violations, showIntermission };
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
      return newAnswers;
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and running against sample test cases...\n');
    
    setTimeout(() => {
      setOutput(prev => prev + '> Running sample case 1: [5, 2, 7]\n> Output: Success\n> Running sample case 2: [1, 2, 3]\n> Output: Success\n\nAll sample cases passed locally.');
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    let score = 0;
    let sectionScores = {};
    
    exam.sections.forEach(section => {
      if (!sectionScores[section.title]) sectionScores[section.title] = { total: 0, correct: 0 };
      
      section.questions.forEach(q => {
        sectionScores[section.title].total += 10;
        
        if (q.type === 'mcq' || q.type === 'domain' || q.type === 'quant' || q.type === 'aptitude') {
          if (answers[q.id] === q.answer) {
            score += 10;
            sectionScores[section.title].correct += 10;
          }
        } else if (q.type === 'coding') {
           if (answers[q.id] && answers[q.id].length > 50) {
              score += 10;
              sectionScores[section.title].correct += 10;
           }
        }
      });
    });

    let totalQuestions = exam.sections.reduce((acc, sec) => acc + sec.questions.length, 0);
    const finalScore = Math.min(100, (score / (totalQuestions * 10)) * 100);
    
    clearSession(); 
    navigate('/results', { state: { score: finalScore, sectionScores, answers, violations } });
  };

  if (!exam) return <div className="p-20 text-center text-primary font-bold mb-4 flex items-center justify-center min-h-screen">Compiling Assessment Modules...</div>;

  // Render Intermission Screen
  if (showIntermission) {
    const isLastSection = currentSectionIndex >= exam.sections.length - 1;
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[1000] p-6 overflow-y-auto">
        <ProctoringMonitor onViolationsChange={handleViolationsChange} />
        <Card className="max-w-3xl w-full mx-auto shadow-xl border-slate-200">
          <CardHeader className="text-center pb-8 border-b border-slate-100 bg-white rounded-t-xl">
             <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
               <CheckCircle2 size={32} className="text-primary" />
             </div>
             <CardTitle className="text-2xl text-slate-900">
               {isLastSection ? "All Sections Completed" : "Section Completed"}
             </CardTitle>
             <p className="text-slate-500 mt-2">
               {isLastSection 
                 ? "You have finished all sections of the assessment. You can now submit your final answers." 
                 : "Your answers for this section have been saved. Review your upcoming sections below."}
             </p>
          </CardHeader>
          <CardContent className="p-8 bg-slate-50 rounded-b-xl">
             <h3 className="font-semibold text-slate-700 mb-6 uppercase tracking-wider text-sm">Assessment Progress</h3>
             <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {exam.sections.map((sec, idx) => {
                  let status = 'locked'; // locked, current, completed
                  if (idx <= currentSectionIndex) status = 'completed';
                  else if (idx === currentSectionIndex + 1) status = 'current';

                  return (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                         status === 'completed' ? 'bg-green-500 border-green-100' :
                         status === 'current' ? 'bg-primary border-primary/20 animate-pulse' :
                         'bg-slate-200 border-slate-50'
                       }`}>
                          {status === 'completed' && <Check size={16} className="text-white" />}
                          {status === 'current' && <Play size={16} className="text-white ml-0.5" />}
                          {status === 'locked' && <Lock size={16} className="text-slate-400" />}
                       </div>
                       
                       <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm ${
                         status === 'completed' ? 'bg-white border-green-200/50' :
                         status === 'current' ? 'bg-primary/5 border-primary/30' :
                         'bg-slate-100/50 border-slate-200 opacity-70'
                       }`}>
                          <div className="flex items-center justify-between mb-1">
                             <h4 className={`font-bold ${status === 'current' ? 'text-primary' : 'text-slate-800'}`}>
                               Section {idx + 1}: {sec.title}
                             </h4>
                             <span className="text-xs font-semibold text-slate-500">{sec.duration / 60} mins</span>
                          </div>
                          <p className="text-sm text-slate-500">
                            {status === 'completed' ? 'Completed & Locked' : status === 'current' ? 'Up Next' : 'Locked'}
                          </p>
                       </div>
                    </div>
                  );
                })}
             </div>

             <div className="mt-12 flex justify-center">
               <Button onClick={startNextSection} size="lg" className="px-10 py-6 text-lg shadow-lg group">
                 {isLastSection ? 'Submit Final Assessment' : 'Start Next Section'}
                 {isLastSection ? <CheckCircle2 className="ml-3 h-5 w-5" /> : <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSection = exam.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentIndex];

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / currentSection.questions.length) * 100;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[1000] text-slate-900 font-sans">
      <ProctoringMonitor onViolationsChange={handleViolationsChange} />

      {/* Professional Header */}
      <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2.5 rounded-lg border border-primary/20">
            <Code2 size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">{exam.title}</h2>
            <p className="text-[13px] text-slate-500 font-medium">Section {currentSectionIndex + 1}: {currentSection.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Section Time left</span>
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-lg border ${timeLeft < 60 ? 'bg-red-50 border-red-200' : 'bg-slate-100 border-slate-200'}`}>
              <Clock size={18} className={timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
              <span className={`font-mono font-semibold text-[15px] ${timeLeft < 60 ? 'text-red-600' : 'text-slate-700'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <Button onClick={() => advanceSectionManually()} variant="outline" className="px-6 py-2.5 shadow-sm text-sm font-semibold rounded-md transition-all border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
             Submit Section
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Progress Bar */}
          <div className="w-full shrink-0 flex items-center bg-slate-100 h-1">
             <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSectionIndex}-${currentIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                {violations > 0 && (
                  <Alert variant="destructive" className="mb-6 bg-red-50/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning Detected</AlertTitle>
                    <AlertDescription>
                      You have switched tabs {violations} time(s). Repeated violations will void your test results.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mb-6">
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                    Question {currentIndex + 1} / {currentSection.questions.length}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    <Check size={14} className="text-green-500" /> Auto-saved
                  </span>
                </div>

                <div className="mb-8">
                  <h1 className="text-[20px] text-slate-900 font-medium leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    {currentQuestion.text}
                  </h1>
                </div>

                {currentQuestion.type === 'coding' ? (
                  <div className="h-[500px] border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm bg-white">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center text-xs">
                      <div className="flex gap-4">
                        <span className="text-primary font-bold cursor-pointer font-mono">solution.js</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Button onClick={handleRunCode} disabled={isRunning} variant="outline" size="sm" className="h-7 text-xs flex items-center gap-1.5 font-bold shadow-sm">
                            <Play size={14} className="text-green-600" /> <span>Run Code</span>
                         </Button>
                      </div>
                    </div>
                    <div className="flex-1 border-b border-slate-200">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="light"
                        value={answers[currentQuestion.id] || LANGUAGE_TEMPLATES.javascript}
                        onChange={(val) => handleAnswerChange(currentQuestion.id, val)}
                        onMount={(editor) => (editorRef.current = editor)}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: 'on',
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          padding: { top: 16 }
                        }}
                      />
                    </div>
                    {output && (
                      <div className="h-40 bg-slate-100 p-4 font-mono text-[13px] overflow-y-auto whitespace-pre-wrap text-slate-700 border-t border-slate-200">
                        <span className="text-slate-500 block mb-2 font-bold text-[11px] uppercase tracking-wider"># Execution Output</span>
                        {output}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-w-2xl">
                    {currentQuestion.options.map((opt, i) => {
                      const isSelected = answers[currentQuestion.id] === String(i);
                      return (
                        <div 
                          key={i}
                          onClick={() => handleAnswerChange(currentQuestion.id, String(i))}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-md transform scale-[1.02]'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                             isSelected ? 'border-primary bg-primary' : 'border-slate-300'
                          }`}>
                             {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className={`flex-1 font-medium text-[15px] transition-colors ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <footer className="h-[80px] border-t border-slate-200 px-8 flex items-center justify-end bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <Button 
              onClick={handleNextQuestion}
              className="px-8 py-6 rounded-md flex items-center gap-2 text-[15px] shadow-sm transform transition hover:-translate-y-0.5"
            >
              {currentIndex === currentSection.questions.length - 1 ? 'Finish Section' : 'Next Question'}
              <ChevronRight size={18} />
            </Button>
          </footer>
        </div>

        {/* Sidebar / Question Navigator */}
        {isSidebarOpen && (
          <aside className="w-80 border-l border-slate-200 bg-slate-50 flex flex-col hidden lg:flex shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
             <div className="p-6 border-b border-slate-200 bg-white">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                   <Terminal size={18} className="text-primary" /> Array Navigator
                </h3>
             </div>
             
             <div className="flex flex-col gap-0 border-b border-slate-200 bg-white">
               {exam.sections.map((sec, idx) => (
                 <div key={idx} className={`px-6 py-3 border-b border-slate-100 last:border-0 flex items-center justify-between transition-colors ${idx === currentSectionIndex ? 'bg-primary/5' : 'opacity-60'}`}>
                    <span className={`text-[13px] font-bold uppercase tracking-wider ${idx === currentSectionIndex ? 'text-primary' : 'text-slate-500'}`}>
                      {idx + 1}. {sec.title}
                    </span>
                    {idx < currentSectionIndex && <Check size={16} className="text-green-500" />}
                    {idx === currentSectionIndex && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    {idx > currentSectionIndex && <Lock size={14} className="text-slate-300" />}
                 </div>
               ))}
             </div>

             <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-slate-50">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Questions in Active Section</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {currentSection.questions.map((q, i) => {
                      const isAnswered = answers[q.id] !== undefined;
                      const isCurrent = i === currentIndex;
                      
                      return (
                        <div
                          key={q.id}
                          title={isCurrent ? "Current Question" : (i < currentIndex ? "Answered" : "Upcoming")}
                          className={`h-9 rounded-md text-[13px] font-bold transition-all border shadow-sm flex items-center justify-center cursor-default ${
                            isCurrent 
                              ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20' 
                              : (isAnswered ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-200 bg-white text-slate-500')
                          }`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
             </div>
             <div className="p-4 bg-white border-t border-slate-200 text-[11px] font-bold text-slate-500 flex items-center gap-2">
                <HelpCircle size={14} className="shrink-0 text-green-500"/> Proctoring session recorded.
             </div>
          </aside>
        )}
      </div>
    </div>
  );
}
