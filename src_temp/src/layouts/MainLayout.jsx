import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Home, BookOpen, Clock, Calendar, Database, LogOut, Settings, Menu, X, LayoutDashboard, Users, Trophy, HelpCircle, MessageSquare, MapPin } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = {
    student: [
        { path: '/student', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/student/events', name: 'Explore Events', icon: Calendar },
        { path: '/student/leaderboard', name: 'Leaderboard', icon: Trophy },
        { path: '/student/support', name: 'Help & Support', icon: HelpCircle },
    ],
    admin: [
        { path: '/admin', name: 'Overview', icon: LayoutDashboard },
        { path: '/admin/events', name: 'Manage Events', icon: Calendar },
        { path: '/admin/registrations', name: 'Participants', icon: Users },
        { path: '/admin/inter-college', name: 'Inter-College', icon: MapPin },
        { path: '/admin/feedback', name: 'Sentiment', icon: MessageSquare },
        { path: '/admin/leaderboard', name: 'Leaderboard', icon: Trophy },
        { path: '/admin/settings', name: 'System', icon: Settings },
    ]
  };

  const menuItems = user?.role === 'admin' ? navItems.admin : navItems.student;

  return (
    <div className="dashboard-layout">
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'show' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: 'white', color: 'var(--dark-blue)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.9rem' }}>H</div>
            HICAS | VibeHub
          </div>
          <button 
             onClick={() => setIsMobileMenuOpen(false)} 
             style={{ color: 'white', padding: '4px' }}
             className="md-hide"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={idx} 
                to={item.path} 
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Simple Logout at Bottom of Sidebar */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button 
                onClick={handleLogout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1rem', borderRadius: '8px', color: '#ef4444', fontWeight: 600 }}
            >
                <LogOut size={20} /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f8fafc', color: 'var(--dark-blue)', border: '1px solid #e2e8f0' }}
                className="md-hide"
             >
                <Menu size={20} />
             </button>
             <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }} className="hide-on-mobile">
               {user?.role === 'admin' ? 'Administrative Control' : 'Student Portal'}
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
            <div 
              onClick={() => document.getElementById('profile-dropdown').classList.toggle('show')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '50px', border: '1px solid #e2e8f0' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span style={{ fontWeight: 600, color: 'var(--dark-blue)', fontSize: '0.875rem' }} className="hide-on-mobile">
                {user?.name}
              </span>
            </div>

            {/* Profile Dropdown */}
            <div id="profile-dropdown" className="card shadow-lg" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', width: '220px', padding: '0.5rem', zIndex: 1000, display: 'none' }}>
               <style>{`
                 #profile-dropdown.show { display: block !important; animation: fadeIn 0.1s ease-out; }
                 .dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 0.75rem 1rem; border: none; background: none; border-radius: 8px; color: var(--dark-blue); font-weight: 500; cursor: pointer; text-align: left; }
                 .dropdown-item:hover { background-color: #f8fafc; color: var(--primary-blue); }
                 @media (min-width: 769px) { .md-hide { display: none !important; } }
                 @media (max-width: 768px) { .hide-on-mobile { display: none !important; } }
               `}</style>
               <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
               </div>
               <button className="dropdown-item" onClick={() => navigate(user?.role === 'admin' ? '/admin/settings' : '/student')}>
                  <Settings size={18} /> Settings
               </button>
               <button className="dropdown-item" style={{ color: '#ef4444' }} onClick={handleLogout}>
                  <LogOut size={18} /> Log Out
               </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
