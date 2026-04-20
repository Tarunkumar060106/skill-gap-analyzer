import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Lock } from 'lucide-react';

export default function ProctoringMonitor() {
  const [violation, setViolation] = useState(null);
  const location = useLocation();

  // Determine if we should be in locked-down testing mode based on the current route
  const isTestRoute = location.pathname.includes('/test/') || location.pathname.includes('/ai-interview') || location.pathname.includes('/test-setup');

  useEffect(() => {
    // Only proceed if running inside Electron context
    if (!window.electronAPI) return;

    if (isTestRoute) {
      window.electronAPI.lockScreen();
    } else {
      window.electronAPI.unlockScreen();
      setViolation(null); // Clear violation if they leave
    }

    const handleUsbViolation = (event, message) => {
      console.error('Proctoring Violation:', message);
      setViolation(message);
      // Here you would typically also API call to your backend:
      // markTestInvalid(currentUser.id, message)
    };

    const handleDisplayViolation = (event, message) => {
      console.error('Proctoring Violation:', message);
      setViolation(message);
    };

    window.electronAPI.onUsbViolation(handleUsbViolation);
    window.electronAPI.onDisplayViolation(handleDisplayViolation);

    return () => {
      if (!isTestRoute && window.electronAPI) {
        window.electronAPI.unlockScreen();
      }
      window.electronAPI.removeListeners();
    };
  }, [isTestRoute]);

  if (!violation || !isTestRoute) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-red-600/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in zoom-in duration-300">
      <AlertTriangle size={120} className="text-white mb-6 animate-pulse drop-shadow-2xl" strokeWidth={1.5} />
      <h1 className="text-5xl font-black uppercase tracking-widest mb-4">Security Violation</h1>
      <p className="text-2xl font-medium max-w-2xl text-red-100">
        {violation}
      </p>
      <div className="mt-12 p-6 bg-red-900/50 rounded-2xl border-2 border-red-500/50">
        <Lock size={32} className="mx-auto mb-3 text-red-300" />
        <p className="font-bold tracking-wide">TEST SESSION SUSPENDED</p>
        <p className="text-sm mt-2 text-red-200">Your proctor has been notified. Please remove the unauthorized device to potentially resume.</p>
      </div>
    </div>
  );
}
