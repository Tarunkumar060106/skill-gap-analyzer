import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPendingVerifications, reviewVerification, getMentorStats, getTopPerformers } from '../services/api';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, pendingVerifications: 0, avgReadiness: 0 });
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pendingData, statsData, performersData] = await Promise.all([
         getPendingVerifications(),
         getMentorStats(),
         getTopPerformers()
      ]);
      setPending(pendingData);
      setStats(statsData);
      setTopPerformers(performersData);
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
                         <Dialog>
                           <DialogTrigger asChild>
                             <Button variant="link" className="text-primary p-0 h-auto font-semibold hover:underline">
                               View ID
                             </Button>
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-[700px] border-border/50 bg-background/95 backdrop-blur-sm">
                             <DialogHeader className="border-b border-border/50 pb-4 mb-4 text-left">
                                <DialogTitle className="text-xl font-bold">Identity Verification Document</DialogTitle>
                                <DialogDescription>
                                  Student ID Proof: <span className="font-semibold text-primary">{p.fullName}</span> ({p.regNo})
                                </DialogDescription>
                             </DialogHeader>
                             <div className="flex justify-center items-center py-4 bg-secondary/10 rounded-lg overflow-hidden border border-border/50">
                                <img 
                                  src={p.idCardUrl} 
                                  alt={`ID proof for ${p.fullName}`} 
                                  className="max-w-full max-h-[70vh] object-contain rounded-md shadow-2xl"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/600x400?text=ID+Proof+Not+Available';
                                  }}
                                />
                             </div>
                           </DialogContent>
                         </Dialog>
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
                    {topPerformers.length > 0 ? topPerformers.map((p, i) => (
                      <TableRow key={p.userId + i}>
                         <TableCell className="text-green-400 font-bold">#{i + 1}</TableCell>
                         <TableCell className="font-medium">{p.fullName}</TableCell>
                         <TableCell>{p.score}%</TableCell>
                         <TableCell>{p.testName}</TableCell>
                         <TableCell>
                           <Badge variant="default" className="bg-green-500/10 text-green-400 border-none">
                             {p.score >= 90 ? 'Ready' : 'Near-Ready'}
                           </Badge>
                         </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No top performers identified yet.
                        </TableCell>
                      </TableRow>
                    )}
                 </TableBody>
              </Table>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
