import React, { useState } from 'react';
import { Search, Download, Check, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Registrations = () => {
    const { registrations, loading, updateCertificateStatus } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const exportCSV = () => {
        if (registrations.length === 0) return;
        
        const headers = ["ID", "Student Name", "Email", "Institution", "Department", "Event", "Sub-Events", "Registration Date"];
        const rows = registrations.map(r => [
            r.id,
            r.studentName,
            r.email,
            r.institution || 'HICAS',
            r.department,
            r.eventTitle,
            r.subEvents || 'None',
            r.date
        ]);

        const csvContent = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VibeHub_Registrations_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filtered = (registrations || []).filter(r => 
        r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '0.25rem' }}>Master Registration List</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View and manage all event participants.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by student, event or dept..." 
                            className="input-field" 
                            style={{ paddingLeft: '35px', width: '300px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={exportCSV} 
                        className="btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: registrations?.length > 0 ? 1 : 0.5 }}
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.125rem', color: 'var(--text-muted)' }}>Loading Master List...</div>
            ) : (
                <div className="card" style={{ padding: 0, overflowX: 'auto', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</th>
                                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event & Details</th>
                                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Institution</th>
                                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certificate Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? filtered.map((reg, idx) => (
                                <tr key={reg.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? 'white' : '#fafcfd' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {reg.studentName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{reg.studentName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reg.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{reg.eventTitle}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{reg.subEvents || 'Standard Entry'}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-blue)' }}>{reg.institution || 'HICAS'}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ backgroundColor: '#f0f9ff', color: 'var(--primary-blue)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{reg.department || 'General'}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{reg.date}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        {reg.certificate_status === 'issued' ? (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Check size={14} /> Issued
                                                </span>
                                                <button 
                                                    onClick={() => updateCertificateStatus(reg.id, 'pending')}
                                                    style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => updateCertificateStatus(reg.id, 'issued')}
                                                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-blue)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <FileText size={14} /> Issue Certificate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No registrations found.</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Registrations;
