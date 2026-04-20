import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ShieldCheck, Clock, CheckCircle2, AlertTriangle, FileText, MonitorX, Camera, Mic, CameraOff, Video, ScanFace } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startExamSession, getExamQuestions } from '../services/api';

// Check Status Component Helper
const StatusRow = ({ label, status, icon: Icon, error }) => (
  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
    <div className="flex items-center gap-3 text-sm font-medium">
      <div className={`p-2 rounded-full ${status === 'passed' ? 'bg-green-500/10 text-green-500' : status === 'failed' ? 'bg-red-500/10 text-destructive' : status === 'checking' ? 'bg-primary/10 text-primary animate-pulse' : 'bg-secondary text-muted-foreground'}`}>
        <Icon size={16} />
      </div>
      {label}
    </div>
    <div className="text-xs font-bold uppercase tracking-wider">
       {status === 'passed' && <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={14}/> Passed</span>}
       {status === 'failed' && <span className="text-destructive flex items-center gap-1"><AlertTriangle size={14}/> {error || 'Failed'}</span>}
       {status === 'checking' && <span className="text-primary flex items-center gap-1"><Clock size={14}/> Checking...</span>}
       {status === 'waiting' && <span className="text-muted-foreground">Pending</span>}
    </div>
  </div>
);

export default function TestSetup() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [examTemplate, setExamTemplate] = useState([]);
  
  // System Check State
  const [checksStarted, setChecksStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [kioskStatus, setKioskStatus] = useState('waiting'); // waiting, checking, passed, failed
  const [displayStatus, setDisplayStatus] = useState('waiting');
  const [mediaStatus, setMediaStatus] = useState('waiting');
  
  const [stream, setStream] = useState(null);
  const [mediaError, setMediaError] = useState('');
  
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureStatus, setCaptureStatus] = useState('waiting');
  
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const questions = await getExamQuestions();
        // Backend returns sections, adjust duration to match frontend expectations if needed
        const template = questions.map(sec => ({
          ...sec,
          duration: sec.duration || (sec.id === 'coding' ? 900 : 600)
        }));
        setExamTemplate(template);
      } catch (err) {
        console.error("Failed to fetch exam template:", err);
      }
    };
    
    fetchTemplate();
    
    // Cleanup media on unmount
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const runChecks = async () => {
    setChecksStarted(true);
    
    // 1. Electron IPC Checks
    setKioskStatus('checking');
    setDisplayStatus('checking');
    
    let sysInfo = { kioskEnabled: false, displays: 1 };
    
    if (window.electronAPI && window.electronAPI.checkSystem) {
       try {
         sysInfo = await window.electronAPI.checkSystem();
       } catch (e) {
         console.error("IPC Check failed", e);
       }
    } else {
       // Dev/Browser fallback for testing the UI outside electron
       sysInfo = { kioskEnabled: true, displays: 1 }; 
    }
    
    setTimeout(() => {
       setKioskStatus(sysInfo.kioskEnabled ? 'passed' : 'failed');
       setDisplayStatus(sysInfo.displays === 1 ? 'passed' : 'failed');
       
       startMediaCheck();
    }, 1000);
  };
  
  const startMediaCheck = async () => {
    setMediaStatus('checking');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const webcams = devices.filter(d => d.kind === 'videoinput');
      
      if (webcams.length > 1) {
         setMediaError("Multiple webcams detected. Ensure primary facing camera.");
      }
      
      setMediaStatus('passed');
      setCaptureStatus('checking'); // Ready to capture
    } catch (e) {
      console.error("Media permission denied", e);
      setMediaError(e.name === 'NotAllowedError' ? 'Permissions Denied' : 'Device/Webcam not found');
      setMediaStatus('failed');
    }
  };
  
  // Attach stream to video tag manually after state updates
  useEffect(() => {
    if (stream && videoRef.current) {
       videoRef.current.srcObject = stream;
    }
  }, [stream, capturedImage]);

  const captureEnvironment = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    const imageUri = canvasRef.current.toDataURL('image/jpeg');
    setCapturedImage(imageUri);
    setCaptureStatus('passed');
  };
  
  const handleRetake = () => {
    setCapturedImage(null);
    setCaptureStatus('checking');
  };

  const allChecksPassed = 
    kioskStatus === 'passed' && 
    displayStatus === 'passed' && 
    mediaStatus === 'passed' && 
    captureStatus === 'passed' &&
    agreed;

  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const handleStart = async () => {
    if (!allChecksPassed) return;
    setIsStarting(true);
    setStartError('');
    try {
      // Create a server-tracked exam session before leaving this page
      const session = await startExamSession(capturedImage);
      // Stop the webcam stream
      if (stream) stream.getTracks().forEach(t => t.stop());
      navigate('/test/full', { state: { sessionId: session.id, attemptNumber: session.attemptNumber } });
    } catch (err) {
      console.error('Failed to start session:', err);
      setStartError('Could not connect to server. Ensure the backend is running.');
      setIsStarting(false);
    }
  };

  const handleExit = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    navigate('/dashboard');
  };

  return (
    <div className="bg-background min-h-screen py-10 px-6 overflow-y-auto w-full">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="text-center mt-6">
          <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 text-primary">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Comprehensive Assessment Setup</h1>
          <p className="text-muted-foreground text-lg">Complete the automated security checks to begin your exam.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          
          {/* Left Column: Test Details */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm bg-secondary/10">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText size={20} className="text-primary" /> Exam Blueprint
                </CardTitle>
                <CardDescription>
                  This assessment adapts to your skill level. You cannot pause sections once started.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {examTemplate.map((sec, idx) => (
                    <div key={idx} className="relative flex items-center gap-6">
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-background text-primary font-bold text-sm shrink-0 z-10 shadow-sm">
                          {idx + 1}
                       </div>
                       <div className="p-4 rounded-xl border border-border/50 bg-background/50 shadow-sm flex-1 hover:border-primary/30 transition-colors">
                          <h4 className="font-bold text-foreground">
                            {sec.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5"><Clock size={12}/> {sec.duration / 60} mins</span>
                            <span className="opacity-50">•</span>
                            <span>{sec.questions.length} Questions</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Pre-Flight Checks */}
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-lg relative overflow-hidden bg-background">
               {/* Background Accent */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
               
               <CardHeader className="pb-4 border-b border-border/50 bg-secondary/10">
                 <CardTitle className="text-xl flex items-center gap-2">
                   <ShieldCheck size={20} className="text-primary" /> System Verification
                 </CardTitle>
                 <CardDescription>
                   Mandatory system checks to ensure testing integrity.
                 </CardDescription>
               </CardHeader>
               
               <CardContent className="space-y-4 pt-6">
                 <StatusRow label="Proctoring Lockdown Active" status={kioskStatus} icon={ShieldCheck} error="Native Bypass Detected" />
                 <StatusRow label="Single Display Constraint" status={displayStatus} icon={MonitorX} error="Multiple Displays Connected" />
                 <StatusRow label="Camera & Microphone Access" status={mediaStatus} icon={Mic} error={mediaError} />
                 
                 {/* Live Camera Feed & Capture Section */}
                 {(mediaStatus === 'passed' || mediaStatus === 'checking') && (
                   <div className="mt-8 p-5 rounded-xl border border-border/10 bg-secondary/20 shadow-inner">
                     <div className="flex justify-between items-center mb-4">
                       <h3 className="font-semibold text-sm flex items-center gap-2"><ScanFace size={16} className="text-primary"/> Room/Face Snapshot</h3>
                       {captureStatus === 'passed' && (
                         <span className="text-[10px] bg-green-500/20 text-green-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Image Secured</span>
                       )}
                     </div>
                     
                     <div className="relative rounded-lg overflow-hidden bg-black/90 aspect-video flex items-center justify-center border border-border/50 shadow-md">
                       {!stream && <span className="text-muted-foreground flex items-center gap-2 text-sm font-medium animate-pulse"><Video size={16}/> Accessing Lens...</span>}
                       
                       {capturedImage ? (
                         <img src={capturedImage} alt="Environment Snapshot" className="w-full h-full object-cover" />
                       ) : (
                         <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                       )}
                       
                       {/* Overlay Actions */}
                       {stream && (
                         <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                           {!capturedImage ? (
                             <Button onClick={captureEnvironment} variant="default" size="sm" className="shadow-2xl animate-in slide-in-from-bottom-2 bg-primary text-primary-foreground hover:scale-105 transition-transform">
                               <Camera className="mr-2 h-4 w-4" /> Capture Environment 
                             </Button>
                           ) : (
                             <Button onClick={handleRetake} variant="secondary" size="sm" className="shadow-2xl backdrop-blur-md bg-background/80 hover:bg-background">
                               <CameraOff className="mr-2 h-4 w-4" /> Retake Photo
                             </Button>
                           )}
                         </div>
                       )}
                     </div>
                     
                     <p className="text-[11px] text-muted-foreground mt-4 text-center leading-relaxed">
                       Ensure your face and immediate background are clearly visible. This photo validates your test environment to the mentors before you start.
                     </p>
                     
                     {/* Hidden Canvas to extract frame */}
                     <canvas ref={canvasRef} className="hidden" />
                   </div>
                 )}

                 {!checksStarted ? (
                   <Button onClick={runChecks} className="w-full mt-8 py-6 text-base font-semibold shadow-md" variant="default">
                     Initialize Security Checks
                   </Button>
                 ) : (
                   <div className="pt-6 border-t border-border/50 mt-8">
                     <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                       <input 
                         type="checkbox" 
                         id="terms" 
                         checked={agreed} 
                         onChange={(e) => setAgreed(e.target.checked)}
                         disabled={captureStatus !== 'passed'} 
                         className="w-5 h-5 mt-0.5 rounded border-primary/50 text-primary focus:ring-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 accent-primary"
                       />
                       <div className="space-y-1">
                         <label
                           htmlFor="terms"
                           className={`text-sm font-medium leading-relaxed ${captureStatus !== 'passed' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-foreground'}`}
                         >
                           I confirm that I am in a quiet, isolated environment. I accept that video and desktop telemetry will be recorded, and any detected tab switching or malicious software will invalidate this session.
                         </label>
                       </div>
                     </div>
                   </div>
                 )}
               </CardContent>
               <CardFooter className="pt-4 pb-6 px-6 bg-secondary/10 border-t border-border/50 flex flex-col items-center">
                  {startError && <p className="text-sm text-destructive mb-4 text-center">{startError}</p>}
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button 
                      variant="ghost" 
                      onClick={handleExit}
                      className="font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    >
                      Exit Assessment
                    </Button>
                    <Button
                      onClick={handleStart}
                      disabled={!allChecksPassed || isStarting}
                      size="lg"
                      className="font-bold px-8 shadow-lg transition-all"
                    >
                      {isStarting ? 'Initializing...' : <>Start Assessment <Play className="ml-2 h-5 w-5" /></>}
                    </Button>
                  </div>
               </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
