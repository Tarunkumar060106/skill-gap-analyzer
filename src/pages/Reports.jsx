import { Filter, Download, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const { user } = useAuth();
  const isMentor = user?.role === 'mentor';
  
  const mockDeptData = [
    { name: 'Computer Science', avgScore: 78, students: 450 },
    { name: 'Info Tech', avgScore: 72, students: 320 },
    { name: 'Electrical', avgScore: 65, students: 210 },
    { name: 'Mechanical', avgScore: 55, students: 180 },
  ];

  return (
    <div className="card glass-panel" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h2>Analytics & Reports</h2>
          <p className="text-muted">Export detailed skill gap analysis data</p>
        </div>
        
        <div className="flex gap-4">
          <button className="btn-secondary flex items-center gap-2"><Filter size={18} /> Filters</button>
          <button className="btn-success flex items-center gap-2" style={{ background: 'rgba(16, 185, 129, 0.2)' }}><FileSpreadsheet size={18}/> Export Excel</button>
          <button className="btn-primary flex items-center gap-2"><Download size={18}/> Export PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-6">
        <div className="card" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="mb-4">Department Performance</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDeptData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={120} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: 'var(--bg-secondary)', border: 'none'}} />
                <Bar dataKey="avgScore" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="mb-4">Placement Readiness Tracking</h3>
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
             <p className="text-muted mb-2">Percentage of students categorized as "Industry Ready" (Score &gt; 75%) over time.</p>
             <div className="table-container pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <table>
                   <thead>
                      <tr><th>Month</th><th>Ready %</th><th>Growth</th></tr>
                   </thead>
                   <tbody>
                      <tr><td>January</td><td>42%</td><td className="text-success">+2%</td></tr>
                      <tr><td>February</td><td>48%</td><td className="text-success">+6%</td></tr>
                      <tr><td>March</td><td>55%</td><td className="text-success">+7%</td></tr>
                      <tr><td>April</td><td>62%</td><td className="text-success">+7%</td></tr>
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
