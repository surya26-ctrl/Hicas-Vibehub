import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/Dashboard'; // Using the one with Create/Edit logic
import Registrations from './pages/admin/Registrations';
import AdminSettings from './pages/admin/Settings';
import Leaderboard from './pages/Leaderboard';
import Support from './pages/student/Support';
import AdminFeedback from './pages/admin/Feedback';
import InterCollege from './pages/admin/InterCollege';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAppContext();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  
  return children;
};

const EventsRedirect = () => {
    const { user } = useAppContext();
    if (!user) return <Navigate to="/#events" />;
    if (user.role === 'admin') return <Navigate to="/admin/events" />;
    return <Navigate to="/student/events" />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<EventsRedirect />} />

        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRole="student">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="events" element={<StudentDashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="inter-college" element={<InterCollege />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
