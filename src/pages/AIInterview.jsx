import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendInterviewMessage, finishInterview } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, CheckCircle2, Award, ArrowLeft, MoreHorizontal, Sparkles, Mic, MicOff, Volume2, VolumeX, Video, VideoOff, PhoneOff, Settings, UserCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AIInterview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [subject, setSubject] = useState('Full Stack Development');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(true); // Default ON for meeting
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState(null);
  
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            // Auto-submit final voice results if they are significant
            const final = event.results[i][0].transcript.trim();
            if (final.length > 2) {
               setInputValue(final);
               // Optional: auto-send could go here, but manual is safer
            }
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (interimTranscript) setInputValue(interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        // Only restart if we WANT to be listening and not speaking
        if (isVoiceMode && isListening && !isSpeaking) {
           try { recognitionRef.current.start(); } catch(e) {}
        }
      };
    }
  }, [isVoiceMode, isListening, isSpeaking]);

  // Support for persistent listening
  useEffect(() => {
    if (isVoiceMode && isListening && !isSpeaking) {
      try { recognitionRef.current.start(); } catch(e) {}
    } else {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
  }, [isVoiceMode, isListening, isSpeaking]);

  // Handle Camera
  useEffect(() => {
    if (interviewStarted && isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [interviewStarted, isCameraOn]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Speak function (TTS)
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      // Stop recognition while AI talks to avoid echo/self-capture
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = (forceValue) => {
    const targetValue = forceValue !== undefined ? forceValue : !isListening;
    setIsListening(targetValue);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const startInterview = async () => {
    setInterviewStarted(true);
    setLoading(true);
    setIsListening(true); // Start listening immediately
    try {
      const data = await sendInterviewMessage('', [], subject);
      setMessages([{ role: 'assistant', content: data.message }]);
      if (isVoiceMode) speak(data.message);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || loading || isSpeaking) return;

    const userMessage = { role: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setLoading(true);

    try {
      const data = await sendInterviewMessage(userMessage.content, newMessages, subject);
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      if (isVoiceMode) speak(data.message);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    stopCamera();
    setFinishing(true);
    try {
      const data = await finishInterview(messages, subject);
      navigate('/results', { state: { interviewResult: data } });
    } catch (e) {
      console.error(e);
    } finally {
      setFinishing(false);
    }
  };

  if (!interviewStarted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 font-sans overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10"
        >
          {/* Left Side: Cinematic Camera Preview */}
          <div className="relative group">
             <div className="aspect-video bg-neutral-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                <AnimatePresence mode="wait">
                   {isCameraOn ? (
                     <motion.video 
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover scale-x-[-1]" 
                     />
                   ) : (
                     <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-6"
                     >
                        <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                           <UserCircle size={80} className="opacity-10" />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-30">Camera Disabled</span>
                     </motion.div>
                   )}
                </AnimatePresence>

                {/* Local Controls Overlay */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10">
                   <Button size="icon" variant={isCameraOn ? "secondary" : "destructive"} className="rounded-xl w-12 h-12" onClick={() => setIsCameraOn(!isCameraOn)}>
                      {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                   </Button>
                   <Button size="icon" variant={isVoiceMode ? "secondary" : "destructive"} className="rounded-xl w-12 h-12" onClick={() => setIsVoiceMode(!isVoiceMode)}>
                      {isVoiceMode ? <Mic size={20} /> : <MicOff size={20} />}
                   </Button>
                </div>
             </div>
             
             {/* Micro-indicators */}
             <div className="mt-6 flex justify-center gap-8">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Video Ready</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${isVoiceMode ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Audio Ready</span>
                </div>
             </div>
          </div>

          {/* Right Side: Join Info & Domain Selection */}
          <div className="space-y-10">
             <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                   Step 01: Secure Entry
                </Badge>
                <h1 className="text-6xl font-black tracking-tighter leading-none italic">
                   READY TO <span className="text-primary not-italic">JOIN?</span>
                </h1>
                <p className="text-muted-foreground text-sm font-medium tracking-tight border-l-2 border-primary/30 pl-4">
                   You're entering a high-fidelity evaluation session with Agent-01. Please verify your equipment before proceeding.
                </p>
             </div>

             <div className="space-y-6">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">Interview Specialization</label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'Full Stack Development', icon: <Sparkles size={20} /> },
                    { id: 'System Design & Architecture', icon: <Bot size={20} /> }
                  ].map((item) => (
                    <motion.button 
                      key={item.id}
                      whileHover={{ x: 10 }}
                      className={`flex items-center justify-between p-6 rounded-3xl border transition-all text-left group ${
                         subject === item.id 
                            ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(var(--primary),0.1)]' 
                            : 'border-white/5 hover:border-white/20'
                      }`}
                      onClick={() => setSubject(item.id)}
                    >
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            subject === item.id ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground group-hover:bg-white/10'
                         }`}>
                            {item.icon}
                         </div>
                         <span className={`font-bold text-sm ${subject === item.id ? 'text-white' : 'text-muted-foreground'}`}>{item.id}</span>
                      </div>
                      {subject === item.id && <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>}
                    </motion.button>
                  ))}
                </div>
             </div>

             <Button 
                className="w-full h-20 rounded-[2rem] text-xl font-black italic shadow-[0_0_40px_rgba(var(--primary),0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 gap-4 group" 
                onClick={startInterview}
             >
                PROCEED TO MEETING
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                   <ChevronRight size={24} />
                </div>
             </Button>
          </div>
        </motion.div>

        {/* Floating Credit */}
        <div className="absolute bottom-10 left-10 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.6em]">
           L-STREAM v4.2 // SECURITY CLEARANCE: LEVEL 5
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Premium Meeting Header */}
      <header className="flex items-center justify-between px-8 py-5 bg-[#121212]/80 backdrop-blur-2xl border-b border-white/5 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                <Bot className="text-primary" size={24} />
             </div>
             <div>
                <h2 className="text-lg font-bold tracking-tight">{subject} Interview</h2>
                <div className="flex items-center gap-2">
                   <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Secure Session ID: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                </div>
             </div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 font-mono text-[10px] flex items-center gap-2">
            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div> LIVE RECORDING
          </Badge>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-primary border-2 border-[#121212] flex items-center justify-center text-[10px] font-black">AI</div>
                 <div className="w-8 h-8 rounded-full bg-secondary border-2 border-[#121212] flex items-center justify-center text-[10px] font-black">ME</div>
              </div>
              <span className="text-[11px] font-bold text-muted-foreground">Meeting with AI Agent</span>
           </div>
           <Button variant="destructive" className="rounded-2xl px-8 font-bold shadow-[0_0_30px_rgba(239,68,68,0.2)] gap-2 h-12 transition-all hover:scale-105 active:scale-95" onClick={handleFinish} disabled={finishing}>
              {finishing ? <Loader2 className="animate-spin" size={20} /> : <PhoneOff size={20} />}
              End Call
           </Button>
        </div>
      </header>

      {/* Grid Layout: Cinematic Meeting Style */}
      <main className="flex-1 flex gap-6 p-6 overflow-hidden relative">
        <div className="flex-[3] flex flex-col gap-6 h-full">
           {/* Main Video Stage */}
           <div className="flex-1 relative rounded-[3rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl group transition-all duration-700">
              <AnimatePresence mode="wait">
                 {isCameraOn ? (
                   <motion.video 
                     key="camera"
                     initial={{ opacity: 0, scale: 1.1 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, filter: 'blur(20px)' }}
                     ref={videoRef} 
                     autoPlay 
                     playsInline 
                     muted 
                     className="w-full h-full object-cover scale-x-[-1]" 
                   />
                 ) : (
                   <motion.div 
                     key="nocamera"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-6 bg-[#0f0f0f]"
                   >
                      <div className="w-40 h-40 rounded-full bg-secondary/5 flex items-center justify-center border border-white/10 shadow-inner">
                         <UserCircle size={80} className="opacity-10" />
                      </div>
                      <span className="text-xs font-bold tracking-[0.4em] uppercase opacity-30">Video Paused</span>
                   </motion.div>
                 )}
              </AnimatePresence>
              
              {/* Participant Labels */}
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                 <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-black/60 backdrop-blur-3xl border border-white/10 text-white font-bold py-2 px-5 rounded-2xl flex items-center gap-3"
                 >
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    {user?.fullName || user?.name}
                 </motion.div>
                 
                 <AnimatePresence>
                    {isListening && !isSpeaking && (
                       <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="bg-primary/20 backdrop-blur-2xl border border-primary/30 text-primary-foreground font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full w-fit shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                       >
                          Listening...
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Floating AI Agent Preview (Top Right) */}
              <motion.div 
                 drag
                 dragConstraints={{ left: -500, right: 0, top: 0, bottom: 400 }}
                 whileHover={{ scale: 1.02 }}
                 className="absolute top-8 right-8 w-64 aspect-[3/4] bg-[#1a1a1a]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col items-center justify-center p-8 text-center space-y-6 cursor-move z-40"
              >
                 <div className="relative">
                    <motion.div 
                       animate={isSpeaking ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                       transition={{ repeat: Infinity, duration: 2 }}
                       className={`w-28 h-28 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isSpeaking ? 'bg-primary/20 border-primary shadow-[0_0_40px_rgba(var(--primary),0.4)]' : 'bg-white/5 border-white/10'}`}
                    >
                       <Bot size={56} className={isSpeaking ? 'text-primary' : 'text-muted-foreground'} />
                    </motion.div>
                    {isSpeaking && (
                       <>
                          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-primary/30 rounded-full -z-10 blur-2xl"></motion.div>
                          <div className="absolute -bottom-2 translate-y-1/2 left-1/2 -translate-x-1/2 flex gap-1">
                             {[1, 2, 3].map(i => (
                                <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} className="w-1 bg-primary rounded-full"></motion.div>
                             ))}
                          </div>
                       </>
                    )}
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">AI Interviewer</h4>
                    <p className="text-[9px] text-muted-foreground mt-2 font-medium tracking-tight h-8 line-clamp-2">
                       {isSpeaking ? 'Responding to current query...' : 'Analyzing technical performance'}
                    </p>
                 </div>
              </motion.div>

              {/* Central Controls Bar */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-3xl group-hover:bottom-14 transition-all duration-500 hover:bg-black/60">
                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button 
                       size="icon" 
                       variant={isListening ? "default" : "secondary"} 
                       className={`rounded-full w-14 h-14 transition-all ${isListening ? 'bg-primary shadow-[0_0_25px_rgba(var(--primary),0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border-none'}`} 
                       onClick={() => toggleListening()}
                    >
                       {isListening ? <Mic size={24} /> : <MicOff size={24} />}
                    </Button>
                 </motion.div>

                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button 
                       size="icon" 
                       variant={isCameraOn ? "secondary" : "destructive"} 
                       className={`rounded-full w-14 h-14 transition-all ${isCameraOn ? 'bg-white/10 text-white hover:bg-white/20 border-none' : 'shadow-[0_0_25px_rgba(239,68,68,0.4)]'}`} 
                       onClick={() => setIsCameraOn(!isCameraOn)}
                    >
                       {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </Button>
                 </motion.div>

                 <div className="w-px h-10 bg-white/10 mx-2"></div>

                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                       size="icon" 
                       variant="destructive" 
                       className="rounded-full w-20 h-16 shadow-[0_0_40px_rgba(239,68,68,0.3)] transition-all bg-red-500 hover:bg-red-600 border-none" 
                       onClick={handleFinish}
                    >
                       <PhoneOff size={32} />
                    </Button>
                 </motion.div>
              </div>
           </div>
        </div>

        {/* Sidebar: Smart Meeting Controls & Chat */}
        <aside className="w-[28rem] flex flex-col gap-6">
           <Card className="flex-1 flex flex-col overflow-hidden bg-[#121212]/80 backdrop-blur-2xl border-white/5 shadow-3xl rounded-[2.5rem]">
             <CardHeader className="px-8 py-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                   <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-primary">
                      <Sparkles size={16} /> Meeting Intel
                   </CardTitle>
                   <Badge variant="secondary" className="bg-white/5 border-white/10 text-[9px] px-2 py-0.5 rounded-lg">LIVE</Badge>
                </div>
             </CardHeader>
             
             <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide" ref={scrollRef}>
                <AnimatePresence mode="popLayout">
                   {messages.map((m, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20, y: 10 }} 
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        className={`group relative ${m.role === 'user' ? 'pl-8' : 'pr-8'}`}
                      >
                         <div className={`flex items-center gap-3 mb-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.role === 'assistant' && (
                               <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Bot size={12} className="text-primary" />
                               </div>
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                               {m.role === 'assistant' ? 'AI INTERVIEWER' : 'CANDIDATE'}
                            </span>
                         </div>
                         <div className={`p-5 rounded-3xl text-[13px] leading-relaxed transition-all duration-300 ${
                            m.role === 'assistant' 
                               ? 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none hover:bg-white/10' 
                               : 'bg-primary/10 text-primary border border-primary/20 rounded-tr-none font-medium ml-auto select-none'
                         }`}>
                            {m.content}
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
                {loading && (
                   <div className="flex items-center gap-3 px-2">
                      <div className="flex gap-1.5">
                         <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                         <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                         <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">AI is thinking...</span>
                   </div>
                )}
             </CardContent>

             {/* Integrated Dual-Mode Input Field */}
             <div className="p-8 bg-white/5 border-t border-white/5">
                <form onSubmit={handleSendMessage} className="relative group">
                   <div className={`absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-opacity duration-500 opacity-0 ${isListening && !isSpeaking ? 'opacity-40' : ''}`}></div>
                   <Input 
                     placeholder={isSpeaking ? "Interviewer is speaking..." : (isListening ? "Listening... (or type here)" : "Message meeting participants...")}
                     className={`h-16 bg-[#1a1a1a] border-white/5 rounded-2xl pr-16 pl-6 text-[13px] transition-all duration-500 focus-visible:ring-1 focus-visible:ring-primary/50 ${
                        isListening && !isSpeaking ? 'border-primary/40 ring-1 ring-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.1)]' : ''
                     }`}
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     disabled={loading || isSpeaking}
                   />
                   <div className="absolute right-2 top-2 flex items-center">
                      <Button 
                         type="submit" 
                         size="icon" 
                         variant="ghost" 
                         className={`h-12 w-12 rounded-xl text-primary transition-all ${!inputValue.trim() ? 'opacity-20' : 'opacity-100 hover:bg-primary/10'}`} 
                         disabled={!inputValue.trim() || loading || isSpeaking}
                      >
                         <Send size={20} />
                      </Button>
                   </div>
                </form>
                <div className="mt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-2">
                   <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                         <div className={`w-1 h-1 rounded-full ${isListening ? 'bg-primary' : 'bg-white/20'}`}></div>
                         VOICE: {isListening ? 'ACTIVE' : 'IDLE'}
                      </span>
                      <span className="flex items-center gap-1.5">
                         <div className={`w-1 h-1 rounded-full ${inputValue.trim() ? 'bg-primary' : 'bg-white/20'}`}></div>
                         TEXT: {inputValue.trim() ? 'READY' : 'EMPTY'}
                      </span>
                   </div>
                   <span>POWERED BY OLLAMA</span>
                </div>
             </div>
           </Card>
        </aside>
      </main>
      
      {/* Dynamic News/Ticker Footer */}
      <footer className="px-8 py-3 bg-[#0a0a0a] border-t border-white/5 text-center overflow-hidden">
         <div className="flex items-center justify-center gap-12 whitespace-nowrap animate-marquee">
            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> AGENT-01 CONNECTED
            </p>
            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-primary rounded-full"></span> LIVE INTELLIGENCE STREAMING
            </p>
            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span> END-TO-END ENCRYPTED
            </p>
         </div>
      </footer>
    </div>
  );
}
