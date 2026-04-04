import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, ShieldCheck, MapPin, Calendar } from 'lucide-react';

const IDCard = ({ user, onClose }) => {
    const cardRef = useRef(null);

    const downloadCard = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null });
        const link = document.createElement('a');
        link.download = `${user.name}_VibeHub_ID.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,37,64,0.85)', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button onClick={downloadCard} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(27, 161, 205, 0.3)' }}><Download size={18}/> Download ID Card</button>
                <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid white', color: 'white', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>

            {/* The ID Card Design */}
            <div ref={cardRef} style={{ 
                width: '320px', 
                height: '500px', 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e2e8f0',
                fontFamily: 'sans-serif'
            }}>
                {/* Header Container */}
                <div style={{ height: '140px', background: 'linear-gradient(135deg, #0a2540 0%, #1ba1cd 100%)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '1rem' }}>
                    <div style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.2 }}><ShieldCheck size={40} /></div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '4px' }}>VIBE HUB 2026</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.8, textAlign: 'center', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Hindusthan College of Arts & Science</div>
                </div>

                {/* Profile Section */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-30px', padding: '0 1.5rem 1.5rem' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'white', padding: '4px', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                            {user.name?.charAt(0)}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a2540' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#1ba1cd', fontWeight: 700, marginTop: '2px' }}>Participant ID: VH-{user.id || '26A'}</div>
                        <div style={{ marginTop: '6px', padding: '2px 10px', backgroundColor: '#f0f9ff', color: '#0369a1', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, display: 'inline-block' }}>{user.institution?.includes('HICAS') ? 'INTERNAL' : 'EXTERNAL GUEST'}</div>
                    </div>

                    <div style={{ width: '100%', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 800 }}>DEPARTMENT</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{user.department || 'General'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 800 }}>INSTITUTION</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.institution || 'HICAS'}</div>
                        </div>
                    </div>

                    <div style={{ width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: '#64748b' }}>
                            <MapPin size={12} color="#1ba1cd"/> Main Campus, Coimbatore
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: '#64748b' }}>
                            <Calendar size={12} color="#1ba1cd"/> Valid: Feb 14-25, 2026
                        </div>
                    </div>
                </div>

                {/* Footer Section with Barcode (Mock) */}
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '80%', height: '30px', background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px)', marginBottom: '4px' }}></div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>AUTHORIZED BY HICAS FEST COORDINATOR</div>
                </div>
            </div>
        </div>
    );
};

export default IDCard;
