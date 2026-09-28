import React from 'react';
import { PastReceipt, Student } from '../types';

interface ReceiptInvoiceModalProps {
  receipt: PastReceipt;
  student: Student;
  onClose: () => void;
}

export const ReceiptInvoiceModal: React.FC<ReceiptInvoiceModalProps> = ({
  receipt,
  student,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Controls */}
        <div className="p-3 bg-[#00152f] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#fde68a]">
              receipt_long
            </span>
            <span className="text-xs font-bold">Official E-Receipt: {receipt.ref}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:text-[#fde68a] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Printable Invoice Document */}
        <div className="p-5 overflow-y-auto space-y-4 bg-white text-[#00152f]">
          {/* Institutional Header */}
          <div className="text-center pb-3 border-b-2 border-[#00152f] space-y-1">
            <div className="w-14 h-16 mx-auto mb-1">
              <img
                src="/disney-world-logo.svg"
                alt="Disney World Public School Crest"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <h2 className="text-lg font-bold font-['Playfair_Display'] tracking-tight">
              DISNEY WORLD PUBLIC SCHOOL
            </h2>
            <p className="text-[11px] font-semibold text-[#9b4500] uppercase tracking-wider">
              Knowledge is Our Magic • Affiliated to CBSE
            </p>
            <p className="text-[10px] text-[#74777f]">
              Campus Accounts &amp; Fee Department | Tel: +91 98996 38676 | Email: dwpsballabgarh@gmail.com
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <div>
              <span className="text-[10px] text-[#74777f] font-semibold uppercase">Receipt No.</span>
              <p className="font-mono font-bold text-[#00152f]">{receipt.ref}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#74777f] font-semibold uppercase">Date of Payment</span>
              <p className="font-bold text-[#00152f]">{receipt.paidOn}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#74777f] font-semibold uppercase">Student Name</span>
              <p className="font-bold text-[#00152f]">{student.name}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#74777f] font-semibold uppercase">Class &amp; Roll</span>
              <p className="font-bold text-[#00152f]">{student.grade} (Roll: {student.rollNo})</p>
            </div>
            <div>
              <span className="text-[10px] text-[#74777f] font-semibold uppercase">Admission No</span>
              <p className="font-mono font-bold text-[#00152f]">{student.admissionNo}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#74777f] font-semibold uppercase">Payment Channel</span>
              <p className="font-bold text-[#10b981]">{receipt.mode}</p>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <div className="border border-[#e2e8f0] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#eff4ff] text-[#00152f] font-bold">
                <tr>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                <tr>
                  <td className="p-2.5">
                    <p className="font-semibold">{receipt.term}</p>
                    <p className="text-[10px] text-[#74777f]">Academic tuition, digital laboratory &amp; curriculum</p>
                  </td>
                  <td className="p-2.5 text-right font-semibold">₹10,500</td>
                </tr>
                <tr>
                  <td className="p-2.5">
                    <p className="font-semibold">School Bus Transport Fee</p>
                    <p className="text-[10px] text-[#74777f]">Sector 2 Ballabgarh Route</p>
                  </td>
                  <td className="p-2.5 text-right font-semibold">₹2,500</td>
                </tr>
                <tr>
                  <td className="p-2.5">
                    <p className="font-semibold">Activity &amp; Examination Fund</p>
                  </td>
                  <td className="p-2.5 text-right font-semibold">₹1,500</td>
                </tr>
              </tbody>
              <tfoot className="bg-[#f8fafc] border-t-2 border-[#00152f] font-bold">
                <tr>
                  <td className="p-2.5 text-sm">Total Paid</td>
                  <td className="p-2.5 text-right text-base text-[#10b981]">
                    ₹{receipt.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Institutional Stamp & Authorization */}
          <div className="pt-3 flex items-center justify-between text-xs border-t border-[#e2e8f0]">
            <div>
              <span className="text-[10px] text-[#74777f] uppercase font-semibold">Verification</span>
              <p className="text-[11px] text-[#10b981] font-bold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Digitally Signed &amp; Audited
              </p>
            </div>

            <div className="text-right">
              <div className="w-24 border-b border-[#00152f] mb-1" />
              <p className="text-[10px] font-bold text-[#00152f]">Accounts Officer</p>
              <p className="text-[9px] text-[#74777f]">Disney World Public School</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] grid grid-cols-2 gap-2">
          <button
            onClick={handlePrint}
            className="py-2.5 bg-[#00152f] hover:bg-[#0f2a4a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 bg-white hover:bg-[#eff4ff] text-[#00152f] border border-[#e2e8f0] rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
