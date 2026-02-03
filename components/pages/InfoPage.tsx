import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Monitor, Cpu, Mic2, Move3d, Clock, Calendar, 
  MapPin, Box, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, LayoutGrid, List
} from 'lucide-react';

// Static descriptions for Labs, but counts will come from Context
const STATIC_LAB_INFO = [
  {
    id: 'Lab Komputer A',
    name: 'Lab Komputer Utama (Lab A)',
    location: 'Gedung Vokasi Lt. 3, R.304',
    description: 'Laboratorium utama untuk perkuliahan 3D Modeling, Texturing, dan Digital Painting.',
    icon: <Monitor size={24} />,
    capacity: 40,
  },
  {
    id: 'Studio Mocap',
    name: 'Studio Motion Capture',
    location: 'Gedung Vokasi Lt. 3, R.305',
    description: 'Studio khusus untuk perekaman gerak (Motion Capture) dan Green Screen VFX.',
    icon: <Move3d size={24} />,
    capacity: 15,
  },
  {
    id: 'Studio Audio',
    name: 'Studio Audio & Dubbing',
    location: 'Gedung Vokasi Lt. 3, R.306',
    description: 'Fasilitas professional recording untuk dubbing, foley, dan mixing audio.',
    icon: <Mic2 size={24} />,
    capacity: 10,
  }
];

