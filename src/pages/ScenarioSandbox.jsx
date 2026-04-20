
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { 
  Send, 
  Terminal, 
  Code2, 
  MessageSquare, 
  FileText, 
  Play, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { 
  getActiveScenario, 
  startSandboxSession, 
  sendInterviewMessage, 
  evaluateSandboxSession 
} from '../services/api';
import { useTelemetry } from '../hooks/useTelemetry';

export default function ScenarioSandbox() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState(null);
  const [session, setSession] = useState(null);
  const [code, setCode] = useState("// Loading scenario code...");
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Telemetry
  const { logEvent, flush } = useTelemetry(session?.id);

  useEffect(() => {
    async function init() {
      try {
        const sc = await getActiveScenario();
        setScenario(sc);
        
        const sess = await startSandboxSession(sc.id);
        setSession(sess);

        // Initial scenario base code (hardcoded for MVP)
        const baseCode = `// Stripe Webhook Verification Helper
const stripe = require('stripe')('sk_test_...');
const endpointSecret = 'whsec_...';

exports.handler = async (request, context) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        // TODO: The developer was trying to verify the signature manually...
        // event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        
        // TEMPORARY BYPASS (Security Issue here!)
        event = JSON.parse(request.body);
    } catch (err) {
        console.log(\`Webhook Error: \${err.message}\`);
        return { statusCode: 400, body: \`Webhook Error: \${err.message}\` };
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!');
            break;
        default:
            console.log(\`Unhandled event type \${event.type}\`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
};`;
        setCode(baseCode);
        setLoading(false);
        logEvent('session_started', { scenarioId: sc.id });
      } catch (err) {
        console.error("Failed to initialize sandbox", err);
      }
    }
    init();
  }, [logEvent]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    const newMessage = { role: 'user', content: userInput };
    setChat(prev => [...prev, newMessage]);
    setUserInput('');
    setIsSending(true);

    logEvent('prompt', { content: userInput });

    try {
      const response = await sendInterviewMessage(userInput, chat, `AI Sandbox: ${scenario?.title}`);
      setChat(prev => [...prev, { role: 'assistant', content: response.message }]);
      logEvent('ai_responded', { responseLength: response.message.length });
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleOnCodeChange = (value) => {
    setCode(value);
    // Debounced log in a real app, here we log every 10th change or so to avoid noise
    if (Math.random() > 0.9) {
       logEvent('code_edited', { length: value.length });
    }
  };

  const handleCopyPaste = (e) => {
    logEvent('copy_paste', { type: e.type, target: 'editor' });
  };

  const handleCompleteTest = async () => {
    setIsEvaluating(true);
    logEvent('complete_test_clicked');
    await flush();

    try {
      const result = await evaluateSandboxSession(session.id, code);
      navigate('/scenario/report', { state: { profile: result.profile } });
    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-3 bg-secondary/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Terminal size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">{scenario?.title}</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">AI-Assisted Collaboration Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Live Telemetry Active
          </Badge>
          <Button 
            onClick={handleCompleteTest} 
            disabled={isEvaluating} 
            size="sm"
            className="font-bold shadow-lg shadow-primary/20"
          >
            {isEvaluating ? <Loader2 className="animate-spin mr-2" size={16}/> : <CheckCircle2 className="mr-2" size={16}/>}
            Finish & Evaluate
          </Button>
        </div>
      </header>

      {/* Main Content: 3 Pane Layout */}
      <main className="flex flex-1 overflow-hidden p-2 gap-2">
        
        {/* Left: Scenario Details */}
        <div className="w-1/4 flex flex-col gap-2">
          <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm">
            <CardHeader className="pb-2 bg-secondary/5">
              <CardTitle className="text-sm flex items-center gap-2 font-bold">
                <FileText size={16} className="text-primary" /> Scenario Context
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4 py-4 text-xs leading-relaxed space-y-4">
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p>{scenario?.context}</p>
              </div>
              
              <div className="space-y-2">
                 <h4 className="font-bold flex items-center gap-2"><Info size={14} className="text-primary"/> Objectives</h4>
                 <ul className="space-y-2">
                   {scenario?.tasks.map((task, i) => (
                     <li key={i} className="flex gap-2 items-start p-2 rounded-md bg-secondary/20 border border-border/50">
                        <div className="mt-1 h-3 w-3 rounded-full border border-primary flex items-center justify-center text-[8px] font-black">{i+1}</div>
                        <span>{task}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="text-[10px] text-muted-foreground mt-10">
                 <p className="italic">Note: Your behavior (how you collaborate with the AI, your iterations, and your decision-making) is being measured alongside your code output.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle: AI Chat */}
        <div className="w-1/3 flex flex-col gap-2">
          <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm">
            <CardHeader className="pb-2 bg-secondary/5">
              <CardTitle className="text-sm flex items-center gap-2 font-bold">
                <MessageSquare size={16} className="text-primary" /> AI Assistant
              </CardTitle>
              <CardDescription className="text-[10px]">Your senior pair programmer</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
               <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                     {chat.length === 0 && (
                       <div className="text-center py-10 space-y-2 opacity-50">
                          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
                          <p className="text-xs">Ask the AI for guidance, architecture suggestions, or debugging help.</p>
                       </div>
                     )}
                     {chat.map((m, i) => (
                       <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[90%] rounded-2xl px-4 py-2 text-xs shadow-sm ${
                            m.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-secondary text-foreground rounded-tl-none border border-border/50'
                          }`}>
                            {m.content}
                          </div>
                       </div>
                     ))}
                     {isSending && (
                       <div className="flex justify-start">
                          <div className="bg-secondary p-3 rounded-2xl rounded-tl-none animate-pulse">
                             <div className="flex gap-1">
                               <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                               <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-75"></div>
                               <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                             </div>
                          </div>
                       </div>
                     )}
                  </div>
               </ScrollArea>
               
               <div className="flex gap-2 mt-auto p-1 bg-secondary/20 rounded-xl border border-border/50">
                  <input 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about the webhook logic..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-3"
                  />
                  <Button onClick={handleSendMessage} size="icon" disabled={isSending || !userInput.trim()} className="h-8 w-8 rounded-lg">
                    <Send size={14} />
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Code Editor */}
        <div className="flex-1 flex flex-col gap-2">
           <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm relative">
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                 <Badge className="bg-black/80 text-white border-transparent hover:bg-black/90">
                   <Code2 size={12} className="mr-1" /> sandbox.js
                 </Badge>
              </div>
              <CardContent className="flex-1 p-0 overflow-hidden" onPaste={handleCopyPaste}>
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={handleOnCodeChange}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    padding: { top: 40 },
                    wordWrap: 'on'
                  }}
                />
              </CardContent>
           </Card>
        </div>

      </main>
    </div>
  );
}
