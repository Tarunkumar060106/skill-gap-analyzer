import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, Star, Lock, Award, Trophy, Gift, ArrowLeft, MoreHorizontal } from 'lucide-react';

export default function LearningPlan() {
  const { user } = useAuth();
  
  const modules = [
    { title: 'React Basics', status: 'completed', icon: CheckCircle },
    { title: 'State & Props', status: 'completed', icon: CheckCircle },
    { title: 'Hooks Deep Dive', status: 'active', icon: Star, label: 'START' },
    { title: 'Context API', status: 'locked', icon: Star },
    { title: 'Bonus: Animation', status: 'locked', icon: Gift }, 
    { title: 'Router Master', status: 'locked', icon: Star },
    { title: 'Data Fetching', status: 'locked', icon: Lock },
    { title: 'Testing Suite', status: 'locked', icon: Lock },
    { title: 'Project Launch', status: 'locked', icon: Trophy },
  ];

  return (
    <div className="learning-path-page">
      {/* Duolingo Style Header */}
      <div style={{ 
        background: '#58cc02', 
        color: 'white', 
        padding: '1.5rem', 
        borderRadius: '16px 16px 0 0', 
        marginBottom: '2rem',
        boxShadow: '0 4px 0 0 #46a302'
      }}>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <ArrowLeft size={24} />
              <div>
                 <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>Unit 1, Section 1</p>
                 <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Intro to Web Development</h2>
              </div>
           </div>
           <button style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.25rem', borderRadius: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
              <BookOpen size={20} /> TIPS
           </button>
        </div>
      </div>

      <div className="learning-path-wrapper">
        {modules.map((m, i) => {
          const isLast = i === modules.length - 1;
          
          return (
            <div key={i} className="path-node-container">
              {!isLast && <div className={`path-connector ${m.status === 'completed' ? 'completed' : ''}`} />}
              
              <div className={`path-node ${m.status}`}>
                 <m.icon size={36} />
                 
                 {m.status === 'active' && (
                    <div className="node-label">
                       {m.label || 'CONTINUE'}
                    </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Floating Re-assess Button */}
      <div className="mt-12 text-center pb-20">
         <button className="btn-secondary" style={{ borderRadius: 16, padding: '1rem 2rem', fontWeight: 800 }}>
            VIEW COURSE DETAILS
         </button>
      </div>
    </div>
  );
}
