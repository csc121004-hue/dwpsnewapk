import React, { useState } from 'react';
import { Student, HomeworkItem, CircularItem } from '../types';

interface DashboardTabProps {
  student: Student;
  homeworkList: HomeworkItem[];
  circulars: CircularItem[];
  onSwitchStudent: () => void;
  onNavigateTab: (tab: 'dashboard' | 'attendance' | 'fees' | 'calendar') => void;
  onOpenBusTracking: () => void;
  onOpenReportCard: () => void;
  onOpenTeacherChat: () => void;
  onSelectCircular: (circular: CircularItem) => void;
  onToggleHomework: (id: string) => void;
  onLogout?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  student,
  homeworkList,
  circulars,
  onSwitchStudent,
  onNavigateTab,
  onOpenBusTracking,
  onOpenReportCard,
  onOpenTeacherChat,
  onSelectCircular,
  onToggleHomework,
  onLogout,
}) => {
  const [copySuccess, setCopySuccess] = useState('');

  const sportsDayCircular = circulars.find(c => c.featured) || circulars[1] || circulars[0];

  const handleCopyHelpdesk = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopySuccess(`${label} copied!`);
    setTimeout(() => setCopySuccess(''), 2500);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* ACTIVE USER SESSION BAR */}
      <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-2xl p-2.5 px-3.5 flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span className="font-bold text-[#00152f]">Parent Portal</span>
          <span className="text-[#74777f]">• Ward: {student.name.split(' ')[0]}</span>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-[#dc2626] hover:text-[#991b1b] font-bold text-xs px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#dc2626]/20 transition-all shadow-2xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* STUDENT PROFILE HERO CARD */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-[0_4px_20px_-2px_rgba(15,42,74,0.06)] relative overflow-hidden">
        {/* Subtle background crest accent */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#eff4ff] rounded-full opacity-60 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#0f2a4a] text-[#d4e3ff] flex items-center justify-center text-xl font-bold shadow-inner">
                {student.avatarText}
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10b981] text-white rounded-full flex items-center justify-center shadow"
                title="Active Enrolled Student"
              >
                <span className="material-symbols-outlined text-[13px] fill-1">check</span>
              </span>
            </div>

            <div>
              <div
                onClick={onSwitchStudent}
                className="flex items-center gap-1.5 cursor-pointer group"
                title="Click to switch student"
              >
                <h1 className="text-[18px] font-bold text-[#00152f] tracking-tight group-hover:text-[#9b4500] transition-colors">
                  {student.name}
                </h1>
                <span className="material-symbols-outlined text-[18px] text-[#74777f] group-hover:text-[#00152f] transition-colors">
                  arrow_drop_down
                </span>
              </div>
              <p className="text-[13px] text-[#43474e]">
                {student.grade} • Roll No: {student.rollNo}
              </p>
              <p className="text-[11px] font-mono text-[#74777f]">{student.admissionNo}</p>
            </div>
          </div>

          {/* Sibling Switcher Button */}
          <button
            onClick={onSwitchStudent}
            className="px-2.5 py-1 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#00152f] rounded-lg text-xs font-semibold border border-[#e2e8f0] flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
            Switch
          </button>
        </div>

        {/* Quick Attendance Meter Banner */}
        <div className="mt-3.5 pt-3 border-t border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#065f46] rounded-full px-2.5 py-0.5 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              {student.attendanceRate}% Attendance
            </span>
            <span className="text-xs text-[#9b4500] font-semibold">
              {student.term} • Excellent
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="text-xs text-[#00152f] font-semibold flex items-center gap-0.5 hover:text-[#9b4500] transition-colors"
          >
            History
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* QUICK STATS BENTO GRID */}
      <section className="grid grid-cols-2 gap-2.5">
        {/* Stat 1: Attendance */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white rounded-2xl p-3.5 border border-[#e2e8f0] shadow-sm flex flex-col justify-between hover:border-[#b0c8f0] transition-all cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#43474e]">Attendance</span>
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#065f46] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#00152f]">
              {student.attendanceSummary.presentDays}
              <span className="text-xs text-[#43474e] font-normal"> / 28 d (Oct)</span>
            </div>
            <span className="text-xs text-[#10b981] font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> Consistent
            </span>
          </div>
        </div>

        {/* Stat 2: Pending Fee */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white rounded-2xl p-3.5 border border-[#e2e8f0] shadow-sm flex flex-col justify-between hover:border-[#fde68a] transition-all cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#43474e]">Q3 Fee Due</span>
            <div className="w-7 h-7 rounded-lg bg-[#fffbeb] text-[#9b4500] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#00152f]">
              {student.fee.totalOutstanding > 0
                ? `₹${student.fee.totalOutstanding.toLocaleString('en-IN')}`
                : '₹0 (Paid)'}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-semibold text-[#f59e0b]">
                {student.fee.totalOutstanding > 0 ? 'Due Oct 15' : 'No Dues'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab('fees');
                }}
                className="bg-[#00152f] hover:bg-[#0f2a4a] text-white px-2 py-0.5 rounded-full text-[11px] font-semibold active:scale-95 transition-transform"
              >
                {student.fee.totalOutstanding > 0 ? 'Pay Now' : 'Receipts'}
              </button>
            </div>
          </div>
        </div>

        {/* Stat 3: Next Event */}
        <div
          onClick={() => onNavigateTab('calendar')}
          className="bg-white rounded-2xl p-3.5 border border-[#e2e8f0] shadow-sm flex flex-col justify-between hover:border-[#b0c8f0] transition-all cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#43474e]">Next Event</span>
            <div className="w-7 h-7 rounded-lg bg-[#e5eeff] text-[#00152f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[15px] font-bold text-[#00152f] leading-snug line-clamp-1">
              Sports Meet
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] bg-[#fffbeb] text-[#9b4500] font-semibold border border-[#fde68a]/60">
              Tomorrow, 8:30 AM
            </span>
          </div>
        </div>

        {/* Stat 4: Today's Schedule */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#43474e]">Class Status</span>
            <div className="w-7 h-7 rounded-lg bg-[#dce9ff] text-[#00152f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[15px] font-bold text-[#00152f]">Period 4 of 7</div>
            <span className="text-[11px] text-[#10b981] font-semibold flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Science Lab Active
            </span>
          </div>
        </div>
      </section>

      {/* ACADEMIC UTILITIES CLUSTER */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#00152f]">Academic Utilities</h2>
          <span className="text-xs font-semibold text-[#9b4500] cursor-pointer hover:underline">
            Quick Actions
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
          {/* 1. Pay Fees */}
          <button
            onClick={() => onNavigateTab('fees')}
            className="flex flex-col items-center group cursor-pointer"
            type="button"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fffbeb] text-[#9b4500] flex items-center justify-center border border-[#fde68a] group-hover:bg-[#fde68a] transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <span className="text-xs font-medium text-[#0b1c30] mt-1.5 group-hover:text-[#9b4500]">
              Pay Fees
            </span>
          </button>

          {/* 2. Apply Leave */}
          <button
            onClick={() => onNavigateTab('attendance')}
            className="flex flex-col items-center group cursor-pointer"
            type="button"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center border border-[#dce9ff] group-hover:bg-[#e5eeff] transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">event_busy</span>
            </div>
            <span className="text-xs font-medium text-[#0b1c30] mt-1.5 group-hover:text-[#00152f]">
              Apply Leave
            </span>
          </button>

          {/* 3. Bus Tracking */}
          <button
            onClick={onOpenBusTracking}
            className="flex flex-col items-center group cursor-pointer"
            type="button"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center border border-[#a7f3d0] group-hover:bg-[#d1fae5] transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
            </div>
            <span className="text-xs font-medium text-[#0b1c30] mt-1.5 group-hover:text-[#10b981]">
              Bus Track
            </span>
          </button>

          {/* 4. Calendar */}
          <button
            onClick={() => onNavigateTab('calendar')}
            className="flex flex-col items-center group cursor-pointer"
            type="button"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center border border-[#dce9ff] group-hover:bg-[#e5eeff] transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">calendar_month</span>
            </div>
            <span className="text-xs font-medium text-[#0b1c30] mt-1.5 group-hover:text-[#00152f]">
              Calendar
            </span>
          </button>

          {/* 5. Report Card */}
          <button
            onClick={onOpenReportCard}
            className="flex flex-col items-center group cursor-pointer"
            type="button"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center border border-[#dce9ff] group-hover:bg-[#e5eeff] transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">assignment</span>
            </div>
            <span className="text-xs font-medium text-[#0b1c30] mt-1.5 group-hover:text-[#00152f]">
              Report Card
            </span>
          </button>

          {/* 6. Teacher Chat */}
          <button
            onClick={onOpenTeacherChat}
            className="flex flex-col items-center group cursor-pointer"
            type="button"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fffbeb] text-[#9b4500] flex items-center justify-center border border-[#fde68a] group-hover:bg-[#fde68a] transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">forum</span>
            </div>
            <span className="text-xs font-medium text-[#0b1c30] mt-1.5 group-hover:text-[#9b4500]">
              Teacher Chat
            </span>
          </button>
        </div>
      </section>

      {/* FEATURED HIGHLIGHT BANNER */}
      {sportsDayCircular && (
        <section className="bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-md group">
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={sportsDayCircular.imageUrl || "https://lh3.googleusercontent.com/aida/AEtjO1X0fdW0bArp6KJC0jhMLC1g9liJtNCqAR0fEc0aU9W5kSRkuuRyOK9AEx5ky3W5iIKi36CUmuVzgyoXAc_LiKb0fi_Eeu-miEbLfo23cWP12xWRtuCD7XLzt_IXKBStAjrj7TxISIT4tZwOBQrDLlUgVpVZpBoVF6XDGKoyotR80KqE9o5kOnilMeoeEIwpw9qIk3hqBZ9ZQkA_NNMXcA15D5GY0lB5xZhe_n_tqpIBB_MNns2oUTBMOw"}
              alt="DWPS Annual Sports Day"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00152f] via-[#00152f]/40 to-transparent" />

            <div className="absolute top-3 left-3 bg-[#9b4500] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1 shadow">
              <span className="material-symbols-outlined text-[13px] fill-1">verified</span>
              FEATURED HIGHLIGHT
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] text-[#fde68a] font-medium">
                October 11, 2024 • Main Sports Arena
              </span>
              <h3 className="text-[17px] font-bold leading-tight drop-shadow-sm mt-0.5">
                {sportsDayCircular.title}
              </h3>
            </div>
          </div>

          <div className="p-3.5 bg-white flex items-center justify-between gap-2">
            <p className="text-xs text-[#43474e] line-clamp-1 flex-1">
              {sportsDayCircular.summary}
            </p>
            <button
              onClick={() => onSelectCircular(sportsDayCircular)}
              className="whitespace-nowrap px-3 py-1.5 bg-[#fffbeb] text-[#9b4500] border border-[#fde68a] rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-[#fde68a] transition-all active:scale-95"
            >
              Read Circular
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </section>
      )}

      {/* TODAY'S CLASSWORK & HOMEWORK */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9b4500] text-[20px]">
              assignment_turned_in
            </span>
            <h2 className="text-[16px] font-bold text-[#00152f]">
              Today's Classwork & Homework
            </h2>
          </div>
          <span className="text-xs font-medium text-[#74777f]">Oct 10, Thu</span>
        </div>

        <div className="space-y-2.5">
          {homeworkList.map((hw) => (
            <div
              key={hw.id}
              className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                hw.isCompleted
                  ? 'bg-[#f8fafc] border-[#e2e8f0] opacity-80'
                  : 'bg-[#eff4ff] border-[#e2e8f0]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center border shadow-xs mt-0.5 shrink-0 ${
                    hw.badgeColor === 'secondary'
                      ? 'bg-white text-[#9b4500] border-[#fde68a]'
                      : hw.badgeColor === 'gold'
                      ? 'bg-[#fffbeb] text-[#9b4500] border-[#fde68a]'
                      : 'bg-white text-[#00152f] border-[#e2e8f0]'
                  }`}
                >
                  {hw.subject}
                </span>

                <div>
                  <p
                    className={`text-[14px] font-bold ${
                      hw.isCompleted ? 'line-through text-[#74777f]' : 'text-[#00152f]'
                    }`}
                  >
                    {hw.title}
                  </p>
                  <p className="text-xs text-[#43474e] mt-0.5">{hw.description}</p>
                  <span
                    className={`text-[11px] font-semibold mt-1 inline-block ${
                      hw.isCompleted ? 'text-[#10b981]' : 'text-[#f59e0b]'
                    }`}
                  >
                    {hw.isCompleted ? '✓ Completed' : `Due: ${hw.dueDate}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onToggleHomework(hw.id)}
                className="text-[#74777f] hover:text-[#10b981] transition-colors p-1"
                title={hw.isCompleted ? 'Mark as pending' : 'Mark as done'}
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    hw.isCompleted ? 'text-[#10b981] fill-1' : 'text-[#c4c6cf]'
                  }`}
                >
                  {hw.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT SCHOOL CIRCULARS & NOTICES */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00152f] text-[20px]">
              campaign
            </span>
            <h2 className="text-[16px] font-bold text-[#00152f]">School Circulars</h2>
          </div>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-semibold text-[#9b4500] hover:underline"
            type="button"
          >
            View Archive
          </button>
        </div>

        <div className="space-y-2.5">
          {circulars.slice(0, 3).map((circ) => (
            <div
              key={circ.id}
              onClick={() => onSelectCircular(circ)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors border border-[#e2e8f0] cursor-pointer"
            >
              {circ.imageUrl ? (
                <img
                  src={circ.imageUrl}
                  alt={circ.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#e5eeff] text-[#00152f] flex flex-col items-center justify-center shrink-0 border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-[24px]">description</span>
                  <span className="text-[10px] font-bold text-[#74777f]">
                    {circ.isPdf ? 'PDF' : 'NOTICE'}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fffbeb] text-[#9b4500] border border-[#fde68a]/50">
                    {circ.category}
                  </span>
                  <span className="text-[11px] text-[#74777f]">{circ.date}</span>
                </div>
                <h4 className="text-[14px] font-bold text-[#00152f] truncate mt-0.5">
                  {circ.title}
                </h4>
                <p className="text-xs text-[#43474e] truncate">{circ.summary}</p>
              </div>

              <span className="material-symbols-outlined text-[#74777f] text-[20px]">
                chevron_right
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* BALLABGARH CAMPUS HELPDESK BANNER */}
      <section className="bg-[#00152f] text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fde68a] text-[22px] fill-1">
                verified_user
              </span>
              <span className="text-[15px] font-bold text-white">
                Ballabgarh Campus Helpdesk
              </span>
            </div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
          </div>

          <p className="text-xs text-[#d4e3ff] mt-1.5 leading-relaxed">
            Need immediate assistance regarding bus routes, fee reconciliation, or child safety?
          </p>

          {copySuccess && (
            <div className="mt-2 text-xs font-semibold text-[#fde68a] bg-[#0f2a4a] px-2.5 py-1 rounded-md text-center">
              ✓ {copySuccess}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold">
            <a
              href="tel:+919899638676"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0f2a4a] text-white border border-[#304869] hover:bg-[#304869] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-[#10b981]">call</span>
              +91 98996 38676
            </a>

            <button
              onClick={() => handleCopyHelpdesk('dwpsballabgarh@gmail.com', 'Email')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0f2a4a] text-white border border-[#304869] hover:bg-[#304869] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-[#fde68a]">mail</span>
              Email Desk
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-2 space-y-1">
        <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">
          Disney World Public School • CBSE Affiliated
        </p>
        <p className="text-[11px] text-[#74777f]">
          Knowledge is Our Magic • Academic Session 2024-25
        </p>
      </footer>
    </div>
  );
};
