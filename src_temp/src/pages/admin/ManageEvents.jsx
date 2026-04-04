import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Edit, Trash2, Search, Filter, Download } from 'lucide-react';
import API_BASE_URL from '../../config';

const ManageEvents = () => {
    const { events, deleteEvent } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure? All registrations for this event will be lost.")) return;
        const success = await deleteEvent(id);
        if (success) {
            // Optional: state should update automatically via context, 
            // but if we used a direct page reload before, we can keep it if needed.
            // window.location.reload(); 
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-blue)' }}>Manage All Events</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search events..." 
                            className="input-field" 
                            style={{ paddingLeft: '35px', width: '300px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>EVENT DETAILS</th>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>DATE / TIME</th>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>VENUE</th>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(evt => (
                            <tr key={evt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            borderRadius: '8px', 
                                            backgroundImage: evt.poster_url ? 
                                                (evt.poster_url.startsWith('data:') || evt.poster_url.startsWith('http') ? `url(${evt.poster_url})` : (API_BASE_URL ? `url(${API_BASE_URL}${evt.poster_url})` : `url(${evt.poster_url})`)) 
                                                : 'linear-gradient(135deg, #0a2540 0%, #1ba1cd 100%)',
                                            backgroundSize: 'cover', backgroundPosition: 'center'
                                        }}></div>
                                        <span style={{ fontWeight: 600, color: 'var(--dark-blue)' }}>{evt.title}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--dark-blue)' }}>{new Date(evt.date).toDateString()}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.time || 'TBD'}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{evt.venue}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-dark" style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', color: '#475569' }}><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(evt.id)} className="btn-dark" style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#ef4444' }}><Trash2 size={16}/></button>
                                        {evt.excel_sheet_url && (
                                            <a href={`${API_BASE_URL}${evt.excel_sheet_url}`} download className="btn-dark" style={{ padding: '0.5rem', backgroundColor: '#dcfce7', color: '#166534' }}><Download size={16}/></a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageEvents;
