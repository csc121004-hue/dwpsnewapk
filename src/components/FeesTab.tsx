import React, { useState } from 'react';
import { Student, PastReceipt } from '../types';

interface FeesTabProps {
  student: Student;
  onPayFee: (mode: string) => Promise<{ success: boolean; receipt?: PastReceipt; message?: string }>;
  onSwitchStudent: () => void;
  onViewReceipt: (receipt: PastReceipt) => void;
}

export const FeesTab: React.FC<FeesTabProps> = ({
  student,
  onPayFee,
  onSwitchStudent,
  onViewReceipt,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('parent@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<PastReceipt | null>(null);

  const isDuesCleared = student.fee.totalOutstanding === 0;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    const modeLabel =
      selectedMethod === 'upi'
        ? `UPI (${upiId})`
        : selectedMethod === 'card'
        ? 'Credit/Debit Card (Online)'
        : 'NetBanking (HDFC Bank)';

    const result = await onPayFee(modeLabel);
    setIsProcessing(false);

    if (result.success && result.receipt) {
      setPaymentSuccessData(result.receipt);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* HEADER BAR */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/disney-world-logo.svg"
            alt="Disney World Public School Logo"
            className="h-10 w-auto object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icon.svg';
            }}
          />
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Disney World Public School
            </span>
            <h2 className="text-[17px] font-bold text-[#00152f]">Fee Details &amp; Invoices</h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#065f46] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#a7f3d0]">
          <span className="material-symbols-outlined text-[15px]">verified_user</span>
          Secure 256-Bit
        </span>
      </section>

      {/* STUDENT PROFILE STRIP */}
      <section className="bg-white rounded-2xl p-3.5 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#0f2a4a] text-[#d4e3ff] flex items-center justify-center font-bold text-sm shadow-inner">
            {student.avatarText}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#00152f]">{student.name}</h3>
              <span className="bg-[#eff4ff] text-[#00152f] px-2 py-0.5 rounded text-[11px] font-semibold">
                {student.grade}
              </span>
            </div>
            <p className="text-[11px] text-[#74777f]">
              Roll: {student.rollNo} • Reg: {student.regNo}
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchStudent}
          className="px-2.5 py-1 text-xs font-semibold text-[#00152f] bg-[#eff4ff] hover:bg-[#e5eeff] rounded-lg border border-[#e2e8f0] flex items-center gap-1 active:scale-95 transition-all"
          type="button"
        >
          <span>Switch</span>
          <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
        </button>
      </section>

      {/* OUTSTANDING BALANCE HERO CARD */}
      <section className="bg-[#00152f] text-white rounded-2xl p-4 sm:p-5 shadow-md relative overflow-hidden space-y-3">
        {/* Glow circle */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#0f2a4a] rounded-full blur-2xl opacity-60 pointer-events-none" />

        <div className="flex items-center justify-between">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isDuesCleared
                ? 'bg-[#10b981] text-white'
                : 'bg-[#fffbeb] text-[#9b4500] border border-[#fde68a]'
            }`}
          >
            {isDuesCleared ? '✓ Dues Cleared' : `Due in ${student.fee.dueDaysLeft} Days`}
          </span>
          <span className="text-[11px] text-[#b0c8f0] font-medium">{student.fee.termName}</span>
        </div>

        <div>
          <span className="text-xs text-[#b0c8f0] uppercase tracking-wider font-semibold">
            {isDuesCleared ? 'Outstanding Dues' : 'Total Outstanding Balance'}
          </span>
          <div className="text-3xl font-extrabold text-white mt-0.5 tracking-tight">
            ₹{student.fee.totalOutstanding.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-[#d4e3ff] ml-2">
              {isDuesCleared ? 'No payment required' : `due by ${student.fee.dueDate}`}
            </span>
          </div>
        </div>

        {!isDuesCleared ? (
          <div className="flex items-center gap-2 text-xs text-[#fde68a] bg-[#0f2a4a]/80 p-2.5 rounded-xl border border-[#304869]">
            <span className="material-symbols-outlined text-[18px] text-[#fde68a] shrink-0">
              schedule
            </span>
            <span className="leading-snug">{student.fee.lateWaiverNotice}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#10b981] bg-[#0f2a4a]/80 p-2.5 rounded-xl border border-[#10b981]/40">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>All term dues have been cleared. Official receipt archived below.</span>
          </div>
        )}

        {/* Primary Action Button */}
        {!isDuesCleared ? (
          <button
            onClick={() => {
              setPaymentSuccessData(null);
              setShowPaymentModal(true);
            }}
            className="w-full py-3.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span>
              Pay ₹{student.fee.totalOutstanding.toLocaleString('en-IN')} via UPI / Card /
              NetBanking
            </span>
          </button>
        ) : (
          <button
            onClick={() => student.fee.pastReceipts[0] && onViewReceipt(student.fee.pastReceipts[0])}
            className="w-full py-3.5 bg-[#0f2a4a] hover:bg-[#1a3d66] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 border border-[#304869] active:scale-98 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span>View Latest Receipt ({student.fee.pastReceipts[0]?.ref || 'DWPS-REC'})</span>
          </button>
        )}

        {/* Assurance badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#d4e3ff] pt-1">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#10b981]">bolt</span>
            Instant Confirmation
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#fde68a]">description</span>
            Official E-Receipt
          </span>
        </div>
      </section>

      {/* DISNEY WORLD PUBLIC SCHOOL FEE SCHEDULE BREAKDOWN */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Disney World Public School Schedule
            </span>
            <h3 className="text-[17px] font-bold text-[#00152f]">Term 2 Fee Breakdown</h3>
          </div>
          <span className="material-symbols-outlined text-[#74777f] text-[22px]">
            account_balance
          </span>
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {student.fee.breakdown.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-bold text-[#00152f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#43474e]">
                    {item.type === 'discount' ? 'redeem' : 'check_circle'}
                  </span>
                  {item.title}
                </p>
                <p className="text-xs text-[#74777f] ml-6">{item.subtitle}</p>
              </div>

              <span
                className={`text-[14px] font-bold whitespace-nowrap ${
                  item.type === 'discount' ? 'text-[#10b981]' : 'text-[#00152f]'
                }`}
              >
                {item.type === 'discount' ? '-' : ''}₹{Math.abs(item.amount).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t-2 border-[#00152f] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#00152f] uppercase">Total Payable Dues</span>
            <p className="text-[11px] text-[#74777f]">Inclusive of all institutional levies</p>
          </div>
          <span className="text-xl font-extrabold text-[#00152f]">
            ₹{student.fee.totalOutstanding > 0 ? student.fee.totalOutstanding.toLocaleString('en-IN') : '14,500'}
          </span>
        </div>
      </section>

      {/* INSTANT ONLINE PAYMENT MODES */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#00152f]">Instant Online Payment Modes</h3>
          <span className="text-[11px] font-bold text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded-full">
            0% Surcharge
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            onClick={() => {
              setSelectedMethod('upi');
              setShowPaymentModal(true);
            }}
            className="p-2.5 rounded-xl border border-[#e2e8f0] hover:border-[#b0c8f0] bg-[#f8fafc] flex flex-col items-center justify-center transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[#00152f] text-[24px]">qr_code_2</span>
            <span className="text-[11px] font-bold text-[#00152f] mt-1">UPI / QR</span>
            <span className="text-[9px] text-[#74777f]">GPay • PhonePe</span>
          </button>

          <button
            onClick={() => {
              setSelectedMethod('card');
              setShowPaymentModal(true);
            }}
            className="p-2.5 rounded-xl border border-[#e2e8f0] hover:border-[#b0c8f0] bg-[#f8fafc] flex flex-col items-center justify-center transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[#00152f] text-[24px]">credit_card</span>
            <span className="text-[11px] font-bold text-[#00152f] mt-1">Cards</span>
            <span className="text-[9px] text-[#74777f]">RuPay • Visa</span>
          </button>

          <button
            onClick={() => {
              setSelectedMethod('netbanking');
              setShowPaymentModal(true);
            }}
            className="p-2.5 rounded-xl border border-[#e2e8f0] hover:border-[#b0c8f0] bg-[#f8fafc] flex flex-col items-center justify-center transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[#00152f] text-[24px]">account_balance</span>
            <span className="text-[11px] font-bold text-[#00152f] mt-1">NetBanking</span>
            <span className="text-[9px] text-[#74777f]">50+ Banks</span>
          </button>

          <button
            onClick={() => {
              setSelectedMethod('upi');
              setShowPaymentModal(true);
            }}
            className="p-2.5 rounded-xl border border-[#e2e8f0] hover:border-[#b0c8f0] bg-[#f8fafc] flex flex-col items-center justify-center transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[#00152f] text-[24px]">document_scanner</span>
            <span className="text-[11px] font-bold text-[#00152f] mt-1">Scan UPI</span>
            <span className="text-[9px] text-[#74777f]">Paytm • BHIM</span>
          </button>
        </div>
      </section>

      {/* FINANCIAL ARCHIVE: PAST FEE RECEIPTS */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Financial Archive
            </span>
            <h3 className="text-[17px] font-bold text-[#00152f]">Past Fee Receipts</h3>
          </div>
          <span className="text-xs font-bold text-[#00152f]">
            {student.fee.pastReceipts.length} Receipts
          </span>
        </div>

        <div className="space-y-2.5">
          {student.fee.pastReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-[#00152f]">{receipt.term}</h4>
                  <p className="text-xs text-[#74777f]">
                    Paid on: {receipt.paidOn} • Ref: {receipt.ref}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                  ■ {receipt.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#e2e8f0]">
                <span className="text-[15px] font-extrabold text-[#00152f]">
                  ₹{receipt.amount.toLocaleString('en-IN')}
                </span>

                <button
                  onClick={() => onViewReceipt(receipt)}
                  className="px-3 py-1.5 bg-white hover:bg-[#eff4ff] text-[#00152f] border border-[#e2e8f0] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SCHOOL ACCOUNTS DESK DIRECTORY */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#fffbeb] text-[#9b4500] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#00152f]">School Accounts Desk</h4>
            <p className="text-xs text-[#74777f]">
              For reconciliation, tax exemptions (80G), or corporate sponsorship
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <a
            href="mailto:dwpsballabgarh@gmail.com"
            className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center gap-2 text-[#00152f] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00152f]">mail</span>
            <span>dwpsballabgarh@gmail.com</span>
          </a>

          <a
            href="tel:+919899638676"
            className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center gap-2 text-[#00152f] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#10b981]">call</span>
            <span>+91 98996 38676</span>
          </a>
        </div>
      </section>

      {/* PAYMENT CHECKOUT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4 max-h-[90vh] overflow-y-auto">
            {!paymentSuccessData ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                  <div>
                    <h3 className="text-[17px] font-bold text-[#00152f]">Secure Payment Checkout</h3>
                    <p className="text-xs text-[#74777f]">Disney World Public School</p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-1 text-[#74777f] hover:text-[#00152f] font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount to pay */}
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#74777f]">Total Payable Amount</span>
                    <p className="text-xl font-extrabold text-[#00152f]">
                      ₹{student.fee.totalOutstanding.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold text-[#00152f] border border-[#e2e8f0]">
                    {student.grade}
                  </span>
                </div>

                {/* Method selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#43474e] uppercase">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('upi')}
                      className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                        selectedMethod === 'upi'
                          ? 'bg-[#00152f] text-white border-[#00152f]'
                          : 'bg-white text-[#43474e] border-[#e2e8f0]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">qr_code</span>
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('card')}
                      className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                        selectedMethod === 'card'
                          ? 'bg-[#00152f] text-white border-[#00152f]'
                          : 'bg-white text-[#43474e] border-[#e2e8f0]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">credit_card</span>
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('netbanking')}
                      className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                        selectedMethod === 'netbanking'
                          ? 'bg-[#00152f] text-white border-[#00152f]'
                          : 'bg-white text-[#43474e] border-[#e2e8f0]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">account_balance</span>
                      <span>NetBanking</span>
                    </button>
                  </div>
                </div>

                {/* Method Specific Details */}
                {selectedMethod === 'upi' && (
                  <div className="space-y-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#e2e8f0]">
                      {/* Simulated QR code */}
                      <div className="w-32 h-32 bg-[#00152f] p-2 rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-6xl">qr_code_2</span>
                      </div>
                      <span className="text-[10px] text-[#74777f] font-mono mt-1">
                        Scan with GPay / PhonePe / Paytm
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                        Or enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                        className="w-full h-10 px-3 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#00152f]"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-2.5 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        defaultValue="4111 2222 3333 4444"
                        className="w-full h-10 px-3 rounded-lg border border-[#e2e8f0] text-xs font-mono font-semibold text-[#00152f]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        defaultValue="12/28"
                        placeholder="MM/YY"
                        className="h-10 px-3 rounded-lg border border-[#e2e8f0] text-xs font-mono font-semibold text-[#00152f]"
                      />
                      <input
                        type="password"
                        defaultValue="892"
                        placeholder="CVV"
                        className="h-10 px-3 rounded-lg border border-[#e2e8f0] text-xs font-mono font-semibold text-[#00152f]"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-2">
                    <label className="block text-[11px] font-semibold text-[#74777f]">
                      Choose Preferred Bank
                    </label>
                    <select className="w-full h-10 px-3 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#00152f] bg-white">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full h-12 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform disabled:opacity-50"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>
                    {isProcessing
                      ? 'Authorizing with Bank Server...'
                      : `Authorize ₹${student.fee.totalOutstanding.toLocaleString('en-IN')}`}
                  </span>
                </button>
              </>
            ) : (
              /* Success confirmation state */
              <div className="text-center py-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mx-auto ring-8 ring-[#ecfdf5]/50 animate-bounce">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#00152f]">Payment Confirmed!</h3>
                  <p className="text-xs text-[#43474e] mt-1">
                    Reference ID: <span className="font-mono font-bold">{paymentSuccessData.ref}</span>
                  </p>
                  <p className="text-xs text-[#10b981] font-semibold mt-0.5">
                    Amount: ₹{paymentSuccessData.amount.toLocaleString('en-IN')} (Term 2)
                  </p>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-xs text-[#00152f] text-left">
                  <p className="font-semibold">Official E-Receipt Generated</p>
                  <p className="text-[11px] text-[#74777f] mt-0.5">
                    A confirmation SMS and email have been dispatched to the registered mobile number.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      onViewReceipt(paymentSuccessData);
                      setShowPaymentModal(false);
                    }}
                    className="py-2.5 bg-[#00152f] text-white rounded-xl text-xs font-bold active:scale-95 transition-transform"
                  >
                    View Receipt
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="py-2.5 bg-[#f8fafc] text-[#00152f] border border-[#e2e8f0] rounded-xl text-xs font-bold hover:bg-[#eff4ff] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
