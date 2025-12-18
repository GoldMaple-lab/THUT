import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore'; // 🔥 เปลี่ยน getDoc เป็น onSnapshot

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign Up
  async function signup(email, password) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // สร้าง User ใน Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      email: email,
      role: 'user',
      score: 0,
      unlockedLevel: 1 // เริ่มต้นที่ด่าน 1
    });
    return res;
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // --- 🔥 หัวใจหลัก: ระบบ Realtime User Data ---
  useEffect(() => {
    let unsubscribeUserDoc; // ตัวแปรเก็บฟังก์ชันยกเลิกการฟัง

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true); // เริ่มโหลด

      if (user) {
        setCurrentUser(user);
        
        // ✅ เปลี่ยนจาก getDoc เป็น onSnapshot
        // เมื่อข้อมูลใน DB เปลี่ยน (เช่น ชนะด่าน) -> บรรทัดนี้จะทำงานทันที -> หน้าจออัปเดตทันที
        const userRef = doc(db, "users", user.uid);
        
        unsubscribeUserDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // กรณีหาไม่เจอ (กัน Error)
            setUserData({ role: 'user', score: 0, unlockedLevel: 1 });
          }
          setLoading(false); // โหลดเสร็จแล้ว
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });

      } else {
        // กรณี Logout
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        // หยุดฟังข้อมูล User เก่า
        if (unsubscribeUserDoc) unsubscribeUserDoc(); 
      }
    });

    // Cleanup function (ทำงานเมื่อปิดหน้าเว็บ)
    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}