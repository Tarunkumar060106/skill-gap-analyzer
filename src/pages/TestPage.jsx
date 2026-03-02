import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveTestResult } from '../services/api';
import { Clock } from 'lucide-react';

const DUMMY_QUESTIONS = [
  { id: 1, text: 'What is the Virtual DOM in React?', options: ['A mock of the real DOM', 'The browser built-in DOM', 'A shadow DOM', 'None of the above'], answer: 0 },
  { id: 2, text: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useMemo', 'useRef'], answer: 1 },
  { id: 3, text: 'What does REST stand for?', options: ['Representational State Transfer', 'Responsive Server Technology', 'Real Execute State Time', 'Restrained System Tools'], answer: 0 },
  { id: 4, text: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH', 'None'], answer: 1 },
];

export default function TestPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const testType = searchParams.get('type') || 'Unknown Test';

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if(prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (idx) => {
    setAnswers({ ...answers, [currentQ]: idx });
  };

  const calculateScore = () => {
    let score = 0;
    DUMMY_QUESTIONS.forEach((q, i) => {
      if(answers[i] === q.answer) score++;
    });
    return Math.round((score / DUMMY_QUESTIONS.length) * 100);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const result = {
      userId: user.userId,
      testName: testType,
      score,
      readinessLevel: score >= 75 ? 'Ready' : 'Needs Practice',
      weakSkills: ['System Design', 'React Performance Hooks'],
      createdAt: new Date().toISOString()
    };
    try {
      await saveTestResult(result);
      navigate('/results');
    } catch(e) {
      console.error(e);
      navigate('/results');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card glass-panel" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h2>{testType.toUpperCase()} Test</h2>
        <div className="badge badge-pending flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
          <Clock size={16} /> Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="progress-bar-container mb-6">
        <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / DUMMY_QUESTIONS.length) * 100}%` }}></div>
      </div>

      <h3 className="mb-4">Question {currentQ + 1} of {DUMMY_QUESTIONS.length}</h3>
      <p className="text-lg mb-6">{DUMMY_QUESTIONS[currentQ].text}</p>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {DUMMY_QUESTIONS[currentQ].options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleSelect(i)} 
            className={`btn-secondary text-left`}
            style={{ 
              borderColor: answers[currentQ] === i ? 'var(--accent-primary)' : 'var(--border-color)',
              background: answers[currentQ] === i ? 'rgba(102, 252, 241, 0.1)' : 'transparent'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-auto pt-4 border-t border-color">
        <button 
          className="btn-secondary" 
          disabled={currentQ === 0} 
          onClick={() => setCurrentQ(prev => prev - 1)}
        >
          Previous
        </button>
        {currentQ < DUMMY_QUESTIONS.length - 1 ? (
          <button className="btn-primary" onClick={() => setCurrentQ(prev => prev + 1)}>
            Next Question
          </button>
        ) : (
          <button className="btn-success" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>
    </div>
  );
}
