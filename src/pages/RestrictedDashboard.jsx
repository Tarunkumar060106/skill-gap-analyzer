import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Clock, ShieldX, UserCircle, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function RestrictedDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Alert variant="warning" className="bg-orange-500/10 border-orange-500/30 text-orange-500">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold mb-1">Verification Required</AlertTitle>
        <AlertDescription>
          You must verify your student identity to access skill tests and learning plans.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.verificationStatus === 'pending' ? (
          <Card className="flex flex-col items-center justify-center text-center py-12 bg-secondary/20 border-border/50">
            <Clock size={48} className="text-orange-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Review in Progress</h3>
            <p className="text-muted-foreground">Your ID is currently being reviewed by mentors.</p>
          </Card>
        ) : user?.verificationStatus === 'rejected' ? (
          <Card className="flex flex-col items-center justify-center text-center py-12 bg-secondary/20 border-border/50">
            <ShieldX size={48} className="text-destructive mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-destructive">Verification Rejected</h3>
            <p className="text-muted-foreground mb-6">Your uploaded ID was invalid. Please re-upload.</p>
            <Button asChild size="lg">
              <Link to="/verify">Re-upload ID</Link>
            </Button>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center text-center py-12 bg-secondary/20 border-border/50">
            <UploadCloud size={48} className="text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-2">Identity Unverified</h3>
            <p className="text-muted-foreground mb-6">Upload your college ID to unlock features.</p>
            <Button asChild size="lg">
              <Link to="/verify">Upload ID Now</Link>
            </Button>
          </Card>
        )}

        <Card className="flex flex-col items-center justify-center text-center py-12 bg-secondary/20 border-border/50">
          <UserCircle size={48} className="text-purple-400 mb-6" />
          <h3 className="text-2xl font-bold mb-2">Your Profile</h3>
          <p className="text-muted-foreground mb-6">Complete your specific skills and career goals.</p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/profile">Edit Profile</Link>
          </Button>
        </Card>
      </div>

      <div className="pt-8">
        <h3 className="text-xl font-bold mb-6">Restricted Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 pointer-events-none">
           <Card className="p-6 text-center bg-secondary/20 border-border/50 font-medium">Take Skill Test</Card>
           <Card className="p-6 text-center bg-secondary/20 border-border/50 font-medium">Learning Plans</Card>
           <Card className="p-6 text-center bg-secondary/20 border-border/50 font-medium">Skill Gap Analysis</Card>
        </div>
      </div>
    </div>
  );
}
