// รวม Assets ของตกแต่งและธีมทั้งหมดไว้ที่นี่
export const THEMES = {
  forest: {
    name: "🌳 ป่าไม้ (Forest)",
    bgClass: "bg-gradient-to-b from-[#87CEEB] to-[#90EE90]", // ฟ้า -> เขียวอ่อน
    nodeColor: "bg-emerald-500 hover:bg-emerald-400 border-emerald-700",
    pattern: "radial-gradient(#ffffff 2px, transparent 2px)", // ลายจุด
    patternSize: "30px 30px"
  },
  desert: {
    name: "🏜️ ทะเลทราย (Desert)",
    bgClass: "bg-gradient-to-b from-[#FFD700] to-[#FFA500]", // ทอง -> ส้ม
    nodeColor: "bg-orange-500 hover:bg-orange-400 border-orange-700",
    pattern: "repeating-linear-gradient(45deg, #ffffff20 0, #ffffff20 1px, transparent 0, transparent 50%)", // ลายเส้น
    patternSize: "20px 20px"
  },
  ocean: {
    name: "🌊 ใต้สมุทร (Ocean)",
    bgClass: "bg-gradient-to-b from-[#00BFFF] to-[#00008B]", // ฟ้าสด -> น้ำเงินเข้ม
    nodeColor: "bg-cyan-500 hover:bg-cyan-400 border-cyan-700",
    pattern: "radial-gradient(circle at center, #ffffff15 0, #ffffff00 50%)", // ฟองอากาศเบาๆ
    patternSize: "50px 50px"
  },
  candy: {
    name: "🍭 เมืองขนม (Candy)",
    bgClass: "bg-gradient-to-b from-[#FFB6C1] to-[#FF69B4]", // ชมพูอ่อน -> ชมพูเข้ม
    nodeColor: "bg-pink-500 hover:bg-pink-400 border-pink-700",
    pattern: "linear-gradient(45deg, #ffccdd 25%, transparent 25%, transparent 75%, #ffccdd 75%, #ffccdd), linear-gradient(45deg, #ffccdd 25%, transparent 25%, transparent 75%, #ffccdd 75%, #ffccdd)", // ลายตารางหมากรุก
    patternSize: "40px 40px"
  },
  space: {
    name: "🌌 อวกาศ (Space)",
    bgClass: "bg-gradient-to-b from-[#1a1a2e] to-[#16213e]", // ดำน้ำเงิน
    nodeColor: "bg-purple-600 hover:bg-purple-500 border-purple-800",
    pattern: "radial-gradient(white 1px, transparent 1px)", // ดาว
    patternSize: "60px 60px"
  },
  volcano: {
    name: "🌋 ภูเขาไฟ (Volcano)",
    bgClass: "bg-gradient-to-b from-[#5c0f0f] to-[#8a1c1c]", // แดงมืด
    nodeColor: "bg-red-600 hover:bg-red-500 border-red-800",
    pattern: "repeating-radial-gradient(circle, #00000020, #00000020 5px, transparent 5px, transparent 10px)", // วงคลื่นความร้อน
    patternSize: "100%"
  },
  snow: {
    name: "❄️ หิมะ (Snow)",
    bgClass: "bg-gradient-to-b from-[#E0FFFF] to-[#B0E0E6]",
    nodeColor: "bg-sky-400 hover:bg-sky-300 border-sky-600",
    pattern: "radial-gradient(#ffffff 3px, transparent 3px)",
    patternSize: "40px 40px"
  }
};

export const DECORATIONS = {
  tree: { label: "ต้นไม้", content: "🌳" },
  pine: { label: "ต้นสน", content: "🌲" },
  cactus: { label: "กระบองเพชร", content: "🌵" },
  flower: { label: "ดอกไม้", content: "🌻" },
  rock: { label: "ก้อนหิน", content: "🪨" },
  cloud: { label: "เมฆ", content: "☁️" },
  grass: { label: "หญ้า", content: "🌿" },
  mushroom: { label: "เห็ด", content: "🍄" },
  house: { label: "บ้าน", content: "🏠" },
  castle: { label: "ปราสาท", content: "🏰" },
  tent: { label: "เต็นท์", content: "⛺" },
  fish: { label: "ปลา", content: "🐟" },
  coral: { label: "ปะการัง", content: "🪸" },
  star: { label: "ดาว", content: "⭐" },
  moon: { label: "ดวงจันทร์", content: "🌙" },
  planet: { label: "ดาวเคราะห์", content: "🪐" },
  rocket: { label: "จรวด", content: "🚀" },
  ufo: { label: "UFO", content: "🛸" },
  ghost: { label: "ผี", content: "👻" },
  crystal: { label: "คริสตัล", content: "💎" },
  fire: { label: "ไฟ", content: "🔥" },
  snowman: { label: "ตุ๊กตาหิมะ", content: "⛄" },
  candy: { label: "ลูกกวาด", content: "🍬" },
  donut: { label: "โดนัท", content: "🍩" },
  cat: { label: "แมว", content: "🐱" },
  dog: { label: "หมา", content: "🐶" },
  dragon: { label: "มังกร", content: "🐉" }
};