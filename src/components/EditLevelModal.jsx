import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function EditLevelModal({ level, onClose }) {
  // สร้าง State รอรับค่า (กัน level เป็น null)
  const [formData, setFormData] = useState({
    title: '',
    lesson: '',
    question: '',
    choices: ["", "", "", ""],
    answer: 0
  });
  const [saving, setSaving] = useState(false);

  // โหลดข้อมูลด่านมาใส่ฟอร์มตอนเปิด Modal
  useEffect(() => {
    if (level) {
      setFormData({
        title: level.title || '',
        lesson: level.lesson || '',
        question: level.quiz?.question || '',
        choices: level.quiz?.choices || ["", "", "", ""],
        answer: level.quiz?.answer || 0
      });
    }
  }, [level]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const levelRef = doc(db, "levels", level.id);
      await updateDoc(levelRef, {
        title: formData.title,
        lesson: formData.lesson,
        quiz: {
          question: formData.question,
          choices: formData.choices,
          answer: parseInt(formData.answer)
        }
      });
      alert("✅ บันทึกข้อมูลเรียบร้อย!");
      onClose();
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาด: " + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`ยืนยันที่จะลบ "ด่าน ${level.order}" ใช่ไหม?\n(ลบแล้วกู้คืนไม่ได้นะ)`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "levels", level.id));
      alert("🗑 ลบด่านเรียบร้อย!");
      onClose();
    } catch (error) {
      alert("❌ ลบไม่สำเร็จ: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold font-thai text-slate-800">🛠 แก้ไขข้อมูล: ด่าน {level.order}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        
        <div className="space-y-5 font-thai">
          {/* ชื่อด่าน */}
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">ชื่อด่าน</label>
            <input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น บทนำ, การทักทาย"
            />
          </div>

          {/* บทเรียน */}
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">
              เนื้อหาบทเรียน <span className="text-xs font-normal text-slate-500">(รองรับ HTML เช่น &lt;b&gt;ตัวหนา&lt;/b&gt;, &lt;br&gt;ขึ้นบรรทัดใหม่)</span>
            </label>
            <textarea 
              value={formData.lesson}
              onChange={(e) => setFormData({...formData, lesson: e.target.value})}
              className="w-full border border-slate-300 p-3 rounded-lg h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ใส่เนื้อหาที่นี่..."
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-lg text-slate-800 mb-3">ส่วนคำถาม (Quiz)</h3>
            
            {/* คำถาม */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1 text-slate-700">โจทย์คำถาม</label>
              <input 
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ตัวเลือก */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.choices.map((c, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-500">ตัวเลือก {i+1}</label>
                    <input 
                      type="radio" 
                      name="correct_ans" 
                      checked={formData.answer === i}
                      onChange={() => setFormData({...formData, answer: i})}
                      className="w-4 h-4 text-blue-600"
                      title="เลือกเป็นคำตอบที่ถูกต้อง"
                    />
                  </div>
                  <input 
                    value={c}
                    onChange={(e) => {
                      const newChoices = [...formData.choices];
                      newChoices[i] = e.target.value;
                      setFormData({...formData, choices: newChoices});
                    }}
                    className={`w-full border p-2 rounded text-sm focus:outline-none ${formData.answer === i ? 'border-green-500 bg-green-50' : 'border-slate-300'}`}
                    placeholder={`คำตอบข้อ ${i+1}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-right text-slate-400 mt-2">* ติ๊กถูกที่ช่องวงกลม เพื่อเลือกข้อที่ถูกต้อง</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <button 
            onClick={handleDelete} 
            className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 font-bold text-sm transition"
          >
            🗑 ลบด่านนี้
          </button>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition">
              ยกเลิก
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 font-bold transition disabled:bg-slate-400"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}