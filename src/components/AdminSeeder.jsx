import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';

export default function AdminSeeder() {
  const [status, setStatus] = useState('');

  const createInitialWorld = async () => {
    setStatus('กำลังสร้างโลก... กรุณารอสักครู่');
    try {
      const batch = writeBatch(db);

      // 1. สร้าง Zone 1 (ป่า)
      // เราใช้ addDoc เพื่อให้ Firestore Gen ID ให้ แต่ในที่นี้เพื่อความง่ายในการอ้างอิง
      // ผมจะใช้ doc() แบบระบุ ID เองสำหรับ demo นี้นะครับ
      
      const zoneRef = doc(collection(db, "zones")); // Gen Auto ID
      batch.set(zoneRef, {
        orderIndex: 1,
        themeId: "forest",
        decorations: [
          { type: "tree_1", x: 10, y: 15, scale: 1.2 },
          { type: "tree_2", x: 85, y: 25, scale: 1.5 },
          { type: "rock", x: 20, y: 70, scale: 0.8 },
          { type: "cloud", x: 50, y: 5, scale: 1.0 }
        ]
      });

      // 2. สร้าง 5 ด่านแรก (Levels) ใส่ Zone นี้
      const positions = [
        { x: 50, y: 150 }, { x: 20, y: 300 }, { x: 60, y: 450 }, { x: 30, y: 600 }, { x: 50, y: 750 }
      ];

      positions.forEach((pos, index) => {
        const levelRef = doc(collection(db, "levels"));
        batch.set(levelRef, {
          zoneId: zoneRef.id, // ผูกกับ Zone ที่เพิ่งสร้าง
          order: index + 1,
          x: pos.x, // %
          y: pos.y, // px (สมมติว่าเป็นระยะห่างจากด้านบนของ Zone)
          title: `ด่านที่ ${index + 1}`,
          quiz: {
            question: "1 + 1 เท่ากับเท่าไหร่?",
            choices: ["1", "2", "3", "4"],
            answer: 1
          }
        });
      });

      await batch.commit();
      setStatus('✅ สร้างโลกเสร็จสมบูรณ์! เช็ค Firestore ได้เลย');
    } catch (err) {
      console.error(err);
      setStatus('❌ เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button 
        onClick={createInitialWorld}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg text-xs"
      >
        🛠 ADMIN: Reset World
      </button>
      {status && <div className="bg-white p-2 mt-2 rounded shadow text-xs">{status}</div>}
    </div>
  );
}