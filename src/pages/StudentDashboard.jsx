import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTestResults } from '../services/api';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FileCheck2, UserCircle, Target, Activity } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function loadData() {
      if(user) {
        try {
          const res = await getTestResults(user.userId);
          setResults(res);
        } catch(e) {}
      }
    }
    loadData();
  }, [user]);

  const skillData = [
    { subject: 'React', A: 80, fullMark: 100 },
    { subject: 'Node.js', A: 65, fullMark: 100 },
    { subject: 'DB Design', A: 90, fullMark: 100 },
    { subject: 'System Architecture', A: 45, fullMark: 100 },
    { subject: 'Soft Skills', A: 70, fullMark: 100 },
  ];

  return (
    <div className="grid">
      <div className="grid grid-cols-3">
        <Link to="/test-setup" className="card glass-panel" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="flex items-center gap-4">
            <div className="avatar" style={{ background: 'rgba(102, 252, 241, 0.2)', color: 'var(--accent-primary)' }}>
              <FileCheck2 size={24} />
            </div>
            <div>
              <p className="text-secondary text-sm">Action</p>
              <h3 className="card-value" style={{ fontSize: '1.25rem' }}>Take Skill Test</h3>
            </div>
          </div>
        </Link>
        <Link to="/learn" className="card glass-panel" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="flex items-center gap-4">
            <div className="avatar" style={{ background: 'rgba(138, 43, 226, 0.2)', color: 'var(--accent-secondary)' }}>
              <Target size={24} />
            </div>
            <div>
              <p className="text-secondary text-sm">Action</p>
              <h3 className="card-value" style={{ fontSize: '1.25rem' }}>Learning Plan</h3>
            </div>
          </div>
        </Link>
        <Link to="/profile" className="card glass-panel" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="flex items-center gap-4">
            <div className="avatar" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
              <UserCircle size={24} />
            </div>
            <div>
              <p className="text-secondary text-sm">Action</p>
              <h3 className="card-value" style={{ fontSize: '1.25rem' }}>View Profile</h3>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2">
        <div className="card glass-panel">
          <h3 className="card-title mb-4">Skill Gap Analysis</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" fill="#fff" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Skills" dataKey="A" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card glass-panel flex" style={{ flexDirection: 'column' }}>
          <h3 className="card-title mb-4">Recent Activities</h3>
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {results.length > 0 ? results.slice(0, 4).map(r => (
              <div key={r.$id} className="flex justify-between items-center" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-accent" />
                  <div>
                    <h4 style={{ fontSize: '0.875rem' }}>{r.testName || 'React Assessment'}</h4>
                    <p className="text-muted text-sm">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="badge badge-verified">{r.score}%</div>
              </div>
            )) : (
              <div className="text-center text-muted" style={{ padding: '2rem' }}>
                <p>No test results yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
