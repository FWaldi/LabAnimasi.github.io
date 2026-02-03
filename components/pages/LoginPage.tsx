import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCog, GraduationCap, Users, Lock, User as UserIcon, AlertCircle, ArrowRight, PlayCircle } from 'lucide-react';
import { UserRole } from '../../types';

const LoginPage: React.FC = () => {
  const { login, users } = useApp();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!id || !password) {
      setError('Mohon lengkapi User ID dan Password!');
      return;
    }

    const foundUser = users.find(u => u.nim_nip === id);

    if (foundUser) {
        if (foundUser.password === password) {
            if (foundUser.isBlocked) {
                setError('Akun ini telah DIBLOKIR. Hubungi Laboran.');
                return;
            }
            login(foundUser.role, foundUser.name, foundUser.nim_nip || '');
        } else {
            setError('Password salah.');
        }
    } else {
        setError('User ID tidak ditemukan.');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
      // Find a valid user for this role from the dummy data
      const demoUser = users.find(u => u.role === role && !u.isBlocked);
      if (demoUser) {
          login(demoUser.role, demoUser.name, demoUser.nim_nip || '');
      } else {
          setError(`Tidak ada user ${role} tersedia untuk demo.`);
      }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Illustration / Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-unp-primary to-blue-900 p-12 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 border border-white/20">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Logo_Universitas_Negeri_Padang.svg/1200px-Logo_Universitas_Negeri_Padang.svg.png" 
                    alt="UNP Logo"
                    className="w-10 h-10 object-contain"
                />
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Sistem Informasi Laboratorium Animasi</h2>
            <p className="text-blue-100 leading-relaxed text-sm opacity-90">
              Satu pintu akses untuk manajemen aset, praktikum, dan showcase karya Fakultas Vokasi UNP.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <p className="font-bold text-xs tracking-widest uppercase mb-4 opacity-70">Support Role</p>
            <div className="flex gap-4">
                <div className="text-center">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1 mx-auto"><Users size={18} /></div>
                    <span className="text-[10px]">Mahasiswa</span>
                </div>
                <div className="text-center">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1 mx-auto"><GraduationCap size={18} /></div>
                    <span className="text-[10px]">Dosen</span>
                </div>
                 <div className="text-center">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1 mx-auto"><UserCog size={18} /></div>
                    <span className="text-[10px]">Laboran</span>
                </div>
            </div>
          </div>

          {/* Background Patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Selamat Datang</h3>
            <p className="text-gray-500 text-sm mt-1">Silakan login menggunakan User ID & Password Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2 border border-red-100">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> 
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">User ID (NIM / NIP)</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-unp-primary focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-gray-800"
                  placeholder="Contoh: 2001001"
                />
                <UserIcon size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-unp-primary transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-unp-primary focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="••••••••"
                />
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-unp-primary transition-colors" />
              </div>
            </div>

            <button type="submit" className="w-full bg-unp-primary text-white font-bold py-3.5 rounded-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 mt-2 flex items-center justify-center gap-2 group">
              Masuk Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Demo Login Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">Akses Demo Cepat (Tanpa Password)</p>
             <div className="grid grid-cols-3 gap-3">
                <button 
                    onClick={() => handleDemoLogin('mahasiswa')}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Users size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">Mahasiswa</span>
                </button>
                
                <button 
                    onClick={() => handleDemoLogin('dosen')}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <GraduationCap size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">Dosen</span>
                </button>

                <button 
                    onClick={() => handleDemoLogin('laboran')}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <UserCog size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">Laboran</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;