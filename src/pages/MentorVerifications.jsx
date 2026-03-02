import { useEffect, useState } from 'react';
import { getPendingVerifications, reviewVerification } from '../services/api';
import { Check, X, ExternalLink, ShieldAlert, UserCheck } from 'lucide-react';

export default function MentorVerifications() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, verified, rejected (for history)

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
       fetchPending();
    } catch(e) {
       console.error(e);
    }
  };

  return (
    <div className="card glass-panel" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="dashboard-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div className="flex items-center gap-3">
           <ShieldAlert className="text-pending" size={32} />
           <div>
              <h2 style={{ fontWeight: 600 }}>Identity Verification Center</h2>
              <p className="text-muted">Review and approve student identification documents</p>
           </div>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setFilter('pending')} 
             className={filter === 'pending' ? 'btn-primary' : 'btn-secondary'}
             style={{ fontSize: '0.875rem' }}
           >
             Pending ({pending.length})
           </button>
           <button 
             onClick={() => setFilter('all')} 
             className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
             style={{ fontSize: '0.875rem' }}
           >
             History
           </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
           <div className="spinner mb-4" style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
           <p className="text-muted">Securely fetching documents...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
           {pending.length === 0 ? (
             <div className="text-center py-20 bg-tertiary" style={{ borderRadius: 8, border: '1px dashed var(--border-color)' }}>
                <UserCheck size={48} className="text-success mx-auto mb-4" />
                <h3>All Caught Up!</h3>
                <p className="text-muted">There are no student identities waiting for review.</p>
             </div>
           ) : (
             <div className="table-container">
               <table style={{ border: 'none' }}>
                 <thead>
                   <tr style={{ background: 'var(--bg-tertiary)' }}>
                     <th>Student Details</th>
                     <th>ID Document</th>
                     <th>Request Date</th>
                     <th>Status</th>
                     <th style={{ textAlign: 'right' }}>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {pending.map((p) => (
                     <tr key={p.$id || p.userId}>
                       <td>
                          <div className="flex flex-col">
                             <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.fullName}</span>
                             <span className="text-xs text-muted">{p.regNo} • {p.department}</span>
                          </div>
                       </td>
                       <td>
                          <button 
                            onClick={() => window.open(p.idCardUrl, '_blank')}
                            className="btn-secondary py-1 px-3 flex items-center gap-2"
                            style={{ fontSize: '0.75rem', fontWeight: 600 }}
                          >
                             <ExternalLink size={14} /> VIEW DOC
                          </button>
                       </td>
                       <td>
                          <span className="text-sm text-secondary">
                             {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Today'}
                          </span>
                       </td>
                       <td>
                          <span className={`badge badge-${p.verificationStatus}`}>
                             {p.verificationStatus}
                          </span>
                       </td>
                       <td style={{ textAlign: 'right' }}>
                          <div className="flex justify-end gap-2">
                             <button 
                               onClick={() => handleReview(p.userId, 'verified')}
                               className="btn-success flex items-center gap-1"
                               style={{ padding: '4px 12px', borderRadius: 4, background: '#eef9f2', border: '1px solid #ccebd7' }}
                               title="Approve Identity"
                             >
                                <Check size={16} /> <span style={{ fontSize: '0.8rem' }}>APPROVE</span>
                             </button>
                             <button 
                               onClick={() => handleReview(p.userId, 'rejected')}
                               className="btn-danger flex items-center gap-1"
                               style={{ padding: '4px 12px', borderRadius: 4, background: '#fdf3f4', border: '1px solid #fac2c5' }}
                               title="Reject Identity"
                             >
                                <X size={16} /> <span style={{ fontSize: '0.8rem' }}>REJECT</span>
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      )}

      {/* Stats / Help Card */}
      <div className="mt-8 grid grid-cols-2 gap-6">
         <div className="card" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '1rem' }}>
            <h4 className="flex items-center gap-2 mb-2"><ShieldAlert size={16} /> Compliance Note</h4>
            <p className="text-xs text-muted">
               Please ensure the student's Registration Number matches the official university database records before approval. ID document must be clear and legible.
            </p>
         </div>
      </div>
    </div>
  );
}
