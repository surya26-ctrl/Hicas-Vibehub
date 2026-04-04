import React from 'react';
import { Star, MessageCircle, BarChart2, TrendingUp, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminFeedback = () => {
    const { feedback } = useAppContext();

    const stats = [
        { label: 'Total Reviews', value: feedback?.length || 0, icon: MessageCircle, color: 'var(--primary-blue)' },
        { label: 'Avg. Rating', value: feedback?.length ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1) : 0, icon: Star, color: '#fbbf24' },
        { label: 'Net Satisfaction', value: feedback?.length ? Math.round((feedback.filter(f => f.rating >= 4).length / feedback.length) * 100) + '%' : '0%', icon: TrendingUp, color: '#10b981' },
    ];

    const ratingCounts = [1, 2, 3, 4, 5].map(star => ({
        rating: `${star} Star`,
        count: (feedback || []).filter(f => f.rating === star).length
    }));

    const COLORS = ['#ef4444', '#f97316', '#fbbf24', '#3b82f6', '#10b981'];

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>Sentiment Analysis</h1>
                <p style={{ color: 'var(--text-muted)' }}>Analyze student feedback and event performance metrics.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
                {stats.map((s, i) => (
                    <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: `${s.color}15`, color: s.color }}>
                            <s.icon size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-blue)' }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribution Chart */}
                <div className="card">
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--dark-blue)' }}>Rating Distribution</h2>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ratingCounts}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {ratingCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Latest Reviews */}
                <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark-blue)' }}>Recent Comments</h2>
                    </div>
                    <div style={{ maxHeight: '315px', overflowY: 'auto', padding: '0.5rem 1rem' }}>
                        {(feedback || []).slice(0, 10).map((f, i) => (
                            <div key={i} style={{ padding: '1rem', borderBottom: i === 9 ? 'none' : '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark-blue)' }}>{f.studentName}</div>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[1,2,3,4,5].map(star => <Star key={star} size={12} fill={star <= f.rating ? '#fbbf24' : 'none'} color={star <= f.rating ? '#fbbf24' : '#e2e8f0'} />)}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{f.eventTitle} • {f.date}</div>
                                <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>"{f.comment}"</p>
                            </div>
                        ))}
                        {(!feedback || feedback.length === 0) && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No feedback received yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFeedback;
