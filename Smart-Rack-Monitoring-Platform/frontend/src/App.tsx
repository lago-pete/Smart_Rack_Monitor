import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import DeviceConfig from './pages/DeviceConfig';
import ProtectedRoute from './components/ProtectedRoute';

function LocaleSync() {
  const location = useLocation();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Extract language from path: /en/something or /es/something
    const lng = location.pathname.split('/')[1];
    if ((lng === 'en' || lng === 'es') && i18n.language !== lng) {
      i18n.changeLanguage(lng);
      document.documentElement.lang = lng;
    }
  }, [location.pathname, i18n]);
  
  return null;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <LocaleSync />

      <Routes>
        {/* Public (auth) routes — NOTE: relative paths (no leading /) */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Private area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="info/:deviceName" element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="device-config" element={<DeviceConfig />} />
          </Route>
        </Route>

        {/* 404 within locale -> back to locale root */}
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
}