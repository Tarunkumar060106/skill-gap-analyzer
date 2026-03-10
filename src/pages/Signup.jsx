import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="auth-page py-8">
      <Card className="w-full max-w-2xl p-8">
        <div className="auth-header mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join the Skill Gap Analyzer platform</p>
        </div>
        {error && <div className="text-destructive font-semibold text-center mb-6">{error}</div>}
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
            <Select onValueChange={(val) => setFormData({...formData, department: val})} defaultValue="CS">
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
            <Select onValueChange={(val) => setFormData({...formData, year: val})} defaultValue="1">
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
          <div className="space-y-2">
            <Label>Password</Label>
            <Input name="password" type="password" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input name="confirmPassword" type="password" required onChange={handleChange} />
          </div>
          <div className="col-span-2 mt-4">
            <Button type="submit" className="w-full py-6 text-base">Sign Up</Button>
          </div>
        </form>
        <p className="text-center mt-8 text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}
