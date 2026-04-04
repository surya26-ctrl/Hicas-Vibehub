import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, Globe, Pencil, Award } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminSettings = () => {
    const { resetData, signatures, updateSignatures } = useAppContext();
    const [systemSettings, setSystemSettings] = useState({
        collegeName: 'Hindusthan College of Arts & Science',
        eventYear: '2026',
        contactEmail: 'admin@hicas.ac.in',
        enableRegistrations: true,
        maintenanceMode: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSystemSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        alert("System configuration updated successfully!");
        // Logic to persist to backend or localStorage for demo
        localStorage.setItem('vibeHubSystemSettings', JSON.stringify(systemSettings));
    };

    const handleReset = () => {
        const pass = prompt("Enter Administration Password to Reset System (admin123):");
        if (pass === 'admin123') {
            const success = resetData(pass);
            if (success) {
                alert("Platform Reset Successful! All mock data has been purged.");
            }
        } else if (pass !== null) {
            alert("Incorrect Password. System Reset Aborted.");
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '2rem' }}>System Settings</h1>

            <div className="grid grid-cols-1" style={{ gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                
                {/* General Configuration */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={20} /> Platform Branding
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label className="label">College/Institution Name</label>
                            <input type="text" name="collegeName" className="input-field" value={systemSettings.collegeName} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="label">Event Year</label>
                            <input type="text" name="eventYear" className="input-field" value={systemSettings.eventYear} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="label">Contact Support Email</label>
                            <input type="email" name="contactEmail" className="input-field" value={systemSettings.contactEmail} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Security & Access */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={20} /> Security & Access Control
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--dark-blue)' }}>Allow Registrations</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Students can register for new events.</div>
                            </div>
                            <input type="checkbox" name="enableRegistrations" checked={systemSettings.enableRegistrations} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#fff1f2', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: '#9f1239' }}>Maintenance Mode</div>
                                <div style={{ fontSize: '0.8rem', color: '#be123c' }}>Take the system offline for updates.</div>
                            </div>
                            <input type="checkbox" name="maintenanceMode" checked={systemSettings.maintenanceMode} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>
                </div>

                {/* Institutional Signature (Global) */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                        <div style={{ backgroundColor: '#fff7ed', color: '#f97316', padding: '10px', borderRadius: '10px' }}><Award size={24} /></div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--dark-blue)' }}>Institutional Signature</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This Principal's signature appears on all official certificates.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div style={{ padding: '1.5rem', border: '2px dashed #e2e8f0', borderRadius: '16px', textAlign: 'center', backgroundColor: '#fdfcfb' }}>
                            <label className="label" style={{ display: 'block', marginBottom: '1rem', cursor: 'pointer' }}>
                                <div style={{ color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Click to Upload</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Principal's E-Signature (PNG suggested)</div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => updateSignatures({ principal: reader.result });
                                            reader.readAsDataURL(file);
                                        }
                                    }} 
                                />
                            </label>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Note: Coordinator signatures are now uploaded individually per event.</p>
                        </div>

                        <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Preview</div>
                            {(signatures && signatures.principal) ? (
                                <img src={signatures.principal} alt="Principal Signature" style={{ height: '80px', margin: '0 auto', mixBlendMode: 'multiply' }} />
                            ) : (
                                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '0.8rem', fontStyle: 'italic' }}>No signature uploaded</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Database Maintenance */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={20} /> Data Management
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn-dark" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', color: '#475569' }}>
                            <Database size={16}/> Create System Backup
                        </button>
                        <button 
                            onClick={handleReset}
                            className="btn-dark" 
                            style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}
                        >
                            <Shield size={16}/> Wipe All System Data (Reset)
                        </button>
                    </div>
                </div>

            </div>


            <div style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSave} className="btn-primary" style={{ padding: '0.75rem 2.5rem' }}>Save System Configuration</button>
            </div>
        </div>
    );
};

export default AdminSettings;
