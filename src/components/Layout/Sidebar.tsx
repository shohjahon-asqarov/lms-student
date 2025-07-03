import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  BookOpen,
  User,
  Settings,
  LogOut,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Student-only menu items with enhanced icons and descriptions
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['STUDENT'],
      description: 'Umumiy ko\'rinish',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      path: '/quizzes',
      label: 'Mavjud testlar',
      icon: FileText,
      roles: ['STUDENT'],
      description: 'Testlarni ishlash',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      path: '/results',
      label: 'Natijalarim',
      icon: BarChart3,
      roles: ['STUDENT'],
      description: 'Test natijalari',
      gradient: 'from-green-500 to-emerald-500'
    },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || 'STUDENT')
  );

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white/95 backdrop-blur-md shadow-2xl z-50 
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:shadow-lg lg:bg-white
        w-72 flex flex-col border-r border-gray-200/50
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-indigo-600 to-purple-600">
          <span className="font-bold text-white text-xl tracking-wide">iTech Academy</span>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl 
                            flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName || 'Talaba'} {user?.lastName || ''}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Talaba
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300
                  hover:scale-105 hover:shadow-lg relative overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Background gradient for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90"></div>
                )}

                {/* Icon container */}
                <div className={`
                  relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${isActive
                    ? 'bg-white/20 backdrop-blur-sm'
                    : `bg-gradient-to-r ${item.gradient} text-white shadow-md group-hover:shadow-lg group-hover:scale-110`
                  }
                `}>
                  <Icon className="w-5 h-5 relative z-10" />
                </div>

                {/* Text content */}
                <div className="relative z-10 flex-1">
                  <span className="font-semibold text-sm">{item.label}</span>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="relative z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            );
          })}

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Tezkor statistika
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Ishlangan testlar</span>
                <span className="font-semibold text-blue-600">12</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">O'rtacha ball</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Streak</span>
                <span className="font-semibold text-orange-600 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  7 kun
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 
                     hover:text-red-600 rounded-2xl transition-all duration-300 hover:scale-105
                     group"
          >
            <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-xl 
                          flex items-center justify-center transition-all duration-300">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <span className="font-semibold text-sm">Chiqish</span>
              <p className="text-xs text-gray-500">Tizimdan chiqish</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;