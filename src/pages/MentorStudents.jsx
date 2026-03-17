import { useEffect, useState } from 'react';
import { getStudents, reviewVerification } from '../services/api';
import { Users, Search, Filter, Eye, FileText, CheckCircle2, UserCircle, Github, Linkedin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function MentorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border/50 pb-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-primary/10 text-primary rounded-full">
             <Users size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-bold">Students Directory</h2>
              <p className="text-muted-foreground">Manage and overview all registered students</p>
           </div>
        </div>
      </div>

      <Card className="bg-secondary/20 border-border/50">
        <CardHeader className="pb-4">
           <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle>All Students</CardTitle>
                <CardDescription>A complete list of students in the system.</CardDescription>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search students..." 
                      className="pl-8 bg-background/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                 </Button>
              </div>
           </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center">
               <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
               <p className="text-muted-foreground border-primary">Loading students...</p>
            </div>
          ) : (
            <div className="space-y-4">
               {filteredStudents.length === 0 ? (
                 <div className="text-center py-12 bg-background/50 rounded-xl border border-dashed border-border/50">
                    <p className="text-muted-foreground">No students found.</p>
                 </div>
               ) : (
                 <div className="rounded-md border border-border/50 overflow-hidden">
                   <Table>
                     <TableHeader className="bg-secondary/30">
                       <TableRow>
                         <TableHead>Student Name</TableHead>
                         <TableHead>Reg No.</TableHead>
                         <TableHead>Department</TableHead>
                         <TableHead>Year</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead className="text-right">Joined</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {filteredStudents.map((s) => (
                         <TableRow key={s.$id || s.userId}>
                           <TableCell className="font-semibold">{s.fullName}</TableCell>
                           <TableCell className="font-mono text-sm">{s.regNo || 'N/A'}</TableCell>
                           <TableCell>{s.department || 'N/A'}</TableCell>
                           <TableCell className="text-muted-foreground">{s.year || 'N/A'}</TableCell>
                           <TableCell>
                              {s.verificationStatus === 'verified' && <Badge className="bg-green-500/10 text-green-500 border-none hover:bg-green-500/20">Verified</Badge>}
                              {s.verificationStatus === 'pending' && <Badge variant="outline" className="text-orange-400 border-orange-400/50 bg-orange-400/10">Pending</Badge>}
                              {s.verificationStatus === 'rejected' && <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-none hover:bg-red-500/20">Rejected</Badge>}
                              {s.verificationStatus === 'unverified' && <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground border-none">Unverified</Badge>}
                           </TableCell>
                           <TableCell className="text-right text-muted-foreground text-sm">
                              {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Unknown'}
                           </TableCell>
                           <TableCell className="text-right">
                             <Dialog>
                               <DialogTrigger asChild>
                                 <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(s)}>
                                   <Eye className="h-4 w-4 mr-2" /> View
                                 </Button>
                               </DialogTrigger>
                               <DialogContent className="sm:max-w-[600px] border-border/50">
                                 <DialogHeader className="border-b border-border/50 pb-4 mb-4">
                                   <div className="flex items-start gap-4">
                                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold bg-primary/20 text-primary shrink-0">
                                        {(selectedStudent?.fullName || selectedStudent?.name || 'U').charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <DialogTitle className="text-2xl">{selectedStudent?.fullName || selectedStudent?.name}</DialogTitle>
                                        <DialogDescription className="text-base mt-1">
                                          {selectedStudent?.email}
                                        </DialogDescription>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                            {selectedStudent?.department || 'CS'} - {selectedStudent?.year || '3rd'} Year
                                          </Badge>
                                          {selectedStudent?.regNo && (
                                            <Badge variant="outline" className="font-mono">{selectedStudent?.regNo}</Badge>
                                          )}
                                          {selectedStudent?.verificationStatus === 'verified' && <Badge className="bg-green-500/10 text-green-500 border-none">Verified</Badge>}
                                        </div>
                                      </div>
                                   </div>
                                 </DialogHeader>
                                 <div className="space-y-4 py-2">
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Bio</h4>
                                      <p className="text-sm">{selectedStudent?.bio || 'No bio provided.'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Technical Skills</h4>
                                        <p className="text-sm">{selectedStudent?.techSkills || 'Not specified'}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Soft Skills</h4>
                                        <p className="text-sm">{selectedStudent?.softSkills || 'Not specified'}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2 pt-4 border-t border-border/50">
                                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Links & Documents</h4>
                                      <div className="flex flex-col gap-2">
                                        {selectedStudent?.githubUrl ? (
                                          <a href={selectedStudent.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors"><Github size={16} /> GitHub Profile</a>
                                        ) : (
                                          <span className="flex items-center gap-2 text-sm text-muted-foreground"><Github size={16} /> No GitHub link</span>
                                        )}
                                        {selectedStudent?.linkedinUrl ? (
                                          <a href={selectedStudent.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors"><Linkedin size={16} /> LinkedIn Profile</a>
                                        ) : (
                                          <span className="flex items-center gap-2 text-sm text-muted-foreground"><Linkedin size={16} /> No LinkedIn link</span>
                                        )}
                                        {selectedStudent?.resumeUrl ? (
                                          <a href={selectedStudent.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline font-medium mt-2"><FileText size={16} /> Download Resume PDF</a>
                                        ) : (
                                          <span className="flex items-center gap-2 text-sm text-muted-foreground mt-2"><FileText size={16} /> No Resume uploaded</span>
                                        )}
                                      </div>
                                    </div>
                                 </div>
                               </DialogContent>
                             </Dialog>
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
    </div>
  );
}
