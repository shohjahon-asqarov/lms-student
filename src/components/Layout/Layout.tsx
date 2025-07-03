import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 lg:p-6">
            <div className="mx-auto">
              <Outlet />
            </div>
          </main>

          <footer className="w-full text-center py-4 text-gray-400 text-sm border-t border-gray-100 mt-8">
            {/* Test mode notification bar */}
            <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 flex items-center justify-center py-2 px-4 text-sm font-medium shadow-sm mb-2">
              <span>Sayt test rejimida ishlamoqda. Kamchilik yoki takliflaringiz bo‘lsa, bizga xabar bering.</span>
              <a
                href="https://t.me/shohjahon_asqarov"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 px-3 py-1 rounded bg-yellow-300 text-yellow-900 font-semibold hover:bg-yellow-400 transition-all"
              >
                Fikr bildirish / Aloqa
              </a>
            </div>
            © {new Date().getFullYear()} iTech Academy. Barcha huquqlar himoyalangan.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;