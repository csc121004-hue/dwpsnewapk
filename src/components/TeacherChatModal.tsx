import React, { useState } from 'react';
import { Student } from '../types';

interface TeacherChatModalProps {
  student: Student;
  onClose: () => void;
}

export const TeacherChatModal: React.FC<TeacherChatModalProps> = ({ student, onClose }) => {
  const [messages, setMessages] = useState<{ sender: 'teacher' | 'parent'; text: string; time: string }[]>([
    {
      sender: 'teacher',
      text: 'Good morning Mr. Sharma! Aarav performed very well in the Science lab demonstration today.',
      time: '10:30 AM',
    },
    {
      sender: 'parent',
      text: 'Thank you Mrs. Verma! He was very excited about the Solar Water Filtration prototype.',
      time: '11:15 AM',
    },
    {
      sender: 'teacher',
      text: 'Yes! Please ensure he brings the diagram workbook tomorrow for final term sign-off.',
      time: '12:00 PM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'parent' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated quick teacher auto-acknowledgement
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'teacher',
          text: 'Noted! I have updated Aarav’s homeroom diary. Have a good evening!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#e2e8f0] flex flex-col h-[520px] overflow-hidden">
        {/* Header */}
        <div className="p-3.5 bg-[#00152f] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#fde68a] text-[#9b4500] font-bold flex items-center justify-center">
              S
            </div>
            <div>
              <h3 className="text-sm font-bold">{student.classTeacher}</h3>
              <p className="text-[10px] text-[#10b981] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                Online • {student.grade} Homeroom
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:text-[#fde68a] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-[#f8fafc]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'parent' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'parent'
                    ? 'bg-[#00152f] text-white rounded-br-xs'
                    : 'bg-white text-[#0b1c30] border border-[#e2e8f0] rounded-bl-xs shadow-2xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-[#74777f] px-1 mt-0.5">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-[#e2e8f0] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to Mrs. Verma..."
            className="flex-1 h-10 px-3 rounded-xl border border-[#e2e8f0] text-xs text-[#00152f] focus:outline-hidden focus:border-[#00152f]"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-[#00152f] text-white flex items-center justify-center hover:bg-[#0f2a4a] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
