import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--white)' }}>
      {/* Left Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dark-blue)', fontWeight: 700, fontSize: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--dark-blue)', color: 'white', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>H</div>
            HICAS | VibeHub
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600 }}>
            <Link to="/" style={{ color: 'var(--dark-blue)' }}>Home</Link>
            <Link to="/#events" style={{ color: 'var(--dark-blue)' }}>Events</Link>

            <Link to="/login" style={{ backgroundColor: 'var(--dark-blue)', color: 'white', padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)' }}>Login</Link>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Outlet />
        </div>
      </div>

      {/* Right Image Side (Hidden on mobile) */}
      <div style={{ flex: 1, backgroundColor: 'var(--bg-light)', display: 'none', '@media (minWidth: 768px)': { display: 'block' } }}>
        <div style={{ height: '100%', width: '100%', backgroundImage: 'url("https://hicas.ac.in/images/hicas-campus.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', padding: '2rem' }}>
           {/* Fallback pattern if image fails */}
           <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,45,98,0.2)' }}></div>
        </div>
      </div>
      
      {/* Mobile media query emulation using inline styles where necessary isn't great, better to add a class to index.css */}
    </div>
  );
};

export default AuthLayout;
