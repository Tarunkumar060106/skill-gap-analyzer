import { useEffect, useState } from 'react';
import { getPendingVerifications, reviewVerification } from '../services/api';
import { Check, X, ExternalLink, ShieldAlert, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MentorVerifications() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, verified, rejected (for history)

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingVerifications();
      setPending(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (userId, status) => {
    try {
       await reviewVerification(userId, status);
       fetchPending();
    } catch(e) {
       console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border/50 pb-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-orange-500/10 text-orange-400 rounded-full">
             <ShieldAlert size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-bold">Identity Verification Center</h2>
              <p className="text-muted-foreground">Review and approve student identification documents</p>
           </div>
        </div>
        
        <div className="flex gap-2 bg-secondary/30 p-1 rounded-lg border border-border/50">
           <Button 
             variant={filter === 'pending' ? 'default' : 'ghost'} 
             onClick={() => setFilter('pending')} 
             size="sm"
           >
             Pending ({pending.length})
           </Button>
           <Button 
             variant={filter === 'all' ? 'default' : 'ghost'} 
             onClick={() => setFilter('all')} 
             size="sm"
           >
             History
           </Button>
        </div>
      </div>

      <Card className="bg-secondary/20 border-border/50">
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center">
               <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
               <p className="text-muted-foreground border-primary">Securely fetching documents...</p>
            </div>
          ) : (
            <div className="space-y-4">
               {pending.length === 0 ? (
                 <div className="text-center py-20 bg-background/50 rounded-xl border border-dashed border-border/50">
                    <UserCheck size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">There are no student identities waiting for review.</p>
                 </div>
               ) : (
                 <div className="rounded-md border border-border/50 overflow-hidden">
                   <Table>
                     <TableHeader className="bg-secondary/30">
                       <TableRow>
                         <TableHead>Student Details</TableHead>
                         <TableHead>ID Document</TableHead>
                         <TableHead>Request Date</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead className="text-right">Actions</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {pending.map((p) => (
                         <TableRow key={p.$id || p.userId}>
                           <TableCell>
                              <div className="flex flex-col">
                                 <span className="font-semibold text-foreground">{p.fullName}</span>
                                 <span className="text-xs text-muted-foreground">{p.regNo} • {p.department}</span>
                              </div>
                           </TableCell>
                            <TableCell>
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button 
                                     variant="outline" 
                                     size="sm" 
                                     className="h-8 gap-2 font-semibold"
                                   >
                                      <ExternalLink size={14} /> VIEW DOC
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
                           <TableCell className="text-muted-foreground text-sm">
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Today'}
                           </TableCell>
                           <TableCell>
                              <Badge variant="outline" className="text-orange-400 border-orange-400/50 bg-orange-400/10">
                                 {p.verificationStatus || 'Pending'}
                              </Badge>
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                 <Button 
                                   size="sm"
                                   className="bg-green-600 hover:bg-green-700 text-white gap-1 h-8"
                                   onClick={() => handleReview(p.userId, 'verified')}
                                 >
                                    <Check size={16} /> <span className="text-xs">APPROVE</span>
                                 </Button>
                                 <Button 
                                   variant="destructive"
                                   size="sm"
                                   className="gap-1 h-8"
                                   onClick={() => handleReview(p.userId, 'rejected')}
                                 >
                                    <X size={16} /> <span className="text-xs">REJECT</span>
                                 </Button>
                              </div>
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
               )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats / Help Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="bg-secondary/20 border-border/50">
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldAlert size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Compliance Note</h4>
                <p className="text-sm text-muted-foreground">
                   Please ensure the student's Registration Number matches the official university database records before approval. ID document must be clear and legible.
                </p>
              </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
