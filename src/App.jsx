import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute'; // not used? replacing logic below.
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import RestrictedDashboard from './pages/RestrictedDashboard';
import StudentDashboard from './pages/StudentDashboard';

import Profile from './pages/Profile';
import MentorDashboard from './pages/MentorDashboard';
import MentorVerifications from './pages/MentorVerifications';
import MentorStudents from './pages/MentorStudents';
import Reports from './pages/Reports';
import LearningPlan from './pages/LearningPlan';
import Lesson from './pages/Lesson';
import Leaderboard from './pages/Leaderboard';
import TestSetup from './pages/TestSetup';
import SkillTest from './pages/SkillTest';
import TestResult from './pages/TestResult';
import AIInterview from './pages/AIInterview';

const PrivateRoute = ({ children, requireVerified = true, requireMentor = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  
  if (requireMentor && user?.role !== 'mentor') return <Navigate to="/dashboard" replace />;
  if (!requireMentor && user?.role === 'mentor') return <Navigate to="/mentor" replace />;
  
  if (!requireMentor && requireVerified && user?.verificationStatus !== 'verified') {
    return <Navigate to="/restricted" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Gamified Full-Screen Routes (Verified Student) */}
          <Route path="/learn" element={
            <PrivateRoute>
              <LearningPlan />
            </PrivateRoute>
          } />
          
          <Route path="/lesson/:id" element={
            <PrivateRoute>
              <Lesson />
            </PrivateRoute>
          } />

          <Route path="/leaderboard" element={
            <PrivateRoute>
              <Leaderboard />
            </PrivateRoute>
          } />

          <Route path="/test-setup" element={
            <PrivateRoute>
              <TestSetup />
            </PrivateRoute>
          } />

          <Route path="/test/:categoryId" element={
            <PrivateRoute>
              <SkillTest />
            </PrivateRoute>
          } />

          <Route path="/results" element={
            <PrivateRoute>
              <TestResult />
            </PrivateRoute>
          } />

          <Route path="/ai-interview" element={
            <PrivateRoute>
              <AIInterview />
            </PrivateRoute>
          } />

          {/* Authenticated Routes with Sidebar */}
          <Route element={<Layout />}>
            {/* Restricted (Unverified Student) */}
            <Route path="/restricted" element={
              <PrivateRoute requireVerified={false}>
                <RestrictedDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/verify" element={
              <PrivateRoute requireVerified={false}>
                <Verify />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute requireVerified={false}>
                <Profile />
              </PrivateRoute>
            } />

            {/* Standard Dashboard view */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            } />

            {/* Mentor Routes */}
            <Route path="/mentor" element={
              <PrivateRoute requireMentor={true} requireVerified={false}>
                <MentorDashboard />
              </PrivateRoute>
            } />
            <Route path="/mentor/students" element={
              <PrivateRoute requireMentor={true} requireVerified={false}>
                <MentorStudents />
              </PrivateRoute>
            } />
            <Route path="/mentor/verifications" element={
              <PrivateRoute requireMentor={true} requireVerified={false}>
                <MentorVerifications />
              </PrivateRoute>
            } />
            <Route path="/mentor/reports" element={
              <PrivateRoute requireMentor={true} requireVerified={false}>
                <Reports />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
