import React, { useState } from 'react';
import { THEMES } from '../../config/assets';

export default function LevelNode({ level, themeId, isLocked, isCurrent, onClick, onMouseDown, isAdmin }) {
  const theme = THEMES[themeId] || THEMES.forest;
  const [isDragging, setIsDragging] = useState(false);
  const [isClicking, setIsClicking] = useState(false); // State สำหรับเอฟเฟกต์ตอนกด

  // Handlers
  const handleMouseDown = (e) => {
    if (!isAdmin) return;
    e.stopPropagation();
    setIsDragging(false);
    onMouseDown(e, level.id);
  };

  const handleMouseMove = () => { if (isAdmin) setIsDragging(true); };

  const handleMouseUp = (e) => {
    if (isAdmin) {
      e.stopPropagation();
      if (!isDragging && onClick) onClick();
    }
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (!isAdmin && onClick) {
      if (isLocked) return;

      // 🔥 เริ่มเอฟเฟกต์กดปุ่ม (เด้งดึ๋ง + ระเบิด)
      setIsClicking(true);
      
      // รอ Animation จบ 300ms ค่อยเปิด Modal
      setTimeout(() => {
        setIsClicking(false);
        onClick();
      }, 300);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleUserClick}
      style={{
        position: 'absolute',
        left: `${level.x}%`,
        top: `${level.y}px`,
        transform: 'translate(-50%, -50%)',
        cursor: isAdmin ? 'grab' : (isLocked ? 'not-allowed' : 'pointer'),
        zIndex: 50
      }}
      className="relative flex flex-col items-center justify-center group"
    >
      {/* -------------------------------------------------- */}
      {/* 🔥 EFFECT 1: IDLE GLOW (แสงวิบวับรอบด่านที่ผ่านแล้ว) */}
      {/* -------------------------------------------------- */}
      {!isLocked && !isCurrent && (
        <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl ${theme.nodeColor}`}></div>
      )}

      {/* -------------------------------------------------- */}
      {/* 🔥 EFFECT 2: CURRENT LEVEL RING (วงแหวนหมุนรอบด่านปัจจุบัน) */}
      {/* -------------------------------------------------- */}
      {isCurrent && !isAdmin && (
        <>
          {/* วงแหวนหมุน */}
          <div className="absolute w-28 h-28 rounded-full border-[3px] border-dashed border-yellow-400 animate-[spin_4s_linear_infinite] opacity-80 pointer-events-none"></div>
          {/* แสง Pulse กระพริบ */}
          <div className="absolute w-24 h-24 bg-yellow-400/30 rounded-full animate-ping pointer-events-none"></div>
        </>
      )}

      {/* -------------------------------------------------- */}
      {/* 🔥 EFFECT 3: CLICK RIPPLE (ระเบิดวงกลมตอนกด) */}
      {/* -------------------------------------------------- */}
      {isClicking && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full rounded-full border-4 border-white animate-ping opacity-75"></div>
          <div className="absolute w-full h-full rounded-full bg-white/50 animate-pulse"></div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* MAIN BUTTON (ตัวด่าน) */}
      {/* -------------------------------------------------- */}
      <div 
        className={`
          relative z-10
          w-20 h-20 rounded-full flex items-center justify-center shadow-[0_8px_15px_rgba(0,0,0,0.3)] 
          border-[5px] border-white
          transition-all duration-200 cubic-bezier(0.175, 0.885, 0.32, 1.275) /* เด้งดึ๋ง */
          
          /* Admin Effect */
          ${isAdmin ? 'active:scale-110 active:shadow-2xl' : ''}
          
          /* User Hover Effect */
          ${!isAdmin && !isLocked ? 'hover:scale-110 hover:-translate-y-2 hover:shadow-[0_15px_25px_rgba(0,0,0,0.4)] hover:brightness-110' : ''}
          
          /* Click Animation (หดย่อลงไปแล้วเด้งคืน) */
          ${isClicking ? '!scale-90 !brightness-125 ring-4 ring-white/50' : ''}

          /* Color & Lock State */
          ${isLocked ? 'bg-slate-400 grayscale opacity-90' : theme.nodeColor}
        `}
      >
        <span className="text-white font-extrabold text-3xl font-thai select-none drop-shadow-md relative">
          {isLocked ? '🔒' : level.order}
          
          {/* ดาวดวงเล็กๆ ประดับด่านปัจจุบัน */}
          {isCurrent && !isAdmin && (
            <span className="absolute -top-1 -right-1 text-xs animate-bounce">⭐</span>
          )}
        </span>
      </div>

      {/* -------------------------------------------------- */}
      {/* TITLE LABEL (ชื่อด่าน) */}
      {/* -------------------------------------------------- */}
      <div 
        className={`
          mt-3 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-md backdrop-blur-md
          border-2 border-white/50
          transition-all duration-300
          ${isLocked ? 'bg-slate-200/80 text-slate-500 scale-95 opacity-80' : 'bg-white/90 text-slate-800 scale-100'}
          ${isCurrent ? 'ring-2 ring-yellow-400 bg-yellow-50 text-yellow-800 transform scale-110' : ''}
        `}
      >
        {level.title || `ด่านที่ ${level.order}`}
      </div>
    </div>
  );
}