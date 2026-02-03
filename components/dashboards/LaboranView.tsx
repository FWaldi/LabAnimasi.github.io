import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  LayoutDashboard, Monitor, AlertTriangle, 
  Activity, Settings, Plus, Filter, Download, Clock, Users, Calendar, Trash2, Tag, Edit, Lock, Unlock, UserCog, Camera, Save, Search, MapPin, AlertCircle
} from 'lucide-react';
import { User, UserRole, ClassSchedule, Equipment } from '../../types';

const LaboranView: React.FC = () => {
  const { 
     user, updateUserProfile, inventory, activeSessions, sessionHistory, maintenanceLogs, resolveIssue, addEquipment, updateEquipment,
     users, manageUser, schedules, manageSchedule, artworkCategories, addArtworkCategory, removeArtworkCategory 
  } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // -- Local State --
  
  // Profile
  const [profileForm, setProfileForm] = useState({
     name: user?.name || '',
     email: user?.email || '',
     password: user?.password || '',
     confirmPassword: user?.password || '',
     profileImage: user?.profileImage || ''
  });

  // User Management
  const [newUser, setNewUser] = useState<Partial<User>>({ role: 'mahasiswa', name: '', nim_nip: '', password: '123' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState('');
  
  // Inventory
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', id: '', location: '', specs: '' });
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [inventoryFilter, setInventoryFilter] = useState('All');

  // Categories
  const [newCategory, setNewCategory] = useState('');

  // Schedules
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [scheduleForm, setScheduleForm] = useState<Partial<ClassSchedule>>({ day: 'Senin', room: 'Lab Komputer A' });

  // -- Handlers --

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

  const handleAddUser = (e: React.FormEvent) => {
     e.preventDefault();
     if (newUser.name && newUser.nim_nip) {
        manageUser('add', {
           id: Date.now().toString(),
           name: newUser.name,
           role: newUser.role as UserRole,
           nim_nip: newUser.nim_nip,
           password: newUser.password,
           email: `${newUser.nim_nip}@unp.ac.id`,
           isBlocked: false
        });
        setNewUser({ role: 'mahasiswa', name: '', nim_nip: '', password: '123' });
        alert('User berhasil ditambahkan');
     }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if(editingUser) {
          manageUser('update', editingUser);
          setEditingUser(null);
          alert("Data user berhasil diupdate.");
      }
  };

  const toggleBlockUser = (u: User) => {
      const updated = { ...u, isBlocked: !u.isBlocked };
      manageUser('update', updated);
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment({
      id: newItem.id,
      name: newItem.name,
      labLocation: newItem.location,
      specs: newItem.specs,
      status: 'available'
    });
    setShowAddForm(false);
    setNewItem({ name: '', id: '', location: '', specs: '' });
  };

  const handleUpdateEquipment = (e: React.FormEvent) => {
      e.preventDefault();
      if(editingItem) {
          updateEquipment(editingItem);
          setEditingItem(null);
      }
  };

  const handleAddCategory = (e: React.FormEvent) => {
     e.preventDefault();
     if(newCategory) {
        addArtworkCategory(newCategory);
        setNewCategory('');
     }
  };

  const handleUpdateSchedule = (e: React.FormEvent) => {
      e.preventDefault();
      if(editingSchedule && scheduleForm.subject) {
          manageSchedule('update', { ...editingSchedule, ...scheduleForm } as ClassSchedule);
          setEditingSchedule(null);
      }
  };

  // -- Menu Items --

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Manajemen User', icon: <Users size={20} /> },
    { id: 'schedules', label: 'Jadwal Lab', icon: <Calendar size={20} /> },
    { id: 'inventory', label: 'Inventaris', icon: <Monitor size={20} /> },
    { id: 'maintenance', label: 'Laporan Kerusakan', icon: <AlertTriangle size={20} /> },
    { id: 'sessions', label: 'Log Aktivitas', icon: <Activity size={20} /> },
    { id: 'categories', label: 'Kategori Karya', icon: <Tag size={20} /> },
    { id: 'profile', label: 'Edit Profil', icon: <Settings size={20} /> },
  ];

  const getPageTitle = () => {
    const item = menuItems.find(i => i.id === activeTab);
    return item ? item.label : 'Dashboard';
  };

  // -- Sub Components --

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm mb-1">Total Aset</p>
           <h3 className="text-3xl font-bold text-gray-800">{inventory.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm mb-1">Sedang Dipakai</p>
           <h3 className="text-3xl font-bold text-green-600">{activeSessions.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm mb-1">Total User</p>
           <h3 className="text-3xl font-bold text-purple-600">{users.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm mb-1">Dosen Mengajar</p>
           <h3 className="text-3xl font-bold text-orange-600">{activeSessions.filter(s => s.userRole === 'dosen').length}</h3>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h4 className="font-bold text-gray-800 mb-4">Monitoring Sesi Dosen (Teaching)</h4>
           {activeSessions.filter(s => s.userRole === 'dosen').length === 0 ? (
             <div className="text-center py-4 text-gray-400 border border-dashed rounded-lg">Tidak ada dosen yang sedang mengajar.</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {activeSessions.filter(s => s.userRole === 'dosen').map(s => (
                 <div key={s.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex justify-between items-center">
                    <div>
                       <h5 className="font-bold text-orange-900">{s.studentName}</h5>
                       <p className="text-sm text-orange-700">{s.labLocation} • {s.subject}</p>
                    </div>
                    <span className="text-xs font-bold bg-white text-orange-600 px-2 py-1 rounded">LIVE</span>
                 </div>
               ))}
             </div>
           )}
      </div>
    </div>
  );

  const UserManagementContent = () => {
      const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.nim_nip?.includes(userSearch));
      
      return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-6 text-gray-800">Manajemen Data Pengguna</h3>
        
        {/* Add User Form */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
           <h4 className="font-bold text-gray-700 text-sm mb-3">Tambah Pengguna Baru</h4>
           <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
               <div>
                  <label className="text-xs font-bold text-gray-600">Role</label>
                  <select className="w-full p-2 border rounded mt-1 text-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                     <option value="mahasiswa">Mahasiswa</option>
                     <option value="dosen">Dosen</option>
                     <option value="laboran">Laboran</option>
                  </select>
               </div>
               <div className="md:col-span-1">
                  <label className="text-xs font-bold text-gray-600">Nama Lengkap</label>
                  <input required className="w-full p-2 border rounded mt-1 text-sm" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Nama User" />
               </div>
               <div className="md:col-span-1">
                  <label className="text-xs font-bold text-gray-600">NIM / NIP</label>
                  <input required className="w-full p-2 border rounded mt-1 text-sm" value={newUser.nim_nip} onChange={e => setNewUser({...newUser, nim_nip: e.target.value})} placeholder="ID Nomor" />
               </div>
               <div className="md:col-span-1">
                  <label className="text-xs font-bold text-gray-600">Password</label>
                  <input required className="w-full p-2 border rounded mt-1 text-sm" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Default: 123" />
               </div>
               <button type="submit" className="bg-green-600 text-white p-2 rounded text-sm font-bold hover:bg-green-700">Tambah</button>
           </form>
        </div>

        <div className="flex justify-between items-center mb-4">
            <div className="relative">
                <input className="pl-8 pr-4 py-2 border rounded text-sm w-64" placeholder="Cari user..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                <Search size={14} className="absolute left-2.5 top-3 text-gray-400" />
            </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left border rounded-lg">
              <thead className="bg-gray-100 font-bold text-gray-700">
                 <tr><th className="p-3">Nama</th><th className="p-3">ID</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                       <td className="p-3 font-medium">{u.name}</td>
                       <td className="p-3 font-mono text-gray-600">{u.nim_nip}</td>
                       <td className="p-3 capitalize">{u.role}</td>
                       <td className="p-3">
                           {u.isBlocked ? <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">BLOCKED</span> : <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded">ACTIVE</span>}
                       </td>
                       <td className="p-3 text-right flex justify-end gap-2">
                          <button onClick={() => toggleBlockUser(u)} className={`p-1.5 rounded ${u.isBlocked ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {u.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                          </button>
                          <button onClick={() => setEditingUser(u)} className="p-1.5 bg-blue-100 text-blue-700 rounded"><Edit size={14} /></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Edit Modal (Reuse logic from before) */}
        {editingUser && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h3 className="font-bold text-lg mb-4">Edit User: {editingUser.name}</h3>
                    <form onSubmit={handleUpdateUser} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-600">Password Baru</label>
                            <input className="w-full p-2 border rounded" value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} />
                        </div>
                         <div>
                            <label className="text-xs font-bold text-gray-600">Email</label>
                            <input className="w-full p-2 border rounded" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
     </div>
  )};

  const InventoryContent = () => {
    // Unique Lab Locations
    const labLocations = Array.from(new Set(inventory.map(i => i.labLocation)));
    const filteredInventory = inventoryFilter === 'All' 
        ? inventory 
        : inventory.filter(i => i.labLocation === inventoryFilter);

    // Grouping by Lab for "All" view or specific view
    const groupedItems = labLocations.reduce((acc, lab) => {
        const labKey = lab as string;
        if (inventoryFilter !== 'All' && labKey !== inventoryFilter) return acc;
        acc[labKey] = inventory.filter(i => i.labLocation === labKey);
        return acc;
    }, {} as Record<string, Equipment[]>);

    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
            <h3 className="font-bold text-lg text-gray-800">Detail Inventaris</h3>
            <p className="text-sm text-gray-500">Kelola dan pantau status aset per laboratorium.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowAddForm(true)} className="bg-unp-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Tambah Unit</button>
        </div>
      </div>

      {/* Lab Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1 overflow-x-auto">
         <button 
            onClick={() => setInventoryFilter('All')} 
            className={`px-4 py-2 rounded-t-lg text-sm font-bold ${inventoryFilter === 'All' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
         >
            Semua Lab
         </button>
         {labLocations.map(lab => (
             <button 
                key={lab}
                onClick={() => setInventoryFilter(lab)} 
                className={`px-4 py-2 rounded-t-lg text-sm font-bold whitespace-nowrap ${inventoryFilter === lab ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
             >
                {lab}
             </button>
         ))}
      </div>

      {showAddForm && (
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg mb-6">
          <form onSubmit={handleAddEquipment} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-1"><input required className="w-full p-2 border rounded" value={newItem.id} onChange={e => setNewItem({...newItem, id: e.target.value})} placeholder="ID Aset" /></div>
            <div className="md:col-span-1"><input required className="w-full p-2 border rounded" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Nama Aset" /></div>
            <div className="md:col-span-1"><input required className="w-full p-2 border rounded" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} placeholder="Lokasi (Lab A, Mocap..)" /></div>
            <div className="md:col-span-1"><input required className="w-full p-2 border rounded" value={newItem.specs} onChange={e => setNewItem({...newItem, specs: e.target.value})} placeholder="Spesifikasi Singkat" /></div>
            <div className="flex gap-2"><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button></div>
          </form>
        </div>
      )}

      {/* Render Tables per Lab */}
      {Object.entries(groupedItems).map(([labName, items]) => (
        <div key={labName} className="mb-8 last:mb-0">
           <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <MapPin size={18} className="text-unp-secondary" /> {labName}
           </h4>
           <div className="overflow-x-auto border rounded-lg">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                <tr><th className="p-3">ID</th><th className="p-3">Nama Alat</th><th className="p-3">Status</th><th className="p-3">Specs</th><th className="p-3 text-right">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {items.map(item => {
                    const hasOpenReport = maintenanceLogs.some(l => l.equipmentId === item.id && l.status === 'open');
                    
                    return (
                        <tr key={item.id} className={`hover:bg-gray-50 ${hasOpenReport ? 'bg-yellow-50' : ''}`}>
                            <td className="p-3 font-mono text-blue-600 font-bold">{item.id}</td>
                            <td className="p-3 font-medium">{item.name}</td>
                            <td className="p-3">
                                {hasOpenReport && item.status !== 'broken' && item.status !== 'maintenance' ? (
                                    <div className="flex items-center gap-1 text-orange-600 font-bold text-xs">
                                        <AlertCircle size={14} /> Dalam Pengecekan
                                    </div>
                                ) : (
                                    <span className={`uppercase text-xs font-bold px-2 py-1 rounded 
                                        ${item.status === 'available' ? 'bg-green-100 text-green-700' : 
                                        item.status === 'broken' ? 'bg-red-100 text-red-700' : 
                                        item.status === 'in-use' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.status}
                                    </span>
                                )}
                            </td>
                            <td className="p-3 text-gray-500 text-xs">{item.specs}</td>
                            <td className="p-3 text-right">
                                <button onClick={() => setEditingItem(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"><Edit size={14} /></button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
             </table>
           </div>
        </div>
      ))}

      {editingItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                   <h3 className="font-bold text-lg mb-4">Edit Status Aset: {editingItem.id}</h3>
                   <form onSubmit={handleUpdateEquipment} className="space-y-3">
                       <div><label className="text-xs font-bold">Nama</label><input className="w-full p-2 border rounded" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                       <div><label className="text-xs font-bold">Lokasi</label><input className="w-full p-2 border rounded" value={editingItem.labLocation} onChange={e => setEditingItem({...editingItem, labLocation: e.target.value})} /></div>
                       <div><label className="text-xs font-bold">Update Status Kondisi</label>
                           <select className="w-full p-2 border rounded" value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value as any})}>
                               <option value="available">Available (Baik)</option>
                               <option value="in-use">In Use (Sedang Dipakai)</option>
                               <option value="maintenance">Maintenance (Perbaikan)</option>
                               <option value="broken">Broken (Rusak)</option>
                           </select>
                           <p className="text-[10px] text-gray-500 mt-1">*Ubah ke "Maintenance" atau "Broken" jika laporan kerusakan valid.</p>
                       </div>
                       <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                        </div>
                   </form>
              </div>
          </div>
      )}
    </div>
  )};

  const ProfileSettingsContent = () => (
     <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
           <Settings /> Pengaturan Akun Laboran
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

  // ... (Other components remain reused)
  const ScheduleManagementContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
       <h3 className="font-bold text-lg mb-6 text-gray-800">Manajemen Jadwal (Block View)</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {schedules.map(sch => (
             <div key={sch.id} className="relative p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => { setEditingSchedule(sch); setScheduleForm(sch); }} className="p-1 hover:bg-gray-100 rounded text-blue-500"><Edit size={14} /></button>
                    <button onClick={() => manageSchedule('delete', sch)} className="p-1 hover:bg-gray-100 rounded text-red-500"><Trash2 size={14} /></button>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded mb-2 inline-block">{sch.day}</span>
                <h4 className="font-bold text-gray-800 text-lg">{sch.subject}</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><Clock size={14} /> {sch.time}</p>
                    <p className="flex items-center gap-2"><Users size={14} /> {sch.lecturer}</p>
                    <p className="flex items-center gap-2"><Monitor size={14} /> {sch.room}</p>
                </div>
             </div>
          ))}
       </div>
       {/* Edit Schedule Modal */}
       {editingSchedule && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white p-6 rounded-lg w-full max-w-md">
                   <h3 className="font-bold text-lg mb-4">Edit Jadwal</h3>
                   <form onSubmit={handleUpdateSchedule} className="space-y-3">
                        <div>
                           <label className="text-xs font-bold text-gray-600">Mata Kuliah</label>
                           <input className="w-full p-2 border rounded" value={scheduleForm.subject} onChange={e => setScheduleForm({...scheduleForm, subject: e.target.value})} />
                       </div>
                       <div>
                           <label className="text-xs font-bold text-gray-600">Jam</label>
                           <input className="w-full p-2 border rounded" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} />
                       </div>
                       <div>
                           <label className="text-xs font-bold text-gray-600">Dosen</label>
                           <input className="w-full p-2 border rounded" value={scheduleForm.lecturer} onChange={e => setScheduleForm({...scheduleForm, lecturer: e.target.value})} />
                       </div>
                        <div className="flex justify-end gap-2 pt-2">
                           <button type="button" onClick={() => setEditingSchedule(null)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                           <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
 );

 const MaintenanceContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-6 text-gray-800">Laporan Detail Kondisi Aset</h3>
        <div className="overflow-x-auto">
         <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
               <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">ID Aset</th>
                  <th className="p-4">Lokasi</th>
                  <th className="p-4">Deskripsi Kerusakan</th>
                  <th className="p-4">Pelapor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {maintenanceLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                     <td className="p-4 text-gray-500">{log.date}</td>
                     <td className="p-4 font-mono font-bold">{log.equipmentId}</td>
                     <td className="p-4">{log.labLocation}</td>
                     <td className="p-4 text-red-600">{log.description}</td>
                     <td className="p-4">{log.reportedBy}</td>
                     <td className="p-4 uppercase text-xs font-bold">{log.status}</td>
                     <td className="p-4 text-right">
                         {log.status === 'open' && (
                             <button onClick={() => resolveIssue(log.id)} className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Selesai</button>
                         )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
);

const ActivityLogContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <h3 className="font-bold text-lg mb-6 text-gray-800">Detail Log Aktivitas Lab</h3>
         <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                <tr>
                   <th className="p-4">Waktu</th>
                   <th className="p-4">User</th>
                   <th className="p-4">Role</th>
                   <th className="p-4">Lokasi</th>
                   <th className="p-4">Aktivitas</th>
                   <th className="p-4">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {[...activeSessions, ...sessionHistory].sort((a,b) => b.startTime.localeCompare(a.startTime)).map(session => (
                   <tr key={session.id} className="hover:bg-gray-50">
                      <td className="p-4">{session.date} {session.startTime}</td>
                      <td className="p-4 font-bold">{session.studentName} <span className="text-gray-400 font-normal">({session.studentNim})</span></td>
                      <td className="p-4 capitalize">{session.userRole}</td>
                      <td className="p-4">{session.labLocation} <span className="text-xs bg-gray-100 px-1 rounded">{session.equipmentId}</span></td>
                      <td className="p-4">{session.subject}</td>
                      <td className="p-4">{session.status === 'active' ? <span className="text-green-600 font-bold">LIVE</span> : <span className="text-gray-500">Selesai ({session.endTime})</span>}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
);

const CategoriesContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
       <h3 className="font-bold text-lg mb-6 text-gray-800">Manajemen Kategori Karya</h3>
       <div className="flex gap-4 mb-6">
          <form onSubmit={handleAddCategory} className="flex-1 flex gap-2">
             <input className="flex-1 border rounded-lg px-4 py-2" placeholder="Nama Kategori Baru" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">Tambah</button>
          </form>
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artworkCategories.map(cat => (
             <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg">
                <span className="font-medium">{cat}</span>
                <button onClick={() => removeArtworkCategory(cat)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
             </div>
          ))}
       </div>
    </div>
 );


  return (
    <DashboardLayout 
      title={getPageTitle()} 
      menuItems={menuItems} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && <OverviewContent />}
      {activeTab === 'users' && <UserManagementContent />}
      {activeTab === 'schedules' && <ScheduleManagementContent />}
      {activeTab === 'categories' && <CategoriesContent />}
      {activeTab === 'inventory' && <InventoryContent />}
      {activeTab === 'maintenance' && <MaintenanceContent />}
      {activeTab === 'sessions' && <ActivityLogContent />}
      {activeTab === 'profile' && <ProfileSettingsContent />}
    </DashboardLayout>
  );
};

export default LaboranView;