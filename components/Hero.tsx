import React from 'react';
import { ArrowRight, CalendarCheck } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://picsum.photos/seed/serverroom/1920/1080")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-unp-primary/95 to-unp-primary/50 md:to-transparent"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded mb-4 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Lab Beroperasi Normal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Pusat Teknologi & <span className="text-yellow-400">Inovasi Kreatif</span> Digital
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
            Menyediakan fasilitas workstation High-End, Motion Capture, dan Render Farm untuk menunjang produktivitas civitas akademika Vokasi UNP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-unp-secondary hover:bg-amber-600 text-white font-semibold rounded transition-all flex items-center justify-center gap-2 group shadow-lg shadow-amber-500/20">
              Lihat Fasilitas
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded transition-all flex items-center justify-center gap-2">
              <CalendarCheck size={18} />
              Cek Jadwal Lab
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto fill-gray-50">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;