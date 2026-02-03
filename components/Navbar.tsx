import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { user, logout, navigateTo, currentPage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: 'home' | 'showcase' | 'info' | 'login') => {
    navigateTo(page);
    setIsOpen(false);
  };

  const activeClass = (page: string) => currentPage === page ? 'text-unp-primary font-bold' : 'text-gray-700 hover:text-unp-primary font-medium';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4 shadow-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-full flex items-center justify-center shrink-0">
               <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Logo_Universitas_Negeri_Padang.svg/1200px-Logo_Universitas_Negeri_Padang.svg.png" 
                alt="Logo UNP"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
               />
            </div>
            <div>
              <h1 className="font-bold text-unp-primary text-lg md:text-xl leading-tight">Laboratorium Animasi</h1>
              <p className="text-xs md:text-sm text-gray-600 font-medium tracking-wide">SISTEM INTEGRASI VOKASI</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <button onClick={() => handleNav('home')} className={activeClass('home')}>Beranda</button>
            <button onClick={() => handleNav('showcase')} className={activeClass('showcase')}>Showcase Karya</button>
            <button onClick={() => handleNav('info')} className={activeClass('info')}>Info Lab</button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-unp-secondary uppercase font-semibold">{user.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigateTo('login')}
                className="px-6 py-2 bg-unp-primary text-white font-bold rounded-full hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
              >
                <User size={16} /> Portal Login
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-gray-700 hover:text-unp-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 flex flex-col space-y-2">
            <button onClick={() => handleNav('home')} className="py-2 text-left px-2 hover:bg-gray-50">Beranda</button>
            <button onClick={() => handleNav('showcase')} className="py-2 text-left px-2 hover:bg-gray-50">Showcase Karya</button>
            <button onClick={() => handleNav('info')} className="py-2 text-left px-2 hover:bg-gray-50">Info Lab</button>
            {!user ? (
               <button onClick={() => handleNav('login')} className="py-3 mt-2 text-center bg-unp-primary text-white rounded">Portal Login</button>
            ) : (
               <button onClick={logout} className="py-3 mt-2 text-center bg-red-100 text-red-600 rounded">Logout</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;