import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user } = useAuth();
  const [techSkills, setTechSkills] = useState('React, Node.js, Python');
  const [softSkills, setSoftSkills] = useState('Communication, Leadership');
  const [goals, setGoals] = useState('Become a Full Stack Developer at a top tech company.');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile updated! (Demo)');
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 md:p-8 border-none bg-secondary/20">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-border/50 pb-8 text-center md:text-left">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-primary/20 text-primary shrink-0">
          {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-1">{user?.fullName || user?.name}</h2>
          <p className="text-muted-foreground mb-4">{user?.email}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Badge variant={user?.verificationStatus === 'verified' ? 'default' : 'secondary'} className={user?.verificationStatus === 'verified' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : ''}>
              {user?.verificationStatus?.toUpperCase() || 'VERIFIED'}
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
              {user?.department || 'CS'} - {user?.year || '3rd'} Year
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2 md:col-span-2">
           <Label>Full Name</Label>
           <Input type="text" defaultValue={user?.fullName || user?.name} disabled />
         </div>
         <div className="space-y-2">
           <Label>Register Number</Label>
           <Input type="text" defaultValue={user?.regNo} disabled />
         </div>
         <div className="space-y-2">
           <Label>Department</Label>
           <Input type="text" defaultValue={user?.department} disabled />
         </div>
         
         <div className="space-y-2 md:col-span-2">
           <Label>Technical Skills (Comma separated)</Label>
           <Input type="text" value={techSkills} onChange={e => setTechSkills(e.target.value)} />
         </div>
         <div className="space-y-2 md:col-span-2">
           <Label>Soft Skills (Comma separated)</Label>
           <Input type="text" value={softSkills} onChange={e => setSoftSkills(e.target.value)} />
         </div>
         <div className="space-y-2 md:col-span-2">
           <Label>Career Goals</Label>
           <Textarea rows={3} value={goals} onChange={e => setGoals(e.target.value)} />
         </div>

         <div className="md:col-span-2 pt-4 text-right">
            <Button type="submit" size="lg">Save Changes</Button>
         </div>
      </form>
    </Card>
  );
}
