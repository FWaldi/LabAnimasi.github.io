import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Heart, Share2, PlayCircle, Tag, X, MessageSquare, User, Download, ExternalLink } from 'lucide-react';
import { Artwork } from '../../types';

const ShowcasePage: React.FC = () => {
  const { artworks } = useApp();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredArtId, setHoveredArtId] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const categories = ['All', '3D Modeling', '2D Animation', 'Concept Art', 'VFX', 'Motion Graphic'];

  const filteredArtworks = artworks.filter(art => {
    const matchesCategory = filter === 'All' || art.category === filter;
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Galeri Karya Mahasiswa</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Menampilkan hasil karya terbaik dari mahasiswa D4 Animasi Vokasi UNP.
            Platform ini menjadi bukti kompetensi dan kreativitas dalam dunia industri digital kreatif.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-24 z-30">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat 
                    ? 'bg-unp-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Cari karya, tag, mahasiswa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-unp-primary"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Grid */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((art) => {
              const youtubeId = art.videoUrl ? getYoutubeId(art.videoUrl) : null;
              const isHovered = hoveredArtId === art.id;

              return (
                <div 
                  key={art.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100 cursor-pointer"
                  onMouseEnter={() => setHoveredArtId(art.id)}
                  onMouseLeave={() => setHoveredArtId(null)}
                  onClick={() => setSelectedArtwork(art)}
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-200">
                    {/* YouTube Autoplay Logic */}
                    {youtubeId && isHovered ? (
                      <iframe 
                        className="w-full h-full absolute inset-0 pointer-events-none"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1`}
                        title={art.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    ) : (
                      <>
                        <img 
                          src={art.imageUrl} 
                          alt={art.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {youtubeId && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                             <PlayCircle size={48} className="text-white opacity-80" />
                          </div>
                        )}
                      </>
                    )}

                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                        {art.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{art.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{art.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                       {art.tags.map(tag => (
                         <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                            <Tag size={10} /> {tag}
                         </span>
                       ))}
                    </div>

                    <div className="flex items-center gap-2 mb-4 mt-auto">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        {art.studentName.charAt(0)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{art.studentName}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                      <span>NIM: {art.studentNim}</span>
                      <span>{art.uploadedAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak ada karya ditemukan</h3>
            <p className="text-gray-500">Coba ubah filter kategori atau kata kunci pencarian Anda.</p>
            <button 
              onClick={() => { setFilter('All'); setSearchTerm(''); }}
              className="mt-4 text-unp-primary font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Detailed Modal */}
        {selectedArtwork && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArtwork(null)}>
               <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative" onClick={e => e.stopPropagation()}>
                    <button 
                        onClick={() => setSelectedArtwork(null)}
                        className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Media Side */}
                    <div className="md:w-2/3 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-full">
                         {selectedArtwork.videoUrl ? (
                             <iframe 
                                className="w-full h-full aspect-video"
                                src={`https://www.youtube.com/embed/${getYoutubeId(selectedArtwork.videoUrl)}?autoplay=1`}
                                title={selectedArtwork.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                             ></iframe>
                         ) : (
                             <img src={selectedArtwork.imageUrl} className="w-full h-auto max-h-[80vh] object-contain" alt={selectedArtwork.title} />
                         )}
                    </div>

                    {/* Info Side */}
                    <div className="md:w-1/3 p-8 flex flex-col">
                        <div className="mb-6">
                            <span className="bg-unp-primary/10 text-unp-primary text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                                {selectedArtwork.category}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{selectedArtwork.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{selectedArtwork.uploadedAt}</span>
                                <span>•</span>
                                <span>{selectedArtwork.type.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-unp-primary text-white flex items-center justify-center font-bold text-lg">
                                {selectedArtwork.studentName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{selectedArtwork.studentName}</p>
                                <p className="text-xs text-gray-500">NIM: {selectedArtwork.studentNim}</p>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-6 text-sm flex-grow">
                            {selectedArtwork.description}
                        </p>

                        <div className="mb-6">
                            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedArtwork.tags.map(t => (
                                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">#{t}</span>
                                ))}
                            </div>
                        </div>

                        {/* Actions / Feedback */}
                         <div className="space-y-4 mt-auto">
                            {selectedArtwork.assetUrl && (
                                <a 
                                    href={selectedArtwork.assetUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                                >
                                    <Download size={16} /> Download Asset
                                </a>
                            )}
                            
                            {selectedArtwork.lecturerFeedback && (
                                <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-800 font-bold text-xs mb-2">
                                        <MessageSquare size={14} /> Feedback Dosen
                                    </div>
                                    <p className="text-sm text-green-700 italic">"{selectedArtwork.lecturerFeedback}"</p>
                                    <p className="text-xs text-green-600 mt-2 text-right">- {selectedArtwork.lecturerName}</p>
                                </div>
                            )}
                         </div>
                    </div>
               </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ShowcasePage;