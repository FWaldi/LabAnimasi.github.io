import { NavLink, NewsItem, Staff } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Beranda', href: '/' },
  { 
    label: 'Fasilitas', 
    href: '#fasilitas',
    dropdown: [
      { label: 'Lab Komputer Utama', href: '#lab-utama' },
      { label: 'Studio Motion Capture', href: '#mocap' },
      { label: 'Studio Audio & Dubbing', href: '#audio' },
      { label: 'Render Farm', href: '#render' }
    ]
  },
  { 
    label: 'Layanan', 
    href: '#layanan',
    dropdown: [
      { label: 'Peminjaman Alat', href: '#peminjaman' },
      { label: 'Jadwal Praktikum', href: '#jadwal' },
      { label: 'SOP & K3', href: '#sop' }
    ]
  },
  { label: 'Inventaris', href: '#inventaris' },
  { label: 'Info Lab', href: '#info' },
  { label: 'Kontak', href: '#kontak' },
];

export const LATEST_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Maintenance Berkala PC Workstation Lab A",
    date: "10 Februari 2024",
    summary: "Akan dilakukan maintenance rutin dan update driver GPU pada seluruh unit komputer di Lab A. Mohon backup data sebelum tanggal tersebut.",
    image: "https://picsum.photos/seed/pcbuild/600/400",
    category: "Maintenance"
  },
  {
    id: 2,
    title: "Kedatangan Alat Baru: 20 Unit Wacom Cintiq Pro 24",
    date: "01 Februari 2024",
    summary: "Laboratorium Animasi kedatangan fasilitas baru berupa Pen Display untuk menunjang mata kuliah Digital Painting dan 3D Sculpting.",
    image: "https://picsum.photos/seed/tablet/600/400",
    category: "Fasilitas"
  },
  {
    id: 3,
    title: "Workshop Penggunaan Alat Motion Capture Optitrack",
    date: "25 Januari 2024",
    summary: "Wajib bagi mahasiswa semester 4 yang akan mengambil mata kuliah Teknik Gerak Digital. Pendaftaran dibuka melalui asisten lab.",
    image: "https://picsum.photos/seed/mocapstudio/600/400",
    category: "Pelatihan"
  }
];

export const LAB_TEAM: Staff[] = [
  {
    id: 1,
    name: "Rudi Hermawan, M.Kom.",
    role: "Kepala Laboratorium",
    image: "https://picsum.photos/seed/lecturer3/200/200"
  },
  {
    id: 2,
    name: "Ahmad Teknisi, A.Md.",
    role: "Teknisi Lab Komputer",
    image: "https://picsum.photos/seed/tech1/200/200"
  },
  {
    id: 3,
    name: "Sarah Admin, S.Tr.Anim.",
    role: "Administrasi & Inventaris",
    image: "https://picsum.photos/seed/admin1/200/200"
  },
  {
    id: 4,
    name: "Team Asisten Lab",
    role: "Student Staff",
    image: "https://picsum.photos/seed/students/200/200"
  }
];