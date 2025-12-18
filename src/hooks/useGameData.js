import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export function useGameData() {
  const [zones, setZones] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. ดึงข้อมูล Zones (เรียงตาม orderIndex)
    const qZones = query(collection(db, "zones"), orderBy("orderIndex"));
    const unsubZones = onSnapshot(qZones, (snapshot) => {
      const loadedZones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setZones(loadedZones);
    });

    // 2. ดึงข้อมูล Levels (เรียงตาม order)
    const qLevels = query(collection(db, "levels"), orderBy("order"));
    const unsubLevels = onSnapshot(qLevels, (snapshot) => {
      const loadedLevels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLevels(loadedLevels);
    });

    setLoading(false);

    // Cleanup function (หยุดฟังเมื่อเปลี่ยนหน้า)
    return () => {
      unsubZones();
      unsubLevels();
    };
  }, []);

  return { zones, levels, loading };
}