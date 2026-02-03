import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  LayoutDashboard, UploadCloud, Image, Monitor, 
  CheckCircle, Wifi, Cpu, Layers, AlertTriangle, Power, UserCog, Save, Tag,
  FileBox, Youtube, MessageSquare, Camera
} from 'lucide-react';
import { ArtworkType } from '../../types';

const StudentView: React.FC = () => {
  const { user, updateUserProfile, inventory, startSession, activeSessions, uploadArtwork, artworks, currentDeviceId, artworkCategories } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Local state
  const [uploadForm, setUploadForm] = useState({ 
     title: '', category: '', type: 'image' as ArtworkType, 
     url: '', videoUrl: '', assetUrl: '', desc: '', tags: '' 
  });
  
  // Profile state
  const [profileForm, setProfileForm] = useState({
     name: user?.name || '',
     email: user?.email || '',
     password: user?.password || '',
     confirmPassword: user?.password || '',
     profileImage: user?.profileImage || ''
  });

  const mySession = activeSessions.find(s => s.studentNim === user?.nim_nip);
  const currentDevice = inventory.find(i => i.id === currentDeviceId);

  const menuItems = [
    { id: 'overview', label: 'Overview & Status', icon: <LayoutDashboard size={20} /> },
    { id: 'upload', label: 'Upload Karya', icon: <UploadCloud size={20} /> },
    { id: 'gallery', label: 'Portofolio & Feedback', icon: <Image size={20} /> },
    { id: 'profile', label: 'Edit Profil', icon: <UserCog size={20} /> },
  ];

  const handleCheckIn = () => {
    startSession();
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && mySession) {
      // Logic validation
      let finalImageUrl = uploadForm.url;
      if (!finalImageUrl) finalImageUrl = 'https://picsum.photos/seed/placeholder/400/300'; // Fallback

      uploadArtwork({
        id: Date.now().toString(),
        type: uploadForm.type,
        title: uploadForm.title,
        description: uploadForm.desc,
        tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        category: uploadForm.category,
        imageUrl: finalImageUrl,
        videoUrl: uploadForm.type === 'video' ? uploadForm.videoUrl : undefined,
        assetUrl: uploadForm.type === 'asset' ? uploadForm.assetUrl : undefined,
        studentName: user.name,
        studentNim: user.nim_nip || '',
        uploadedAt: new Date().toLocaleDateString()
      });
      setUploadForm({ title: '', category: '', type: 'image', url: '', videoUrl: '', assetUrl: '', desc: '', tags: '' });
      alert('Karya berhasil diupload ke galeri showcase!');
      setActiveTab('gallery');
    } else {
      alert('Anda harus Login di Komputer Lab (Check-in) terlebih dahulu.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
     e.preventDefault();
     if (profileForm.password !== profileForm.confirmPassword) {
        alert("Konfirmasi password tidak cocok!");
        return;
     }
     updateUserProfile({
        name: profileForm.name,
        email: profileForm.email,
        password: profileForm.password,
        profileImage: profileForm.profileImage
     });
     alert('Profil berhasil diperbarui!');
  };

  const OverviewContent = () => (
    <div className="flex flex-col lg:flex-row gap-8">
       {/* ID Card Status */}
       <div className="lg:w-1/3">
          <div className={`rounded-2xl p-6 text-white shadow-xl relative overflow-hidden ${mySession ? 'bg-gradient-to-br from-green-600 to-emerald-800' : 'bg-gradient-to-br from-gray-600 to-gray-800'}`}>
             {/* Abstract Pattern */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <Monitor size={32} className="opacity-80" />
                   {mySession && <Wifi size={24} className="animate-pulse text-green-300" />}
                </div>
                
                <h3 className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Status Sesi Lab</h3>
                <h2 className="text-2xl font-bold mb-6">{mySession ? 'ACTIVE SESSION' : 'READY TO START'}</h2>
                
                {mySession ? (
                   <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                      <div className="flex justify-between mb-2">
                         <span className="text-xs opacity-70">Workstation ID</span>
                         <span className="font-mono font-bold">{mySession.equipmentId}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                         <span className="text-xs opacity-70">Lokasi</span>
                         <span className="font-bold">{mySession.labLocation}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-xs opacity-70">Waktu Mulai</span>
                         <span className="font-mono font-bold">{mySession.startTime}</span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-green-300 font-bold flex items-center justify-center gap-2">
                         <CheckCircle size={14} /> TOKEN VERIFIED
                      </div>
                   </div>
                ) : (
                   <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Monitor size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-300">Device Terdeteksi:</p>
                            <p className="font-bold text-lg leading-none">{currentDeviceId || 'Unknown'}</p>
                            <p className="text-xs text-gray-400">{currentDevice?.labLocation || 'Unknown Location'}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleCheckIn}
                        className="w-full bg-white text-gray-900 font-bold py-3 rounded hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Power size={16} />
                        Mulai Praktikum (Check-In)
                      </button>
                      <p className="text-[10px] text-center mt-2 opacity-60">
                        *Klik tombol di atas untuk mencatat kehadiran
                      </p>
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* Quick Stats */}
       <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                <Layers size={24} />
             </div>
             <div>
                <h4 className="font-bold text-gray-800 text-xl">{artworks.filter(a => a.studentNim === user?.nim_nip).length}</h4>
                <p className="text-gray-500 text-sm">Karya Diupload</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                <Cpu size={24} />
             </div>
             <div>
                <h4 className="font-bold text-gray-800 text-xl">100%</h4>
                <p className="text-gray-500 text-sm">Akses Fasilitas</p>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
             <h4 className="font-bold text-gray-800 mb-2">Panduan Singkat</h4>
             <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li>Sistem otomatis mendeteksi komputer yang Anda gunakan.</li>
                <li>Lakukan <strong>Check-In</strong> di awal perkuliahan untuk validasi absensi dosen.</li>
                <li>Logout saat selesai untuk mengakhiri sesi pemakaian alat.</li>
             </ul>
          </div>
       </div>
    </div>
  );

  const UploadContent = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
         <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
               <UploadCloud size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Upload Hasil Karya</h3>
            <p className="text-gray-500 mt-2">Karya akan ditampilkan di Showcase publik setelah diupload.</p>
         </div>

         {!mySession ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700 text-sm">
               <AlertTriangle className="mx-auto mb-2" size={24} />
               <strong>Akses Ditolak:</strong> Anda tidak terdeteksi di dalam lab (Belum Check-In). Silakan Check-In terlebih dahulu di menu Overview.
            </div>
         ) : (
            <form onSubmit={handleUpload} className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Judul Karya</label>
                  <input required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} placeholder="Contoh: Character Design - Warrior" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" value={uploadForm.category} onChange={e => setUploadForm({...uploadForm, category: e.target.value})}>
                     <option value="">Pilih Kategori...</option>
                     {artworkCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tipe Karya</label>
                  <div className="flex gap-4">
                     <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 hover:bg-gray-50">
                        <input type="radio" name="type" checked={uploadForm.type === 'image'} onChange={() => setUploadForm({...uploadForm, type: 'image'})} />
                        <Image size={16} /> Gambar
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 hover:bg-gray-50">
                        <input type="radio" name="type" checked={uploadForm.type === 'video'} onChange={() => setUploadForm({...uploadForm, type: 'video'})} />
                        <Youtube size={16} /> Video
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 hover:bg-gray-50">
                        <input type="radio" name="type" checked={uploadForm.type === 'asset'} onChange={() => setUploadForm({...uploadForm, type: 'asset'})} />
                        <FileBox size={16} /> Aset 3D
                     </label>
                  </div>
               </div>

               {uploadForm.type === 'image' && (
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Upload Gambar / Link</label>
                      <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://picsum.photos/..." value={uploadForm.url} onChange={e => setUploadForm({...uploadForm, url: e.target.value})} />
                  </div>
               )}

               {uploadForm.type === 'video' && (
                  <>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Link Video (YouTube)</label>
                         <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://youtube.com/..." value={uploadForm.videoUrl} onChange={e => setUploadForm({...uploadForm, videoUrl: e.target.value})} />
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Link Gambar Cover (Thumbnail)</label>
                         <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." value={uploadForm.url} onChange={e => setUploadForm({...uploadForm, url: e.target.value})} />
                     </div>
                  </>
               )}

               {uploadForm.type === 'asset' && (
                  <>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Link Download Aset (Drive/Cloud)</label>
                         <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." value={uploadForm.assetUrl} onChange={e => setUploadForm({...uploadForm, assetUrl: e.target.value})} />
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Upload Cover Gambar Aset</label>
                         <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." value={uploadForm.url} onChange={e => setUploadForm({...uploadForm, url: e.target.value})} />
                         <p className="text-xs text-gray-400 mt-1">Gunakan link gambar untuk preview</p>
                     </div>
                  </>
               )}

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi Singkat</label>
                  <textarea required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" rows={3} value={uploadForm.desc} onChange={e => setUploadForm({...uploadForm, desc: e.target.value})} placeholder="Jelaskan konsep karya anda..." />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Pisahkan dengan koma)</label>
                  <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" value={uploadForm.tags} onChange={e => setUploadForm({...uploadForm, tags: e.target.value})} placeholder="Contoh: 3D, Blender, Character" />
               </div>
               
               <button type="submit" className="w-full bg-unp-primary text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 mt-4">
                  Publish ke Showcase
               </button>
            </form>
         )}
      </div>
    </div>
  );

  const GalleryContent = () => (
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-6 text-gray-800">Portofolio & Feedback</h3>
        <div className="space-y-6">
           {artworks.filter(a => a.studentNim === user?.nim_nip).map(art => (
             <div key={art.id} className="flex flex-col md:flex-row gap-4 border border-gray-200 rounded-lg p-4 bg-white">
                <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                   <img src={art.imageUrl} className="w-full h-full object-cover" alt={art.title} />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-gray-800">{art.title}</h4>
                      <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded text-gray-600">{art.type}</span>
                   </div>
                   <p className="text-sm text-gray-600 mb-2">{art.description}</p>
                   <div className="flex gap-2 mb-4">
                      {art.tags.map(t => <span key={t} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{t}</span>)}
                   </div>
                   
                   {/* Feedback Section */}
                   {art.lecturerFeedback ? (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg mt-2">
                         <div className="flex items-center gap-2 text-green-800 font-bold text-xs mb-1">
                            <MessageSquare size={14} /> Masukan dari Dosen ({art.lecturerName})
                         </div>
                         <p className="text-sm text-green-900 italic">"{art.lecturerFeedback}"</p>
                      </div>
                   ) : (
                      <div className="text-xs text-gray-400 italic mt-2">Belum ada masukan dari dosen.</div>
                   )}
                </div>
             </div>
           ))}
           {artworks.filter(a => a.studentNim === user?.nim_nip).length === 0 && (
              <div className="py-12 text-center text-gray-400 border-2 border-dashed rounded-xl">
                 Belum ada karya yang diupload.
              </div>
           )}
        </div>
     </div>
  );

  const ProfileContent = () => (
     <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
           <UserCog /> Edit Profil Mahasiswa
        </h3>
        <div className="flex justify-center mb-6">
           <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative group">
              {profileForm.profileImage ? (
                  <img src={profileForm.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><UserCog size={40} /></div>
              )}
              <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs cursor-pointer">
                 <Camera size={20} />
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
           </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
              <input required className="w-full border border-gray-300 rounded-lg p-2.5" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
           </div>
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input type="email" required className="w-full border border-gray-300 rounded-lg p-2.5" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
           </div>
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" required className="w-full border border-gray-300 rounded-lg p-2.5" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} />
           </div>
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Password</label>
              <input type="password" required className="w-full border border-gray-300 rounded-lg p-2.5" value={profileForm.confirmPassword} onChange={e => setProfileForm({...profileForm, confirmPassword: e.target.value})} />
           </div>
           <div className="pt-4">
              <button type="submit" className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
                 <Save size={18} /> Simpan Perubahan
              </button>
           </div>
        </form>
     </div>
  );

  return (
    <DashboardLayout 
      title={`Halo, ${user?.name}`} 
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
       {activeTab === 'overview' && <OverviewContent />}
       {activeTab === 'upload' && <UploadContent />}
       {activeTab === 'gallery' && <GalleryContent />}
       {activeTab === 'profile' && <ProfileContent />}
    </DashboardLayout>
  );
};

export default StudentView;