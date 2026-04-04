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

  // Initialize from LocalStorage (Sync for Netlify/Static Hosting)
  useEffect(() => {
    const localUser = localStorage.getItem('vibeHubUser');
    if (localUser) setUser(JSON.parse(localUser));

    const localRegistrations = localStorage.getItem('vibeHubRegistrations');
    if (localRegistrations) setRegistrations(JSON.parse(localRegistrations));

    const localSignatures = localStorage.getItem('vibeHubSignatures');
    if (localSignatures) {
      setSignatures(JSON.parse(localSignatures));
    } else {
      setSignatures({ principal: '' });
    }

    const localEvents = localStorage.getItem('vibeHubEvents');
    if (localEvents) {
      setEvents(JSON.parse(localEvents));
    } else {
      // Default Mock Events for HICAS
      const initialEvents = [];
      setEvents(initialEvents);
      localStorage.setItem('vibeHubEvents', JSON.stringify(initialEvents));
    }

    const localRegs = localStorage.getItem('vibeHubRegistrations');
    if (localRegs) {
      setRegistrations(JSON.parse(localRegs));
    } else {
      const mockRegs = [];
      setRegistrations(mockRegs);
      localStorage.setItem('vibeHubRegistrations', JSON.stringify(mockRegs));
    }

    const localFeedback = localStorage.getItem('vibeHubFeedback');
    if (localFeedback) {
      setFeedback(JSON.parse(localFeedback));
    } else {
      const initialFeed = [];
      setFeedback(initialFeed);
      localStorage.setItem('vibeHubFeedback', JSON.stringify(initialFeed));
    }

    const localUsers = localStorage.getItem('vibeHubUsers');
    if (localUsers) {
      setAllUsers(JSON.parse(localUsers));
    } else {
      const initialUsers = [
          { name: 'Admin Account', email: 'admin@hicas.ac.in', role: 'admin', department: 'Administration' },
          { name: 'Demo Student', email: 'student@hicas.ac.in', role: 'student', department: 'Computer Science' }
      ];
      setAllUsers(initialUsers);
      localStorage.setItem('vibeHubUsers', JSON.stringify(initialUsers));
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events`);
        if (response.ok) {
          const data = await response.json();
          if (data.events && data.events.length > 0) {
            setEvents(data.events);
            localStorage.setItem('vibeHubEvents', JSON.stringify(data.events));
          }
        }
      } catch (err) {
        console.warn('Using LocalStorage data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    try {
        const posterUrl = eventData.poster instanceof File ? await convertToBase64(eventData.poster) : (eventData.poster_url || '');
        const coordSig = eventData.signature instanceof File ? await convertToBase64(eventData.signature) : (eventData.coordinatorSignature || '');

        const newEvent = { 
            ...eventData, 
            id: eventData.id || Date.now(),
            poster_url: posterUrl,
            coordinatorSignature: coordSig
        };
        
        let updatedEvents;
        const existingIndex = events.findIndex(e => e.id === newEvent.id);
        
        if (existingIndex > -1) {
            updatedEvents = events.map(e => e.id === newEvent.id ? newEvent : e);
        } else {
            updatedEvents = [newEvent, ...events];
        }
        
        setEvents(updatedEvents);
        localStorage.setItem('vibeHubEvents', JSON.stringify(updatedEvents));

        // Optional Backend Sync
        try {
            const method = eventData.id ? 'PUT' : 'POST';
            const url = eventData.id ? `${API_BASE_URL}/api/events/${eventData.id}` : `${API_BASE_URL}/api/events`;
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent)
            });
        } catch (e) {
            console.log("Sync skipped in offline/demo mode");
        }
        return true;
    } catch (err) {
        console.error("Failed to add/update event:", err);
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
        
        const data = await response.json().catch(() => ({}));
        
        if (response.ok && data.success) {
            setUser(data.user);
            localStorage.setItem('vibeHubUser', JSON.stringify(data.user));
            return true;
        }
        throw new Error('Login failed');
    } catch(e) {
        console.warn("Login fallback initiated...");
        // Mock Login for Netlify Demo
        const baseUser = { 
            id: email === 'admin@hicas.ac.in' ? 1 : 2, 
            name: email === 'admin@hicas.ac.in' ? 'Admin' : 'Student', 
            role: email === 'admin@hicas.ac.in' ? 'admin' : 'student',
            email: email,
            department: 'Computer Science' 
        };
        
        const lowerEmail = email.toLowerCase().trim();
        const trimmedPass = password.trim();

        // Check if user exists in local registered users
        const localUsers = JSON.parse(localStorage.getItem('vibeHubUsers') || '[]');
        const foundUser = localUsers.find(u => u.email.toLowerCase() === lowerEmail && u.password === trimmedPass && u.role === role);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('vibeHubUser', JSON.stringify(foundUser));
            return true;
        }

        if ((lowerEmail === 'admin@hicas.ac.in' && trimmedPass === 'admin123' && role === 'admin') || 
            (lowerEmail === 'student@hicas.ac.in' && trimmedPass === 'student123' && role === 'student')) {
            setUser(baseUser);
            localStorage.setItem('vibeHubUser', JSON.stringify(baseUser));
            return true;
        }
        return false;
    }
  };

  const registerForEvent = async (eventId, subEvents) => {
    const event = events.find(e => e.id === eventId);
    const newReg = {
        id: Date.now(),
        eventId: eventId,
        studentName: user.name,
        email: user.email,
        institution: user.institution || 'HICAS',
        eventTitle: event?.title || 'Unknown Event',
        department: user.department || 'General',
        subEvents: Array.isArray(subEvents) ? subEvents.join(', ') : (typeof subEvents === 'string' ? subEvents : 'Standard Entry'),
        date: new Date().toISOString().split('T')[0]
    };

    const updatedRegs = [newReg, ...registrations];
    setRegistrations(updatedRegs);
    localStorage.setItem('vibeHubRegistrations', JSON.stringify(updatedRegs));

    return true;
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
        const data = await response.json().catch(() => ({}));
        if (response.ok && data.success) return true;
        throw new Error(data.message || 'Server error');
    } catch (err) {
        const newUser = { ...userData, id: Date.now() };
        const existingUsers = JSON.parse(localStorage.getItem('vibeHubUsers') || '[]');
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('vibeHubUsers', JSON.stringify(updatedUsers));
        setAllUsers(updatedUsers);
        return true;
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
