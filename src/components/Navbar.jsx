import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Diamond, User } from 'lucide-react'; // อย่าลืม npm install lucide-react

export default function Navbar() {
  const { userData, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-3 flex justify-between items-center pointer-events-none">
      {/* Group ซ้าย: Profile */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-auto flex items-center gap-3 border border-slate-200">
        <div className="bg-slate-200 p-1.5 rounded-full">
          <User size={18} className="text-slate-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-bold leading-none">ผู้เล่น</span>
          <span className="text-sm font-bold text-slate-800 leading-none">{userData?.email?.split('@')[0]}</span>
        </div>
      </div>

      {/* Group ขวา: Score & Logout */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Score Badge */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-2">
          <Diamond size={18} className="text-blue-500 fill-blue-500" />
          <span className="font-bold text-slate-800">{userData?.score || 0}</span>
          <span className="text-xs text-slate-400">XP</span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
          title="ออกจากระบบ"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}