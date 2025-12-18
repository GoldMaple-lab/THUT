import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Diamond, User, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { userData, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 pointer-events-none font-thai">
      <div className="relative flex justify-between items-center w-full max-w-7xl mx-auto">
        
        {/* --- LEFT: Profile --- */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm pointer-events-auto flex items-center gap-3 border border-white/60 transition-transform hover:scale-105">
          <div className="bg-blue-100 p-1.5 rounded-full">
            <User size={18} className="text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold">ผู้เล่น</span>
            <span className="text-sm font-bold text-slate-700 leading-none max-w-[100px] truncate">
              {userData?.email?.split('@')[0] || 'Guest'}
            </span>
          </div>
        </div>

        {/* --- CENTER: APP LOGO (แก้ใหม่ให้เข้าธีม) --- */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto select-none">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg border-4 border-white/40 ring-1 ring-slate-100/50">
            {/* ไอคอนหนังสือสีพาสเทล */}
            <div className="bg-orange-100 p-1.5 rounded-full">
              <BookOpen size={20} className="text-orange-500" strokeWidth={2.5} />
            </div>
            
            {/* ชื่อแอป ฟอนต์ไทย สีสวยๆ */}
            <h1 className="text-xl font-extrabold text-slate-700 tracking-wide drop-shadow-sm">
              THAI <span className="text-blue-500">UNDERSTAND</span>
            </h1>
          </div>
        </div>

        {/* --- RIGHT: Score & Logout --- */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Score */}
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/60 flex items-center gap-2 transition-transform hover:scale-105">
            <Diamond size={20} className="text-cyan-500 fill-cyan-500" />
            <div className="flex flex-col items-end leading-none">
              <span className="font-black text-slate-700 text-lg">{userData?.score || 0}</span>
              <span className="text-[9px] text-slate-400 font-bold">XP Points</span>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={logout}
            className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 p-2.5 rounded-xl shadow-sm transition-all hover:rotate-90 active:scale-90"
            title="ออกจากระบบ"
          >
            <LogOut size={20} />
          </button>
        </div>

      </div>
    </nav>
  );
}