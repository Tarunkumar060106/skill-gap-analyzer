import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      <Card className="w-full max-w-md p-6">
        <div className="auth-header">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Login to continue</p>
          <p className="text-muted-foreground text-sm mt-4 bg-secondary p-3 rounded-lg text-left">
            <strong>Mentor:</strong> mentor@test.com / password<br/>
            <strong>Student:</strong> student@test.com / password
          </p>
        </div>
        {error && <div className="text-destructive font-semibold text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right">
            <a href="#" className="text-muted-foreground text-sm hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full py-6 text-base">Login</Button>
        </form>
        <p className="text-center mt-6 text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
}
