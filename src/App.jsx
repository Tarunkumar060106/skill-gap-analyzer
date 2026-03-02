import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import RestrictedDashboard from './pages/RestrictedDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TestSetup from './pages/TestSetup';
import TestPage from './pages/TestPage';
import TestResults from './pages/TestResults';
import Profile from './pages/Profile';
import MentorDashboard from './pages/MentorDashboard';
import Reports from './pages/Reports';
import LearningPlan from './pages/LearningPlan';

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

            {/* Full Student Dash (Verified) */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/test-setup" element={
              <PrivateRoute>
                <TestSetup />
              </PrivateRoute>
            } />
            
            <Route path="/test" element={
              <PrivateRoute>
                <TestPage />
              </PrivateRoute>
            } />
            
            <Route path="/results" element={
              <PrivateRoute>
                <TestResults />
              </PrivateRoute>
            } />
            
            <Route path="/learn" element={
              <PrivateRoute>
                <LearningPlan />
              </PrivateRoute>
            } />

            {/* Mentor Routes */}
            <Route path="/mentor" element={
              <PrivateRoute requireMentor={true} requireVerified={false}>
                <MentorDashboard />
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
