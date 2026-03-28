import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  ArrowRight, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  LayoutDashboard,
  BrainCircuit,
  Award
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TestResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [interviewResult, setInterviewResult] = useState(location.state?.interviewResult || null);
  // Safe defaults if accessed directly
  const { score, sectionScores, answers } = location.state || { 
    score: 68, 
    sectionScores: { 
      'Data Structures': {total: 100, correct: 50}, 
      'Logical Ability': {total: 100, correct: 90},
      'Computer Science': {total: 100, correct: 70},
      'Coding Challenge': {total: 100, correct: 60}
    }, 
    answers: {} 
  };

  // Convert sectionScores to skillData
  const skillData = Object.keys(sectionScores).map(subject => ({
    subject,
    A: (sectionScores[subject].correct / sectionScores[subject].total) * 100,
    fullMark: 100
  }));

  const gaps = skillData.filter(s => s.A < 70).map(s => ({
    title: s.subject,
    impact: s.A <= 50 ? 'High' : 'Medium',
    reason: `Proficiency verified at ${Math.round(s.A)}%, indicating a gap against the required 70%+ baseline for role tracking.`
  }));

  const strengths = skillData.filter(s => s.A >= 80);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
          <Trophy size={48} className="text-green-700" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">Assessment Completed!</h1>
        <p className="text-muted-foreground text-lg">Overall Proficiency Score: <span className="font-bold text-accent-foreground">{Math.round(score)}%</span></p>
      </motion.div>

      {interviewResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <Card className="bg-primary/5 border-primary/20 overflow-hidden relative shadow-lg shadow-primary/5">
            <div className="absolute top-0 right-0 p-4">
              <Badge variant="default" className="text-base px-5 py-1.5 rounded-full shadow-lg shadow-primary/20">New Assessment</Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center text-primary rotate-3 shadow-inner">
                  <Award size={40} />
                </div>
                <div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">AI Assessment: {interviewResult.subject}</CardTitle>
                  <CardDescription className="text-xl font-medium text-primary/80">Overall Performance Score: <span className="text-foreground">{interviewResult.score}%</span></CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl border border-primary/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary/30"></div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" /> Professional Feedback
                </h3>
                <p className="text-muted-foreground text-xl leading-relaxed italic font-medium">
                  "{interviewResult.feedback}"
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setInterviewResult(null)} variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">
                  Dismiss Assessment View
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Score & Radar */}
        <Card className="flex flex-col items-center pt-6">
          <CardHeader className="w-full pb-0">
            <CardTitle className="flex items-center gap-2 text-base border-b pb-4">
              <Target size={20} className="text-primary text-accent-foreground" /> Performance Map
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full flex-1 flex flex-col justify-between mt-4">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip />
                  <Radar name="Proficiency %" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 text-center w-full p-4 rounded-md bg-secondary">
               <div className="text-3xl font-bold text-primary">{score >= 80 ? 'Exceptional' : (score >= 60 ? 'Competitive' : 'Needs Focus')}</div>
               <p className="text-xs text-muted-foreground mt-1">Profile updated based on these metrics</p>
            </div>
          </CardContent>
        </Card>

        {/* Gap Identification */}
        <Card className="lg:col-span-2 pt-6">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-base border-b pb-4">
              <AlertCircle size={20} className="text-orange-500" /> Identified Skill Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col h-full">
            <div className="space-y-4">
              {gaps.length > 0 ? gaps.map((gap, i) => (
                <div key={i} className="p-4 rounded-lg flex items-start gap-4 bg-orange-50 border border-orange-100">
                   <div className="p-2 rounded-md bg-orange-100 text-orange-600">
                      <BrainCircuit size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="font-bold text-primary">{gap.title}</h4>
                         <Badge variant={gap.impact === 'High' ? 'destructive' : 'secondary'}>
                            {gap.impact} Priority
                         </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{gap.reason}</p>
                   </div>
                </div>
              )) : (
                 <div className="p-6 text-center text-muted-foreground border rounded-lg bg-secondary/30">
                   No critical gaps identified in the core patterns. Excellent benchmark!
                 </div>
              )}
              
              {strengths.map((s, i) => (
                <div key={i} className="p-4 rounded-lg flex items-start gap-4 bg-green-50 border border-green-100">
                   <div className="p-2 bg-white rounded-md text-green-700 shadow-sm">
                      <CheckCircle2 size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-primary">Strong in {s.subject}</h4>
                      <p className="text-sm text-muted-foreground">Demonstrated proficiency with {Math.round(s.A)}% accuracy.</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 flex flex-wrap gap-4 border-t">
              <Button 
                onClick={() => navigate('/learn')}
                className="px-8 py-6 rounded-md flex items-center gap-2 font-bold shadow-sm"
              >
                View Learning Roadmap <ArrowRight size={18} />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/test-setup')}
                className="px-8 py-6 rounded-md flex items-center gap-2 font-bold"
              >
                <RotateCcw size={18} /> Re-evaluate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center gap-8">
         <Link to="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-semibold transition-colors">
            <LayoutDashboard size={18} /> Return to Dashboard
         </Link>
         <Link to="/profile" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-semibold transition-colors">
            Share Result <ChevronRight size={18} />
         </Link>
      </div>
    </div>
  );
}
