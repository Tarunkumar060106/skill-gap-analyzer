import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '', regNo: '', department: 'CS', year: '1', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      await registerUser(formData.email, formData.password, formData.fullName, {
        regNo: formData.regNo,
        department: formData.department,
        year: formData.year
      });
      navigate('/verify');
    } catch (err) {
      setError('Failed to create account.');
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="auth-page" style={{ padding: '2rem 0' }}>
      <div className="auth-card glass-panel" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p className="text-muted">Join the Skill Gap Analyzer platform</p>
        </div>
        {error && <div className="btn-danger mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Full Name</label>
            <input name="fullName" type="text" className="form-control" required onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="form-label">Register Number</label>
            <input name="regNo" type="text" className="form-control" required onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="department" className="form-control" onChange={handleChange}>
              <option value="CS">Computer Science</option>
              <option value="IT">Info Tech</option>
              <option value="EE">Electrical</option>
              <option value="ME">Mechanical</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Year of Study</label>
            <select name="year" className="form-control" onChange={handleChange}>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" required onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" required onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input name="confirmPassword" type="password" className="form-control" required onChange={handleChange}/>
          </div>
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary w-full">Sign Up</button>
          </div>
        </form>
        <p className="text-center mt-6 text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
