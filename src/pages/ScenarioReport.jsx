
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  Trophy, 
  Target, 
  AlertTriangle, 
  Zap, 
  Brain, 
  ArrowLeft,
  Share2,
  Download,
  ShieldCheck,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ScenarioReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-10">
        <Card className="max-w-md w-full text-center p-10 space-y-4">
           <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
           <h2 className="text-xl font-bold">No Profile Found</h2>
           <p className="text-muted-foreground">Complete a scenario to see your evaluation.</p>
           <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  const radarData = [
    { subject: 'AI Prompting', A: profile.aiPromptingScore * 10, fullMark: 100 },
    { subject: 'Debugging', A: profile.debuggingScore * 10, fullMark: 100 },
    { subject: 'System Design', A: profile.systemDesignScore * 10, fullMark: 100 },
    { subject: 'Edge Cases', A: profile.edgeCaseThinkingScore * 10, fullMark: 100 },
    { subject: 'Efficiency', A: 85, fullMark: 100 },
  ];

  const overrelianceColor = {
    "low": "text-green-500 bg-green-500/10",
    "medium": "text-yellow-500 bg-yellow-500/10",
    "high": "text-destructive bg-destructive/10"
  }[profile.aiOverrelianceRisk] || "text-muted-foreground";

  return (
    <div className="bg-background min-h-screen text-foreground pb-20 overflow-y-auto">
      {/* Hero Header */}
      <div className="bg-secondary/10 border-b py-10 px-8">
        <div className="max-w-7xl mx-auto">
           <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-6 -ml-4 gap-2">
             <ArrowLeft size={16} /> Back to Hub
           </Button>
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div>
                <div className="flex items-center gap-3 mb-2">
                   <Badge variant="outline" className="bg-primary/10 text-primary">Employer Assessment</Badge>
                   <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <History size={12}/> Completed Today
                   </span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">Behavioral Skill Graph</h1>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Evaluation results for Phase 1 MVP Scenario: <strong>Stripe Webhook Refactoring</strong>. 
                  Metrics are generated from your interaction telemetry and collaboration with AI.
                </p>
             </div>
             
             <div className="flex gap-3">
               <Button variant="outline" size="sm" className="gap-2">
                 <Download size={16}/> Export PDF
               </Button>
               <Button variant="default" size="sm" className="gap-2">
                 <Share2 size={16}/> Share Results
               </Button>
             </div>
           </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="max-w-7xl mx-auto px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radar Chart Component */}
        <Card className="lg:col-span-2 border-border/50 shadow-xl overflow-hidden bg-background">
          <CardHeader className="border-b bg-secondary/5">
            <CardTitle className="text-lg flex items-center gap-2">
               <Zap size={20} className="text-primary fill-primary/20" /> Multidimensional Performance
            </CardTitle>
            <CardDescription>Comparison against senior engineer benchmarks</CardDescription>
          </CardHeader>
          <CardContent className="h-[450px] pt-10">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="hsla(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name="Candidate"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.15}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Behavioral Insights */}
        <div className="space-y-8 flex flex-col">
           {/* Risk Card */}
           <Card className="border-border/50 shadow-lg shrink-0">
             <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                   <AlertTriangle size={16} className="text-primary" /> AI Overreliance Risk
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className={`p-4 rounded-xl text-center font-black text-2xl uppercase tracking-widest ${overrelianceColor}`}>
                   {profile.aiOverrelianceRisk}
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                   Based on the ratio of manual code edits vs. copy-pasted block inserts from AI suggestions. 
                   {profile.aiOverrelianceRisk === 'high' ? ' High risk indicates blind trust in LLM output.' : ' Low risk suggests smart selective verification.'}
                </p>
             </CardContent>
           </Card>

           {/* Feedback Card */}
           <Card className="border-border/50 shadow-lg flex-1 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Brain size={120} />
             </div>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                   <Target size={16} className="text-primary" /> Qualitative Insight
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/20 rounded-lg text-xs leading-relaxed border-l-4 border-primary italic quotes">
                  "{profile.qualitativeFeedback}"
                </div>
                
                <div className="pt-4 border-t space-y-3">
                   <h5 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Top Strength</h5>
                   <div className="flex items-center gap-2 text-sm font-semibold">
                      <ShieldCheck size={18} className="text-green-500" />
                      {profile.debuggingScore > 7 ? 'Deep Debugging Curiosity' : 'Iterative Refinement'}
                   </div>
                </div>
             </CardContent>
             <CardFooter className="bg-secondary/10 border-t py-4">
                <Button className="w-full text-xs font-bold py-5 h-auto transition-all hover:translate-y-[-2px]">
                   View Detailed Behavior Logs
                </Button>
             </CardFooter>
           </Card>
        </div>

      </div>

      {/* Benchmarking Section */}
      <div className="max-w-7xl mx-auto px-8 mt-12">
         <Card className="border-border/50 shadow-sm bg-secondary/10">
            <CardContent className="py-6 flex flex-col md:flex-row items-center justify-between gap-10">
               <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                     <Trophy size={22} className="text-yellow-500" /> Top 12% Percentile
                  </h3>
                  <p className="text-sm text-muted-foreground">You ranked higher than 88% of candidates who took this specific Stripe scenario.</p>
               </div>
               <div className="flex gap-8">
                  <div className="text-center">
                     <div className="text-3xl font-black">94</div>
                     <div className="text-[10px] uppercase text-muted-foreground font-bold">Accuracy</div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl font-black">23m</div>
                     <div className="text-[10px] uppercase text-muted-foreground font-bold">Duration</div>
                  </div>
                  <div className="text-center border-l pl-8 border-border/50">
                     <div className="text-3xl font-black text-primary">S+</div>
                     <div className="text-[10px] uppercase text-muted-foreground font-bold">Grade</div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
