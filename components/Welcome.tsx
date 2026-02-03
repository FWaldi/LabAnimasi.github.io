import React from 'react';

const Welcome: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Side */}
          <div className="lg:w-1/3 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://picsum.photos/seed/technician/600/800" 
                alt="Kepala Laboratorium"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decor Elements */}
            <div className="absolute top-10 -right-6 w-full h-full border-2 border-unp-secondary rounded-2xl z-0 hidden md:block"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-dots-pattern opacity-20"></div>
          </div>

          {/* Text Side */}
          <div className="lg:w-2/3">
            <h2 className="text-unp-primary font-bold text-lg mb-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-unp-secondary"></span>
              KEPALA LABORATORIUM
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Standar Industri untuk Kompetensi Vokasi
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                "Selamat datang di Laboratorium Animasi Universitas Negeri Padang. Laboratorium ini didedikasikan sebagai pusat pelatihan teknis dan produksi kreatif bagi mahasiswa D4 Animasi."
              </p>
              <p>
                Kami menerapkan Standar Operasional Prosedur (SOP) yang ketat dan standar K3 (Kesehatan dan Keselamatan Kerja) untuk memastikan peralatan terjaga dan pengguna aman. Fasilitas kami terus diperbarui mengikuti perkembangan teknologi industri animasi global.
              </p>
              <p className="font-semibold text-gray-800 pt-4">
                Manfaatkan fasilitas ini dengan bijak untuk melahirkan karya-karya masterpiece Anda.
              </p>
              
              <div className="pt-6">
                <h4 className="text-xl font-bold text-gray-900">Rudi Hermawan, M.Kom.</h4>
                <p className="text-unp-secondary">Kepala Lab. Animasi & Multimedia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;