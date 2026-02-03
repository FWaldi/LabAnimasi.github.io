export type UserRole = 'guest' | 'laboran' | 'dosen' | 'mahasiswa';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  nim_nip?: string;
  email?: string;
  password?: string; // For demo purposes only
  department?: string;
  profileImage?: string; // New field
  isBlocked?: boolean; // New field
}

export interface Equipment {
  id: string;
  name: string;
  labLocation: string; // e.g., "Lab Motion Capture", "Lab Komputer A"
  status: 'available' | 'in-use' | 'maintenance' | 'broken';
  specs: string;
  lastMaintained?: string;
}

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  labLocation?: string;
  reportedBy: string; // Dosen Name
  description: string;
  date: string;
  status: 'open' | 'resolved';
}

export type ArtworkType = 'image' | 'video' | 'asset';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  tags: string[];
  studentName: string;
  studentNim: string;
  
  type: ArtworkType;
  imageUrl: string; // Used for Image type OR Cover for Asset/Video
  videoUrl?: string; // For Video type
  assetUrl?: string; // For Asset type (Download link)
  
  category: string;
  uploadedAt: string;
  lecturerFeedback?: string; // Feedback from Dosen
  lecturerName?: string;
}

export interface LabSession {
  id: string;
  userId?: string;
  userRole: 'mahasiswa' | 'dosen';
  studentName: string;
  studentNim: string;
  equipmentId: string; // Device ID or "Teaching Station"
  labLocation: string;
  startTime: string;
  endTime?: string;
  date: string;
  subject?: string; 
  lecturerName?: string; 
  status: 'active' | 'completed';
}

export interface ClassSchedule {
  id: string;
  day: string;
  time: string;
  subject: string;
  lecturer: string;
  room: string;
  color: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  image: string;
  category: string;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface NavLink {
  label: string;
  href: string;
  action?: () => void;
  dropdown?: { label: string; href: string }[];
}