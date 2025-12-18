import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { THEMES } from '../config/assets';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // สลับ Login/Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/'); // กลับหน้าหลัก
    } catch (err) {
      setError('เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${THEMES.forest.bgClass}`}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 font-thai text-slate-800">
          {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิกใหม่'}
        </h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition"
          >
            {isLogin ? 'เข้าเล่นเกม' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีอยู่แล้ว?'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 font-bold ml-1 hover:underline"
          >
            {isLogin ? 'สมัครเลย' : 'ล็อคอิน'}
          </button>
        </p>
      </div>
    </div>
  );
}