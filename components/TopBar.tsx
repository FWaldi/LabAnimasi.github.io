import React from 'react';
import { Mail, Phone, MapPin, Search, Facebook, Instagram, Youtube } from 'lucide-react';

const TopBar: React.FC = () => {
  return (
    <div className="bg-unp-accent text-white text-xs py-2 hidden md:block">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Mail size={14} className="text-unp-secondary" />
            <span>vokasi@unp.ac.id</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={14} className="text-unp-secondary" />
            <span>(0751) 123456</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-unp-secondary" />
            <span>Jl. Hamka Air Tawar, Padang</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 border-r border-gray-600 pr-4">
            <a href="#" className="hover:text-unp-secondary transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-unp-secondary transition-colors"><Instagram size={14} /></a>
            <a href="#" className="hover:text-unp-secondary transition-colors"><Youtube size={14} /></a>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded">
            <input 
              type="text" 
              placeholder="Cari..." 
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-24 focus:w-32 transition-all"
            />
            <Search size={14} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;