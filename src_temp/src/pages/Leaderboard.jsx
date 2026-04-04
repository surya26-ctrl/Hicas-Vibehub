import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, TrendingUp, Users, Award } from 'lucide-react';

const Leaderboard = () => {
    const [loading, setLoading] = useState(true);

    // Mock Data for the competitive campus experience
    const DEPARTMENTS = [];

    const INDIVIDUALS = [];

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Synchronizing Campus Standings...</div>;

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>Campus Leaderboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time standings of HICAS departments and top performers.</p>
            </div>

            {DEPARTMENTS.length >= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '3rem', alignItems: 'flex-end' }}>
                {/* 2nd Place */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', borderBottom: '4px solid #94a3b8', order: 2 }}>
                    <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 1rem' }}>
                        <Medal size={60} color="#94a3b8" />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>2</span>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{DEPARTMENTS[1].name}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{DEPARTMENTS[1].points} pts</div>
                </div>

                {/* 1st Place */}
                <div className="premium-card" style={{ textAlign: 'center', padding: '3rem 2rem', borderBottom: '4px solid #fbbf24', transform: 'scale(1.05)', order: 1 }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
                        <Trophy size={80} color="#fbbf24" strokeWidth={2.5} />
                        <span style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, color: 'var(--dark-blue)', fontSize: '1.5rem' }}>1</span>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--dark-blue)' }}>{DEPARTMENTS[0].name}</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-blue)' }}>{DEPARTMENTS[0].points} pts</div>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CROWNED CHAMPIONS</div>
                </div>

                {/* 3rd Place */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', borderBottom: '4px solid #b45309', order: 3 }}>
                    <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 1rem' }}>
                        <Medal size={60} color="#b45309" />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>3</span>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{DEPARTMENTS[2].name}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{DEPARTMENTS[2].points} pts</div>
                </div>
            </div>
            ) : (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem', borderStyle: 'dashed' }}>
                    <Trophy size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Standings will appear as registrations grow.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Department Details */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={24} color="var(--primary-blue)" /> Department Rankings
                    </h2>
                    <div className="card" style={{ padding: 0 }}>
                        {DEPARTMENTS.map((dept, index) => (
                            <div key={dept.id} style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: index < DEPARTMENTS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <div style={{ fontWeight: 900, color: 'var(--text-muted)', width: '20px' }}>#{index + 1}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{dept.name}</div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(dept.points / DEPARTMENTS[0].points) * 100}%`, height: '100%', backgroundColor: dept.color, transition: 'width 1s ease-out' }}></div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'var(--dark-blue)' }}>{dept.points}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{dept.registrations} regs</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Individual Top Performers */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Star size={24} color="#fbbf24" /> Top Performers
                    </h2>
                    <div className="card" style={{ padding: 0 }}>
                        {INDIVIDUALS.length > 0 ? INDIVIDUALS.map((person, index) => (
                            <div key={index} style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: index < INDIVIDUALS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: index === 0 ? '#fbbf24' : '#f1f5f9', color: index === 0 ? 'var(--dark-blue)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                    {person.avatar}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700 }}>{person.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dept: {person.dept}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Award size={16} /> {person.points}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Engagement Pts</div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No top performers yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
