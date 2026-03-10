import { useNavigate } from 'react-router-dom';
import { Play, ShieldCheck, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestSetup() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/test/full');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-accent/10 rounded-full mb-4 text-accent-foreground">
          <ShieldCheck size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-primary">Comprehensive Assessment</h1>
        <p className="text-muted-foreground text-lg">Standardized placement test for role tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card>
          <CardHeader className="border-b mb-4 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText size={20} className="text-primary" /> Assessment Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                 <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                 <div>
                   <p className="font-semibold text-primary">Core domains (CS, DS, Automata)</p>
                   <p className="text-sm text-muted-foreground">Advanced Concepts</p>
                 </div>
              </li>
              <li className="flex items-start gap-3">
                 <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                 <div>
                   <p className="font-semibold text-primary">Aptitude & English</p>
                   <p className="text-sm text-muted-foreground">Basics & Logic</p>
                 </div>
              </li>
              <li className="flex items-start gap-3">
                 <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                 <div>
                   <p className="font-semibold text-primary">Coding Challenges</p>
                   <p className="text-sm text-muted-foreground">Hands-on Problem Solving</p>
                 </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="border-b mb-4 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle size={20} className="text-orange-500" /> Guidelines & Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0" />
                  <span><strong>Duration:</strong> Adaptive & Timed Module</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck size={16} className="shrink-0" />
                  <span><strong>Proctoring Active:</strong> Tab switching is monitored.</span>
                </li>
              </ul>
            </CardContent>
          </div>
          <CardContent className="pt-0">
            <Button
              onClick={handleStart}
              className="w-full mt-4 py-6 text-lg"
              size="lg"
            >
              Acknowledge & Start Test <Play className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
