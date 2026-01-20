import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/auth';
import { loginUser } from '../lib/api';

export default function Login() {
  const { t } = useTranslation();
  const location = useLocation();
  const lng = location.pathname.split('/')[1] || 'en';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    try {
        console.log("Attempting to log in with:", userData);
        const response = await loginUser(userData); 
        const token = response.data.token;
        setToken(token);
        localStorage.setItem('authToken', token);
        console.log("Login successful!");
        console.log("Navigating to home page");
        navigate(`/${lng}`);
    } catch (error: unknown) {
        console.log("Error caught in catch block");
        if (error instanceof Error) {
            console.error("Login error:", error.message);
        } else {
            console.error("Login error:", error);
        }
        alert(t('auth.loginFailed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.login')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.email')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.password')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to={`/${lng}/reset-password`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('auth.loginButton')}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            to={`/${lng}/register`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {t('auth.noAccount')} {t('auth.registerHere')}
          </Link>
        </div>
      </div>
    </div>
  );
}