import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, School } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import API_BASE_URL from '../config';

const Register = () => {
  const [isHICAS, setIsHICAS] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNo: '',
    department: '',
    institution: 'Hindusthan College of Arts & Science (HICAS)'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { registerUser } = useAppContext();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const finalData = { 
        ...formData, 
        institution: isHICAS ? 'Hindusthan College of Arts & Science (HICAS)' : formData.institution,
    };

    const success = await registerUser(finalData);
    setLoading(false);
    
    if (success) {
        alert('Registration Successful! Please login with your credentials.');
        navigate('/login');
    } else {
        setError('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--dark-blue)', marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>Join the Vibe Hub</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Experience the grandest college fest at HICAS</p>

      {/* Participant Type Toggle */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => {
                setIsHICAS(true);
                setFormData(prev => ({ ...prev, institution: 'Hindusthan College of Arts & Science (HICAS)' }));
            }}
            style={{ 
                flex: 1, 
                padding: '1rem', 
                borderRadius: '16px', 
                border: isHICAS ? '2px solid var(--primary-blue)' : '1px solid #e2e8f0',
                backgroundColor: isHICAS ? '#f0f9ff' : 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
          >
              <GraduationCap color={isHICAS ? 'var(--primary-blue)' : '#94a3b8'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isHICAS ? 'var(--dark-blue)' : '#64748b' }}>HICAS STUDENT</span>
          </button>
          <button 
            type="button"
            onClick={() => {
                setIsHICAS(false);
                setFormData(prev => ({ ...prev, institution: '' }));
            }}
            style={{ 
                flex: 1, 
                padding: '1rem', 
                borderRadius: '16px', 
                border: !isHICAS ? '2px solid var(--primary-blue)' : '1px solid #e2e8f0',
                backgroundColor: !isHICAS ? '#f0f9ff' : 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
          >
              <School color={!isHICAS ? 'var(--primary-blue)' : '#94a3b8'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: !isHICAS ? 'var(--dark-blue)' : '#64748b' }}>OTHER COLLEGE</span>
          </button>
      </div>

      <form onSubmit={handleRegister} style={{ textAlign: 'left' }} className="card">
        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Full Name</label>
          <input type="text" name="name" className="input-field" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="label">Email Address</label>
          <input type="email" name="email" className="input-field" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
        </div>

        {!isHICAS && (
             <div style={{ marginBottom: '1rem' }}>
                <label className="label">Institution / College Name</label>
                <input type="text" name="institution" className="input-field" placeholder="Enter your college name" value={formData.institution} onChange={handleChange} required />
             </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="label">Department</label>
              <input type="text" name="department" className="input-field" placeholder="e.g. BCA" value={formData.department} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">{isHICAS ? 'Roll No' : 'Student ID / Reg No'}</label>
              <input type="text" name="rollNo" className="input-field" placeholder="21BCA001" value={formData.rollNo} onChange={handleChange} required />
            </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label className="label">Password</label>
          <input type="password" name="password" className="input-field" placeholder="********" value={formData.password} onChange={handleChange} required />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Finish Registration'}
        </button>
      </form>
      
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--dark-blue)', fontWeight: 600 }}>Sign In</Link>
      </div>
    </div>
  );
};

export default Register;
