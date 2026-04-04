import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Star, MapPin, Download, X, Ticket, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import API_BASE_URL from '../../config';
import IDCard from '../../components/IDCard';

const StudentDashboard = () => {
    const { user, registrations, events, addFeedback, registerForEvent: contextRegister, logout, signatures } = useAppContext();
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [checkedSubEvents, setCheckedSubEvents] = useState([]);
    const [showTicket, setShowTicket] = useState(null);
    const [showCertificate, setShowCertificate] = useState(null);
    const certificateRef = useRef(null);

    const [showIDCard, setShowIDCard] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!user || !registrations) return;
        const myRegs = registrations.filter(r => r.email === user.email);
        setMyEvents(myRegs);
        setLoading(false);
    }, [user, registrations]);

    const handleRegister = async (eventId) => {
        const success = await contextRegister(eventId, checkedSubEvents.join(', '));
        if (success) {
            alert('Successfully registered!');
            window.location.reload();
        } else {
            alert('Registration failed or already registered.');
        }
    }

    const unregIds = myEvents.map(e => e.eventId || e.id); // Fallback to id for legacy regs
    const availableEvents = (events || []).filter(e => !unregIds.includes(e.id));
    const registeredCount = myEvents.length;
    const totalEventsCount = events?.length || 0;
    const participationPercentage = totalEventsCount > 0 ? Math.round((registeredCount / totalEventsCount) * 100) : 0;
    
    const pieData = [
        { name: 'Registered', value: registeredCount, color: '#0a2540' },
        { name: 'Remaining', value: totalEventsCount - registeredCount, color: '#1ba1cd' }
    ];

    const sortedMyEvents = [...myEvents].sort((a,b) => new Date(a.date) - new Date(b.date));
    let cumulative = 0;
    const historyDataMap = {};
    sortedMyEvents.forEach(evt => {
        const d = new Date(evt.date);
        const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        cumulative += 1;
        historyDataMap[dateStr] = cumulative;
    });
    const lineData = Object.keys(historyDataMap).map(dateStr => ({ date: dateStr, total: historyDataMap[dateStr] }));
    if (lineData.length === 0) lineData.push({ date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), total: 0 });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const leaderboardData = [
        { name: `${user?.name || 'You'} (You)`, points: registeredCount * 10 }
    ].sort((a,b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));

    const myRank = leaderboardData.find(u => u.name.includes('(You)'))?.rank || '-';

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;
        const canvas = await html2canvas(certificateRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${user.name}_Certificate.pdf`);
    };

    // Auto-scroll to events if coming from direct navigation
    useEffect(() => {
        if (window.location.pathname.includes('/events')) {
            const el = document.getElementById('explore-events-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [window.location.pathname]);

    return (
        <div style={{ width: '100%' }}>
            {/* Greeting Banner */}
            <div style={{ 
                backgroundColor: 'var(--primary-blue)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-lg)', 
                marginBottom: '2rem', 
                background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%)',
                boxShadow: 'var(--shadow-md)'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>{getGreeting()}, {user?.name?.split(' ')[0]}!</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                    <Star size={14} style={{ fill: '#fbbf24', stroke: '#fbbf24' }} /> 
                    <span>{registeredCount} Events Joined</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span>{participationPercentage}% Done</span>
                </div>
                <button 
                    onClick={() => setShowIDCard(true)}
                    className="btn-primary" 
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
                >
                    <Download size={16} style={{ marginRight: '8px' }} /> Download Participant ID Card
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Participation</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{registeredCount}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 400 }}>/{totalEventsCount}</span></div>
                    </div>
                    <div style={{ backgroundColor: '#f0f9ff', color: 'var(--primary-blue)', padding: '0.75rem', borderRadius: '12px' }}>
                        <Ticket size={24} />
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={18} outerRadius={28} paddingAngle={2} dataKey="value" stroke="none">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--dark-blue)', fontSize: '10px' }}>{participationPercentage}%</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Campus Goal</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-blue)' }}>{registeredCount} Active</div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Leaderboard</div>
                        <div style={{ backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#166534', fontWeight: 'bold' }}>Rank #{myRank}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {leaderboardData.slice(0, 2).map((lb, i) => (
                             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                                 <span style={{ fontWeight: lb.name.includes('(You)') ? 700 : 500, color: 'var(--dark-blue)' }}>{i+1}. {lb.name.split(' ')[0]}</span>
                                 <span style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{lb.points} pts</span>
                             </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Events */}
            <div id="explore-events-section" style={{ marginBottom: '1.5rem', scrollMarginTop: '100px' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--dark-blue)', fontWeight: 800 }}>Explore Events</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>New fests & technical events at HICAS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
                {availableEvents.map(evt => (
                    <div key={evt.id} className="premium-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setSelectedEvent(evt); setCheckedSubEvents([]); }}>
                        <div style={{ 
                            height: '240px', 
                            backgroundImage: evt.poster_url ? 
                                (evt.poster_url.startsWith('data:') || evt.poster_url.startsWith('http') ? `url(${evt.poster_url})` : (API_BASE_URL ? `url(${API_BASE_URL}${evt.poster_url})` : `url(${evt.poster_url})`)) 
                                : 'linear-gradient(135deg, #0a2540 0%, #1ba1cd 100%)', 
                            backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' 
                        }}>
                             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
                             <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', color: 'white' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{evt.title}</h3>
                                <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12}/> {evt.venue}</div>
                             </div>
                        </div>
                        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-blue)' }}>{new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                            <button className="btn-primary" style={{ padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem' }}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* My Registered Events */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--dark-blue)', fontWeight: 800 }}>Registered Portfolio</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginBottom: '2rem' }}>
                  {myEvents.map(evt => (
                    <div key={evt.id} className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark-blue)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.title}</h3>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(evt.date).toDateString()}</div>
                            </div>
                            <div style={{ backgroundColor: '#f0f9ff', color: 'var(--primary-blue)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>JOINED</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <button onClick={() => setShowTicket(evt)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', borderRadius: '8px', backgroundColor: '#f8fafc', color: 'var(--dark-blue)', border: '1px solid #e2e8f0' }}>Ticket</button>
                            <button 
                                disabled={evt.certificate_status !== 'issued'}
                                onClick={() => setShowCertificate(evt)} 
                                style={{ 
                                    flex: 1, 
                                    padding: '0.5rem', 
                                    fontSize: '0.75rem', 
                                    borderRadius: '8px', 
                                    backgroundColor: evt.certificate_status === 'issued' ? 'var(--primary-blue)' : '#f1f5f9', 
                                    color: evt.certificate_status === 'issued' ? 'white' : '#94a3b8',
                                    border: 'none',
                                    cursor: evt.certificate_status === 'issued' ? 'pointer' : 'not-allowed' 
                                }}
                            >
                                Certificate
                            </button>
                        </div>
                        <button 
                            onClick={() => setFeedbackModal(evt)}
                            style={{ 
                                width: '100%', 
                                padding: '0.5rem', 
                                fontSize: '0.7rem', 
                                borderRadius: '8px', 
                                backgroundColor: 'transparent', 
                                color: 'var(--primary-blue)', 
                                border: '1px solid var(--primary-blue)',
                                fontWeight: 700 
                            }}
                        >
                            Give Feedback
                        </button>
                    </div>
                ))}
                {myEvents.length === 0 && (
                     <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
                        No registrations found. Start exploring!
                     </div>
                )}
            </div>

            {/* Ticket Modal */}
            {showTicket && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,37,64,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
                    <div className="card shadow-2xl" style={{ width: '100%', maxWidth: '380px', padding: 0, overflow: 'hidden', borderRadius: '24px' }}>
                         <div style={{ backgroundColor: 'var(--primary-blue)', padding: '1.5rem', color: 'white', textAlign: 'center', position: 'relative' }}>
                             <button onClick={() => setShowTicket(null)} style={{ position: 'absolute', top: '15px', right: '15px', color: 'white' }}><X size={20}/></button>
                             <div style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>Official Event Pass</div>
                             <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{showTicket.title}</h2>
                         </div>
                         <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <div style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                 <QRCodeCanvas value={showTicket.qr_code_data || `REG-${user.id}-${showTicket.id}`} size={160} />
                             </div>
                             <div style={{ textAlign: 'center', width: '100%' }}>
                                 <div style={{ fontWeight: 800, color: 'var(--dark-blue)', fontSize: '1.125rem' }}>{user.name}</div>
                                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{user.department}</div>
                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '2px dashed #f1f5f9', paddingTop: '1.25rem' }}>
                                     <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>DATE</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--dark-blue)' }}>{new Date(showTicket.date).toLocaleDateString()}</div>
                                     </div>
                                     <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>VENUE</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--dark-blue)' }}>{showTicket.venue}</div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         <div style={{ backgroundColor: '#f8fafc', padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                             HICAS VibeHub • Valid Entry Required
                         </div>
                    </div>
                </div>
            )}

            {/* Certificate Modal - Responsive wrapper */}
            {showCertificate && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                        <button onClick={downloadCertificate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={18}/> Save PDF</button>
                        <button onClick={() => setShowCertificate(null)} className="btn-primary" style={{ backgroundColor: '#ef4444' }}>Exit</button>
                    </div>
                    
                    <div style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div ref={certificateRef} style={{ minWidth: '800px', width: '800px', height: '600px', backgroundColor: 'white', padding: '40px', position: 'relative', border: '15px solid var(--primary-blue)', boxSizing: 'border-box' }}>
                            <div style={{ border: '2px solid var(--dark-blue)', height: '100%', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>VIBEHUB 2026</div>
                                <div style={{ fontSize: '1.25rem', color: 'var(--primary-blue)', marginBottom: '2rem', fontWeight: 700 }}>Hindusthan College of Arts & Science</div>
                                <div style={{ fontSize: '3rem', fontFamily: 'serif', fontStyle: 'italic', marginBottom: '1rem' }}>Certificate of Participation</div>
                                <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem' }}>This is to certify that</div>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark-blue)', margin: '1rem 0', borderBottom: '2px solid #e2e8f0', minWidth: '400px' }}>{user.name}</div>
                                <div style={{ fontSize: '1rem', color: '#64748b', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    of <b>{user.department}</b> department has successfully participated in the event <br/>
                                    <span style={{ color: 'var(--primary-blue)', fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase' }}>{showCertificate.eventTitle}</span><br/>
                                    held on <b>{new Date(showCertificate.date).toLocaleDateString()}</b>.
                                </div>
                                <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        {(events.find(e => e.id === showCertificate.eventId || e.title === showCertificate.eventTitle)?.coordinatorSignature) ? (
                                            <div style={{ marginBottom: '-10px' }}>
                                                <img src={events.find(e => e.id === showCertificate.eventId || e.title === showCertificate.eventTitle).coordinatorSignature} alt="Coordinator" style={{ height: '60px', mixBlendMode: 'multiply' }} />
                                            </div>
                                        ) : (
                                            <div style={{ height: '60px' }}></div>
                                        )}
                                        <div style={{ height: '2px', backgroundColor: 'black', width: '180px', marginBottom: '5px' }}></div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>EVENT COORDINATOR</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        {signatures.principal && (
                                            <div style={{ marginBottom: '-10px' }}>
                                                <img src={signatures.principal} alt="Principal" style={{ height: '60px', mixBlendMode: 'multiply' }} />
                                            </div>
                                        )}
                                        <div style={{ height: '2px', backgroundColor: 'black', width: '180px', marginBottom: '5px' }}></div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>PRINCIPAL</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            {selectedEvent && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,37,64,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
                    <div className="card shadow-2xl" style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: 0 }}>
                        <div style={{ position: 'relative' }}>
                        <div style={{ 
                            height: '200px', 
                            backgroundImage: selectedEvent.poster_url ? 
                                (selectedEvent.poster_url.startsWith('data:') || selectedEvent.poster_url.startsWith('http') ? `url(${selectedEvent.poster_url})` : (API_BASE_URL ? `url(${API_BASE_URL}${selectedEvent.poster_url})` : `url(${selectedEvent.poster_url})`)) 
                                : 'linear-gradient(135deg, #0a2540 0%, #1ba1cd 100%)', 
                            backgroundSize: 'cover', backgroundPosition: 'center' 
                        }}></div>
                            <button onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'white', color: 'var(--dark-blue)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><X size={18}/></button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>{selectedEvent.title}</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}><Calendar size={14} color="var(--primary-blue)"/> {new Date(selectedEvent.date).toDateString()}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}><MapPin size={14} color="var(--primary-blue)"/> {selectedEvent.venue}</div>
                            </div>

                            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{selectedEvent.description || "Join us for this exciting departmental event! Perfect opportunity to showcase your talents and network with peers."}</p>
                            
                            {selectedEvent.sub_events && (
                                 <div style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Available Tracks:</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {selectedEvent.sub_events.split(',').map((sub, i) => (
                                            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }}>
                                                <input 
                                                    type="checkbox" 
                                                    style={{ width: '18px', height: '18px' }}
                                                    checked={checkedSubEvents.includes(sub.trim())} 
                                                    onChange={(e) => e.target.checked ? setCheckedSubEvents([...checkedSubEvents, sub.trim()]) : setCheckedSubEvents(checkedSubEvents.filter(s => s !== sub.trim()))} 
                                                />
                                                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#334155' }}>{sub.trim()}</span>
                                            </label>
                                        ))}
                                    </div>
                                 </div>
                            )}

                            <button onClick={() => { setSelectedEvent(null); handleRegister(selectedEvent.id); }} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, borderRadius: '12px', boxShadow: '0 4px 12px rgba(27, 161, 205, 0.3)' }}>Confirm Event Registration</button>
                        </div>
                    </div>
                </div>
            )}
            {/* ID Card Modal */}
            {showIDCard && <IDCard user={user} onClose={() => setShowIDCard(false)} />}

            {/* Feedback Modal */}
            {feedbackModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,37,64,0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ maxWidth: '400px', width: '100%', borderRadius: '24px' }}>
                         <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>Experience Feedback</h3>
                         <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Rate your experience at {feedbackModal.title}</p>
                         
                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1.5rem' }}>
                             {[1,2,3,4,5].map(s => (
                                 <button 
                                    key={s} 
                                    onClick={() => setRating(s)}
                                    style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                                 >
                                     <Star size={32} fill={s <= rating ? '#fbbf24' : 'none'} color={s <= rating ? '#fbbf24' : '#e2e8f0'} />
                                 </button>
                             ))}
                         </div>

                         <textarea 
                            placeholder="Tell us what you liked (Optional)" 
                            className="input-field" 
                            style={{ minHeight: '100px', marginBottom: '1.5rem' }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                         <div style={{ display: 'flex', gap: '1rem' }}>
                             <button 
                                onClick={() => { addFeedback(feedbackModal.title, rating, comment); setFeedbackModal(null); setComment(''); alert('Thank you for your feedback!'); }}
                                className="btn-primary" 
                                style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}
                            >
                                Submit Review
                            </button>
                             <button onClick={() => setFeedbackModal(null)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}>Cancel</button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
