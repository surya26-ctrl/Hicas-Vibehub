import React, { useState, useEffect } from 'react';
import { Users, Calendar, Database, TrendingUp, BarChart2, PieChart as PieChartIcon, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import API_BASE_URL from '../../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const MOCK_STATS = {
        totalUsers: 0,
        totalEvents: 0,
        totalRegistrations: 0,
        deptStats: [],
        eventStats: [],
        institutionStats: [
            { name: 'HICAS (Internal)', value: 0 },
            { name: 'Other Colleges (External)', value: 0 }
        ]
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/events/stats`);
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                } else {
                    setStats(MOCK_STATS);
                }
            } catch (err) {
                console.warn("Backend down, using mock data for analytics");
                setStats(MOCK_STATS);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const COLORS = ['#0a2540', '#1ba1cd', '#fbbf24', '#10b981', '#6366f1', '#f43f5e'];

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Analytics...</div>;

    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-blue)', marginBottom: '0.25rem' }}>Management Overview</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real-time analytics for HICAS VibeHub platform.</p>
                </div>
                <button 
                    onClick={() => window.location.href = '/admin/inter-college'} 
                    className="btn-dark" 
                    style={{ fontSize: '0.8rem', padding: '0.6rem 1.25rem', borderRadius: '50px', backgroundColor: '#f0f9ff', color: 'var(--primary-blue)', border: '1px solid var(--primary-blue)' }}
                >
                    Inter-College Module →
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#f0f9ff', color: 'var(--primary-blue)', padding: '1rem', borderRadius: '12px' }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Students</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-blue)', lineHeight: 1 }}>{stats?.totalUsers || 0}</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#fff7ed', color: '#f97316', padding: '1rem', borderRadius: '12px' }}>
                        <Calendar size={32} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Events</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-blue)', lineHeight: 1 }}>{stats?.totalEvents || 0}</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#f0fdf4', color: '#10b981', padding: '1rem', borderRadius: '12px' }}>
                        <Database size={32} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registrations</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-blue)', lineHeight: 1 }}>{stats?.totalRegistrations || 0}</div>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
                {/* Department Participation */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '1.125rem', fontWeight: 700 }}>
                        <BarChart2 size={20} color="var(--primary-blue)" /> Department-wise Participation
                    </h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={stats?.deptStats || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="count" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Event Popularity */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '1.125rem', fontWeight: 700 }}>
                        <PieChartIcon size={20} color="#f97316" /> Event Registration Split
                    </h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats?.eventStats || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="title"
                                >
                                    {(stats?.eventStats || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Institution Participation */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '1.125rem', fontWeight: 700 }}>
                        <Users size={20} color="#10b981" /> HICAS vs External Participants
                    </h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats?.institutionStats || MOCK_STATS.institutionStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    <Cell fill="var(--dark-blue)" />
                                    <Cell fill="var(--primary-blue)" />
                                </Pie>
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row - More Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', backgroundColor: 'var(--dark-blue)', color: 'white', padding: '2.5rem' }}>
                    <Award size={48} style={{ margin: '0 auto 1.5rem', color: '#fbbf24' }} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Engagement Rate</div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fbbf24', lineHeight: 1 }}>
                        {stats?.totalUsers > 0 ? Math.round((stats.totalRegistrations / stats.totalUsers) * 100) : 0}%
                    </div>
                    <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Average registrations per student</p>
                 </div>

                 <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 700 }}>
                        <TrendingUp size={20} color="#10b981" /> Participation Trend
                    </h3>
                    <div style={{ height: '200px', width: '100%' }}>
                         <ResponsiveContainer>
                             <LineChart data={(stats?.eventStats || []).map(e => ({ name: e.title || e.department, count: e.count }))}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                 <XAxis dataKey="name" hide />
                                 <YAxis hide />
                                 <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                 <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                             </LineChart>
                         </ResponsiveContainer>
                         <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Registration volume across scheduled events</p>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
