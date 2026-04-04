import React, { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send, Phone, Mail, MapPin } from 'lucide-react';

const Support = () => {
    const [openFaq, setOpenFaq] = useState(0);
    const [query, setQuery] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const faqs = [
        { q: "How do I download my Participation Certificate?", a: "Once an admin issues your certificate, a 'Certificate' button will appear in your Joined Events list. You can download it as a PDF from there." },
        { q: "Can students from other colleges participate?", a: "Yes! Vibe Hub 2026 is an inter-college fest. Non-HICAS students can register by selecting 'Other College' during signup." },
        { q: "Where can I find my Event Ticket?", a: "Go to your Student Dashboard, find the event in 'Registered Portfolio', and click the 'Ticket' button to view your QR pass." },
        { q: "Is there a registration fee?", a: "Fee details are event-specific. Please check the 'Explore Events' details for individual pricing (if any)." },
        { q: "What should I do if my QR code doesn't scan?", a: "Please visit the Help Desk at the Main Auditorium entrance with your Hall Ticket and Student ID for manual verification." }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setQuery('');
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>Help & Support</h1>
                <p style={{ color: 'var(--text-muted)' }}>Need assistance? We're here to help you vibe better.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQ Section */}
                <div className="lg:grid-cols-2" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <HelpCircle color="var(--primary-blue)" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-blue)' }}>Frequently Asked Questions</h2>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {faqs.map((faq, i) => (
                            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', border: openFaq === i ? '1px solid var(--primary-blue)' : '1px solid #e2e8f0' }}>
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '1.25rem', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        backgroundColor: openFaq === i ? '#f0f9ff' : 'white',
                                        border: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span style={{ fontWeight: 700, color: openFaq === i ? 'var(--primary-blue)' : 'var(--dark-blue)', fontSize: '0.95rem' }}>{faq.q}</span>
                                    {openFaq === i ? <ChevronUp size={20} color="var(--primary-blue)" /> : <ChevronDown size={20} color="#94a3b8" />}
                                </button>
                                {openFaq === i && (
                                    <div style={{ padding: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #e2e8f0' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ backgroundColor: 'var(--dark-blue)', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                            <MessageSquare size={20} />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick Support</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <textarea 
                                required
                                placeholder="Describe your issue..." 
                                style={{ width: '100%', minHeight: '120px', padding: '0.75rem', borderRadius: '12px', border: 'none', marginBottom: '1rem', color: 'var(--dark-blue)', fontSize: '0.85rem' }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Send size={16} /> {submitted ? 'Query Sent!' : 'Send Query'}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{ fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '1rem', fontSize: '0.9rem' }}>Contact Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <div style={{ minWidth: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}><Mail size={16}/></div>
                                support@hicas.ac.in
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <div style={{ minWidth: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}><Phone size={16}/></div>
                                +91 422 261 1146
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <div style={{ minWidth: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}><MapPin size={16}/></div>
                                Pollachi Main Rd, Coimbatore
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
