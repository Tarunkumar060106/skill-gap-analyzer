import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '', regNo: '', department: 'CS', year: '1', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const { password } = formData;
    const criteria = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[\W_]/.test(password)
    };
    setPasswordCriteria(criteria);

    const metCount = Object.values(criteria).filter(Boolean).length;
    setPasswordStrength(metCount);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    const { length, upper, lower, number, special } = passwordCriteria;
    if (!length || !upper || !lower || !number || !special) {
      return setError('Password does not meet all security requirements');
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
      // If backend returns a message, use it
      setError(err.message || 'Failed to create account.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-destructive';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="auth-page py-8">
      <Card className="w-full max-w-2xl p-8">
        <div className="auth-header mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join the Skill Gap Analyzer platform</p>
        </div>
        {error && <div className="text-destructive font-semibold text-center mb-6 p-3 bg-destructive/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Full Name</Label>
            <Input name="fullName" type="text" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Register Number</Label>
            <Input name="regNo" type="text" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select onValueChange={(val) => setFormData({ ...formData, department: val })} defaultValue="CS">
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CS">Computer Science</SelectItem>
                <SelectItem value="IT">Info Tech</SelectItem>
                <SelectItem value="EE">Electrical</SelectItem>
                <SelectItem value="ME">Mechanical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Year of Study</Label>
            <Select onValueChange={(val) => setFormData({ ...formData, year: val })} defaultValue="1">
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Email</Label>
            <Input name="email" type="email" required onChange={handleChange} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Password</Label>
            <Input name="password" type="password" required onChange={handleChange} />
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Strength: <span className="font-bold">{getStrengthText()}</span></span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`} 
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${passwordCriteria.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordCriteria.length ? <Check size={12} /> : <X size={12} />} 8+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.upper ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordCriteria.upper ? <Check size={12} /> : <X size={12} />} Uppercase
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.lower ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordCriteria.lower ? <Check size={12} /> : <X size={12} />} Lowercase
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.number ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordCriteria.number ? <Check size={12} /> : <X size={12} />} Number
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.special ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordCriteria.special ? <Check size={12} /> : <X size={12} />} Special char
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Confirm Password</Label>
            <Input name="confirmPassword" type="password" required onChange={handleChange} />
          </div>
          <div className="col-span-2 mt-4">
            <Button 
              type="submit" 
              className="w-full py-6 text-base"
              disabled={passwordStrength < 5 || formData.password !== formData.confirmPassword}
            >
              Sign Up
            </Button>
          </div>
        </form>
        <p className="text-center mt-8 text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}
