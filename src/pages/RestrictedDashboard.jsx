import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Clock, ShieldX, UserCircle, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RestrictedDashboard() {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="card glass-panel mb-6" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <div className="flex items-center gap-4">
          <AlertTriangle size={32} className="text-pending" />
          <div>
            <h3 className="mb-1" style={{ color: 'var(--pending)' }}>Verification Required</h3>
            <p>You must verify your student identity to access skill tests and learning plans.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {user?.verificationStatus === 'pending' ? (
          <div className="card glass-panel text-center justify-center flex items-center flex-col py-10">
            <Clock size={48} className="text-pending mb-4" />
            <h3 className="mb-2">Review in Progress</h3>
            <p className="text-muted">Your ID is currently being reviewed by mentors.</p>
          </div>
        ) : user?.verificationStatus === 'rejected' ? (
          <div className="card glass-panel text-center justify-center flex items-center flex-col py-10">
            <ShieldX size={48} className="text-error mb-4" />
            <h3 className="mb-2 text-error">Verification Rejected</h3>
            <p className="text-muted mb-4">Your uploaded ID was invalid. Please re-upload.</p>
            <Link to="/verify" className="btn-primary">Re-upload ID</Link>
          </div>
        ) : (
          <div className="card glass-panel text-center justify-center flex items-center flex-col py-10">
            <UploadCloud size={48} className="text-accent mb-4" />
            <h3 className="mb-2">Identity Unverified</h3>
            <p className="text-muted mb-4">Upload your college ID to unlock features.</p>
            <Link to="/verify" className="btn-primary">Upload ID Now</Link>
          </div>
        )}

        <div className="card glass-panel text-center justify-center flex items-center flex-col py-10">
          <UserCircle size={48} className="text-secondary mb-4" style={{ color: 'var(--accent-secondary)' }} />
          <h3 className="mb-2">Your Profile</h3>
          <p className="text-muted mb-4">Complete your specific skills and career goals.</p>
          <Link to="/profile" className="btn-secondary">Edit Profile</Link>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4">Restricted Features</h3>
        <div className="grid grid-cols-3 opacity-50 pointer-events-none">
           <div className="card glass-panel">Take Skill Test</div>
           <div className="card glass-panel">Learning Plans</div>
           <div className="card glass-panel">Skill Gap Analysis</div>
        </div>
      </div>
    </div>
  );
}
