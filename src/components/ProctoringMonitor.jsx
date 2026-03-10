import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

export default function ProctoringMonitor({ onViolationsChange }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
        setHasCamera(true);
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        setHasCamera(false);
      }
    }
    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => {
          const newViolations = prev + 1;
          if (onViolationsChange) onViolationsChange(newViolations);
          return newViolations;
        });
        
        // Use a more accessible/custom toast or alert in the parent instead of raw alert if needed,
        // but for immediate interruption, this works.
        alert('Warning: You have left the test window. This violation has been recorded.');
      }
    };

    const handleWindowBlur = () => {
       // Only count as violation if it's a significant blur (switching apps vs just clicking outside)
       handleVisibilityChange();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // window.addEventListener('blur', handleWindowBlur); // Can be too aggressive if user clicks a popup

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onViolationsChange]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: window.innerWidth - 220, top: 0, bottom: window.innerHeight - 200 }}
      dragElastic={0.1}
      dragMomentum={false}
      className="fixed bottom-6 lg:bottom-10 right-6 lg:right-10 z-[2000] w-48 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 cursor-move"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      style={{ touchAction: 'none' }}
    >
      <div className="bg-slate-800 px-3 py-1.5 flex justify-between items-center border-b border-slate-700 flex-none select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300">Live Proctor</span>
        </div>
        {violations > 0 && (
          <div className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded text-[10px] font-bold" title={`${violations} Violations`}>
            <AlertTriangle size={10} /> {violations}
          </div>
        )}
      </div>
      
      <div className="aspect-video bg-black relative flex-none pointer-events-none">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <CameraOff size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">No Camera</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
