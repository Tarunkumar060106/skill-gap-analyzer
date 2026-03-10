import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileCheck2, UserCircle, LogOut, BookOpen, BarChart3, Users, FileText, ChevronDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r border-border/50 bg-secondary/10 flex flex-col transition-all">
        <div className="p-6 flex items-center gap-3 font-bold text-xl border-b border-border/50">
          <div className="p-2 bg-primary/20 rounded-xl text-primary">
            <BookOpen size={24} />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">SkillGap AI</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary' : 'opacity-70'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button 
            onClick={logoutUser} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-border/50 bg-background/50 backdrop-blur flex items-center justify-between px-8 z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Welcome, {user?.fullName || user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground font-medium">Role: {user?.role === 'mentor' ? 'Mentor' : 'Student'}</span>
              <span className="text-muted-foreground">•</span>
              <Badge variant={user?.verificationStatus === 'verified' ? 'default' : 'secondary'} className="h-5 rounded-sm capitalize">
                {user?.verificationStatus || 'approved'}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-3 bg-secondary/30 hover:bg-secondary/50 p-1.5 pr-3 rounded-full border border-border/50 transition-colors cursor-pointer">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold max-w-[100px] truncate">{user?.fullName || user?.name}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile" className="flex items-center w-full">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                {isMentor ? (
                  <Link to="/mentor" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <Link to="/dashboard" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutUser} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-background relative selection:bg-primary/20">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
             <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
             <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-accent rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
          </div>
          
          <div className="relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
