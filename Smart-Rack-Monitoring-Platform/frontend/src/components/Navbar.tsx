import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { logout } = useAuthStore();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Extract language from current path: /en/something -> en
  const lng = location.pathname.split('/')[1] || 'en';

  const switchLanguage = () => {
    const next = lng === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
    
    // Replace language in current path
    const newPath = location.pathname.replace(`/${lng}`, `/${next}`);
    navigate(newPath, { replace: false });
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Title */}
          <div className="flex items-center space-x-2">
            <Link
              to={`/${lng}`}
              className="text-xl font-bold text-gray-800"
            >
              {t('appTitle')}
            </Link>

            {/* Language switch button */}
            <button
              onClick={switchLanguage}
              className="text-sm text-gray-600 hover:text-gray-800 border rounded px-2 py-1"
            >
              {lng === 'en' ? 'ES' : 'EN'}
            </button>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            <Link
              to={`/${lng}/profile`}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() => logout()}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}