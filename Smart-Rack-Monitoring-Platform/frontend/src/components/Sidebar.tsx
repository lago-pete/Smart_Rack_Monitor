import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Extract language from current path: /en/something -> en
  const lng = location.pathname.split('/')[1] || 'en';

  const links = [
    { to: `/${lng}`, icon: Home, label: t('sidebar.home') },
    { to: `/${lng}/reports`, icon: FileText, label: t('sidebar.reports') },
    { to: `/${lng}/device-config`, icon: Settings, label: t('sidebar.deviceConfig') },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="mt-8 space-y-2 px-4">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              location.pathname === to
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}