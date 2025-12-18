import React, { useState } from 'react';
import { THEMES } from '../config/assets';

export default function QuizModal({ level, onClose, onWin, onLose, themeId }) {
  // --- 🔥 LOGIC BOSS: ด่านที่ 10, 20, 30... คือบอส ---
  const isBoss = level.order % 10 === 0;

  // ถ้าเป็น Boss ให้ข้ามบทเรียน (Lesson) ไปที่ Quiz เลย
  const [activeTab, setActiveTab] = useState(isBoss ? 'quiz' : 'lesson'); 
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const theme = THEMES[themeId] || THEMES.forest;

  const checkAnswer = () => {
    if (selectedChoice === null) return;
    const correct = selectedChoice === level.quiz.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // ตอบถูก
      setTimeout(() => {
        onWin(); 
        onClose();
      }, 1500);
    } else {
      // ตอบผิด
      if (isBoss) {
        // 🔥 ถ้าเป็น Boss ตอบผิด -> เรียกฟังก์ชัน Reset (Game Over)
        setTimeout(() => {
          onLose(); 
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className={`p-4 text-white text-center relative ${theme.bgClass}`}>
          {isBoss && <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 animate-pulse shadow-lg border border-red-400">💀 BOSS STAGE 💀</div>}
          <h2 className="text-xl font-bold font-thai">{level.title}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
        </div>

        {/* Tabs */}
        {!isBoss && (
          <div className="flex border-b">
            <button onClick={() => setActiveTab('lesson')} className={`flex-1 py-3 font-bold font-thai text-sm transition ${activeTab === 'lesson' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-400'}`}>📖 บทเรียน</button>
            <button onClick={() => setActiveTab('quiz')} className={`flex-1 py-3 font-bold font-thai text-sm transition ${activeTab === 'quiz' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-400'}`}>✍️ แบบทดสอบ</button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'lesson' && (
            <div className="font-thai space-y-4">
              <div className="prose prose-sm max-w-none text-slate-700">
                {level.lesson ? <div dangerouslySetInnerHTML={{ __html: level.lesson }} /> : <p className="text-center text-slate-400 italic">ไม่มีเนื้อหาบทเรียน</p>}
              </div>
              <button onClick={() => setActiveTab('quiz')} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition">พร้อมทำแบบทดสอบ →</button>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="font-thai">
              <p className="text-lg font-medium text-slate-800 mb-6 text-center">{level.quiz.question}</p>
              <div className="space-y-3">
                {level.quiz.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && setSelectedChoice(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedChoice === index ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold' : 'border-slate-100 hover:border-slate-300'
                    } ${showFeedback && index === level.quiz.answer ? '!bg-green-100 !border-green-500 !text-green-800' : ''}
                       ${showFeedback && selectedChoice === index && !isCorrect ? '!bg-red-100 !border-red-500 !text-red-800' : ''}`}
                    disabled={showFeedback}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'quiz' && (
          <div className="p-4 border-t bg-slate-50">
            {!showFeedback ? (
              <button onClick={checkAnswer} disabled={selectedChoice === null} className={`w-full py-3 rounded-xl font-bold text-white transition font-thai ${selectedChoice !== null ? 'bg-slate-800 hover:bg-slate-700 shadow' : 'bg-slate-300 cursor-not-allowed'}`}>ยืนยันคำตอบ</button>
            ) : (
              <div className={`text-center font-bold text-lg animate-bounce ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'ถูกต้อง! 🎉' : (isBoss ? 'GAME OVER! 💀' : 'ผิดครับ ลองใหม่นะ ❌')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}