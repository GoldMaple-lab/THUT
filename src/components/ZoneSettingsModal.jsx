import React from 'react';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { THEMES, DECORATIONS } from '../config/assets';

export default function ZoneSettingsModal({ zone, onClose }) {
  
  const handleChangeTheme = async (themeKey) => {
    await updateDoc(doc(db, "zones", zone.id), { themeId: themeKey });
  };

  const handleAddDeco = async (decoKey) => {
    await updateDoc(doc(db, "zones", zone.id), {
      decorations: arrayUnion({
        type: decoKey,
        x: 50,
        y: 50,
        scale: 1
      })
    });
    // ไม่ต้องปิด Modal เพื่อให้กดเพิ่มได้หลายอัน
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* พื้นหลังใสๆ ให้กดปิดได้ */}
      <div className="absolute inset-0" onClick={onClose} pointer-events="auto"></div>
      
      <div className="bg-white w-full max-w-3xl p-6 rounded-t-2xl shadow-2xl pointer-events-auto border-t-4 border-purple-500 animate-slide-up z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800">
            🎨 ตกแต่ง Zone ที่ {zone.orderIndex}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">ปิด</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* เลือก Theme */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">เปลี่ยนพื้นหลัง (Themes)</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(THEMES).map(key => (
                <button 
                  key={key}
                  onClick={() => handleChangeTheme(key)}
                  className={`p-2 rounded border text-xs font-bold capitalize transition ${zone.themeId === key ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-200' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  {THEMES[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* เลือกของตกแต่ง */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">เพิ่มของตกแต่ง (Decorations)</h4>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {Object.keys(DECORATIONS).map(key => (
                <button 
                  key={key}
                  onClick={() => handleAddDeco(key)}
                  className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-purple-100 hover:scale-105 transition text-2xl border border-transparent hover:border-purple-300"
                  title={DECORATIONS[key].label}
                >
                  {DECORATIONS[key].content}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2">* กดแล้วไอเทมจะโผล่กลางจอ (คลิกที่ไอเทมเพื่อลบ)</p>
          </div>
        </div>
      </div>
    </div>
  );
}