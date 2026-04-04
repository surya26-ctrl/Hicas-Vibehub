import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate API call Delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await login(email, password, role);
    setLoading(false);
    
    if (success) {
      if (role === 'admin') navigate('/admin');
      else navigate('/student');
    } else {
      setError('Invalid credentials. Note: Use "admin123" or "student123" for demo mode.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--dark-blue)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Welcome Back</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to your HICAS account</p>

      <div style={{ display: 'flex', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-full)', padding: '4px', marginBottom: '2rem' }}>
        {['student', 'admin'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            style={{
              flex: 1,
              padding: '0.5rem 0',
              borderRadius: 'var(--radius-full)',
              textTransform: 'capitalize',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: role === r ? 'var(--dark-blue)' : 'var(--text-muted)',
              backgroundColor: role === r ? 'var(--white)' : 'transparent',
              border: role === r ? '1px solid var(--dark-blue)' : 'none',
              boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label">Email Address</label>
          <input
            type="email"
            className="input-field"
            placeholder={`Enter ${role} email`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" style={{ color: '#f97316' }}>Forgot Password?</a>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <button 
          type="submit" 
          className="btn-dark" 
          style={{ width: '100%', padding: '0.875rem' }}
          disabled={loading}
        >
          {loading ? 'Signing in...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
        </button>
      </form>
      
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--dark-blue)', fontWeight: 600 }}>Register Now</Link>
      </div>
    </div>
  );
};

export default Login;
