import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPendingVerifications, reviewVerification, getMentorStats } from '../services/api';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, pendingVerifications: 0, avgReadiness: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pendingData, statsData] = await Promise.all([
         getPendingVerifications(),
         getMentorStats()
      ]);
      setPending(pendingData);
      setStats(statsData);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReview = async (userId, status) => {
    try {
       await reviewVerification(userId, status);
       await fetchDashboardData();
       // remove generic alert in favor of UI state but kept for simple feedback right now
    } catch(e) {
       console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6 bg-secondary/20 border-none">
           <div className="bg-primary/20 p-3 rounded-full text-primary">
             <Users size={32} />
           </div>
           <div>
              <p className="text-muted-foreground text-sm font-medium">Total Students</p>
              <h3 className="text-3xl font-bold">{stats.totalStudents}</h3>
           </div>
        </Card>
        <Card className="flex items-center gap-4 p-6 bg-secondary/20 border-none">
           <div className="bg-green-500/20 p-3 rounded-full text-green-400">
             <CheckCircle size={32} />
           </div>
           <div>
              <p className="text-muted-foreground text-sm font-medium">Avg Placement Readiness</p>
              <h3 className="text-3xl font-bold text-green-400">{stats.avgReadiness}%</h3>
           </div>
        </Card>
        <Card className="flex items-center gap-4 p-6 bg-secondary/20 border-none">
           <div className="bg-orange-500/20 p-3 rounded-full text-orange-400">
             <XCircle size={32} />
           </div>
           <div>
              <p className="text-muted-foreground text-sm font-medium">Pending Verifications</p>
              <h3 className="text-3xl font-bold text-orange-400">{stats.pendingVerifications}</h3>
           </div>
        </Card>
      </div>

      <Card className="bg-secondary/20 border-border/50">
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>Review and verify incoming student identities.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-4 text-center">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center bg-background/50 rounded-lg">No pending verifications. Good job!</p>
          ) : (
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Reg Number</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>ID Card</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((p) => (
                    <TableRow key={p.$id || p.userId}>
                      <TableCell className="font-medium">{p.fullName}</TableCell>
                      <TableCell>{p.regNo}</TableCell>
                      <TableCell>{p.department}</TableCell>
                      <TableCell>
                         <a href={p.idCardUrl || '#'} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">View ID</a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-orange-400 border-orange-400/50 bg-orange-400/10">Pending</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                         <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleReview(p.userId, 'verified')}>Approve</Button>
                         <Button size="sm" variant="destructive" onClick={() => handleReview(p.userId, 'rejected')}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 border-border/50">
         <CardHeader>
           <CardTitle>Recent Top Performers</CardTitle>
           <CardDescription>Students scoring above 90% in technical assessments.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                 <TableHeader className="bg-secondary/30">
                    <TableRow>
                       <TableHead>Rank</TableHead>
                       <TableHead>Student Name</TableHead>
                       <TableHead>Score</TableHead>
                       <TableHead>Test Type</TableHead>
                       <TableHead>Readiness</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    <TableRow>
                       <TableCell className="text-green-400 font-bold">#1</TableCell>
                       <TableCell className="font-medium">Alex Johnson</TableCell>
                       <TableCell>98%</TableCell>
                       <TableCell>MERN Stack</TableCell>
                       <TableCell><Badge variant="default" className="bg-green-500/10 text-green-400 border-none">Ready</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                       <TableCell className="text-green-400 font-bold">#2</TableCell>
                       <TableCell className="font-medium">Samantha Lee</TableCell>
                       <TableCell>95%</TableCell>
                       <TableCell>Backend Engineering</TableCell>
                       <TableCell><Badge variant="default" className="bg-green-500/10 text-green-400 border-none">Ready</Badge></TableCell>
                    </TableRow>
                 </TableBody>
              </Table>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
