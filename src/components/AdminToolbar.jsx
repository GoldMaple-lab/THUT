import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { THEMES } from '../config/assets';

export default function AdminToolbar({ zones, levels }) {
  const [loading, setLoading] = useState(false);
  const [showZoneSettings, setShowZoneSettings] = useState(false);

  const handleAddLevel = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. ถ้ายังไม่มี Zone เลย ให้สร้างใหม่ (เริ่มเกม)
      if (zones.length === 0) {
        const firstZoneRef = await addDoc(collection(db, "zones"), {
          orderIndex: 1, themeId: "forest", decorations: []
        });
        await addDoc(collection(db, "levels"), {
          zoneId: firstZoneRef.id, order: 1, x: 20, y: 100, // เริ่มซ้ายบน
          title: "จุดเริ่มต้น", quiz: { question: "...", choices: ["A","B"], answer: 0 }
        });
        setLoading(false);
        return;
      }

      // 2. หา Zone ล่าสุด (เรียงตาม orderIndex)
      const sortedZones = [...zones].sort((a,b) => a.orderIndex - b.orderIndex);
      const lastZone = sortedZones[sortedZones.length - 1];

      // 3. นับด่านใน Zone ล่าสุด
      const levelsInLastZone = levels.filter(l => l.zoneId === lastZone.id);
      
      // หาเลข order ถัดไป
      const maxOrder = levels.length > 0 ? Math.max(...levels.map(l => l.order)) : 0;
      const newOrder = maxOrder + 1;

      let targetZoneId = lastZone.id;
      let startY = (levelsInLastZone.length * 150) + 100; // วางต่อลงมาเรื่อยๆ
      let startX = (levelsInLastZone.length % 2 === 0) ? 20 : 80; // สลับซ้าย-ขวาแบบฟันปลา

      // --- 🔥 LOGIC: ครบ 10 ด่าน บังคับสร้าง Zone ใหม่ทันที ---
      if (levelsInLastZone.length >= 10) {
        console.log("Zone เต็ม 10 ด่านแล้ว! สร้าง Map ใหม่...");
        
        // สุ่มธีมใหม่
        const themeKeys = Object.keys(THEMES);
        const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];

        const newZoneRef = await addDoc(collection(db, "zones"), {
          orderIndex: lastZone.orderIndex + 1,
          themeId: randomTheme,
          decorations: []
        });
        
        targetZoneId = newZoneRef.id;
        startY = 100; // แมพใหม่ เริ่มข้างบน
        startX = 50;  // แมพใหม่ เริ่มกลาง หรือซ้ายขวาก็ได้
      }

      // 4. สร้างด่านใหม่
      await addDoc(collection(db, "levels"), {
        zoneId: targetZoneId,
        order: newOrder,
        x: startX, 
        y: startY > 700 ? 700 : startY, 
        title: `ด่านที่ ${newOrder}`,
        quiz: {
           question: "แก้ไขคำถาม...", choices: ["A","B","C","D"], answer: 0 
        }
      });

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white p-3 rounded-2xl shadow-2xl flex items-center gap-4 z-40">
        <div className="font-bold text-emerald-400 text-sm">🔧 ADMIN</div>
        <button onClick={handleAddLevel} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-bold disabled:opacity-50">
          {loading ? '...' : '+ เพิ่มด่าน'}
        </button>
        <button onClick={() => setShowZoneSettings(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded text-sm font-bold">
          🎨 ตกแต่ง Zone
        </button>
      </div>
      
      {/* (Modal ตกแต่งใช้ผ่าน GameMap เหมือนเดิม) */}
    </>
  );
}