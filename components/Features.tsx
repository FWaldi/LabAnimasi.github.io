import React from 'react';
import { Monitor, Cpu, Mic2, Move3d } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, specs: string }> = ({ icon, title, desc, specs }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
    <div className="w-14 h-14 bg-blue-50 text-unp-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-unp-primary group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm mb-4 min-h-[60px]">
      {desc}
    </p>
    <div className="pt-4 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase">Spesifikasi Utama:</p>
      <p className="text-xs text-unp-primary font-medium mt-1">{specs}</p>
    </div>
  </div>
);

const Features: React.FC = () => {
  return (
    <section id="fasilitas" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-unp-secondary font-bold text-sm tracking-wider uppercase mb-2">Infrastruktur Digital</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Fasilitas Laboratorium</h3>
          <div className="w-20 h-1 bg-unp-secondary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Monitor size={28} />}
            title="Lab Komputer & Cintiq"
            desc="Ruang praktikum utama untuk 2D/3D modeling dan digital painting dengan tablet display profesional."
            specs="40x PC Workstation (RTX 3060), 40x Wacom Cintiq 22"
          />
          <FeatureCard 
            icon={<Move3d size={28} />}
            title="Studio Motion Capture"
            desc="Fasilitas perekaman gerak digital presisi tinggi untuk kebutuhan animasi realistis dan game development."
            specs="12x Optitrack Cameras, Motive Software, Faceware"
          />
          <FeatureCard 
            icon={<Cpu size={28} />}
            title="Render Farm Node"
            desc="Server khusus untuk mempercepat proses rendering animasi 3D kompleks dan simulasi fisika."
            specs="5x Blade Server, Dual Xeon, 256GB RAM, Network Rendering"
          />
          <FeatureCard 
            icon={<Mic2 size={28} />}
            title="Audio & Foley Studio"
            desc="Ruang kedap suara untuk perekaman dubbing, sound effect (Foley), dan mixing audio paska produksi."
            specs="Pro Tools, Neumann Mic, Focusrite Interface, Akustik Treatment"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;