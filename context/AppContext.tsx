import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Equipment, Artwork, MaintenanceLog, LabSession, ClassSchedule } from '../types';

export type PageType = 'home' | 'showcase' | 'info' | 'login';

interface AppContextType {
  user: User | null;
  users: User[];
  login: (role: UserRole, name: string, id: string) => void;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  manageUser: (action: 'add' | 'update' | 'delete', userData: User) => void;
  
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
  
  inventory: Equipment[];
  artworks: Artwork[];
  artworkCategories: string[];
  maintenanceLogs: MaintenanceLog[];
  activeSessions: LabSession[];
  sessionHistory: LabSession[];
  schedules: ClassSchedule[];
  
  currentDeviceId: string | null; 
  
  // Actions
  addEquipment: (item: Equipment) => void;
  updateEquipment: (item: Equipment) => void; // New
  reportIssue: (equipmentId: string, description: string) => void;
  resolveIssue: (logId: string) => void;
  
  uploadArtwork: (art: Artwork) => void;
  deleteArtwork: (id: string) => void;
  addArtworkCategory: (category: string) => void;
  removeArtworkCategory: (category: string) => void;
  giveArtworkFeedback: (artId: string, feedback: string, lecturerName: string) => void;

  startSession: () => void; // For Student
  startLecturerSession: (labLocation: string, subject?: string) => void; // For Lecturer
  endSession: (sessionId: string) => void;
  
