import { Filter, Download, FileSpreadsheet, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Reports() {
  const { user } = useAuth();
  const isMentor = user?.role === 'mentor';
  
  const mockDeptData = [
    { name: 'Computer Science', avgScore: 78, students: 450 },
    { name: 'Info Tech', avgScore: 72, students: 320 },
    { name: 'Electrical', avgScore: 65, students: 210 },
    { name: 'Mechanical', avgScore: 55, students: 180 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
             <div className="p-2 bg-primary/10 text-primary rounded-xl">
               <BarChart3 size={28} />
             </div>
             Analytics & Reports
          </h2>
          <p className="text-muted-foreground ml-1">Export detailed skill gap analysis data and track cohort progress.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            <Filter size={16} /> Filters
          </Button>
          <Button variant="outline" className="gap-2 text-green-500 border-green-500/30 hover:bg-green-500/10">
            <FileSpreadsheet size={16}/> Export Excel
          </Button>
          <Button className="gap-2">
            <Download size={16}/> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-secondary/20 border-border/50">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Average scores across departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <BarChart data={mockDeptData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} tick={{fill: 'hsl(var(--foreground))'}} />
                  <Tooltip 
                     cursor={{fill: 'hsl(var(--secondary))'}} 
                     contentStyle={{background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px'}}
                     formatter={(value) => [`${value}%`, 'Average Score']}
                  />
                  <Bar dataKey="avgScore" radius={[0, 4, 4, 0]}>
                    {mockDeptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.avgScore > 70 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle>Placement Readiness Tracking</CardTitle>
            <CardDescription>Percentage of students categorized as "Industry Ready" (Score &gt; 75%) over time.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="rounded-md border border-border/50 overflow-hidden">
               <Table>
                  <TableHeader className="bg-secondary/30">
                     <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Ready %</TableHead>
                        <TableHead className="text-right">Growth</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     <TableRow>
                        <TableCell>January</TableCell><TableCell>42%</TableCell><TableCell className="text-right text-green-400 font-medium">+2%</TableCell>
                     </TableRow>
                     <TableRow>
                        <TableCell>February</TableCell><TableCell>48%</TableCell><TableCell className="text-right text-green-400 font-medium">+6%</TableCell>
                     </TableRow>
                     <TableRow>
                        <TableCell>March</TableCell><TableCell>55%</TableCell><TableCell className="text-right text-green-400 font-medium">+7%</TableCell>
                     </TableRow>
                     <TableRow>
                        <TableCell>April</TableCell><TableCell>62%</TableCell><TableCell className="text-right text-green-400 font-medium">+7%</TableCell>
                     </TableRow>
                  </TableBody>
               </Table>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
