import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, TrendingUp, Users, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Leaderboard = () => {
    const { registrations, allUsers } = useAppContext();
    const [loading, setLoading] = useState(true);

    const DEPARTMENTS = [];
    const INDIVIDUALS = [];

    // Derive Department Stats
    const deptMap = {};
    (registrations || []).forEach(reg => {
        if (!deptMap[reg.department]) {
            deptMap[reg.department] = { id: reg.department, name: reg.department, points: 0, registrations: 0, color: '#1ba1cd' };
        }
        deptMap[reg.department].points += 10;
        deptMap[reg.department].registrations += 1;
    });

    const sortedDepts = Object.values(deptMap).sort((a, b) => b.points - a.points);
    const DEPARTMENTS_DATA = sortedDepts.length > 0 ? sortedDepts : [
        { id: 1, name: 'Computer Science', points: 0, registrations: 0, color: '#0a2540' },
        { id: 2, name: 'Information Technology', points: 0, registrations: 0, color: '#1ba1cd' },
        { id: 3, name: 'Commerce', points: 0, registrations: 0, color: '#fbbf24' }
    ];

    // Derive Individual Stats
    const userMap = {};
    (registrations || []).forEach(reg => {
        if (!userMap[reg.email]) {
            userMap[reg.email] = { name: reg.studentName, dept: reg.department, points: 0, avatar: reg.studentName.charAt(0) };
        }
        userMap[reg.email].points += 10;
    });

    const INDIVIDUALS_DATA = Object.values(userMap).sort((a, b) => b.points - a.points).slice(0, 10);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Synchronizing Campus Standings...</div>;

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>Campus Leaderboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time standings of HICAS departments and top performers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '3rem', alignItems: 'flex-end' }}>
                {/* 2nd Place */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', borderBottom: '4px solid #94a3b8', order: 2 }}>
                    <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 1rem' }}>
                        <Medal size={60} color="#94a3b8" />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>2</span>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{DEPARTMENTS_DATA[1]?.name || 'TBD'}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{DEPARTMENTS_DATA[1]?.points || 0} pts</div>
                </div>

                {/* 1st Place */}
                <div className="premium-card" style={{ textAlign: 'center', padding: '3rem 2rem', borderBottom: '4px solid #fbbf24', transform: 'scale(1.05)', order: 1 }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
                        <Trophy size={80} color="#fbbf24" strokeWidth={2.5} />
                        <span style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, color: 'var(--dark-blue)', fontSize: '1.5rem' }}>1</span>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--dark-blue)' }}>{DEPARTMENTS_DATA[0]?.name || 'TBD'}</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-blue)' }}>{DEPARTMENTS_DATA[0]?.points || 0} pts</div>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CROWNED CHAMPIONS</div>
                </div>

                {/* 3rd Place */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', borderBottom: '4px solid #b45309', order: 3 }}>
                    <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 1rem' }}>
                        <Medal size={60} color="#b45309" />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>3</span>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{DEPARTMENTS_DATA[2]?.name || 'TBD'}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{DEPARTMENTS_DATA[2]?.points || 0} pts</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Department Details */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={24} color="var(--primary-blue)" /> Department Rankings
                    </h2>
                    <div className="card" style={{ padding: 0 }}>
                        {DEPARTMENTS_DATA.map((dept, index) => (
                            <div key={dept.id} style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: index < DEPARTMENTS_DATA.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <div style={{ fontWeight: 900, color: 'var(--text-muted)', width: '20px' }}>#{index + 1}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{dept.name}</div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(DEPARTMENTS_DATA[0].points > 0 ? (dept.points / DEPARTMENTS_DATA[0].points) * 100 : 0)}%`, height: '100%', backgroundColor: dept.color, transition: 'width 1s ease-out' }}></div>
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
                        {INDIVIDUALS_DATA.length > 0 ? INDIVIDUALS_DATA.map((person, index) => (
                            <div key={index} style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: index < INDIVIDUALS_DATA.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
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
