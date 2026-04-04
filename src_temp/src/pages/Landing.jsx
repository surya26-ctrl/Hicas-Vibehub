import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import API_BASE_URL from '../config';

const Landing = () => {
    const { events } = useAppContext();

    const displayEvents = events && events.length > 0 ? events : [];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dark-blue)', fontWeight: 700, fontSize: '1.25rem' }}>
                    <div style={{ backgroundColor: 'var(--dark-blue)', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>H</div>
                    HICAS | VibeHub
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/register" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.9rem' }}>Inter-College</Link>
                    <Link to="/login" style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '0.9rem' }}>Sign In</Link>
                    <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Join Now</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main style={{ flex: 1, backgroundColor: 'var(--bg-light)' }}>
                <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', color: 'var(--dark-blue)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>
                        Unleash the Vibe at <br/>
                        <span style={{ color: 'var(--primary-blue)' }}>HICAS Events</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        The official event hub for Hindusthan College of Arts and Science. Discover, Register, and Excel in the grandest fests of 2026.
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px' }}>
                            <User size={18} /> HICAS Student
                        </Link>
                        <Link to="/register" className="btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', backgroundColor: '#f0f9ff', color: 'var(--primary-blue)', border: '1px solid var(--primary-blue)' }}>
                            <ArrowRight size={18} /> Other College Student
                        </Link>
                    </div>
                </div>

                {/* Event Section */}
                <div id="events" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', color: 'var(--dark-blue)', fontWeight: 800 }}>Upcoming Experiences</h2>
                        <a href="#" style={{ color: 'var(--primary-blue)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem' }}>View All <ArrowRight size={16} /></a>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '1rem 0', scrollbarWidth: 'none' }}>
                        {displayEvents.map(evt => (
                            <div key={evt.id} className="premium-card" style={{ padding: 0, minWidth: '320px', maxWidth: '320px', overflow: 'hidden', flexShrink: 0 }}>
                                <div style={{ height: '200px', backgroundImage: evt.poster_url ? (evt.poster_url.startsWith('http') || evt.poster_url.startsWith('data:')) ? `url(${evt.poster_url})` : (API_BASE_URL ? `url(${API_BASE_URL}${evt.poster_url})` : `url(${evt.poster_url})`) : 'linear-gradient(135deg, #0a2540 0%, #1ba1cd 100%)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 800, marginBottom: '0.5rem' }}>
                                        {new Date(evt.date).toDateString()}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-blue)', fontWeight: 800, marginBottom: '1.25rem' }}>{evt.title}</h3>
                                    <Link to="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '50px', fontSize: '0.9rem' }}>Secure Spot</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partners & Sponsors Section */}
                <div style={{ padding: '5rem 2rem', backgroundColor: 'white', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                         <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '3.5rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Our Strategic Partners</h2>
                         <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4rem', alignItems: 'center', opacity: 0.6 }}>
                              <div style={{ fontWeight: 900, fontSize: '1.75rem', color: '#4285F4' }}>Google Cloud</div>
                              <div style={{ fontWeight: 900, fontSize: '1.75rem', color: '#00A4EF' }}>Microsoft</div>
                              <div style={{ fontWeight: 900, fontSize: '1.75rem', color: '#FF9900' }}>AWS</div>
                              <div style={{ fontWeight: 900, fontSize: '1.75rem', color: '#EB001B' }}>Oracle</div>
                              <div style={{ fontWeight: 900, fontSize: '1.75rem', color: 'var(--dark-blue)' }}>HICAS ALUMNI</div>
                         </div>
                    </div>
                </div>

                {/* Footer Section */}
                <footer style={{ backgroundColor: 'white', padding: '4rem 2rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '3rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                         <div style={{ flex: 1, minWidth: '250px' }}>
                            <div style={{ color: 'var(--dark-blue)', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>HICAS</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '300px' }}>
                                Hindusthan College of Arts & Science<br/>
                                Hindusthan Gardens, Nava India,<br/>
                                Coimbatore, Tamil Nadu - 641028.
                            </p>
                         </div>
                         <div style={{ flex: 1, minWidth: '200px', textAlign: 'right' }}>
                            <p style={{ fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '1.25rem', fontSize: '0.9rem', letterSpacing: '1px' }}>RESOURCES</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <span style={{ cursor: 'pointer' }}>Official HICAS Portal</span>
                                <span style={{ cursor: 'pointer' }}>Fest Rules 2026</span>
                                <span style={{ cursor: 'pointer' }}>Privacy & Terms</span>
                                <span style={{ cursor: 'pointer' }}>Developer API</span>
                            </div>
                         </div>
                    </div>
                    <div style={{ maxWidth: '1200px', margin: '3rem auto 0', borderTop: '1px solid #f1f5f9', paddingTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                        © 2026 HICAS VibeHub. All rights reserved.
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Landing;
