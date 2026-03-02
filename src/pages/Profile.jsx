import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

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
    <div className="card glass-panel" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="flex items-center gap-6 mb-8 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
        <div className="avatar" style={{ width: 80, height: 80, fontSize: '2.5rem', background: 'var(--accent-secondary)' }}>
          {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{user?.fullName || user?.name}</h2>
          <p className="text-secondary">{user?.email}</p>
          <div className="mt-2 flex gap-2">
            <span className={`badge badge-${user?.verificationStatus}`}>{user?.verificationStatus?.toUpperCase() || 'VERIFIED'}</span>
            <span className="badge" style={{ background: 'rgba(102, 252, 241, 0.1)', color: 'var(--accent-primary)' }}>{user?.department || 'CS'} - {user?.year || '3rd'} Year</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-2">
         <div className="form-group" style={{ gridColumn: 'span 2' }}>
           <label className="form-label">Full Name</label>
           <input type="text" className="form-control" defaultValue={user?.fullName || user?.name} disabled />
         </div>
         <div className="form-group">
           <label className="form-label">Register Number</label>
           <input type="text" className="form-control" defaultValue={user?.regNo} disabled />
         </div>
         <div className="form-group">
           <label className="form-label">Department</label>
           <input type="text" className="form-control" defaultValue={user?.department} disabled />
         </div>
         
         <div className="form-group" style={{ gridColumn: 'span 2' }}>
           <label className="form-label">Technical Skills (Comma separated)</label>
           <input type="text" className="form-control" value={techSkills} onChange={e => setTechSkills(e.target.value)} />
         </div>
         <div className="form-group" style={{ gridColumn: 'span 2' }}>
           <label className="form-label">Soft Skills (Comma separated)</label>
           <input type="text" className="form-control" value={softSkills} onChange={e => setSoftSkills(e.target.value)} />
         </div>
         <div className="form-group" style={{ gridColumn: 'span 2' }}>
           <label className="form-label">Career Goals</label>
           <textarea className="form-control" rows="3" value={goals} onChange={e => setGoals(e.target.value)}></textarea>
         </div>

         <div style={{ gridColumn: 'span 2', marginTop: '1rem', textAlign: 'right' }}>
            <button type="submit" className="btn-primary">Save Changes</button>
         </div>
      </form>
    </div>
  );
}
