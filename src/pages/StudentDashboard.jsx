import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTestResults, getStudentDashboardStats } from '../services/api';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FileCheck2, UserCircle, Target, Activity, Sparkles, TrendingUp, Award, ArrowRight, BookOpen, Lightbulb, ExternalLink, Code2, BrainCircuit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Course & Project suggestion mappings keyed by skill area
const SUGGESTION_MAP = {
  'Aptitude': {
    courses: [
      { title: 'Quantitative Aptitude Masterclass', difficulty: 'Beginner', platform: 'Internal' },
      { title: 'Problem Solving with Numbers', difficulty: 'Intermediate', platform: 'Internal' },
    ],
    projects: [
      { title: 'Build a Mental Math Trainer App', description: 'Create a timed quiz app that drills arithmetic, percentage, and ratio problems.' },
    ]
  },
  'Domain Knowledge': {
    courses: [
      { title: 'Data Structures & Algorithms Fundamentals', difficulty: 'Beginner', platform: 'Internal' },
      { title: 'System Design Basics', difficulty: 'Intermediate', platform: 'Internal' },
    ],
    projects: [
      { title: 'Design a URL Shortener', description: 'Build a full-stack URL shortener with analytics dashboard to practice system design.' },
    ]
  },
  'Coding': {
    courses: [
      { title: 'Array & String Mastery', difficulty: 'Beginner', platform: 'Internal' },
      { title: 'Advanced Algorithm Patterns', difficulty: 'Advanced', platform: 'Internal' },
    ],
    projects: [
      { title: 'LeetCode Problem Tracker', description: 'Build an app that tracks your solved problems and visualizes progress by topic.' },
    ]
  },
  'Logical Reasoning': {
    courses: [
      { title: 'Logical Puzzles & Pattern Recognition', difficulty: 'Beginner', platform: 'Internal' },
      { title: 'Critical Thinking for Engineers', difficulty: 'Intermediate', platform: 'Internal' },
    ],
    projects: [
      { title: 'Build a Sudoku Solver', description: 'Implement a backtracking Sudoku solver with step-by-step visualization.' },
    ]
  },
  'English': {
    courses: [
      { title: 'Technical Communication Skills', difficulty: 'Beginner', platform: 'Internal' },
      { title: 'Business English for Engineers', difficulty: 'Intermediate', platform: 'Internal' },
    ],
    projects: [
      { title: 'Technical Blog Platform', description: 'Build a markdown-based blog to practice technical writing and documentation.' },
    ]
  },
};

