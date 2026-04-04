import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Download, Users, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API_BASE_URL from '../../config';

const AdminDashboard = () => {
    const { events, addEvent, deleteEvent, registrations } = useAppContext();
    const [adminEvents, setAdminEvents] = useState(events || []);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        sub_events: ''
    });
    const [posterFile, setPosterFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (events && events.length > 0) {
            setAdminEvents(events);
        } else {
            setAdminEvents([]);
        }
    }, [events]);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleEditClick = (evt) => {
        setIsEditing(true);
        setEditId(evt.id);
        setFormData({
            title: evt.title,
            date: evt.date ? evt.date.substring(0, 10) : '',
            time: evt.time || '',
            venue: evt.venue || '',
            description: evt.description || '',
            sub_events: evt.sub_events || ''
        });
        setPosterFile(null);
        setSignatureFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this event? All associated student registrations will also be PERMANENTLY lost!")) return;
        await deleteEvent(id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await addEvent({ ...formData, poster: posterFile, signature: signatureFile });
            if (success) {
                alert(isEditing ? 'Event Updated!' : 'Event Created Successfully! Local storage has been updated.');
                setIsEditing(false);
                setFormData({title:'', date:'', time:'', venue:'', description:'', sub_events:''});
                setPosterFile(null);
                setSignatureFile(null);
            }
        } catch(err) {
             alert('Failed to save event. Check console for details.');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '0.25rem' }}>Event Management</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Create and manage events for the college fest.</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6" style={{ alignItems: 'start' }}>
                
                {/* Event Creation Form */}
                <div className="card lg:col-span-1">
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-blue)', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PlusCircle size={20} /> {isEditing ? 'Edit Event' : 'New Event'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label">Event Title</label>
                            <input type="text" name="title" className="input-field" placeholder="e.g. Hilaricas 2026" required value={formData.title} onChange={handleChange} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
                            <div>
                                <label className="label">Date</label>
                                <input type="date" name="date" className="input-field" required value={formData.date} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Time</label>
                                <input type="time" name="time" className="input-field" required value={formData.time} onChange={handleChange} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label">Venue</label>
                            <input type="text" name="venue" className="input-field" placeholder="e.g. Auditorium" required value={formData.venue} onChange={handleChange} />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label">Description</label>
                            <textarea name="description" className="input-field" placeholder="Rules and details..." rows="3" value={formData.description} onChange={handleChange}></textarea>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="label">Sub-Events</label>
                            <input type="text" name="sub_events" className="input-field" placeholder="Quiz, Dance, etc." value={formData.sub_events} onChange={handleChange} />
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Separate with commas.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <label className="label">Event Poster</label>
                                <input type="file" name="poster" accept="image/*" className="input-field" onChange={(e) => setPosterFile(e.target.files[0])} />
                            </div>
                            <div>
                                <label className="label">Coordinator Sig</label>
                                <input type="file" name="signature" accept="image/*" className="input-field" onChange={(e) => setSignatureFile(e.target.files[0])} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                                {isEditing ? 'Update Event' : 'Publish Event'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={() => {setIsEditing(false); setFormData({title:'', date:'', time:'', venue:'', description:'', sub_events:''}); setPosterFile(null);}} className="btn-dark" style={{ width: '100%', backgroundColor: '#f3f4f6', color: '#374151' }}>
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Event List */}
                <div className="lg:col-span-2">
                     <h2 style={{ fontSize: '1.25rem', color: 'var(--dark-blue)', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={20} /> Managed Events
                    </h2>
                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {adminEvents.length > 0 ? adminEvents.map(evt => (
                            <div key={evt.id} className="card" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ 
                                            width: '64px', height: '64px', minWidth: '64px', borderRadius: '12px', 
                                            backgroundImage: evt.poster_url ? 
                                                (evt.poster_url.startsWith('data:') || evt.poster_url.startsWith('http') ? `url(${evt.poster_url})` : (API_BASE_URL ? `url(${API_BASE_URL}${evt.poster_url})` : `url(${evt.poster_url})`)) 
                                                : 'linear-gradient(135deg, #0a2540 0%, #1ba1cd 100%)', 
                                            backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#e5e7eb' 
                                        }}></div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h3 style={{ color: 'var(--dark-blue)', fontWeight: 700, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.title}</h3>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {evt.date ? new Date(evt.date).toLocaleDateString() : 'TBD'} • {evt.venue}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                         <button 
                                            onClick={() => {
                                                const eventRegs = (registrations || []).filter(r => r.eventTitle === evt.title);
                                                if (eventRegs.length === 0) return alert('No registrations yet for this event.');
                                                
                                                const headers = ["ID", "Student Name", "Email", "Institution", "Department", "Sub-Events", "Date"];
                                                const rows = eventRegs.map(r => [r.id, r.studentName, r.email, r.institution, r.department, r.subEvents, r.date]);
                                                const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join("\n");
                                                const blob = new Blob([csv], { type: 'text/csv' });
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `Registrations_${evt.title.replace(/\s+/g,'_')}.csv`;
                                                a.click();
                                            }} 
                                            className="btn-dark" 
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.6rem', fontSize: '0.75rem' }}
                                         >
                                            <Download size={14} /> Data
                                         </button>
                                         <button onClick={() => handleEditClick(evt)} className="btn-dark" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.6rem', fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: '#374151' }}>
                                            <Edit size={14} /> Edit
                                         </button>
                                         <button onClick={() => handleDelete(evt.id)} className="btn-dark" style={{ padding: '0.6rem', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                                            <Trash2 size={16} />
                                         </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
                                No events created yet.
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
