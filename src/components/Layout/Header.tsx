import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, Search, User, Sun, Moon, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <>
      <header className="sticky top-10 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-gray-900 gradient-text">
                Xush kelibsiz, {user?.firstName || 'Foydalanuvchi'}! 👋
              </h2>
              <p className="text-sm text-gray-500 mt-1">Bugun testlaringizda nimalar bo'layapti?</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Settings */}
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full 
                              flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300
                              hover:scale-105 cursor-pointer">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName || 'Foydalanuvchi'} {user?.lastName || ''}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.toLowerCase() === 'student' ? 'Talaba' : user?.role?.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;