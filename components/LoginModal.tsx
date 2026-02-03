import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserCog, GraduationCap, Users } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { login } = useApp();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [role, setRole] = useState<'laboran' | 'dosen' | 'mahasiswa'>('mahasiswa');
  const [username, setUsername] = useState('');
  const [idNum, setIdNum] = useState('');

  const handleRoleSelect = (r: 'laboran' | 'dosen' | 'mahasiswa') => {
    setRole(r);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, username, idNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login Sistem Laboratorium
        </h2>

        {step === 'role' ? (
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => handleRoleSelect('laboran')} className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 flex items-center gap-4 transition-all">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600"><UserCog /></div>
              <div className="text-left">
                <div className="font-bold text-gray-800">Laboran / Teknisi</div>
                <div className="text-xs text-gray-500">Manajemen Inventaris & User</div>
              </div>
            </button>
            <button onClick={() => handleRoleSelect('dosen')} className="p-4 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 flex items-center gap-4 transition-all">
              <div className="bg-amber-100 p-3 rounded-full text-amber-600"><GraduationCap /></div>
              <div className="text-left">
                <div className="font-bold text-gray-800">Dosen Pengawas</div>
                <div className="text-xs text-gray-500">Lapor Kerusakan & Moderasi</div>
              </div>
            </button>
            <button onClick={() => handleRoleSelect('mahasiswa')} className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 flex items-center gap-4 transition-all">
              <div className="bg-green-100 p-3 rounded-full text-green-600"><Users /></div>
              <div className="text-left">
                <div className="font-bold text-gray-800">Mahasiswa</div>
                <div className="text-xs text-gray-500">Upload Karya & Akses Komputer</div>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {role === 'mahasiswa' ? 'Nama Mahasiswa' : role === 'dosen' ? 'Nama Dosen' : 'Nama Petugas'}
              </label>
              <input 
                required 
                className="w-full border rounded p-3" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan nama lengkap..." 
              />
            </div>
            {(role === 'mahasiswa' || role === 'dosen') && (
              <div className="mb-6">
                 <label className="block text-sm font-bold text-gray-700 mb-1">
                  {role === 'mahasiswa' ? 'NIM' : 'NIP'}
                </label>
                <input 
                  required 
                  className="w-full border rounded p-3" 
                  value={idNum}
                  onChange={e => setIdNum(e.target.value)}
                  placeholder="Nomor Induk..." 
                />
              </div>
            )}
            <button type="submit" className="w-full bg-unp-primary text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
              Masuk Dashboard
            </button>
            <button type="button" onClick={() => setStep('role')} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-800">
              Kembali pilih role
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;