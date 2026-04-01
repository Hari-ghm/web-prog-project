import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import GlobalWeather from './pages/GlobalWeather';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Group */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="energy" element={<Energy />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<Admin />} />
            <Route path="global-weather" element={<GlobalWeather />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
