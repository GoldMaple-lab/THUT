import React from 'react';
import { THEMES, DECORATIONS } from '../../config/assets';
import LevelNode from './LevelNode';

export const ZONE_HEIGHT = 800; 

export default function ZoneSection({ 
  zone, levelsInZone, onLevelClick, isAdmin, 
  onNodeMouseDown, onDecoMouseDown, onZoneClick, 
  selectedDecoIndex, onSelectDeco, onDeleteDeco 
}) {
  const theme = THEMES[zone.themeId] || THEMES.forest;

  return (
    <div 
      onClick={(e) => {
        if (isAdmin && e.target === e.currentTarget) {
          onZoneClick(zone); // เปิดแก้ Theme
          onSelectDeco(null, null); // ยกเลิกเลือกของ
        }
      }}
      className={`relative w-full overflow-hidden ${theme.bgClass}`}
      style={{ height: `${ZONE_HEIGHT}px` }}
    >
      {zone.decorations?.map((deco, idx) => {
        const asset = DECORATIONS[deco.type];
        if (!asset) return null;
        const isSelected = selectedDecoIndex === idx;

        return (
          <div
            key={idx}
            onMouseDown={(e) => {
              if (isAdmin) {
                e.stopPropagation(); // ห้ามทะลุลงพื้นหลัง
                onDecoMouseDown(e, zone.id, idx); // เริ่มลาก
                onSelectDeco(zone.id, idx); // เลือกชิ้นนี้
              }
            }}
            style={{
              position: 'absolute',
              left: `${deco.x}%`,
              top: `${deco.y}%`,
              transform: `translate(-50%, -50%) scale(${deco.scale || 1})`,
              fontSize: '2rem',
              userSelect: 'none',
              cursor: isAdmin ? 'grab' : 'default',
              pointerEvents: isAdmin ? 'auto' : 'none',
              zIndex: 10,
              border: isSelected && isAdmin ? '2px dashed red' : 'none',
              borderRadius: '8px',
              padding: '2px'
            }}
            className={isAdmin ? "hover:scale-110 transition-transform" : ""}
          >
            {asset.content}
            
            {/* ปุ่มลบ */}
            {isSelected && isAdmin && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDeco(zone.id, idx);
                }}
                className="absolute -top-3 -right-3 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-red-800 shadow-md"
              >
                ✕
              </div>
            )}
          </div>
        );
      })}

      {levelsInZone.map((lvl) => (
        <LevelNode 
          key={lvl.id} level={lvl} themeId={zone.themeId} isLocked={lvl.isLocked} 
          onClick={() => onLevelClick(lvl)} isAdmin={isAdmin} onMouseDown={onNodeMouseDown}
        />
      ))}
    </div>
  );
}