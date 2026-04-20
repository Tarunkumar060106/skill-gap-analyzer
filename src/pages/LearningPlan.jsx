import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, Star, Lock, Trophy, ArrowLeft, Flame, Zap, ShieldAlert,
  Code2, BookOpen, Swords, BrainCircuit, Cpu, Database, Network, Rocket,
  Gem, Crown, Calculator, Puzzle, PenTool, MessageCircle, Wrench,
  GraduationCap, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { getLessons } from '../services/api';

// ─── TRACKS ────────────────────────────────────────────────────────────────────
// ... (TRACKS remains same for styling/order)
const TRACKS = [
  {
    id: 'coding',
    title: 'Coding',
    subtitle: 'From fundamentals to advanced algorithms',
    emoji: '💻',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    ringColor: 'ring-blue-500/20',
    borderAccent: 'border-blue-600',
    bgAccent: 'bg-blue-500',
    units: [
      {
        title: 'Fundamentals',
        color: 'bg-blue-600',
        levels: [
          { id: 'c1', type: 'lesson', title: 'Variables & Data Types', icon: BookOpen, xp: 50, duration: '10 min' },
          { id: 'c2', type: 'lesson', title: 'Control Flow & Loops', icon: BookOpen, xp: 50, duration: '12 min' },
          { id: 'c3', type: 'practice', title: 'FizzBuzz Drill', icon: Star, xp: 75, duration: '8 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 'c4', type: 'lesson', title: 'Functions & Scope', icon: BookOpen, xp: 50, duration: '15 min' },
          { id: 'c5', type: 'lesson', title: 'Strings & Manipulation', icon: Code2, xp: 60, duration: '12 min' },
          { id: 'c6', type: 'checkpoint', title: 'Boss: Fundamentals Exam', icon: Swords, xp: 200, duration: '20 min', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-600' },
        ]
      },
      {
        title: 'Data Structures & Algorithms',
        color: 'bg-blue-700',
        levels: [
          { id: 'c7', type: 'lesson', title: 'Arrays & Two Pointers', icon: BookOpen, xp: 60, duration: '15 min' },
          { id: 'c8', type: 'practice', title: 'Array Olympics', icon: Star, xp: 100, duration: '15 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 'c9', type: 'lesson', title: 'Linked Lists', icon: BookOpen, xp: 70, duration: '18 min' },
          { id: 'c10', type: 'lesson', title: 'Stacks & Queues', icon: Database, xp: 60, duration: '14 min' },
          { id: 'c11', type: 'bonus', title: 'Bonus: Recursion Deep Dive', icon: Gem, xp: 150, duration: '20 min', color: 'text-cyan-500', bg: 'bg-cyan-500', border: 'border-cyan-600' },
          { id: 'c12', type: 'lesson', title: 'Trees & Binary Search', icon: Network, xp: 80, duration: '20 min' },
          { id: 'c13', type: 'practice', title: 'Graph Traversal Lab', icon: Star, xp: 100, duration: '18 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 'c14', type: 'checkpoint', title: 'Boss: Algorithm Gauntlet', icon: Swords, xp: 250, duration: '25 min', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-600' },
        ]
      },
      {
        title: 'Advanced Coding',
        color: 'bg-blue-800',
        levels: [
          { id: 'c15', type: 'lesson', title: 'Array & String Mastery', icon: Code2, xp: 80, duration: '18 min' },
          { id: 'c16', type: 'lesson', title: 'Advanced Algorithm Patterns', icon: BrainCircuit, xp: 100, duration: '22 min' },
          { id: 'c17', type: 'practice', title: 'LeetCode Problem Tracker', icon: Star, xp: 120, duration: '20 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 'c18', type: 'bonus', title: 'Bonus: Competitive Coding', icon: Gem, xp: 200, duration: '25 min', color: 'text-cyan-500', bg: 'bg-cyan-500', border: 'border-cyan-600' },
          { id: 'c19', type: 'checkpoint', title: 'Boss: Coding Interview Sim', icon: Crown, xp: 300, duration: '30 min', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-600' },
        ]
      }
    ]
  },
  {
    id: 'system-design',
    title: 'System Design',
    subtitle: 'Architecture, APIs, and scalable systems',
    emoji: '🏗️',
    color: 'bg-orange-600',
    textColor: 'text-orange-600',
    ringColor: 'ring-orange-500/20',
    borderAccent: 'border-orange-600',
    bgAccent: 'bg-orange-500',
    units: [
      {
        title: 'Design Fundamentals',
        color: 'bg-orange-600',
        levels: [
          { id: 's1', type: 'lesson', title: 'REST API Design', icon: Cpu, xp: 70, duration: '15 min' },
          { id: 's2', type: 'lesson', title: 'Database Modeling', icon: Database, xp: 80, duration: '18 min' },
          { id: 's3', type: 'lesson', title: 'Authentication & Security', icon: ShieldAlert, xp: 70, duration: '16 min' },
          { id: 's4', type: 'practice', title: 'Design: URL Shortener', icon: Star, xp: 120, duration: '22 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 's5', type: 'checkpoint', title: 'Boss: API Design Review', icon: Swords, xp: 200, duration: '20 min', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-600' },
        ]
      },
      {
        title: 'Scalable Architecture',
        color: 'bg-orange-700',
        levels: [
          { id: 's6', type: 'lesson', title: 'Caching & CDNs', icon: Rocket, xp: 80, duration: '16 min' },
          { id: 's7', type: 'lesson', title: 'Message Queues & Async', icon: Network, xp: 90, duration: '18 min' },
          { id: 's8', type: 'practice', title: 'Design: Chat Application', icon: BrainCircuit, xp: 150, duration: '25 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 's9', type: 'bonus', title: 'Bonus: Microservices', icon: Gem, xp: 180, duration: '22 min', color: 'text-cyan-500', bg: 'bg-cyan-500', border: 'border-cyan-600' },
          { id: 's10', type: 'checkpoint', title: 'Boss: System Design Defense', icon: Crown, xp: 500, duration: '30 min', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-600' },
        ]
      }
    ]
  },
  {
    id: 'aptitude',
    title: 'Aptitude & Reasoning',
    subtitle: 'Quantitative, logical, and analytical thinking',
    emoji: '🧠',
    color: 'bg-indigo-600',
    textColor: 'text-indigo-600',
    ringColor: 'ring-indigo-500/20',
    borderAccent: 'border-indigo-600',
    bgAccent: 'bg-indigo-500',
    units: [
      {
        title: 'Quantitative Aptitude',
        color: 'bg-indigo-600',
        levels: [
          { id: 'a1', type: 'lesson', title: 'Arithmetic & Percentages', icon: Calculator, xp: 60, duration: '14 min' },
          { id: 'a2', type: 'lesson', title: 'Problem Solving with Numbers', icon: Calculator, xp: 70, duration: '15 min' },
          { id: 'a3', type: 'practice', title: 'Mental Math Trainer', icon: Star, xp: 100, duration: '12 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 'a4', type: 'lesson', title: 'Ratios, Time & Speed', icon: BookOpen, xp: 65, duration: '15 min' },
          { id: 'a5', type: 'checkpoint', title: 'Boss: Quant Challenge', icon: Swords, xp: 200, duration: '18 min', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-600' },
        ]
      },
      {
        title: 'Logical Reasoning',
        color: 'bg-indigo-700',
        levels: [
          { id: 'a6', type: 'lesson', title: 'Logical Puzzles & Patterns', icon: Puzzle, xp: 70, duration: '16 min' },
          { id: 'a7', type: 'lesson', title: 'Critical Thinking', icon: BrainCircuit, xp: 80, duration: '18 min' },
          { id: 'a8', type: 'practice', title: 'Build a Sudoku Solver', icon: Star, xp: 150, duration: '25 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 'a9', type: 'bonus', title: 'Bonus: Data Interpretation', icon: Gem, xp: 120, duration: '18 min', color: 'text-cyan-500', bg: 'bg-cyan-500', border: 'border-cyan-600' },
          { id: 'a10', type: 'checkpoint', title: 'Boss: Aptitude Gauntlet', icon: Crown, xp: 250, duration: '22 min', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-600' },
        ]
      }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    subtitle: 'Technical writing, English, and professional skills',
    emoji: '✍️',
    color: 'bg-teal-600',
    textColor: 'text-teal-600',
    ringColor: 'ring-teal-500/20',
    borderAccent: 'border-teal-600',
    bgAccent: 'bg-teal-500',
    units: [
      {
        title: 'Technical Communication',
        color: 'bg-teal-600',
        levels: [
          { id: 'e1', type: 'lesson', title: 'Technical Writing Skills', icon: PenTool, xp: 60, duration: '14 min' },
          { id: 'e2', type: 'lesson', title: 'Business English', icon: MessageCircle, xp: 60, duration: '14 min' },
          { id: 'e3', type: 'practice', title: 'Technical Blog Platform', icon: Star, xp: 120, duration: '20 min', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
          { id: 'e4', type: 'lesson', title: 'Resume & Portfolio Workshop', icon: Wrench, xp: 70, duration: '15 min' },
          { id: 'e5', type: 'checkpoint', title: 'Boss: Mock HR Round', icon: GraduationCap, xp: 300, duration: '25 min', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-600' },
        ]
      }
    ]
  }
];

export default function LearningPlan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(null); // null = show track selection
  const [trackData, setTrackData] = useState({}); // { trackId: units with status }
  
  const streak = 12;
  const health = 5;

  useEffect(() => {
    async function fetchProgress() {
      try {
        setLoading(true);
        const lessons = await getLessons();
        const completedIds = lessons.filter(l => l.isCompleted).map(l => l.id);

        // Build status for ALL tracks
        const data = {};
        TRACKS.forEach(track => {
          let foundActive = false;
          data[track.id] = {
            ...track,
            units: track.units.map(unit => ({
              ...unit,
              levels: unit.levels.map(level => {
                if (completedIds.includes(level.id)) {
                    return { ...level, status: 'completed' };
                } else if (!foundActive) {
                    foundActive = true;
                    return { ...level, status: 'active' };
                } else {
                    return { ...level, status: 'locked' };
                }
              })
            }))
          };
        });

        setTrackData(data);
      } catch (err) {
        console.error('Failed to fetch learning progress:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [user]);

  const getTrackStats = (trackId) => {
    const td = trackData[trackId];
    if (!td) return { completed: 0, total: 0, xp: 0, percent: 0 };
    const all = td.units.flatMap(u => u.levels);
    const done = all.filter(l => l.status === 'completed');
    return {
      completed: done.length,
      total: all.length,
      xp: done.reduce((a, l) => a + (l.xp || 0), 0),
      percent: all.length > 0 ? Math.round((done.length / all.length) * 100) : 0
    };
  };

  const handleNodeClick = (level) => {
    if (level.status !== 'locked') {
      navigate(`/lesson/${level.id}`);
    }
  };

  if (loading) return <div className="p-20 text-center text-primary font-bold animate-pulse">Loading your learning path...</div>;

  // ─── TRACK SELECTION VIEW ──────────────────────────────────────────────────
  if (!selectedTrack) {
    const totalXP = Object.keys(trackData).reduce((sum, id) => sum + getTrackStats(id).xp, 0);
    
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full hover:bg-slate-100">
               <ArrowLeft size={24} className="text-slate-600" />
             </Button>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">Learning Tracks</h1>
          </div>
          <div className="flex items-center gap-6 font-bold text-[15px]">
             <div className="flex items-center gap-1.5 text-red-500 px-3 py-1.5 rounded-xl">
                <ShieldAlert size={20} fill="currentColor" strokeWidth={0} /> {health}
             </div>
             <div className="flex items-center gap-1.5 text-orange-500 px-3 py-1.5 rounded-xl">
                <Flame size={20} fill="currentColor" /> {streak}
             </div>
             <div className="flex items-center gap-1.5 text-primary px-3 py-1.5 rounded-xl">
                <Zap size={20} fill="currentColor" /> {totalXP} XP
             </div>
          </div>
        </header>

        {/* Track Cards */}
        <main className="flex-1 max-w-4xl mx-auto w-full py-10 px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Choose Your Track</h2>
            <p className="text-slate-500 text-lg">Each track focuses on a different skill area. Progress is saved independently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRACKS.map(track => {
              const stats = getTrackStats(track.id);
              const totalLevels = trackData[track.id]?.units.flatMap(u => u.levels).length || 0;
              
              return (
                <motion.button
                  key={track.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTrack(track.id)}
                  className="text-left group"
                >
                  <div className={`relative overflow-hidden rounded-2xl border-2 border-slate-200 hover:${track.borderAccent} bg-white shadow-sm hover:shadow-xl transition-all duration-300 p-6`}>
                    {/* Background accent blob */}
                    <div className={`absolute top-[-40%] right-[-20%] w-48 h-48 ${track.bgAccent} opacity-[0.07] rounded-full blur-2xl group-hover:opacity-[0.12] transition-opacity`}></div>
                    
                    <div className="relative z-10">
                      {/* Emoji + Title */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 ${track.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-black/10`}>
                          {track.emoji}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 group-hover:text-slate-900">{track.title}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">{track.subtitle}</p>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 text-sm font-bold mb-4">
                        <span className="text-slate-500">{totalLevels} lessons</span>
                        <span className="text-slate-300">•</span>
                        <span className={track.textColor}>{stats.xp} XP earned</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full ${track.bgAccent} rounded-full`}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs font-bold text-slate-400">{stats.completed}/{stats.total} completed</span>
                        <span className={`text-xs font-bold ${track.textColor}`}>{stats.percent}%</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ─── TRACK PATH VIEW ──────────────────────────────────────────────────────
  const currentTrack = trackData[selectedTrack];
  if (!currentTrack) return null;

  const stats = getTrackStats(selectedTrack);
  const trackMeta = TRACKS.find(t => t.id === selectedTrack);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans mb-24">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => setSelectedTrack(null)} className="rounded-full hover:bg-slate-100">
             <ChevronLeft size={24} className="text-slate-600" />
           </Button>
           <div>
             <div className="flex items-center gap-2">
               <span className="text-lg">{trackMeta.emoji}</span>
               <h1 className="text-lg font-bold text-slate-800 tracking-tight">{trackMeta.title}</h1>
             </div>
             <div className="flex items-center gap-2 mt-0.5">
               <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                 <div className={`h-full ${trackMeta.bgAccent} rounded-full transition-all`} style={{ width: `${stats.percent}%` }}></div>
               </div>
               <span className="text-xs font-bold text-slate-500">{stats.percent}%</span>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-6 font-bold text-[15px]">
           <div className="flex items-center gap-1.5 text-red-500 px-3 py-1.5 rounded-xl">
              <ShieldAlert size={20} fill="currentColor" strokeWidth={0} /> {health}
           </div>
           <div className="flex items-center gap-1.5 text-orange-500 px-3 py-1.5 rounded-xl">
              <Flame size={20} fill="currentColor" /> {streak}
           </div>
           <div className={`flex items-center gap-1.5 ${trackMeta.textColor} px-3 py-1.5 rounded-xl`}>
              <Zap size={20} fill="currentColor" /> {stats.xp} XP
           </div>
        </div>
      </header>

      {/* Main Path */}
      <main className="flex-1 max-w-2xl mx-auto w-full py-12 px-4 relative flex flex-col items-center">
        
        {/* Path Line */}
        <div className="absolute top-12 bottom-20 left-1/2 w-4 -translate-x-1/2 bg-slate-200 -z-10 rounded-full">
           <div className={`w-full ${trackMeta.bgAccent} rounded-full transition-all duration-700`} style={{ height: `${stats.percent}%` }}></div>
        </div>

        <div className="space-y-8 w-full flex flex-col items-center relative z-0">
           
           {currentTrack.units.map((unit, unitIdx) => {
             const unitCompleted = unit.levels.every(l => l.status === 'completed');
             const unitActive = unit.levels.some(l => l.status === 'active');
             
             return (
               <div key={unitIdx} className="w-full flex flex-col items-center space-y-10">

                 {/* Unit Header */}
                 <div className={`w-full ${unit.color} text-white p-6 rounded-2xl shadow-lg border-b-4 border-black/10 relative overflow-hidden text-center max-w-sm ${!unitActive && !unitCompleted ? 'opacity-50' : ''}`}>
                   <div className="absolute inset-0 opacity-10">
                     <div className="absolute top-[-30%] right-[-20%] w-40 h-40 bg-white rounded-full"></div>
                     <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-white rounded-full"></div>
                   </div>
                   <div className="relative z-10">
                     <h2 className="text-2xl font-black mb-1">{unit.title}</h2>
                     {unitCompleted && (
                       <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                         <CheckCircle size={14} /> Completed
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Nodes */}
                 {unit.levels.map((level, i) => {
                   const offsetX = i % 2 === 0 ? '-3rem' : '3rem';
                   const isCenter = level.type === 'checkpoint';
                   const isBonus = level.type === 'bonus';
                   
                   let bgClass = 'bg-slate-300';
                   let borderClass = 'border-slate-400';
                   let textClass = 'text-slate-500';
                   let nodeSize = 'w-[85px] h-[85px]';
                   
                   if (isCenter || isBonus) nodeSize = 'w-[95px] h-[95px]';
                   
                   if (level.status === 'completed') {
                     bgClass = 'bg-green-500';
                     borderClass = 'border-green-600';
                     textClass = 'text-white';
                   } else if (level.status === 'active') {
                     bgClass = level.bg || trackMeta.bgAccent;
                     borderClass = level.border || trackMeta.borderAccent;
                     textClass = 'text-white';
                   }

                   return (
                     <div key={level.id} className="relative flex flex-col items-center" style={{ transform: isCenter ? 'none' : `translateX(${offsetX})` }}>
                       
                       {level.status === 'active' && (
                         <motion.div 
                           initial={{ y: 5, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           className="absolute -top-16 bg-white px-4 py-2.5 rounded-xl shadow-lg border-2 border-slate-100 font-bold text-sm text-slate-700 whitespace-nowrap z-20 text-center"
                         >
                            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                            <div>{level.title}</div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center justify-center gap-2">
                              <span>{level.duration}</span> • <span>{level.xp} XP</span>
                            </div>
                         </motion.div>
                       )}

                       <motion.button
                         whileHover={level.status !== 'locked' ? { scale: 1.08 } : {}}
                         whileTap={level.status !== 'locked' ? { scale: 0.95 } : {}}
                         onClick={() => handleNodeClick(level)}
                         className={`relative z-10 ${nodeSize} rounded-full flex items-center justify-center transition-all 
                           ${bgClass} ${textClass} border-[6px] ${borderClass} shadow-xl
                           ${level.status === 'locked' ? 'opacity-60 cursor-not-allowed grayscale' : 'cursor-pointer hover:brightness-110'}
                           ${level.status === 'active' ? `ring-8 ${trackMeta.ringColor} animate-pulse-slow` : ''}
                         `}
                       >
                         <div className="absolute top-1 left-2 w-10 h-4 bg-white/20 rounded-full blur-[1px] rotate-[-20deg]"></div>
                         
                         {level.status === 'completed' ? (
                           <CheckCircle size={36} strokeWidth={2.5} />
                         ) : level.status === 'locked' ? (
                           <Lock size={32} strokeWidth={2.5} />
                         ) : (
                           <level.icon size={36} strokeWidth={2.5} className="drop-shadow-md" />
                         )}
                       </motion.button>

                       {level.status !== 'active' && (
                         <span className={`mt-2 text-[11px] font-bold tracking-tight max-w-[120px] text-center leading-tight ${level.status === 'locked' ? 'text-slate-400' : 'text-slate-600'}`}>
                           {level.title}
                         </span>
                       )}
                     </div>
                   );
                 })}
               </div>
             );
           })}

           {/* End Trophy */}
           <div className="pt-6 flex flex-col items-center">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-[6px] ${stats.percent === 100 ? `${trackMeta.bgAccent} ${trackMeta.borderAccent} text-white` : 'bg-slate-200 border-slate-300 text-slate-400'}`}>
               <Trophy size={36} strokeWidth={2.5} />
             </div>
             <span className="mt-2 text-sm font-bold text-slate-500">Track Complete!</span>
           </div>
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t-2 border-slate-200 h-20 flex items-center justify-around px-4 lg:hidden z-50">
         <div className="flex flex-col items-center text-primary font-bold" onClick={() => setSelectedTrack(null)}>
            <BookOpen size={28} />
            <span className="text-[10px] uppercase mt-1">Tracks</span>
         </div>
         <div className="flex flex-col items-center text-slate-400 font-bold hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate('/leaderboard')}>
            <Trophy size={28} />
            <span className="text-[10px] uppercase mt-1">Leagues</span>
         </div>
      </nav>
      
    </div>
  );
}