const DIFFICULTY_COLORS = {
  'Beginner': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Intermediate': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Advanced': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [stats, setStats] = useState({ percentile: '...', rank: '...' });

  useEffect(() => {
    async function loadData() {
      if(user) {
        try {
          const [res, stats] = await Promise.all([
            getTestResults(user.userId),
            getStudentDashboardStats()
          ]);
          setResults(res);
          setSkillData(stats.skillData || []);
          setStats({ percentile: stats.percentile, rank: stats.rank });
        } catch(e) {}
      }
    }
    loadData();
  }, [user]);

  // Derive weak skills (below 70%) for suggestions
  const weakSkills = skillData.filter(s => s.A < 70).sort((a, b) => a.A - b.A);
  const suggestions = weakSkills.slice(0, 3).map(s => ({
    skill: s.subject,
    score: s.A,
    ...(SUGGESTION_MAP[s.subject] || { courses: [], projects: [] })
  }));

  return (
    <div className="space-y-8 flex-1 pb-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-8 rounded-2xl border border-border/50 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fullName?.split(' ')[0] || user?.name || 'Student'}!</h1>
          </div>
          <p className="text-muted-foreground max-w-lg">
            {stats.percentile !== '...' ? (
              <>You're currently in the top <span className="text-primary font-bold">{stats.percentile}%</span> of your department. Keep up the great work!</>
            ) : (
              <>Analyze your performance and boost your placement readiness by taking more tests.</>
            )}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 gap-2 h-12 px-8" asChild>
            <Link to="/test-setup">
              Start Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/test-setup" className="group block focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
          <Card className="h-full bg-secondary/20 hover:bg-secondary/40 transition-all border-border/50 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110"></div>
            <CardContent className="p-6 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20 text-primary mb-4 shadow-sm shadow-primary/20">
                <FileCheck2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">Skill Assessments</h3>
              <p className="text-sm text-muted-foreground">Take AI-driven adaptive tests to evaluate your technical skills.</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/learn" className="group block focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
          <Card className="h-full bg-secondary/20 hover:bg-secondary/40 transition-all border-border/50 hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/5 cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110"></div>
            <CardContent className="p-6 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/20 text-purple-400 mb-4 shadow-sm shadow-purple-500/20">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">Learning Path</h3>
              <p className="text-sm text-muted-foreground">Follow your personalized curriculum to close identified skill gaps.</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/profile" className="group block focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
          <Card className="h-full bg-secondary/20 hover:bg-secondary/40 transition-all border-border/50 hover:border-green-500/30 hover:shadow-md hover:shadow-green-500/5 cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110"></div>
            <CardContent className="p-6 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/20 text-green-400 mb-4 shadow-sm shadow-green-500/20">
                <UserCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-green-400 transition-colors">Career Profile</h3>
              <p className="text-sm text-muted-foreground">Update your goals and track your overall placement readiness.</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-secondary/10 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Skill Gap Analysis
              </CardTitle>
              <CardDescription>Your current proficiency across core competencies.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%" debounce={100} minWidth={0} minHeight={0}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" fill="hsl(var(--foreground))" className="text-xs font-medium" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary))" fillOpacity={0.3} dot={{ r: 4, strokeWidth: 2 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/10 border-border/50 backdrop-blur-sm flex flex-col">
          <CardHeader className="pb-2 flex flex-row justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-400" /> Recent Activities
              </CardTitle>
              <CardDescription>Your latest assessment scores and module completions.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-primary hover:text-primary">
              <Link to="/results">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 pt-4">
            {results.length > 0 ? results.slice(0, 5).map(r => (
              <div key={r.id} className="group flex justify-between items-center p-4 bg-background/60 hover:bg-background/80 transition-colors rounded-xl border border-border/40 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-secondary/50 rounded-lg group-hover:scale-110 group-hover:text-primary transition-all">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{r.testName || 'React Assessment'}</h4>
                    <p className="text-muted-foreground text-xs mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="default" className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20 font-bold px-2.5 py-0.5 text-sm">
                    {r.score}%
                  </Badge>
                  {r.score >= 80 && <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Pass</span>}
                </div>
              </div>
            )) : (
              <div className="text-center text-muted-foreground p-8 flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-background/30 mt-2">
                <Activity className="w-12 h-12 text-muted mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-1">No activities yet</h3>
                <p className="text-sm">Complete your first assessment to see results here.</p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link to="/test-setup">Take a Test</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course & Project Suggestions (US #7) */}
      {suggestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" /> Recommended for You
              </h2>
              <p className="text-muted-foreground mt-1">Courses and projects based on your skill gaps to boost your placement readiness.</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/learn">
                <BookOpen className="mr-2 h-4 w-4" /> Go to Learning Path
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {suggestions.map((sg, idx) => (
              <Card key={idx} className="border-border/50 bg-secondary/5 overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-secondary/20 to-transparent">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                        <TrendingUp size={20} />
                      </div>
                      Improve: {sg.skill}
                    </CardTitle>
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 font-bold">
                      Score: {sg.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Courses */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <BookOpen size={14} /> Suggested Courses
                      </h4>
                      {sg.courses.map((course, i) => (
                        <Link to="/learn" key={i} className="block group">
                          <div className="p-4 rounded-xl border border-border/50 bg-background/60 hover:bg-background hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-sm font-semibold group-hover:text-primary transition-colors">{course.title}</h5>
                              <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[course.difficulty]}`}>
                                {course.difficulty}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{course.platform}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Projects */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Code2 size={14} /> Suggested Projects
                      </h4>
                      {sg.projects.map((project, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/60 hover:bg-background hover:border-accent/30 transition-all">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg text-accent shrink-0 mt-0.5">
                              <BrainCircuit size={16} />
                            </div>
                            <div>
                              <h5 className="text-sm font-semibold">{project.title}</h5>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{project.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
