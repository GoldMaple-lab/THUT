import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import GameMap from './pages/GameMap';

// PrivateRoute: ตัวกั้นประตู
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // 1. ถ้ากำลังโหลดข้อมูล User ให้รอ... (แสดง Loading Screen)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-emerald-600 text-xl font-bold animate-pulse font-thai">
          กำลังเข้าสู่ระบบ...
        </div>
      </div>
    );
  }

  // 2. ถ้าโหลดเสร็จแล้ว แต่ไม่มี User -> ไปหน้า Login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 3. ถ้ามี User -> เข้าเกมได้
  return children;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <GameMap />
              </PrivateRoute>
            } 
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;