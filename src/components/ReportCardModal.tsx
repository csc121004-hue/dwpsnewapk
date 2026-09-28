import React from 'react';
import { Student } from '../types';

interface ReportCardModalProps {
  student: Student;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ student, onClose }) => {
  const subjects = [
    { name: 'Mathematics', max: 100, obtained: 96, grade: 'A1' },
    { name: 'Science & Lab', max: 100, obtained: 94, grade: 'A1' },
    { name: 'English Language & Lit', max: 100, obtained: 89, grade: 'A2' },
    { name: 'Social Studies', max: 100, obtained: 91, grade: 'A1' },
    { name: 'Hindi Course A', max: 100, obtained: 90, grade: 'A1' },
    { name: 'Computer Applications', max: 100, obtained: 98, grade: 'A1' },
  ];

  const totalObtained = subjects.reduce((acc, curr) => acc + curr.obtained, 0);
  const totalMax = subjects.length * 100;
  const overallPercentage = ((totalObtained / totalMax) * 100).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
          <div>
            <span className="text-[10px] font-bold text-[#9b4500] uppercase">Official Marksheet</span>
            <h3 className="text-[16px] font-bold text-[#00152f]">Term-1 Performance Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#74777f] hover:text-[#00152f] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Student metadata banner */}
        <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-[#00152f]">{student.name}</p>
            <p className="text-[11px] text-[#74777f]">{student.grade} • Roll No: {student.rollNo}</p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-[#00152f]">{student.admissionNo}</span>
            <p className="text-[10px] text-[#10b981] font-bold">Passed with Distinction</p>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="border border-[#e2e8f0] rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#00152f] text-white">
              <tr>
                <th className="p-2.5">Subject</th>
                <th className="p-2.5 text-center">Max</th>
                <th className="p-2.5 text-center">Obtained</th>
                <th className="p-2.5 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {subjects.map((sub, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                  <td className="p-2.5 font-semibold text-[#00152f]">{sub.name}</td>
                  <td className="p-2.5 text-center text-[#74777f]">{sub.max}</td>
                  <td className="p-2.5 text-center font-bold text-[#00152f]">{sub.obtained}</td>
                  <td className="p-2.5 text-center font-bold text-[#10b981]">{sub.grade}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#fffbeb] border-t-2 border-[#fde68a] font-bold text-[#00152f]">
              <tr>
                <td className="p-2.5">Aggregate Result</td>
                <td className="p-2.5 text-center">{totalMax}</td>
                <td className="p-2.5 text-center">{totalObtained}</td>
                <td className="p-2.5 text-center text-[#9b4500]">{overallPercentage}% (A1)</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Co-curricular & Teacher Assessment */}
        <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-[#00152f]">
            <span>Discipline &amp; Punctuality: <strong className="text-[#10b981]">A (Exemplary)</strong></span>
            <span>Sports &amp; Drill: <strong className="text-[#10b981]">A+</strong></span>
          </div>
          <p className="text-[11px] text-[#43474e] italic pt-1 border-t border-[#e2e8f0]">
            Class Teacher Remark: "Aarav is an inquisitive, highly organized student with strong analytical and scientific capabilities."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handlePrint}
            className="py-2.5 bg-[#00152f] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Report</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 bg-[#eff4ff] text-[#00152f] rounded-xl text-xs font-bold hover:bg-[#dce9ff] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