const InfoPage: React.FC = () => {
  const { schedules, inventory } = useApp();
  const [activeTab, setActiveTab] = useState<'inventory' | 'schedule'>('inventory');
  const [selectedLabId, setSelectedLabId] = useState<string>(STATIC_LAB_INFO[0].id);
  const [scheduleView, setScheduleView] = useState<'weekly' | 'monthly'>('weekly');

  const selectedLabInfo = STATIC_LAB_INFO.find(l => l.id === selectedLabId) || STATIC_LAB_INFO[0];
  
  // Dynamic Inventory Data Logic
  const labItems = inventory.filter(item => item.labLocation === selectedLabInfo.id);
  
  interface ItemSummary {
    name: string;
    specs: string;
    qty: number;
    conditions: {
      available: number;
      'in-use': number;
      maintenance: number;
      broken: number;
    }
  }

  // Group items by Name for the summary table
  const groupedItems: ItemSummary[] = Object.values(labItems.reduce((acc, item) => {
      if (!acc[item.name]) {
          acc[item.name] = { 
              name: item.name, 
              specs: item.specs, 
              qty: 0, 
              conditions: { available: 0, 'in-use': 0, maintenance: 0, broken: 0 } 
          };
      }
      acc[item.name].qty += 1;
      acc[item.name].conditions[item.status] += 1;
      return acc;
  }, {} as Record<string, ItemSummary>));

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  // Helper for Monthly View (Simulated)
  const getDaysInMonth = () => Array.from({ length: 30 }, (_, i) => i + 1);
  const getDayName = (dayNum: number) => {
      // Simulate Month starting on Wednesday (index 2)
      const dayIndex = (dayNum + 1) % 7; 
      const dayNames = ['Minggu','Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return dayNames[dayIndex];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-unp-accent text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Informasi Fasilitas & Jadwal</h1>
          <p className="text-blue-200 max-w-2xl">
            Detail lengkap mengenai inventaris alat di setiap laboratorium serta jadwal penggunaan ruangan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex flex-col sm:flex-row gap-2 w-full md:w-fit">
            <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'inventory' ? 'bg-unp-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                <Box size={18} /> Data Inventaris
            </button>
            <button 
                onClick={() => setActiveTab('schedule')}
                className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'schedule' ? 'bg-unp-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                <Calendar size={18} /> Jadwal Pemakaian
            </button>
            </div>
        </div>

        {activeTab === 'inventory' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">Daftar Ruangan</div>
                <div className="divide-y divide-gray-100">
                  {STATIC_LAB_INFO.map((lab) => (
                    <button
                      key={lab.id}
                      onClick={() => setSelectedLabId(lab.id)}
                      className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                        selectedLabId === lab.id ? 'bg-blue-50 text-unp-primary border-l-4 border-unp-primary' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedLabId === lab.id ? 'bg-white' : 'bg-gray-100'}`}>{lab.icon}</div>
                      <span className="font-medium text-sm">{lab.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">{selectedLabInfo.name}</h2>
                    <p className="text-gray-500 mt-2 text-sm flex items-center gap-2"><MapPin size={16} /> {selectedLabInfo.location}</p>
                    <p className="text-gray-600 mt-4 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">{selectedLabInfo.description}</p>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><Box size={20} className="text-unp-secondary" /> Daftar Alat & Spesifikasi</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                      <tr><th className="px-6 py-4">Nama Alat</th><th className="px-6 py-4">Spesifikasi Utama</th><th className="px-6 py-4 text-center">Total Unit</th><th className="px-6 py-4">Status Summary</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {groupedItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 text-gray-500">{item.specs}</td>
                          <td className="px-6 py-4 text-center font-mono font-bold">{item.qty}</td>
                          <td className="px-6 py-4">
                              <div className="flex flex-col gap-1 text-[10px]">
                                  {item.conditions.available > 0 && <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded w-fit">Avail: {item.conditions.available}</span>}
                                  {item.conditions['in-use'] > 0 && <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded w-fit">In-Use: {item.conditions['in-use']}</span>}
                                  {(item.conditions.maintenance + item.conditions.broken) > 0 && <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded w-fit">Issue: {item.conditions.maintenance + item.conditions.broken}</span>}
                              </div>
                          </td>
                        </tr>
                      ))}
                      {groupedItems.length === 0 && (
                          <tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada data inventaris untuk ruangan ini.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
             <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-gray-800">Jadwal Pemakaian Laboratorium</h2>
                    <p className="text-gray-500 text-sm">Update Realtime dari Sistem Akademik</p>
                </div>
                
                {/* View Toggles */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                        onClick={() => setScheduleView('weekly')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${scheduleView === 'weekly' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <List size={16} /> Mode Mingguan
                    </button>
                    <button 
                        onClick={() => setScheduleView('monthly')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${scheduleView === 'monthly' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutGrid size={16} /> Mode Bulanan
                    </button>
                </div>
             </div>

             {/* WEEKLY VIEW */}
             {scheduleView === 'weekly' && (
                 <div className="relative group">
                    {/* Visual hints for scrolling */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 md:hidden bg-white/80 p-1 rounded-full shadow-lg"><ChevronLeft size={20} className="text-gray-400" /></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 md:hidden bg-white/80 p-1 rounded-full shadow-lg"><ChevronRight size={20} className="text-gray-400" /></div>
                    
                    <div className="overflow-x-auto pb-4 scrollbar-hide">
                        <div className="grid grid-cols-5 gap-4 min-w-[1000px]"> {/* Fixed min-width to force scroll on small screens */}
                            {days.map(day => {
                                const daySchedules = schedules.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time));
                                const isToday = new Date().toLocaleDateString('id-ID', { weekday: 'long' }) === day;
                                return (
                                    <div key={day} className={`flex flex-col h-full rounded-xl overflow-hidden border ${isToday ? 'border-unp-primary ring-2 ring-unp-primary/20' : 'border-gray-200'}`}>
                                        <div className={`p-4 text-center ${isToday ? 'bg-unp-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
                                            <span className="block font-bold text-lg">{day}</span>
                                            {isToday && <span className="text-[10px] uppercase tracking-wider opacity-90">Hari Ini</span>}
                                        </div>
                                        <div className="bg-white p-3 flex-grow space-y-3 min-h-[350px]">
                                            {daySchedules.length > 0 ? (
                                                daySchedules.map((sch, idx) => (
                                                <div key={idx} className={`p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50 ${sch.color.replace('bg-', 'border-')}`}>
                                                    <div className="flex items-center gap-1 mb-2 text-gray-500 font-mono text-xs">
                                                        <Clock size={12} /> {sch.time}
                                                    </div>
                                                    <h4 className="font-bold text-gray-800 text-sm leading-snug mb-2">{sch.subject}</h4>
                                                    <div className="flex items-start gap-2 text-xs text-gray-600 mb-1">
                                                        <MapPin size={12} className="shrink-0 mt-0.5" /> <span>{sch.room}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-600">
                                                        <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center shrink-0 mt-0.5 text-[8px] text-white">D</div> 
                                                        <span className="truncate">{sch.lecturer}</span>
                                                    </div>
                                                </div>
                                                ))
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-300 text-sm py-10">
                                                    <CheckCircle size={32} className="mb-2 opacity-20" />
                                                    Tidak ada jadwal
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2 md:hidden">Geser ke samping untuk melihat hari lain</p>
                 </div>
             )}

             {/* MONTHLY VIEW */}
             {scheduleView === 'monthly' && (
                 <div className="border border-gray-200 rounded-xl overflow-hidden">
                     <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                         {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                             <div key={d} className="py-3 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">{d}</div>
                         ))}
                     </div>
                     <div className="grid grid-cols-7 auto-rows-fr bg-white">
                         {getDaysInMonth().map(dayNum => {
                             const dayName = getDayName(dayNum);
                             // Find if there are recurring schedules for this day name
                             const daySchedules = schedules.filter(s => s.day === dayName);
                             
                             return (
                                 <div key={dayNum} className="min-h-[100px] border-b border-r border-gray-100 p-2 hover:bg-gray-50 transition-colors">
                                     <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${dayNum === 15 ? 'bg-unp-primary text-white' : 'text-gray-700'}`}>
                                         {dayNum}
                                     </span>
                                     <div className="space-y-1">
                                         {daySchedules.map((sch, idx) => (
                                             <div key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 truncate" title={`${sch.time} - ${sch.subject}`}>
                                                 {sch.time.split(' - ')[0]} {sch.subject}
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )
                         })}
                         {/* Empty slots filler for visual grid if needed (35 total) */}
                         {Array.from({length: 5}).map((_, i) => <div key={`e-${i}`} className="bg-gray-50/50"></div>)}
                     </div>
                 </div>
             )}

             <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                 <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                 <div className="text-sm text-blue-800">
                     <strong>Catatan Penting:</strong> Jadwal dapat berubah sewaktu-waktu (kuliah pengganti, maintenance mendadak). Silakan cek pengumuman di papan informasi lab atau hubungi asisten lab.
                 </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPage;