import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await loginUser(email, password);
      // Wait, what role is it? We can't immediately know here synchronously, 
      // but App.jsx protected route handles redirect. Since we aren't inside ProtectedRoute, we navigate.
      // Easiest is to navigate to /dashboard, ProtectedRoute will catch it and bounce to restricted if needed.
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Check credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p className="text-muted">Login to continue</p>
          <p className="text-muted text-sm mt-2">
            <strong>Mentor:</strong> mentor@test.com / password<br/>
            <strong>Student:</strong> student@test.com / password
          </p>
        </div>
        {error && <div className="btn-danger mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right mb-4">
            <a href="#" className="text-muted text-sm">Forgot password?</a>
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <p className="text-center mt-6 text-muted">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
