import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTestResults } from '../services/api';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, AlertTriangle, BookOpen } from 'lucide-react';

export default function TestResults() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if(user) {
        try {
          const res = await getTestResults(user.userId);
          setResults(res.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch(e) {}
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  if(loading) return <div>Loading results...</div>;

  if(results.length === 0) {
    return (
      <div className="card glass-panel text-center py-10" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 className="mb-4">No Test Results Yet</h2>
        <p className="text-muted mb-6">You haven't completed any assessments.</p>
        <Link to="/test-setup" className="btn-primary">Take a Test</Link>
      </div>
    );
  }

  const latest = results[0];
  const chartData = results.slice(0, 5).reverse().map((r, i) => ({
    name: `Test ${i+1}`,
    score: r.score
  }));

  return (
    <div className="grid grid-cols-1">
      <div className="card glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <Award size={64} className="mx-auto mb-4 text-accent" style={{ color: latest.score >= 70 ? 'var(--success)' : 'var(--pending)' }} />
        <h1>{latest.score}%</h1>
        <p className="text-secondary" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Test Output: {latest.testName}</p>
        <div className="badge badge-verified inline-block">{latest.readinessLevel}</div>
      </div>

      <div className="grid grid-cols-2 mt-4">
        <div className="card glass-panel">
          <h3 className="mb-4">Performance Trend</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: 'var(--bg-secondary)', border: 'none'}} />
                <Bar dataKey="score" fill="var(--accent-primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card glass-panel">
          <h3 className="flex items-center gap-2 mb-4"><AlertTriangle className="text-pending" size={20} /> Areas to Improve</h3>
          <ul style={{ listStyle: 'none' }} className="gap-2 flex flex-col">
            {(latest.weakSkills || ['State Management', 'React Hooks', 'Advanced Routing']).map((skill, idx) => (
              <li key={idx} className="p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                 {skill}
              </li>
            ))}
          </ul>
          
          <div className="mt-auto pt-6 flex gap-4">
            <Link to="/learn" className="btn-primary flex-1 text-center justify-center flex">View Learning Plan</Link>
            <Link to="/test-setup" className="btn-secondary flex-1 text-center justify-center flex">Retake Test</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
