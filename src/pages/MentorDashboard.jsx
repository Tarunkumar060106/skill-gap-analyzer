import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPendingVerifications, reviewVerification } from '../services/api';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingVerifications();
      setPending(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (userId, status) => {
    try {
       await reviewVerification(userId, status);
       await fetchPending();
       alert('Verification '+ status);
    } catch(e) {
       console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-3 mb-6">
        <div className="card glass-panel flex items-center gap-4">
           <Users size={32} className="text-secondary" />
           <div>
              <h3>Total Students</h3>
              <p className="card-value">1,248</p>
           </div>
        </div>
        <div className="card glass-panel flex items-center gap-4">
           <CheckCircle size={32} className="text-success" />
           <div>
              <h3>Avg Placement Readiness</h3>
              <p className="card-value text-success">68%</p>
           </div>
        </div>
        <div className="card glass-panel flex items-center gap-4">
           <XCircle size={32} className="text-pending" />
           <div>
              <h3>Pending Verifications</h3>
              <p className="card-value text-pending">{pending.length}</p>
           </div>
        </div>
      </div>

      <div className="card glass-panel">
        <h2 className="mb-4">Pending Verifications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : pending.length === 0 ? (
          <p className="text-muted p-4 text-center">No pending verifications. Good job!</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Reg Number</th>
                  <th>Department</th>
                  <th>ID Card</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.$id || p.userId}>
                    <td className="font-medium">{p.fullName}</td>
                    <td>{p.regNo}</td>
                    <td>{p.department}</td>
                    <td>
                       <a href={p.idCardUrl || '#'} target="_blank" rel="noreferrer" className="text-accent">View ID</a>
                    </td>
                    <td><span className="badge badge-pending">Pending</span></td>
                    <td className="flex gap-2">
                       <button onClick={() => handleReview(p.userId, 'verified')} className="btn-success text-sm py-1 px-3">Approve</button>
                       <button onClick={() => handleReview(p.userId, 'rejected')} className="btn-danger text-sm py-1 px-3">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card glass-panel mt-6">
         <h2 className="mb-4">Recent Top Performers</h2>
         <p className="text-muted mb-4">Students scoring above 90% in technical assessments.</p>
         <div className="table-container">
            <table>
               <thead>
                  <tr>
                     <th>Rank</th>
                     <th>Student Name</th>
                     <th>Score</th>
                     <th>Test Type</th>
                     <th>Readiness</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="text-success">#1</td>
                     <td>Alex Johnson</td>
                     <td>98%</td>
                     <td>MERN Stack</td>
                     <td><span className="badge badge-verified">Ready</span></td>
                  </tr>
                  <tr>
                     <td className="text-success">#2</td>
                     <td>Samantha Lee</td>
                     <td>95%</td>
                     <td>Backend Engineering</td>
                     <td><span className="badge badge-verified">Ready</span></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
