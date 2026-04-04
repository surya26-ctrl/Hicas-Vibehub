import React, { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, Users, PieChart } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API_BASE_URL from '../../config';

const InterCollege = () => {
    const { registrations } = useAppContext();
    const [externalRegs, setExternalRegs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, distinctColleges: 0 });

    useEffect(() => {
        // Filter for external students (not HICAS)
        const filtered = (registrations || []).filter(reg => 
            reg.institution && !reg.institution.includes('Hindusthan') && !reg.institution.includes('HICAS')
        );
        setExternalRegs(filtered);

        const colleges = [...new Set(filtered.map(r => r.institution))];
        setStats({
            total: filtered.length,
            distinctColleges: colleges.length
        });
    }, [registrations]);

    const filtered = externalRegs.filter(r => 
        r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const viewProfile = (reg) => {
        alert(`
            --- STUDENT PROFILE ---
            Name: ${reg.studentName}
            Email: ${reg.email}
            College: ${reg.institution}
            Department: ${reg.department || 'N/A'}
            Event: ${reg.eventTitle}
            Sub-Events: ${reg.subEvents || 'General Entry'}
            Registration Date: ${reg.date}
        `);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '0.25rem' }}>Inter-College Participants</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage and track registrations from external institutions.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10b981' }}>
                    <div style={{ backgroundColor: '#ecfdf5', color: '#10b981', padding: '0.75rem', borderRadius: '12px' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>External Participants</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{stats.total}</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ backgroundColor: '#fffbe6', color: '#f59e0b', padding: '0.75rem', borderRadius: '12px' }}>
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Participating Colleges</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{stats.distinctColleges}</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by student, college or event..." 
                        className="input-field" 
                        style={{ paddingLeft: '35px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STUDENT</th>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>COLLEGE / INSTITUTION</th>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>EVENT</th>
                            <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(reg => (
                            <tr key={reg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{reg.studentName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reg.email}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontWeight: 600 }}>
                                        <MapPin size={14} /> {reg.institution}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 600 }}>{reg.eventTitle}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reg.subEvents || 'General'}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button 
                                        className="btn-dark" 
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                        onClick={() => viewProfile(reg)}
                                    >
                                        <ExternalLink size={12} /> View Profile
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No external participants found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InterCollege;