  manageSchedule: (action: 'add' | 'delete' | 'update', schedule: ClassSchedule) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- SEED DATA ---

const INITIAL_USERS: User[] = [
  // Dosen
  { id: 'd1', name: 'Rudi Hermawan, M.Kom', role: 'dosen', nim_nip: '19850101', email: 'rudi@unp.ac.id', password: '123', profileImage: 'https://picsum.photos/seed/dosen1/200/200' },
  { id: 'd2', name: 'Siti Nurbaya, S.Sn, M.Sn', role: 'dosen', nim_nip: '19900202', email: 'siti@unp.ac.id', password: '123', profileImage: 'https://picsum.photos/seed/dosen2/200/200' },
  { id: 'd3', name: 'Dr. Budi Santoso', role: 'dosen', nim_nip: '19800303', email: 'budi_dr@unp.ac.id', password: '123', profileImage: 'https://picsum.photos/seed/dosen3/200/200' },
  
  // Laboran
  { id: 'l1', name: 'Ahmad Teknisi, A.Md', role: 'laboran', nim_nip: '19950505', email: 'ahmad@unp.ac.id', password: '123', profileImage: 'https://picsum.photos/seed/lab1/200/200' },
  { id: 'l2', name: 'Rina Admin', role: 'laboran', nim_nip: '19960606', email: 'rina@unp.ac.id', password: '123' },

  // Mahasiswa
  { id: 'm1', name: 'Iqbal Ramadan', role: 'mahasiswa', nim_nip: '2001001', email: 'iqbal@mhs.unp.ac.id', password: '123', profileImage: 'https://picsum.photos/seed/mhs1/200/200' },
  { id: 'm2', name: 'Sarah Putri', role: 'mahasiswa', nim_nip: '2001002', email: 'sarah@mhs.unp.ac.id', password: '123', profileImage: 'https://picsum.photos/seed/mhs2/200/200' },
  { id: 'm3', name: 'Kevin Sanjaya', role: 'mahasiswa', nim_nip: '2001003', email: 'kevin@mhs.unp.ac.id', password: '123', profileImage: 'https://picsum.photos/seed/mhs3/200/200' },
  { id: 'm4', name: 'Dinda Kirana', role: 'mahasiswa', nim_nip: '2001004', email: 'dinda@mhs.unp.ac.id', password: '123', isBlocked: true }, // Blocked User Example
  { id: 'm5', name: 'Eko Patrio', role: 'mahasiswa', nim_nip: '2001005', email: 'eko@mhs.unp.ac.id', password: '123' },
];

const INITIAL_INVENTORY: Equipment[] = [
  // Lab Komputer A (Total 10 PCs for demo)
  { id: 'PC-A-01', name: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', status: 'available', specs: 'i9-11900K, RTX 3080, 64GB RAM' },
  { id: 'PC-A-02', name: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', status: 'in-use', specs: 'i9-11900K, RTX 3080, 64GB RAM' },
  { id: 'PC-A-03', name: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', status: 'maintenance', specs: 'i9-11900K, RTX 3080, 64GB RAM' }, // Maintenance
  { id: 'PC-A-04', name: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', status: 'available', specs: 'i9-11900K, RTX 3080, 64GB RAM' },
  { id: 'PC-A-05', name: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', status: 'available', specs: 'i9-11900K, RTX 3080, 64GB RAM' },
  { id: 'PC-A-06', name: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', status: 'available', specs: 'i9-11900K, RTX 3080, 64GB RAM' },
  { id: 'TAB-A-01', name: 'Wacom Cintiq 22', labLocation: 'Lab Komputer A', status: 'available', specs: '22 Inch Pen Display' },
  { id: 'TAB-A-02', name: 'Wacom Cintiq 22', labLocation: 'Lab Komputer A', status: 'in-use', specs: '22 Inch Pen Display' },
  
  // Studio Mocap
  { id: 'MOCAP-CAM-01', name: 'Optitrack Prime 13', labLocation: 'Studio Mocap', status: 'available', specs: '240 FPS, Low Latency' },
  { id: 'MOCAP-CAM-02', name: 'Optitrack Prime 13', labLocation: 'Studio Mocap', status: 'available', specs: '240 FPS, Low Latency' },
  { id: 'MOCAP-SUIT-M', name: 'Mocap Suit Size M', labLocation: 'Studio Mocap', status: 'available', specs: 'Active Markers' },
  { id: 'PC-MOCAP-01', name: 'Server Motive Body', labLocation: 'Studio Mocap', status: 'available', specs: 'Xeon W, 128GB RAM' },

  // Lab Audio
  { id: 'MIC-01', name: 'Neumann TLM 103', labLocation: 'Studio Audio', status: 'available', specs: 'Condenser Microphone' },
  { id: 'MIXER-01', name: 'Solid State Logic SSL2+', labLocation: 'Studio Audio', status: 'available', specs: 'Audio Interface' },
  { id: 'PC-AUDIO-01', name: 'iMac Pro 27"', labLocation: 'Studio Audio', status: 'broken', specs: 'M1 Max, Pro Tools Installed' }, // Broken
];

const INITIAL_SCHEDULES: ClassSchedule[] = [
  // Senin
  { id: 's1', day: 'Senin', time: '08:00 - 11:40', subject: '3D Modeling Dasar', lecturer: 'Rudi Hermawan, M.Kom', room: 'Lab Komputer A', color: 'bg-blue-100 border-blue-200 text-blue-800' },
  { id: 's2', day: 'Senin', time: '13:00 - 15:40', subject: 'Digital Sculpting', lecturer: 'Siti Nurbaya, S.Sn, M.Sn', room: 'Lab Komputer A', color: 'bg-indigo-100 border-indigo-200 text-indigo-800' },
  
  // Selasa
  { id: 's3', day: 'Selasa', time: '08:00 - 11:40', subject: 'Teknik Gerak Digital (Mocap)', lecturer: 'Dr. Budi Santoso', room: 'Studio Mocap', color: 'bg-orange-100 border-orange-200 text-orange-800' },
  { id: 's4', day: 'Selasa', time: '13:00 - 15:40', subject: 'Rigging Character', lecturer: 'Rudi Hermawan, M.Kom', room: 'Lab Komputer A', color: 'bg-emerald-100 border-emerald-200 text-emerald-800' },

  // Rabu
  { id: 's5', day: 'Rabu', time: '08:00 - 11:40', subject: 'Audio & Dubbing', lecturer: 'Siti Nurbaya, S.Sn, M.Sn', room: 'Studio Audio', color: 'bg-purple-100 border-purple-200 text-purple-800' },
  { id: 's6', day: 'Rabu', time: '13:00 - 15:40', subject: 'VFX Compositing', lecturer: 'Dr. Budi Santoso', room: 'Lab Komputer A', color: 'bg-pink-100 border-pink-200 text-pink-800' },

  // Kamis
  { id: 's7', day: 'Kamis', time: '08:00 - 11:40', subject: 'Animasi 2D Lanjut', lecturer: 'Siti Nurbaya, S.Sn, M.Sn', room: 'Lab Komputer A', color: 'bg-cyan-100 border-cyan-200 text-cyan-800' },

  // Jumat
  { id: 's8', day: 'Jumat', time: '08:30 - 11:00', subject: 'Kapita Selekta Animasi', lecturer: 'Dr. Budi Santoso', room: 'Lab Komputer A', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' },
];

const INITIAL_ARTWORKS: Artwork[] = [
  { 
    id: 'a1', type: 'image', title: 'Cyberpunk Padang 2077', 
    description: 'Konsep art futuristik membayangkan kota Padang dengan teknologi tinggi namun tetap mempertahankan kearifan lokal rumah gadang.', 
    tags: ['Concept Art', 'Sci-Fi', 'Digital Painting'], 
    studentName: 'Iqbal Ramadan', studentNim: '2001001', 
    imageUrl: 'https://picsum.photos/seed/cyber/800/600', category: 'Concept Art', uploadedAt: '10 Feb 2024' 
  },
  { 
    id: 'a2', type: 'asset', title: 'Minangkabau Warrior 3D', 
    description: 'Model 3D karakter pendekar silat dengan topologi game-ready. Rigged dan textured.', 
    tags: ['3D', 'Character', 'Asset'], 
    studentName: 'Sarah Putri', studentNim: '2001002', 
    imageUrl: 'https://picsum.photos/seed/warrior/800/600', assetUrl: '#', category: '3D Modeling', uploadedAt: '12 Feb 2024', 
    lecturerFeedback: 'Topologi wajah sangat rapi, edge flow bagus untuk animasi ekspresi. Perbaiki sedikit di bagian bahu agar deformasi lebih natural.', lecturerName: 'Rudi Hermawan, M.Kom' 
  },
  { 
    id: 'a3', type: 'video', title: 'Short Movie: Pulang', 
    description: 'Film pendek animasi 2D tentang perantau yang rindu kampung halaman.', 
    tags: ['2D Animation', 'Short Movie', 'Storytelling'], 
    studentName: 'Kevin Sanjaya', studentNim: '2001003', 
    imageUrl: 'https://picsum.photos/seed/movie/800/600', videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', category: '2D Animation', uploadedAt: '15 Feb 2024' 
  },
  {
    id: 'a4', type: 'image', title: 'Environment: Ngarai Sianok Fantasy',
    description: 'Matte painting pemandangan Ngarai Sianok dengan sentuhan elemen fantasi.',
    tags: ['VFX', 'Matte Painting', 'Environment'],
    studentName: 'Eko Patrio', studentNim: '2001005',
    imageUrl: 'https://picsum.photos/seed/canyon/800/600', category: 'VFX', uploadedAt: '18 Feb 2024',
    lecturerFeedback: 'Pencahayaan atmospheric perspective-nya dapat banget. Good job Eko.', lecturerName: 'Dr. Budi Santoso'
  }
];

const INITIAL_LOGS: MaintenanceLog[] = [
  { id: 'log1', equipmentId: 'PC-A-03', equipmentName: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', reportedBy: 'Rudi Hermawan, M.Kom', description: 'Blue Screen saat rendering berat (GPU Issue suspected)', date: '2024-02-20', status: 'open' },
  { id: 'log2', equipmentId: 'PC-AUDIO-01', equipmentName: 'iMac Pro 27"', labLocation: 'Studio Audio', reportedBy: 'Siti Nurbaya, S.Sn, M.Sn', description: 'Layar retak dan tidak mau booting', date: '2024-02-18', status: 'open' },
  { id: 'log3', equipmentId: 'PC-A-05', equipmentName: 'Workstation Dell Precision 3650', labLocation: 'Lab Komputer A', reportedBy: 'Iqbal Ramadan', description: 'Mouse double click', date: '2024-02-10', status: 'resolved' },
];

const INITIAL_HISTORY: LabSession[] = [
  { id: 'h1', userId: 'm1', userRole: 'mahasiswa', studentName: 'Iqbal Ramadan', studentNim: '2001001', equipmentId: 'PC-A-01', labLocation: 'Lab Komputer A', startTime: '08:00', endTime: '11:40', date: '2024-02-19', subject: '3D Modeling Dasar', lecturerName: 'Rudi Hermawan, M.Kom', status: 'completed' },
  { id: 'h2', userId: 'm2', userRole: 'mahasiswa', studentName: 'Sarah Putri', studentNim: '2001002', equipmentId: 'PC-A-02', labLocation: 'Lab Komputer A', startTime: '08:05', endTime: '11:40', date: '2024-02-19', subject: '3D Modeling Dasar', lecturerName: 'Rudi Hermawan, M.Kom', status: 'completed' },
  { id: 'h3', userId: 'm3', userRole: 'mahasiswa', studentName: 'Kevin Sanjaya', studentNim: '2001003', equipmentId: 'MOCAP-CAM-01', labLocation: 'Studio Mocap', startTime: '08:00', endTime: '11:00', date: '2024-02-20', subject: 'Teknik Gerak Digital', lecturerName: 'Dr. Budi Santoso', status: 'completed' },
];

const INITIAL_CATEGORIES = ['3D Modeling', '2D Animation', 'Concept Art', 'VFX', 'Motion Graphic', 'Audio Production'];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [inventory, setInventory] = useState<Equipment[]>(INITIAL_INVENTORY);
  const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_ARTWORKS);
  const [artworkCategories, setArtworkCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(INITIAL_SCHEDULES);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(INITIAL_LOGS);
  
  const [activeSessions, setActiveSessions] = useState<LabSession[]>([
      // Simulate an active session
      { id: 'act1', userId: 'm2', userRole: 'mahasiswa', studentName: 'Sarah Putri', studentNim: '2001002', equipmentId: 'PC-A-02', labLocation: 'Lab Komputer A', startTime: '13:10', date: new Date().toLocaleDateString(), subject: 'Digital Sculpting', lecturerName: 'Siti Nurbaya, S.Sn, M.Sn', status: 'active' },
      { id: 'act2', userId: 'm3', userRole: 'mahasiswa', studentName: 'Kevin Sanjaya', studentNim: '2001003', equipmentId: 'TAB-A-02', labLocation: 'Lab Komputer A', startTime: '13:15', date: new Date().toLocaleDateString(), subject: 'Digital Sculpting', lecturerName: 'Siti Nurbaya, S.Sn, M.Sn', status: 'active' },
  ]);
  const [sessionHistory, setSessionHistory] = useState<LabSession[]>(INITIAL_HISTORY);
  
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate detecting "PC-A-05"
    const simulatedDevice = 'PC-A-05';
    setCurrentDeviceId(simulatedDevice);
    console.log(`[System] Device Token Detected: ${simulatedDevice}`);
  }, []);

  const login = (role: UserRole, name: string, id: string) => {
    const existingUser = users.find(u => u.nim_nip === id && u.role === role);
    
    if (existingUser) {
      if (existingUser.isBlocked) {
        alert("Akun anda telah DIBLOKIR. Silahkan hubungi admin labor.");
        return;
      }
      setUser(existingUser);
    } else {
      // Create temp user for guest/demo purposes if not found in seed
      const newUser: User = {
        id: Date.now().toString(),
        name: name,
        role: role,
        nim_nip: id,
        email: `${id}@unp.ac.id`,
        password: '123',
        isBlocked: false
      };
      setUser(newUser);
      setUsers([...users, newUser]);
    }
    navigateTo('home');
  };

  const logout = () => {
    if (user?.role === 'mahasiswa') {
       const session = activeSessions.find(s => s.studentNim === user.nim_nip);
       if (session) endSession(session.id);
    }
    if (user?.role === 'dosen') {
        const session = activeSessions.find(s => s.userId === user.id);
        if (session) endSession(session.id);
    }
    setUser(null);
    navigateTo('login');
  };

  const updateUserProfile = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      setUsers(users.map(u => u.id === user.id ? newUser : u));
    }
  };

  const manageUser = (action: 'add' | 'update' | 'delete', userData: User) => {
    if (action === 'add') setUsers([...users, userData]);
    else if (action === 'update') setUsers(users.map(u => u.id === userData.id ? userData : u));
    else if (action === 'delete') setUsers(users.filter(u => u.id !== userData.id));
  };

  const manageSchedule = (action: 'add' | 'delete' | 'update', schedule: ClassSchedule) => {
    if (action === 'add') setSchedules([...schedules, schedule]);
    else if (action === 'update') setSchedules(schedules.map(s => s.id === schedule.id ? schedule : s));
    else setSchedules(schedules.filter(s => s.id !== schedule.id));
  };

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const addEquipment = (item: Equipment) => {
    setInventory([...inventory, item]);
  };
  
  const updateEquipment = (item: Equipment) => {
    setInventory(inventory.map(i => i.id === item.id ? item : i));
  };

  const reportIssue = (equipmentId: string, description: string) => {
    if (!user) return;
    const item = inventory.find(i => i.id === equipmentId);
    const newLog: MaintenanceLog = {
      id: Date.now().toString(),
      equipmentId,
      equipmentName: item?.name || 'Unknown',
      labLocation: item?.labLocation || 'Unknown',
      reportedBy: user.name,
      description,
      date: new Date().toLocaleDateString(),
      status: 'open'
    };
    setMaintenanceLogs([...maintenanceLogs, newLog]);
    setInventory(inventory.map(item => 
      item.id === equipmentId ? { ...item, status: 'maintenance' } : item
    ));
  };

  const resolveIssue = (logId: string) => {
    const log = maintenanceLogs.find(l => l.id === logId);
    if (log) {
      setMaintenanceLogs(maintenanceLogs.map(l => l.id === logId ? { ...l, status: 'resolved' } : l));
      setInventory(inventory.map(item => 
        item.id === log.equipmentId ? { ...item, status: 'available' } : item
      ));
    }
  };

  const uploadArtwork = (art: Artwork) => {
    setArtworks([art, ...artworks]);
  };

  const deleteArtwork = (id: string) => {
    setArtworks(artworks.filter(a => a.id !== id));
  };

  const addArtworkCategory = (category: string) => {
     if (!artworkCategories.includes(category)) {
        setArtworkCategories([...artworkCategories, category]);
     }
  };

  const removeArtworkCategory = (category: string) => {
     setArtworkCategories(artworkCategories.filter(c => c !== category));
  };

  const giveArtworkFeedback = (artId: string, feedback: string, lecturerName: string) => {
     setArtworks(artworks.map(a => a.id === artId ? { ...a, lecturerFeedback: feedback, lecturerName } : a));
  };

  const startSession = () => {
    if (!user || user.role !== 'mahasiswa' || !currentDeviceId) return;
    
    const device = inventory.find(i => i.id === currentDeviceId);
    if (!device) {
        alert("Device tidak dikenali dalam sistem inventaris.");
        return;
    }

    setInventory(inventory.map(item => 
      item.id === currentDeviceId ? { ...item, status: 'in-use' } : item
    ));

    const currentDay = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const activeSchedule = schedules.find(s => s.day === currentDay && s.room === device.labLocation);

    const newSession: LabSession = {
      id: Date.now().toString(),
      userId: user.id,
      userRole: 'mahasiswa',
      studentName: user.name,
      studentNim: user.nim_nip || '',
      equipmentId: currentDeviceId,
      labLocation: device.labLocation,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      subject: activeSchedule ? activeSchedule.subject : 'Praktikum Mandiri',
      lecturerName: activeSchedule ? activeSchedule.lecturer : '-',
      status: 'active'
    };
    setActiveSessions([...activeSessions, newSession]);
  };

  const startLecturerSession = (labLocation: string, subject?: string) => {
    if (!user || user.role !== 'dosen') return;

    const newSession: LabSession = {
      id: Date.now().toString(),
      userId: user.id,
      userRole: 'dosen',
      studentName: user.name,
      studentNim: user.nim_nip || '',
      equipmentId: 'TEACHING-STATION',
      labLocation: labLocation,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      subject: subject || 'Mengajar',
      status: 'active'
    };
    setActiveSessions([...activeSessions, newSession]);
  };

  const endSession = (sessionId: string) => {
    const session = activeSessions.find(s => s.id === sessionId);
    if (session) {
      if (session.equipmentId !== 'TEACHING-STATION') {
        setInventory(inventory.map(item => 
          item.id === session.equipmentId ? { ...item, status: 'available' } : item
        ));
      }
      
      const completedSession: LabSession = {
        ...session,
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed'
      };

      setSessionHistory([completedSession, ...sessionHistory]);
      setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
    }
  };

  return (
    <AppContext.Provider value={{
      user, users, login, logout, updateUserProfile, manageUser,
      currentPage, navigateTo,
      inventory, artworks, artworkCategories, maintenanceLogs, activeSessions, sessionHistory, schedules, currentDeviceId,
      addEquipment, updateEquipment, reportIssue, resolveIssue, 
      uploadArtwork, deleteArtwork, addArtworkCategory, removeArtworkCategory, giveArtworkFeedback,
      startSession, startLecturerSession, endSession, manageSchedule
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};