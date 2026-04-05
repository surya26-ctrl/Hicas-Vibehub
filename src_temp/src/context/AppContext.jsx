import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AppContext = createContext();

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [signatures, setSignatures] = useState({ principal: '' });
  const [feedback, setFeedback] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from API / Fallback to LocalStorage
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const localUser = localStorage.getItem('vibeHubUser');
        if (localUser) setUser(JSON.parse(localUser));

        const [eventsRes, regsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events`),
          fetch(`${API_BASE_URL}/api/registrations`),
          fetch(`${API_BASE_URL}/api/events/stats`)
        ]);

        if (eventsRes.ok) {
           const data = await eventsRes.json();
           setEvents(data.events || []);
        }

        if (regsRes.ok) {
           const data = await regsRes.json();
           setRegistrations(data.registrations || []);
        }

      } catch (err) {
        console.warn('API Error, falling back to local data');
        const localEvents = localStorage.getItem('vibeHubEvents');
        if (localEvents) setEvents(JSON.parse(localEvents));
        
        const localRegs = localStorage.getItem('vibeHubRegistrations');
        if (localRegs) setRegistrations(JSON.parse(localRegs));
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const addEvent = async (eventData) => {
    try {
        const posterUrl = eventData.poster instanceof File ? await convertToBase64(eventData.poster) : (eventData.poster_url || '');
        const coordSig = eventData.signature instanceof File ? await convertToBase64(eventData.signature) : (eventData.coordinatorSignature || '');

        const newEvent = { 
            ...eventData, 
            poster_url: posterUrl,
            coordinatorSignature: coordSig
        };
        
        const response = await fetch(`${API_BASE_URL}/api/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        if (response.ok) {
            const data = await response.json();
            const updated = [{ ...newEvent, id: data.id }, ...events];
            setEvents(updated);
            localStorage.setItem('vibeHubEvents', JSON.stringify(updated));
            return true;
        }
        return false;
    } catch (err) {
        console.error("Failed to add event:", err);
        return false;
    }
  };

  const addFeedback = (eventTitle, rating, comment) => {
      const newFeed = {
          id: Date.now(),
          studentName: user.name,
          eventTitle,
          rating,
          comment,
          date: new Date().toLocaleDateString()
      };
      const updatedFeed = [newFeed, ...(feedback || [])];
      setFeedback(updatedFeed);
      localStorage.setItem('vibeHubFeedback', JSON.stringify(updatedFeed));
  };

  const deleteEvent = async (id) => {
    try {
        const updatedEvents = (events || []).filter(e => e.id !== id);
        setEvents(updatedEvents);
        localStorage.setItem('vibeHubEvents', JSON.stringify(updatedEvents));

        // Silent API attempt
        fetch(`${API_BASE_URL}/api/events/${id}`, { method: 'DELETE' }).catch(() => {});
        return true;
    } catch (err) {
        console.error("Delete failed:", err);
        return false;
    }
  };

  const resetData = (password) => {
      if (password === 'admin123') {
          const keysToRemove = [
              'vibeHubEvents', 
              'vibeHubRegistrations', 
              'vibeHubFeedback', 
              'vibeHubSignatures', 
              'vibeHubUsers',
              'vibeHubSystemSettings'
          ];
          keysToRemove.forEach(k => localStorage.removeItem(k));
          
          // Force state update and reload
          setEvents([]);
          setRegistrations([]);
          setFeedback([]);
          setSignatures({ principal: '' });
          
          window.location.reload();
          return true;
      }
      return false;
  };

  const login = async (email, password, role) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            setUser(data.user);
            localStorage.setItem('vibeHubUser', JSON.stringify(data.user));
            return true;
        }
        return false;
    } catch(e) {
        console.error("Login Error:", e);
        return false;
    }
  };

  const registerForEvent = async (eventId, subEvents) => {
    const event = events.find(e => e.id === eventId);
    const newReg = {
        eventId: eventId,
        studentName: user.name,
        email: user.email,
        institution: user.institution || 'HICAS',
        eventTitle: event?.title || 'Unknown Event',
        department: user.department || 'General',
        subEvents: Array.isArray(subEvents) ? subEvents.join(', ') : (typeof subEvents === 'string' ? subEvents : 'Standard Entry'),
        date: new Date().toISOString().split('T')[0]
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/registrations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReg)
        });

        if (response.ok) {
            const updatedRegs = [newReg, ...registrations];
            setRegistrations(updatedRegs);
            localStorage.setItem('vibeHubRegistrations', JSON.stringify(updatedRegs));
            return true;
        }
        return false;
    } catch (err) {
        console.error("Registration failed:", err);
        return false;
    }
  };

  const updateCertificateStatus = (regId, status) => {
    const updatedRegs = registrations.map(reg => 
        reg.id === regId ? { ...reg, certificate_status: status } : reg
    );
    setRegistrations(updatedRegs);
    localStorage.setItem('vibeHubRegistrations', JSON.stringify(updatedRegs));
    return true;
  };

  const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        return response.ok && data.success;
    } catch (err) {
        console.error("Registration Error:", err);
        return false;
    }
  };

  const updateSignatures = (newSignatures) => {
    const updated = { principal: newSignatures.principal || signatures.principal };
    setSignatures(updated);
    localStorage.setItem('vibeHubSignatures', JSON.stringify(updated));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibeHubUser');
  };

  return (
    <AppContext.Provider value={{ 
        user, setUser, 
        events, setEvents, 
        registrations, setRegistrations,
        feedback, addFeedback,
        signatures, updateSignatures,
        allUsers, setAllUsers,
        resetData, addEvent, deleteEvent, login, logout, registerForEvent, updateCertificateStatus, registerUser, loading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
