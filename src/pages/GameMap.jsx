import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useGameData } from '../hooks/useGameData';
import ZoneSection, { ZONE_HEIGHT } from '../components/map/ZoneSection';
import { useAuth } from '../context/AuthContext';
import AdminToolbar from '../components/AdminToolbar';
import QuizModal from '../components/QuizModal';
import EditLevelModal from '../components/EditLevelModal';
import Navbar from '../components/Navbar';
import ZoneSettingsModal from '../components/ZoneSettingsModal';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function GameMap() {
  const { zones = [], levels = [], loading: gameLoading } = useGameData();
  const { userData, currentUser, loading: authLoading } = useAuth();
  
  // State
  const [dragItem, setDragItem] = useState(null); 
  const [localLevels, setLocalLevels] = useState([]);
  const [localZones, setLocalZones] = useState([]);

  // Modals
  const [activeLevel, setActiveLevel] = useState(null);
  const [editingLevel, setEditingLevel] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  const [selectedDeco, setSelectedDeco] = useState({ zoneId: null, index: null });

  const mapRef = useRef(null);

  const userUnlockedOrder = userData?.unlockedLevel || 1; 
  const isAdmin = userData?.role === 'admin';
  
  // เรียง Zone ให้ชัวร์ (เรียงตาม orderIndex)
  const safeZones = useMemo(() => {
    return Array.isArray(zones) ? [...zones].sort((a,b) => a.orderIndex - b.orderIndex) : [];
  }, [zones]);

  // Sync Data
  useEffect(() => {
    if (!dragItem) {
      if (Array.isArray(levels)) {
        // เรียง Level ตาม order เสมอ
        setLocalLevels([...levels].sort((a, b) => Number(a.order) - Number(b.order)));
      }
      if (Array.isArray(safeZones)) setLocalZones(safeZones);
    }
  }, [levels, safeZones, dragItem]);

  // --- 🔥 แก้ไข 1: SVG PATH ENGINE (สูตรคำนวณเส้นใหม่) ---
  const svgPath = useMemo(() => {
    if (!localLevels || localLevels.length < 2 || safeZones.length === 0) return "";
    
    // เรียงลำดับด่านให้เป๊ะ
    const sorted = [...localLevels].sort((a, b) => Number(a.order) - Number(b.order));
    let path = "";

    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = sorted[i];
      const next = sorted[i+1];

      // หา Index ของ Zone
      const currZIdx = safeZones.findIndex(z => z.id === curr.zoneId);
      const nextZIdx = safeZones.findIndex(z => z.id === next.zoneId);

      // ถ้าหาไม่เจอ ให้ข้าม (กันเส้นระเบิด)
      if (currZIdx === -1 || nextZIdx === -1) continue;

      // ⚠️ แปลงเป็น Number ให้หมด กันค่าเพี้ยน
      const currX = Number(curr.x || 50);
      const currY = (currZIdx * ZONE_HEIGHT) + Number(curr.y || 0);

      const nextX = Number(next.x || 50);
      const nextY = (nextZIdx * ZONE_HEIGHT) + Number(next.y || 0);

      // เริ่มวาดจุดแรก
      if (i === 0) {
        path += `M ${currX} ${currY} `;
      }

      // คำนวณจุดดัดโค้ง (Control Points)
      // ใช้จุดกึ่งกลาง Y แต่ดัด X นิดหน่อยให้โค้งสวย
      const midY = (currY + nextY) / 2;
      
      // วาดเส้นโค้ง Bezier (1->2)
      path += `C ${currX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY} `;
    }
    return path;
  }, [safeZones, localLevels]);

  // --- HANDLERS ---

  const handleLevelMouseDown = (e, levelId) => {
    if (!isAdmin) return;
    setDragItem({ type: 'level', id: levelId });
    setSelectedDeco({ zoneId: null, index: null });
  };

  const handleDecoMouseDown = (e, zoneId, decoIndex) => {
    if (!isAdmin) return;
    setDragItem({ type: 'deco', zoneId: zoneId, index: decoIndex });
  };

  // --- 🔥 แก้ไข 2: DRAG LOGIC (แก้ Drop ไม่ติด + เช็คโควต้า 10 ด่าน) ---
  const handleMouseMove = (e) => {
    // Fail-safe: ถ้าเมาส์ขยับแต่ไม่ได้กดปุ่ม ให้ปล่อยทันที
    if (e.buttons === 0 && dragItem) {
      handleMouseUp();
      return;
    }

    if (!dragItem || !isAdmin || !mapRef.current) return;
    
    const mapRect = mapRef.current.getBoundingClientRect();
    const mapTop = mapRef.current.offsetTop;
    
    // คำนวณ X (%)
    let newX = ((e.clientX - mapRect.left) / mapRect.width) * 100;
    if (newX < 5) newX = 5; if (newX > 95) newX = 95;

    // คำนวณ Y รวม (Global)
    const mouseYGlobal = e.pageY - mapTop; 

    // คำนวณว่าเมาส์อยู่ Zone ไหน
    let currentZoneIndex = Math.floor(mouseYGlobal / ZONE_HEIGHT);
    if (currentZoneIndex < 0) currentZoneIndex = 0;
    if (currentZoneIndex >= safeZones.length) currentZoneIndex = safeZones.length - 1;

    const targetZone = safeZones[currentZoneIndex];
    if (!targetZone) return;

    // Y ใน Zone นั้น
    let newYInZone = mouseYGlobal - (currentZoneIndex * ZONE_HEIGHT);
    
    // --- LAGGING LEVEL ---
    if (dragItem.type === 'level') {
      const draggedLevel = localLevels.find(l => l.id === dragItem.id);
      if (!draggedLevel) return;

      // เช็ค 1: ถ้าเป็นด่านเดิมในโซนเดิม -> ย้ายได้ปกติ
      // เช็ค 2: ถ้าจะย้ายข้ามโซน -> ต้องเช็คว่าโซนปลายทางว่างไหม? (มี < 10 ด่าน?)
      const isSameZone = targetZone.id === draggedLevel.zoneId;
      
      // นับด่านในโซนเป้าหมาย (ไม่นับตัวมันเอง)
      const levelsInTarget = localLevels.filter(l => l.zoneId === targetZone.id && l.id !== dragItem.id).length;
      
      // 🚫 ถ้าไม่ใช่โซนเดิม และโซนเป้าหมายเต็ม 10 ด่าน -> ห้ามย้ายเข้า!
      if (!isSameZone && levelsInTarget >= 10) {
        // ให้เมาส์เป็นรูปห้าม (Visual Feedback อาจจะต้องทำเพิ่ม แต่ตอนนี้ล็อค Logic ไว้ก่อน)
        return; 
      }

      // ล็อคขอบบนล่างของโซน
      if (newYInZone < 50) newYInZone = 50; 
      if (newYInZone > ZONE_HEIGHT - 50) newYInZone = ZONE_HEIGHT - 50;

      // อัปเดต (ย้าย Zone ID ได้ถ้าเงื่อนไขผ่าน)
      setLocalLevels(prev => prev.map(l => 
        l.id === dragItem.id ? { ...l, x: newX, y: newYInZone, zoneId: targetZone.id } : l
      ));
    }
    
    // --- LAGGING DECO (เหมือนเดิม) ---
    else if (dragItem.type === 'deco') {
        const originalZone = safeZones.find(z => z.id === dragItem.zoneId);
        if (!originalZone) return;
        
        const originalZoneIdx = safeZones.findIndex(z => z.id === dragItem.zoneId);
        const zoneStartY = originalZoneIdx * ZONE_HEIGHT;
        let relativeY = mouseYGlobal - zoneStartY;
        let yPercent = (relativeY / ZONE_HEIGHT) * 100;
        
        setLocalZones(prev => prev.map(z => {
          if (z.id !== dragItem.zoneId) return z;
          const newDecos = [...z.decorations];
          if (newDecos[dragItem.index]) {
             newDecos[dragItem.index] = { ...newDecos[dragItem.index], x: newX, y: yPercent };
          }
          return { ...z, decorations: newDecos };
        }));
    }
  };

  // --- MOUSE UP (SAVE) ---
  const handleMouseUp = async () => {
    if (!dragItem || !isAdmin) return;

    try {
      if (dragItem.type === 'level') {
        const lvl = localLevels.find(l => l.id === dragItem.id);
        if (lvl) {
          // บันทึกตำแหน่งและ ZoneId ใหม่
          await updateDoc(doc(db, "levels", dragItem.id), { x: lvl.x, y: lvl.y, zoneId: lvl.zoneId });
          console.log("✅ Saved Level:", lvl.order, "to Zone:", lvl.zoneId);
        }
      } 
      else if (dragItem.type === 'deco') {
        const zone = localZones.find(z => z.id === dragItem.zoneId);
        if (zone) {
          await updateDoc(doc(db, "zones", zone.id), { decorations: zone.decorations });
        }
      }
    } catch (err) { 
      console.error("Save failed:", err); 
    }
    
    setDragItem(null);
  };

  // Global Mouse Listener (สำคัญมาก: ช่วยให้ลากแล้วปล่อยติด 100%)
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [dragItem, localLevels, localZones]);


  // --- INTERACTION ---
  const handleLevelClick = (level) => {
    if (isAdmin) setEditingLevel(level);
    else {
      if (level.order > userUnlockedOrder) return;
      setActiveLevel(level);
    }
  };

  const handleZoneClick = (zone) => { if (isAdmin) setEditingZone(zone); };
  
  const handleDeleteDeco = async (zoneId, index) => {
    if (!isAdmin || !window.confirm("ลบไหม?")) return;
    const zone = localZones.find(z => z.id === zoneId);
    const newDecos = zone.decorations.filter((_, i) => i !== index);
    setLocalZones(prev => prev.map(z => z.id === zoneId ? {...z, decorations: newDecos} : z));
    await updateDoc(doc(db, "zones", zoneId), { decorations: newDecos });
    setSelectedDeco({ zoneId: null, index: null });
  };
  
  const handleLevelWin = async () => {
    if (!currentUser || !activeLevel) return;
    const isNewClear = activeLevel.order === userUnlockedOrder;
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { score: increment(50), unlockedLevel: isNewClear ? increment(1) : undefined });
  };
  
  const handleBossLose = async () => {
    if (!currentUser) return;
    alert("💀 GAME OVER! กลับไปเริ่มด่าน 1");
    await updateDoc(doc(db, "users", currentUser.uid), { unlockedLevel: 1, score: 0 });
    if(mapRef.current) mapRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading || gameLoading || !userData) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">กำลังโหลด...</div>;

  return (
    <div ref={mapRef} className="relative w-full min-h-screen bg-slate-900 select-none overflow-y-auto" onMouseMove={handleMouseMove}>
      <Navbar />

      {/* --- SVG LAYER (ถนนหิน 3 ชั้น) --- */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none" style={{ height: `${safeZones.length * ZONE_HEIGHT}px` }}>
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 100 ${Math.max(safeZones.length * ZONE_HEIGHT, 100)}`}
          preserveAspectRatio="none" // *สำคัญ: ช่วยให้พิกัด % ตรงกับหน้าจอเสมอ
        >
          {/* 1. เงาถนน */}
          <path d={svgPath} fill="none" stroke="#8B4513" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" className="opacity-30" />
          {/* 2. เนื้อถนน */}
          <path d={svgPath} fill="none" stroke="#DEB887" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          {/* 3. ลายหิน */}
          <path d={svgPath} fill="none" stroke="#F5DEB3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1.5" />
        </svg>
      </div>

      <div className="relative">
        {safeZones.map((zone) => {
           const zoneLevels = Array.isArray(localLevels) ? localLevels.filter(l => l.zoneId === zone.id) : [];
           const processedLevels = zoneLevels.map(lvl => ({ ...lvl, isLocked: lvl.order > userUnlockedOrder }));
           
           return (
            <ZoneSection 
              key={zone.id} zone={zone} levelsInZone={processedLevels} 
              onLevelClick={handleLevelClick} isAdmin={isAdmin} 
              onNodeMouseDown={handleLevelMouseDown} onDecoMouseDown={handleDecoMouseDown}
              onZoneClick={handleZoneClick}
              selectedDecoIndex={selectedDeco.zoneId === zone.id ? selectedDeco.index : null}
              onSelectDeco={(zId, idx) => setSelectedDeco({ zoneId: zId, index: idx })}
              onDeleteDeco={handleDeleteDeco}
            />
           );
        })}
      </div>
      
      {isAdmin && (
         <>
            <AdminToolbar zones={safeZones} levels={localLevels} />
            {editingZone && <ZoneSettingsModal zone={editingZone} onClose={() => setEditingZone(null)} />}
         </>
      )}

      {activeLevel && <QuizModal level={activeLevel} onClose={() => setActiveLevel(null)} onWin={handleLevelWin} onLose={handleBossLose} themeId={safeZones.find(z => z.id === activeLevel.zoneId)?.themeId} />}
      {editingLevel && <EditLevelModal level={editingLevel} onClose={() => setEditingLevel(null)} />}
    </div>
  );
}