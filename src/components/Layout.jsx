import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileCheck2, UserCircle, LogOut, BookOpen, BarChart3, Users, FileText } from 'lucide-react';

export default function Layout() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  const isMentor = user?.role === 'mentor';
  const isVerified = user?.verificationStatus === 'verified';

  const menuItems = isMentor ? [
    { name: 'Dashboard', path: '/mentor', icon: LayoutDashboard },
    { name: 'Pending Verifications', path: '/mentor/verifications', icon: Users },
    { name: 'Reports', path: '/mentor/reports', icon: FileText },
  ] : (isVerified ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Test', path: '/test-setup', icon: FileCheck2 },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Results', path: '/results', icon: BarChart3 },
  ] : [
    { name: 'Upload ID', path: '/verify', icon: FileCheck2 },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <BookOpen size={28} className="text-accent" />
          SkillGap AI
        </div>
        
        <nav className="nav-links">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          <button onClick={logoutUser} className="nav-item w-full">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h2 className="card-title text-primary">Welcome, {user?.fullName || user?.name}</h2>
            <p className="text-muted text-sm">
              Role: {user?.role || 'Student'} | Status: 
              <span className={`badge ml-2 badge-${user?.verificationStatus}`}>{user?.verificationStatus || 'approved'}</span>
            </p>
          </div>
          <div className="user-profile-menu">
            <div className="avatar">
              {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
