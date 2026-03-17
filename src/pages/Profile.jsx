import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, uploadResume } from '../services/api';
import { UserCircle, UploadCloud, FileText, CheckCircle2, Github, Linkedin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user } = useAuth();
  
  // States
  const [techSkills, setTechSkills] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Populate form with existing user data if available context has it, or we fetch it
    // Assuming 'user' from AuthContext is fully hydrated after backend update
    if (user) {
      setTechSkills(user.techSkills || '');
      setSoftSkills(user.softSkills || '');
      setBio(user.bio || '');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setResumeUrl(user.resumeUrl || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
       let finalResumeUrl = resumeUrl;
       
       if (resumeFile) {
          const uploadRes = await uploadResume(resumeFile);
          finalResumeUrl = uploadRes.url;
          setResumeUrl(finalResumeUrl);
       }

       await updateUserProfile({
          techSkills,
          softSkills,
          bio,
          githubUrl,
          linkedinUrl,
          resumeUrl: finalResumeUrl
       });

       setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
       console.error(err);
       setMessage({ text: 'Failed to update profile.', type: 'error' });
    } finally {
       setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-4 md:p-8 border-none bg-secondary/20">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-border/50 pb-8 text-center md:text-left">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-primary/20 text-primary shrink-0">
          {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 w-full flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-bold mb-1">{user?.fullName || user?.name}</h2>
          <p className="text-muted-foreground mb-4">{user?.email}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Badge variant={user?.verificationStatus === 'verified' ? 'default' : 'secondary'} className={user?.verificationStatus === 'verified' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : ''}>
              {user?.verificationStatus?.toUpperCase() || 'VERIFIED'}
            </Badge>
            {user?.role !== 'mentor' && (
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                {user?.department || 'CS'} - {user?.year || '3rd'} Year
              </Badge>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-border/50 pb-2">Basic Info</h3>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input type="text" defaultValue={user?.fullName || user?.name} disabled className="bg-background/50" />
            </div>
            {user?.role !== 'mentor' && (
              <>
                <div className="space-y-2">
                  <Label>Register Number</Label>
                  <Input type="text" defaultValue={user?.regNo} disabled className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input type="text" defaultValue={user?.department} disabled className="bg-background/50" />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label>Bio / Headline</Label>
              <Textarea 
                rows={3} 
                placeholder="A short summary about you and your goals..."
                value={bio} 
                onChange={e => setBio(e.target.value)} 
              />
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-border/50 pb-2">Professional Details</h3>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Github size={16}/> GitHub Profile URL</Label>
              <Input type="url" placeholder="https://github.com/username" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Linkedin size={16} className="text-blue-500" /> LinkedIn Profile URL</Label>
              <Input type="url" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Technical Skills</Label>
              <Input type="text" placeholder="e.g. React, Python, PostgreSQL..." value={techSkills} onChange={e => setTechSkills(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Soft Skills</Label>
              <Input type="text" placeholder="e.g. Communication, Agile, Leadership..." value={softSkills} onChange={e => setSoftSkills(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Resume / CV</Label>
              <div className="flex items-center gap-4">
                 <Button type="button" variant="outline" className="relative overflow-hidden group border-dashed" onClick={() => document.getElementById('resume-upload').click()}>
                    <UploadCloud className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> 
                    {resumeFile ? resumeFile.name : 'Upload New Resume'}
                 </Button>
                 <input 
                    id="resume-upload" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    className="hidden" 
                    onChange={handleFileChange} 
                 />
                 {resumeUrl && !resumeFile && (
                    <a href={resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <FileText size={16} /> View Current
                    </a>
                 )}
              </div>
            </div>
         </div>

         <div className="md:col-span-2 pt-6 mt-4 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            {message.text && (
               <div className={`flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'text-green-500' : 'text-destructive'}`}>
                  {message.type === 'success' && <CheckCircle2 size={18} />}
                  {message.text}
               </div>
            )}
            <div className="w-full md:w-auto ml-auto">
               <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
                 {loading ? 'Saving...' : 'Save Profile Changes'}
               </Button>
            </div>
         </div>
      </form>
    </Card>
  );
}
