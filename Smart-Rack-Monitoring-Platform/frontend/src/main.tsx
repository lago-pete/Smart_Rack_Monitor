import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n';
import i18n from 'i18next';

// Detect language BEFORE React renders
function detectLanguage() {
  const stored = (localStorage.getItem('i18nextLng') || '').toLowerCase();
  const system = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  return stored.startsWith('es') || system.startsWith('es') ? 'es' : 'en';
}

// Handle root path redirect
const currentPath = window.location.pathname;
if (currentPath === '/') {
  const lng = detectLanguage();
  i18n.changeLanguage(lng);
  window.location.replace(`/${lng}`);
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <Routes>
      {/* Match both en and es explicitly */}
      <Route path="en/*" element={<App />} />
      <Route path="es/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);