import React from 'react';
import { Student } from '../types';

interface SiblingSwitchModalProps {
  students: Student[];
  activeStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onClose: () => void;
}

export const SiblingSwitchModal: React.FC<SiblingSwitchModalProps> = ({
  students,
  activeStudentId,
  onSelectStudent,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
          <div>
            <h3 className="text-[16px] font-bold text-[#00152f]">Switch Student Account</h3>
            <p className="text-xs text-[#74777f]">Registered Ward Accounts</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#74777f] hover:text-[#00152f] font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {students.map((student) => {
            const isSelected = student.id === activeStudentId;
            return (
              <div
                key={student.id}
                onClick={() => {
                  onSelectStudent(student.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#eff4ff] border-[#00152f] ring-2 ring-[#00152f]/10'
                    : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#eff4ff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-[#00152f] text-white'
                        : 'bg-[#e2e8f0] text-[#00152f]'
                    }`}
                  >
                    {student.avatarText}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#00152f]">{student.name}</h4>
                    <p className="text-xs text-[#74777f]">
                      {student.grade} • Roll No: {student.rollNo}
                    </p>
                    <p className="text-[10px] font-mono text-[#74777f]">{student.admissionNo}</p>
                  </div>
                </div>

                {isSelected ? (
                  <span className="material-symbols-outlined text-[#10b981] fill-1 text-xl">
                    check_circle
                  </span>
                ) : (
                  <span className="text-xs text-[#74777f] font-semibold">Select</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-[#74777f]">
            Both wards receive consolidated fee sibling concession discount.
          </p>
        </div>
      </div>
    </div>
  );
};
