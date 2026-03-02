import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X } from 'lucide-react';

export default function Verify() {
  const { user, requestVerification, logoutUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if(dropped && dropped.type.startsWith('image/')) handleFile(dropped);
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if(selected) handleFile(selected);
  };

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if(!file) return;
    setLoading(true);
    try {
      await requestVerification(file);
      navigate('/restricted');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if(user?.verificationStatus === 'pending') {
    return (
      <div className="card glass-panel text-center" style={{ maxWidth: 600, margin: '2rem auto', padding: '3rem' }}>
        <h2 className="mb-4">Verification Pending</h2>
        <p className="text-muted mb-6">Your ID is under review. You will gain full access once verified.</p>
        <button onClick={() => navigate('/restricted')} className="btn-primary">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card glass-panel" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 className="mb-4">Verify Your Student Identity</h2>
      <p className="text-muted mb-6">Upload your college ID before accessing tests. We accept JPG and PNG formats.</p>

      {!preview ? (
        <div 
          className="file-upload-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud size={48} className="text-accent mb-4 mx-auto" style={{ color: 'var(--accent-primary)' }} />
          <p>Drag and drop your ID card here</p>
          <p className="text-sm text-muted mt-2">or click to browse</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleChange} 
            hidden 
            accept="image/jpeg, image/png"
          />
        </div>
      ) : (
        <div className="file-preview">
          <img src={preview} alt="ID Preview" />
          <button className="file-remove" onClick={() => {setFile(null); setPreview(null);}}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button 
          onClick={handleSubmit} 
          disabled={!file || loading} 
          className="btn-primary flex-1 items-center justify-center"
        >
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </button>
        <button onClick={logoutUser} className="btn-secondary">Save and Logout</button>
      </div>
    </div>
  );
}
