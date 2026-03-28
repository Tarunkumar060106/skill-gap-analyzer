import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  Star, 
  Lock, 
  Trophy, 
  ArrowLeft, 
  Flame,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

// Base Data for the Gamified Path (Status is determined dynamically)
const BASE_LEVELS = [
  { id: 'l1', type: 'lesson', title: 'Basics of Programming', icon: CheckCircle },
  { id: 'l2', type: 'lesson', title: 'Data Structures Intro', icon: CheckCircle },
  { id: 'l3', type: 'practice', title: 'Array Practice', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-600' },
  { id: 'l4', type: 'lesson', title: 'Linked Lists', icon: Lock },
  { id: 'l5', type: 'checkpoint', title: 'Algorithms Checkpoint', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-600' },
  { id: 'l6', type: 'lesson', title: 'System Design', icon: Lock }
];

export default function LearningPlan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pathLevels, setPathLevels] = useState([]);
  
  // Mock Stats
  const streak = 12;
  const xp = 1450;
  const health = 5; // representing hearts/lives

  useEffect(() => {
    // Generate dynamic path based on user progress string
    let completedIds = [];
    if (user?.techSkills && user.techSkills.includes('COMPLETED_LESSONS:')) {
       try {
           const match = user.techSkills.match(/COMPLETED_LESSONS:\[(.*?)\]/);
           if (match && match[1]) {
               completedIds = match[1].split(',');
           }
       } catch (e) {}
    }

    let foundActive = false;
    const dynamicLevels = BASE_LEVELS.map(level => {
       if (completedIds.includes(level.id)) {
           return { ...level, status: 'completed' };
       } else if (!foundActive) {
           foundActive = true;
           return { ...level, status: 'active' };
       } else {
           return { ...level, status: 'locked' };
       }
    });

    setPathLevels(dynamicLevels);
    setLoading(false);
  }, [user]);

  const handleNodeClick = (level) => {
    if (level.status !== 'locked') {
      navigate(`/lesson/${level.id}`);
    }
  };

  if (loading) return <div className="p-20 text-center text-primary font-bold animate-pulse">Loading your learning path...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans mb-24">
      
      {/* Gamified Header (Sticky) */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full hover:bg-slate-100">
             <ArrowLeft size={24} className="text-slate-600" />
           </Button>
           <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">Unit 1: Fundamentals</h1>
        </div>

        <div className="flex items-center gap-6 font-bold text-[15px]">
           {/* Hearts */}
           <div className="flex items-center gap-1.5 text-red-500 cursor-pointer hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors">
              <ShieldAlert size={20} fill="currentColor" strokeWidth={0} /> {health}
           </div>
           
           {/* Streak */}
           <div className="flex items-center gap-1.5 text-orange-500 cursor-pointer hover:bg-orange-50 px-3 py-1.5 rounded-xl transition-colors">
              <Flame size={20} fill="currentColor" /> {streak}
           </div>

           {/* XP / League */}
           <div className="flex items-center gap-1.5 text-primary cursor-pointer hover:bg-primary/5 px-3 py-1.5 rounded-xl transition-colors">
              <Zap size={20} fill="currentColor" /> {xp} XP
           </div>
        </div>
      </header>

      {/* Main Path Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full py-12 px-4 relative flex flex-col items-center">
        
        {/* The Path Line (SVG Background) */}
        {/* We use basic CSS for the winding feel instead of complex SVG for reliability */}
        <div className="absolute top-12 bottom-20 left-1/2 w-4 -translate-x-1/2 bg-slate-200 -z-10 rounded-full">
           <div className="w-full h-1/3 bg-green-500 rounded-t-full rounded-b-full"></div> {/* Progress fill */}
        </div>

        <div className="space-y-12 w-full flex flex-col items-center relative z-0">
           
           {/* Section Header */}
           <div className="w-full bg-primary text-white p-6 rounded-2xl shadow-lg border-b-4 border-primary/50 relative overflow-hidden mb-6 text-center max-w-sm">
             <div className="relative z-10">
               <h2 className="text-2xl font-black mb-1">Fundamentals</h2>
               <p className="opacity-90 font-medium">Master the basics of variables and structures.</p>
             </div>
           </div>

           {/* Nodes */}
           {pathLevels.map((level, i) => {
             // Zig-zag offset
             const offsetX = i % 2 === 0 ? '-3rem' : '3rem';
             const isCenter = level.type === 'checkpoint';
             
             let bgClass = 'bg-slate-300';
             let borderClass = 'border-slate-400';
             let textClass = 'text-slate-500';
             
             if (level.status === 'completed') {
               bgClass = 'bg-green-500';
               borderClass = 'border-green-600';
               textClass = 'text-white';
             } else if (level.status === 'active') {
               bgClass = level.bg || 'bg-primary';
               borderClass = level.border || 'border-blue-700';
               textClass = level.color?.replace('text-', 'text-white ') || 'text-white';
             }

             return (
               <div key={level.id} className="relative flex flex-col items-center" style={{ transform: isCenter ? 'none' : `translateX(${offsetX})` }}>
                 
                 {/* Tooltip for Active Node */}
                 {level.status === 'active' && (
                   <motion.div 
                     initial={{ y: 5, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="absolute -top-12 bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-slate-100 font-bold text-sm text-slate-700 whitespace-nowrap z-20"
                   >
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-100 -z-10"></div>
                      {level.title}
                   </motion.div>
                 )}

                 {/* Node Button */}
                 <motion.button
                   whileHover={level.status !== 'locked' ? { scale: 1.05 } : {}}
                   whileTap={level.status !== 'locked' ? { scale: 0.95 } : {}}
                   onClick={() => handleNodeClick(level)}
                   className={`relative z-10 w-[85px] h-[85px] rounded-full flex items-center justify-center transition-all 
                     ${bgClass} ${textClass} border-[6px] ${borderClass} shadow-xl
                     ${level.status === 'locked' ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}
                     ${level.status === 'active' ? 'ring-8 ring-primary/20 animate-pulse-slow' : ''}
                   `}
                 >
                   {/* Reflection effect for 3D feel */}
                   <div className="absolute top-1 left-2 w-10 h-4 bg-white/20 rounded-full blur-[1px] rotate-[-20deg]"></div>
                   
                   <level.icon size={36} strokeWidth={2.5} className={level.status === 'active' ? 'drop-shadow-md' : ''} />
                 </motion.button>
               </div>
             );
           })}
        </div>
      </main>
      
      {/* Bottom Nav Simulation (Mobile) */}
      <nav className="fixed bottom-0 w-full bg-white border-t-2 border-slate-200 h-20 flex items-center justify-around px-4 lg:hidden z-50">
         <div className="flex flex-col items-center text-primary font-bold">
            <CheckCircle size={28} />
            <span className="text-[10px] uppercase mt-1">Learn</span>
         </div>
         <div className="flex flex-col items-center text-slate-400 font-bold hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate('/leaderboard')}>
            <Trophy size={28} />
            <span className="text-[10px] uppercase mt-1">Leagues</span>
         </div>
      </nav>
      
    </div>
  );
}
