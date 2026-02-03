import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LogOut, Menu, X, Bell, User, LayoutGrid, 
  ChevronRight, Search 
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  title: string;
  menuItems: MenuItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  title, menuItems, activeTab, onTabChange, children 
}) => {
  const { user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 transform 
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'} 
          lg:static lg:block shadow-xl flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {sidebarOpen ? (
             <div className="flex items-center gap-2 px-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-slate-900">L</div>
                <span className="font-bold text-lg tracking-wide">LAB ANIMASI</span>
             </div>
          ) : (
             <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-slate-900">L</div>
          )}
        </div>

        {/* User Profile Mini */}
        <div className={`p-4 border-b border-slate-800 ${!sidebarOpen && 'hidden'}`}>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                 <User size={20} className="text-gray-300" />
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold truncate">{user?.name}</p>
                 <p className="text-xs text-slate-400 uppercase">{user?.role}</p>
              </div>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                ${activeTab === item.id 
                  ? 'bg-yellow-500 text-slate-900 font-bold shadow-lg shadow-yellow-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <div className={activeTab === item.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'}>
                {item.icon}
              </div>
              <span className={`${!sidebarOpen && 'lg:hidden'} origin-left duration-200`}>
                {item.label}
              </span>
              {activeTab === item.id && sidebarOpen && (
                 <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className={`${!sidebarOpen && 'lg:hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
           </div>

           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64" />
                 <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
           </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
           {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;