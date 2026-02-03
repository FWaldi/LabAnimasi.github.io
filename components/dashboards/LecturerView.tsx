import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  LayoutDashboard, Users, Image, AlertTriangle, 
  Trash2, Eye, CheckCircle, ClipboardList, Calendar, Search, 
  UserCog, Save, MapPin, Archive, PlayCircle, MessageSquare, Edit, Camera
} from 'lucide-react';
import { ClassSchedule, LabSession } from '../../types';

const LecturerView: React.FC = () => {
  const { 
    user, updateUserProfile, inventory, reportIssue, artworks, deleteArtwork, giveArtworkFeedback,
    activeSessions, sessionHistory, schedules, manageSchedule, startLecturerSession, endSession 
  } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Local state for reporting
  const [selectedLabReport, setSelectedLabReport] = useState('');
  const [reportModal, setReportModal] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  
  // Attendance Filters
  const [attendanceLabFilter, setAttendanceLabFilter] = useState('All');
  const [attendanceDateFilter, setAttendanceDateFilter] = useState('');
  const [detailSession, setDetailSession] = useState<{date: string, lab: string, subject: string, students: LabSession[]} | null>(null);

  // Moderation
  const [feedbackInput, setFeedbackInput] = useState<{ [key: string]: string }>({});
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Session
  const [selectedLabForSession, setSelectedLabForSession] = useState('');

  // Profile state
  const [profileForm, setProfileForm] = useState({
     name: user?.name || '',
     email: user?.email || '',
     password: user?.password || '',
     confirmPassword: user?.password || '',
     profileImage: user?.profileImage || ''
  });
  
  // Schedule Management
  const [newSchedule, setNewSchedule] = useState<Partial<ClassSchedule>>({ day: 'Senin', room: 'Lab Komputer A' });

  const mySession = activeSessions.find(s => s.userId === user?.id && s.userRole === 'dosen');

  const menuItems = [
    { id: 'overview', label: 'Dashboard Dosen', icon: <LayoutDashboard size={20} /> },
    { id: 'attendance', label: 'Rekap & Arsip Absensi', icon: <ClipboardList size={20} /> },
    { id: 'schedule', label: 'Jadwal Mengajar', icon: <Calendar size={20} /> },
    { id: 'artworks', label: 'Moderasi Karya', icon: <Image size={20} /> },
    { id: 'report', label: 'Lapor Kerusakan', icon: <AlertTriangle size={20} /> },
    { id: 'profile', label: 'Edit Profil', icon: <UserCog size={20} /> },
  ];

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportModal) {
      reportIssue(reportModal, desc);
      setReportModal(null);
      setDesc('');
      alert('Laporan berhasil dikirim ke teknisi.');
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

  const handleAddSchedule = (e: React.FormEvent) => {
     e.preventDefault();
     if (newSchedule.subject && newSchedule.time) {
        manageSchedule('add', {
           id: Date.now().toString(),
           day: newSchedule.day!,
           time: newSchedule.time!,
           subject: newSchedule.subject!,
           lecturer: user?.name || 'Dosen',
           room: newSchedule.room!,
           color: 'bg-blue-100 border-blue-200 text-blue-800'
        });
        setNewSchedule({ day: 'Senin', room: 'Lab Komputer A', subject: '', time: '' });
        alert('Jadwal berhasil ditambahkan');
     }
  };

  const handleStartSession = () => {
    if(!selectedLabForSession) {
       alert("Pilih Laboratorium terlebih dahulu.");
       return;
    }
    // Try to find schedule match
    const currentDay = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const matchSchedule = schedules.find(s => s.day === currentDay && s.room === selectedLabForSession && s.lecturer === user?.name);
    
    startLecturerSession(selectedLabForSession, matchSchedule?.subject);
    alert(`Anda berhasil login di ${selectedLabForSession}`);
  };

  const handleSendFeedback = (artId: string) => {
     if(feedbackInput[artId]) {
        giveArtworkFeedback(artId, feedbackInput[artId], user?.name || 'Dosen');
        setFeedbackInput({ ...feedbackInput, [artId]: '' });
        setEditingFeedback(null);
        alert('Masukan terkirim.');
     }
  };
  
  const handleDeleteArtwork = (artId: string) => {
     deleteArtwork(artId);
     setConfirmDelete(null);
     alert('Karya berhasil dihapus.');
  };

  // Group active/history sessions by date/subject/lab to show "Sessions" not just individual logs
  const allStudentSessions = [...activeSessions, ...sessionHistory].filter(s => s.userRole === 'mahasiswa');
  // Get unique dates for highlighting
  const activeDates = Array.from(new Set(allStudentSessions.map(s => s.date)));

  const OverviewContent = () => (
    <div className="space-y-6">
       {/* Session Control */}
       <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
             <PlayCircle className="text-blue-600" /> Sesi Mengajar
          </h3>
          
          {mySession ? (
             <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div>
                   <p className="text-sm text-blue-600 font-bold uppercase mb-1">Sedang Mengajar di:</p>
                   <h2 className="text-2xl font-bold text-blue-900">{mySession.labLocation}</h2>
                   <p className="text-sm text-blue-700 mt-1">Mata Kuliah: {mySession.subject} • Mulai: {mySession.startTime}</p>
                </div>
                <button 
                  onClick={() => endSession(mySession.id)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 shadow-md"
                >
                   Selesai Mengajar
                </button>
             </div>
          ) : (
             <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Laboratorium</label>
                   <select 
                      className="w-full border border-gray-300 rounded-lg p-3"
                      value={selectedLabForSession}
                      onChange={e => setSelectedLabForSession(e.target.value)}
                   >
                      <option value="">-- Pilih Ruangan --</option>
                      {Array.from(new Set(inventory.map(i => i.labLocation))).map(lab => (
                         <option key={lab} value={lab}>{lab}</option>
                      ))}
                   </select>
                </div>
                <button 
                   onClick={handleStartSession}
                   className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md disabled:bg-gray-300"
                   disabled={!selectedLabForSession}
                >
                   Mulai Mengajar (Login)
                </button>
             </div>
          )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <p className="text-gray-500 mb-2">Mahasiswa Aktif Saat Ini</p>
             <h3 className="text-4xl font-bold text-gray-800">{activeSessions.filter(s => s.userRole === 'mahasiswa').length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <p className="text-gray-500 mb-2">Jadwal Mengajar Anda</p>
             <h3 className="text-4xl font-bold text-gray-800">{schedules.filter(s => s.lecturer === user?.name).length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <p className="text-gray-500 mb-2">Karya Perlu Moderasi</p>
             <h3 className="text-4xl font-bold text-gray-800">{artworks.filter(a => !a.lecturerFeedback).length}</h3>
          </div>
       </div>
    </div>
  );

  const AttendanceContent = () => {
    // Unique Labs
    const labs = ['All', ...Array.from(new Set(inventory.map(i => i.labLocation)))];

    // Filter Logic
    const filteredSessions = allStudentSessions.filter(s => {
       const matchLab = attendanceLabFilter === 'All' || s.labLocation === attendanceLabFilter;
       const matchDate = attendanceDateFilter === '' || s.date === attendanceDateFilter;
       return matchLab && matchDate;
    });

    // Grouping for Summary View
    // Key: Date + Lab + Subject
    const groupedData: {[key: string]: {date: string, lab: string, subject: string, students: LabSession[]}} = {};
    
    filteredSessions.forEach(s => {
       const key = `${s.date}-${s.labLocation}-${s.subject || 'Unknown'}`;
       if(!groupedData[key]) {
          groupedData[key] = {
             date: s.date,
             lab: s.labLocation,
             subject: s.subject || 'Praktikum',
             students: []
          };
       }
       groupedData[key].students.push(s);
    });

    const summaryList = Object.values(groupedData);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
           <Archive className="text-unp-primary" /> Arsip & Rekap Absensi
        </h3>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg items-end">
           <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-700 mb-1">Filter Laboratorium</label>
              <select 
                 className="w-full border rounded p-2 text-sm"
                 value={attendanceLabFilter}
                 onChange={e => setAttendanceLabFilter(e.target.value)}
              >
                 {labs.map(lab => <option key={lab} value={lab}>{lab}</option>)}
              </select>
           </div>
           <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-700 mb-1">Filter Tanggal</label>
              <input 
                 type="date" 
                 className="w-full border rounded p-2 text-sm"
                 onChange={e => {
                    if(e.target.value) {
                       const d = new Date(e.target.value);
                       setAttendanceDateFilter(d.toLocaleDateString());
                    } else {
                       setAttendanceDateFilter('');
                    }
                 }}
              />
              <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-1">
                 <span>Tanggal aktif:</span>
                 {activeDates.map(d => (
                    <span key={d} className="bg-green-100 text-green-800 px-1 rounded cursor-pointer hover:bg-green-200" onClick={() => {
                        // Rough way to set date picker input, actual implementation needs state sync with input value format YYYY-MM-DD
                        alert(`Gunakan date picker untuk memilih: ${d}`); 
                    }}>{d}</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Summary Table */}
        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                 <tr>
                    <th className="p-4 rounded-tl-lg">Tanggal</th>
                    <th className="p-4">Laboratorium</th>
                    <th className="p-4">Mata Kuliah / Kegiatan</th>
                    <th className="p-4">Total Hadir</th>
                    <th className="p-4 rounded-tr-lg text-center">Aksi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {summaryList.map((group, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                       <td className="p-4 text-gray-500">{group.date}</td>
                       <td className="p-4 font-bold text-blue-800">{group.lab}</td>
                       <td className="p-4">{group.subject}</td>
                       <td className="p-4 font-bold">{group.students.length} Mahasiswa</td>
                       <td className="p-4 text-center">
                          <button 
                             onClick={() => setDetailSession(group)}
                             className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-xs font-bold"
                          >
                             Lihat Detail
                          </button>
                       </td>
                    </tr>
                 ))}
                 {summaryList.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-400">Tidak ada data sesuai filter.</td></tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Detail Modal */}
        {detailSession && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                       <h3 className="font-bold text-lg text-gray-800">Detail Kehadiran</h3>
                       <p className="text-sm text-gray-500">{detailSession.date} • {detailSession.lab} • {detailSession.subject}</p>
                    </div>
                    <button onClick={() => setDetailSession(null)} className="text-gray-400 hover:text-gray-600"><Trash2 className="rotate-45" /></button>
                 </div>
                 <div className="p-6 overflow-y-auto">
                    <table className="w-full text-sm">
                       <thead>
                          <tr className="border-b text-gray-500">
                             <th className="pb-2 text-left">Nama</th>
                             <th className="pb-2 text-left">NIM</th>
                             <th className="pb-2 text-left">Waktu</th>
                             <th className="pb-2 text-left">Device</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y">
                          {detailSession.students.map(s => (
                             <tr key={s.id}>
                                <td className="py-3 font-bold">{s.studentName}</td>
                                <td className="py-3 font-mono text-gray-600">{s.studentNim}</td>
                                <td className="py-3">{s.startTime} - {s.endTime || 'Active'}</td>
                                <td className="py-3 text-xs text-gray-500">{s.equipmentId}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl text-right">
                    <button onClick={() => setDetailSession(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-bold">Tutup</button>
                 </div>
              </div>
           </div>
        )}
     </div>
    );
  };

  const ScheduleContent = () => (
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-6 text-gray-800">Manajemen Jadwal Lab</h3>
        
        {/* Add Schedule Form */}
        <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
           <h4 className="font-bold text-blue-800 text-sm mb-3">Tambah Jadwal Baru</h4>
           <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div>
                 <label className="text-xs font-bold text-gray-600">Hari</label>
                 <select className="w-full p-2 border rounded mt-1 text-sm" value={newSchedule.day} onChange={e => setNewSchedule({...newSchedule, day: e.target.value})}>
                    {['Senin','Selasa','Rabu','Kamis','Jumat'].map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-600">Jam</label>
                 <input className="w-full p-2 border rounded mt-1 text-sm" placeholder="08:00 - 10:00" value={newSchedule.time} onChange={e => setNewSchedule({...newSchedule, time: e.target.value})} />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-600">Mata Kuliah</label>
                 <input className="w-full p-2 border rounded mt-1 text-sm" placeholder="Nama Matkul" value={newSchedule.subject} onChange={e => setNewSchedule({...newSchedule, subject: e.target.value})} />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-600">Ruangan</label>
                 <select className="w-full p-2 border rounded mt-1 text-sm" value={newSchedule.room} onChange={e => setNewSchedule({...newSchedule, room: e.target.value})}>
                    {Array.from(new Set(inventory.map(i => i.labLocation))).map(l => <option key={l} value={l}>{l}</option>)}
                 </select>
              </div>
              <button type="submit" className="bg-blue-600 text-white p-2 rounded text-sm font-bold hover:bg-blue-700">Tambah</button>
           </form>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
           {schedules.map(sch => (
              <div key={sch.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                 <div className="flex gap-4 items-center">
                    <div className="w-16 text-center">
                       <div className="font-bold text-gray-800">{sch.day}</div>
                    </div>
                    <div>
                       <div className="font-bold text-lg">{sch.subject}</div>
                       <div className="text-sm text-gray-500">{sch.time} • {sch.room} • {sch.lecturer}</div>
                    </div>
                 </div>
                 <button onClick={() => manageSchedule('delete', sch)} className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded text-xs">Hapus</button>
              </div>
           ))}
        </div>
     </div>
  );

  const ReportContent = () => {
    // Unique Labs
    const labs = Array.from(new Set(inventory.map(i => i.labLocation)));
    
    const filteredInventory = inventory.filter(i => 
       !selectedLabReport || i.labLocation === selectedLabReport
    );

    return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Lapor Kerusakan Aset</h3>
        <p className="text-gray-500 text-sm mb-6">Pilih lokasi laboratorium terlebih dahulu, kemudian pilih alat yang bermasalah.</p>
        
        <div className="mb-6">
           <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Laboratorium</label>
           <select 
              className="w-full md:w-1/2 border rounded-lg p-3 text-sm"
              value={selectedLabReport}
              onChange={e => setSelectedLabReport(e.target.value)}
           >
              <option value="">-- Pilih Lokasi Lab --</option>
              {labs.map(l => <option key={l} value={l}>{l}</option>)}
           </select>
        </div>

        {selectedLabReport && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredInventory.map(item => (
                 <div key={item.id} className={`p-4 border rounded-lg flex justify-between items-center ${item.status === 'maintenance' || item.status === 'broken' ? 'bg-red-50 border-red-100 opacity-60' : 'bg-white hover:border-blue-300'}`}>
                    <div>
                       <p className="font-bold text-gray-700">{item.name}</p>
                       <p className="text-xs text-gray-500 font-mono">{item.id}</p>
                    </div>
                    {item.status !== 'maintenance' && item.status !== 'broken' ? (
                       <button 
                          onClick={() => setReportModal(item.id)}
                          className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white transition-colors"
                       >
                          Lapor
                       </button>
                    ) : (
                       <span className="text-xs font-bold text-red-500">Dalam Perbaikan</span>
                    )}
                 </div>
              ))}
           </div>
        )}
        
        {reportModal && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Detail Kerusakan: <span className="text-red-600">{reportModal}</span></h3>
                <form onSubmit={handleSubmitReport}>
                   <label className="block text-sm text-gray-600 mb-2">Deskripsi Masalah</label>
                   <textarea 
                      className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      rows={4} 
                      placeholder="Contoh: Layar monitor berkedip, mouse double click..."
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      required
                   />
                   <div className="flex gap-3 mt-4 justify-end">
                      <button type="button" onClick={() => setReportModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Batal</button>
                      <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Kirim Laporan</button>
                   </div>
                </form>
             </div>
          </div>
        )}
     </div>
    );
  };

  const ArtworksContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
       <h3 className="font-bold text-lg mb-6 text-gray-800">Moderasi & Feedback Karya</h3>
       
       {confirmDelete && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
             <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                <h3 className="font-bold text-lg mb-2">Konfirmasi Hapus</h3>
                <p className="text-gray-600 mb-4">Apakah anda yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex justify-end gap-3">
                   <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-bold">Batal</button>
                   <button onClick={() => handleDeleteArtwork(confirmDelete)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold">Hapus</button>
                </div>
             </div>
          </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map(art => (
             <div key={art.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="h-40 overflow-hidden relative">
                   <img src={art.imageUrl} className="w-full h-full object-cover" alt={art.title} />
                   <div className="absolute top-2 right-2 flex gap-1">
                      <button onClick={() => setConfirmDelete(art.id)} className="bg-red-600 text-white p-1.5 rounded shadow hover:bg-red-700"><Trash2 size={14} /></button>
                   </div>
                </div>
                <div className="p-4">
                   <h4 className="font-bold text-gray-800 truncate">{art.title}</h4>
                   <p className="text-xs text-gray-500 mb-2">{art.studentName} ({art.studentNim})</p>
                   
                   {art.lecturerFeedback && editingFeedback !== art.id ? (
                      <div className="group text-xs bg-green-50 text-green-700 p-2 rounded mt-2 border border-green-100 relative">
                         <strong>Feedback Anda:</strong> {art.lecturerFeedback}
                         <button 
                           onClick={() => { setEditingFeedback(art.id); setFeedbackInput({...feedbackInput, [art.id]: art.lecturerFeedback || ''}); }}
                           className="absolute top-1 right-1 text-green-800 hover:bg-green-200 rounded p-1"
                         >
                            <Edit size={12} />
                         </button>
                      </div>
                   ) : (
                      <div className="mt-3">
                         <input 
                           className="w-full text-xs border rounded p-2 mb-2" 
                           placeholder="Tulis masukan..."
                           value={feedbackInput[art.id] || ''}
                           onChange={e => setFeedbackInput({...feedbackInput, [art.id]: e.target.value})}
                         />
                         <div className="flex gap-2">
                            {editingFeedback === art.id && <button onClick={() => setEditingFeedback(null)} className="px-3 py-1.5 bg-gray-200 text-xs rounded font-bold">Batal</button>}
                            <button 
                              onClick={() => handleSendFeedback(art.id)}
                              className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700"
                            >
                              Kirim Masukan
                           </button>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const ProfileContent = () => (
     <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
           <UserCog /> Edit Profil Dosen
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
              <label className="block text-sm font-bold text-gray-700 mb-1">Foto Profil (URL)</label>
              <input className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="https://..." value={profileForm.profileImage} onChange={e => setProfileForm({...profileForm, profileImage: e.target.value})} />
           </div>
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap & Gelar</label>
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
      title="Portal Dosen"
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
       {activeTab === 'overview' && <OverviewContent />}
       {activeTab === 'attendance' && <AttendanceContent />}
       {activeTab === 'schedule' && <ScheduleContent />}
       {activeTab === 'artworks' && <ArtworksContent />}
       {activeTab === 'report' && <ReportContent />}
       {activeTab === 'profile' && <ProfileContent />}
    </DashboardLayout>
  );
};

export default LecturerView;