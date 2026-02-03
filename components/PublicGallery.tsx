import React from 'react';
import { useApp } from '../context/AppContext';

const PublicGallery: React.FC = () => {
  const { artworks } = useApp();

  return (
    <section className="py-16 bg-white" id="gallery">
      <div className="container mx-auto px-4">
         <div className="text-center mb-12">
            <h2 className="text-unp-secondary font-bold text-sm tracking-wider uppercase mb-2">Showcase Laboratorium</h2>
            <h3 className="text-3xl font-bold text-gray-800">Karya Terbaik Mahasiswa</h3>
            <p className="text-gray-500 mt-2">Hasil praktikum dan tugas akhir yang diproduksi menggunakan fasilitas Laboratorium Animasi UNP</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((art) => (
              <div key={art.id} className="group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white">
                <div className="h-64 overflow-hidden relative">
                   <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                   />
                   <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                     {art.category}
                   </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-1 truncate">{art.title}</h4>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Oleh: <span className="text-unp-primary font-medium">{art.studentName}</span></span>
                    <span>{art.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
};

export default PublicGallery;