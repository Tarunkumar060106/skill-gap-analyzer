import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TestSetup() {
  const { user } = useAuth();
  const [testType, setTestType] = useState('fullstack');
  const navigate = useNavigate();

  return (
    <div className="card glass-panel" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 className="mb-4">Configure New Assessment</h2>
      
      <div className="grid grid-cols-2 mt-6">
        <div>
          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input type="text" className="form-control" value={user?.fullName} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Select Skill Test</label>
            <select className="form-control" value={testType} onChange={e => setTestType(e.target.value)}>
              <option value="react">React Frontend Developer</option>
              <option value="fullstack">MERN Fullstack Developer</option>
              <option value="backend">NodeJS Backend Engineer</option>
              <option value="ml">Machine Learning Baseline</option>
            </select>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button onClick={() => navigate(`/test?type=${testType}`)} className="btn-primary">Start Test Now</button>
            <button onClick={() => navigate('/results')} className="btn-secondary">Previous Results</button>
          </div>
        </div>

        <div className="card" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <h3 className="mb-2">Instructions</h3>
          <ul style={{ paddingLeft: '1.25rem', listStyle: 'disc', color: 'var(--text-secondary)' }} gap-2="true">
             <li className="mb-2">There is a strict time limit for the test.</li>
             <li className="mb-2">Questions cannot be skipped.</li>
             <li className="mb-2">Make sure your internet is stable.</li>
             <li className="mb-2">Navigating away will auto-submit the test.</li>
          </ul>
          <div className="mt-4 p-4 text-sm" style={{ borderLeft: '3px solid var(--accent-primary)', background: 'rgba(102, 252, 241, 0.1)' }}>
             This is a role-readiness assessment. Treat it like a real interview screening.
          </div>
        </div>
      </div>
    </div>
  );
}
