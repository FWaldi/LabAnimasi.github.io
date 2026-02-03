import React from 'react';
import { Calendar, User, ArrowRight, Info } from 'lucide-react';
import { LATEST_NEWS } from '../constants';

const NewsSection: React.FC = () => {
  return (
    <section id="info" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-unp-secondary font-bold text-sm tracking-wider uppercase mb-2">Informasi Laboratorium</h2>
            <h3 className="text-3xl font-bold text-gray-800">Update Jadwal & Fasilitas</h3>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-unp-primary font-semibold hover:text-unp-secondary transition-colors">
            Lihat Semua Info <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LATEST_NEWS.map((news) => (
            <article key={news.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
              <div className="relative overflow-hidden h-48">
                <div className="absolute top-4 left-4 bg-unp-primary text-white text-xs font-bold px-3 py-1 rounded shadow-lg z-10 flex items-center gap-1">
                  <Info size={10} /> {news.category}
                </div>
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {news.date}</span>
                  <span className="flex items-center gap-1"><User size={12} /> Admin Lab</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-unp-primary transition-colors line-clamp-2">
                  <a href="#">{news.title}</a>
                </h4>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {news.summary}
                </p>
                <a href="#" className="inline-flex items-center text-unp-primary text-sm font-semibold hover:gap-2 transition-all">
                  Detail Info <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
           <button className="px-6 py-2 border border-unp-primary text-unp-primary rounded-full hover:bg-unp-primary hover:text-white transition-colors">
             Lihat Semua Info
           </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;