import React from 'react';
import { Mail, Phone, MapPin, ChevronRight, Facebook, Instagram, Youtube, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-unp-accent text-gray-300 pt-16 pb-8 border-t-4 border-unp-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
             <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                   <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Logo_Universitas_Negeri_Padang.svg/1200px-Logo_Universitas_Negeri_Padang.svg.png" 
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                   />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-none">Lab Animasi</h3>
                  <p className="text-xs text-gray-400">Universitas Negeri Padang</p>
                </div>
              </div>
            <p className="text-sm leading-relaxed mb-6">
              Melayani kebutuhan praktikum, penelitian, dan produksi karya digital civitas akademika Fakultas Vokasi UNP dengan standar industri.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-unp-secondary hover:text-white transition-colors"><Facebook size={16} /></a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-unp-secondary hover:text-white transition-colors"><Instagram size={16} /></a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-unp-secondary hover:text-white transition-colors"><Youtube size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Layanan Lab
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-unp-secondary rounded"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {['Prosedur Peminjaman', 'Cek Ketersediaan Alat', 'Lapor Kerusakan', 'Jadwal Asisten', 'Download Software', 'Pengajuan Bebas Lab'].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center hover:text-unp-secondary transition-colors group">
                    <ChevronRight size={14} className="mr-2 text-gray-500 group-hover:text-unp-secondary" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
             <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-unp-secondary rounded"></span>
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-unp-secondary shrink-0 mt-1" />
                <span>
                  Gedung Laboratorium Terpadu,<br />
                  Lantai 3, Fakultas Vokasi UNP,<br />
                  Air Tawar, Padang
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-unp-secondary shrink-0" />
                <span>+62 812 3456 7890 (Teknisi)</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-unp-secondary shrink-0" />
                <span>lab.animasi@unp.ac.id</span>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mr-3 text-unp-secondary shrink-0 mt-1" />
                <span>
                  Senin - Jumat: 08:00 - 16:00<br />
                  Sabtu: 08:00 - 12:00 (Perjanjian)
                </span>
              </li>
            </ul>
          </div>

          {/* Location / QR */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              SOP Online
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-unp-secondary rounded"></span>
            </h4>
            <div className="bg-white p-4 rounded-lg inline-block">
               {/* QR Code Placeholder */}
               <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=SOP_Lab_Animasi_UNP" 
                alt="QR Code SOP"
                className="w-32 h-32"
               />
            </div>
            <p className="text-xs text-gray-500 mt-2">Scan untuk membaca tata tertib lab</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Laboratorium Animasi - Universitas Negeri Padang.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Tata Tertib</a>
            <a href="#" className="hover:text-white">Form Peminjaman</a>
            <a href="#" className="hover:text-white">Login Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;