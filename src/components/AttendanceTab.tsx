import React, { useState } from 'react';
import { Student, LedgerDay, LeaveRequest } from '../types';

interface AttendanceTabProps {
  student: Student;
  ledger: LedgerDay[];
  leaveRequests: LeaveRequest[];
  onApplyLeave: (leaveData: {
    reasonType: string;
    fromDate: string;
    toDate: string;
    note: string;
    certificateName?: string;
  }) => Promise<boolean>;
  onSwitchStudent: () => void;
  onNavigateTab: (tab: 'dashboard' | 'attendance' | 'fees' | 'calendar') => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  student,
  ledger,
  leaveRequests,
  onApplyLeave,
  onSwitchStudent,
  onNavigateTab,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'attendance' | 'calendar'>('attendance');
  const [selectedDay, setSelectedDay] = useState<LedgerDay | null>(null);

  // Leave Form State
  const [reasonType, setReasonType] = useState<'Sick / Medical' | 'Family Event'>('Sick / Medical');
  const [fromDate, setFromDate] = useState('2024-10-25');
  const [toDate, setToDate] = useState('2024-10-25');
  const [certificateName, setCertificateName] = useState<string>('');
  const [leaveNote, setLeaveNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onApplyLeave({
      reasonType,
      fromDate,
      toDate,
      note: leaveNote,
      certificateName: certificateName || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      setSubmitSuccess('Leave application submitted to homeroom teacher for review!');
      setLeaveNote('');
      setCertificateName('');
      setTimeout(() => setSubmitSuccess(''), 4000);
    }
  };

  const handleSimulateUpload = () => {
    setCertificateName('doctor_prescription_scan.pdf');
  };

  // SVG Gauge calculations for 94.5%
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (student.attendanceRate / 100) * circumference;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* INSTITUTIONAL BRAND HEADER */}
      <section className="bg-white rounded-2xl p-3.5 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/disney-world-logo.svg"
            alt="Disney World Public School Crest"
            className="h-10 w-auto object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icon.svg';
            }}
          />
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Disney World Public School
            </span>
            <h2 className="text-[17px] font-bold text-[#00152f]">Attendance Portal</h2>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#eff4ff] text-[#00152f] border border-[#dce9ff]">
          2024-25
        </span>
      </section>

      {/* STUDENT HEADER STRIP */}
      <section className="bg-white rounded-2xl p-3.5 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#0f2a4a] text-[#d4e3ff] flex items-center justify-center font-bold text-sm shadow-inner">
            {student.avatarText}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-[15px] font-bold text-[#00152f]">{student.name}</h2>
              <span className="text-[11px] font-semibold text-[#43474e] bg-[#eff4ff] px-2 py-0.5 rounded-full">
                {student.grade}
              </span>
            </div>
            <p className="text-[11px] text-[#74777f]">
              Roll No: {student.rollNo} • Admission: {student.admissionNo}
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchStudent}
          className="p-1.5 text-[#00152f] hover:bg-[#eff4ff] rounded-lg transition-colors"
          title="Switch student profile"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
        </button>
      </section>

      {/* SUBTABS: Attendance vs School Calendar */}
      <div className="flex items-center gap-2 p-1 bg-[#eff4ff] rounded-xl border border-[#e2e8f0]">
        <button
          onClick={() => setActiveSubtab('attendance')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubtab === 'attendance'
              ? 'bg-white text-[#00152f] shadow-sm'
              : 'text-[#43474e] hover:text-[#00152f]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
          <span>Attendance</span>
        </button>

        <button
          onClick={() => {
            setActiveSubtab('calendar');
            onNavigateTab('calendar');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubtab === 'calendar'
              ? 'bg-white text-[#00152f] shadow-sm'
              : 'text-[#43474e] hover:text-[#00152f]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          <span>School Calendar</span>
        </button>
      </div>

      {/* ACADEMIC RECORD: ATTENDANCE PULSE */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Academic Record
            </span>
            <h2 className="text-[17px] font-bold text-[#00152f]">Attendance Pulse</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#fffbeb] text-[#9b4500] text-xs font-bold border border-[#fde68a]">
            {student.term}
          </span>
        </div>

        {/* Circular Ring Gauge */}
        <div className="flex flex-col items-center justify-center py-2 relative">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#eff4ff"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress indicator */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-[#00152f] tracking-tight">
              {student.attendanceRate}%
            </span>
            <span className="text-[11px] font-bold text-[#10b981] uppercase tracking-wider mt-0.5">
              EXCELLENT
            </span>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e2e8f0]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#065f46]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              PRESENT
            </div>
            <div className="text-xl font-bold text-[#00152f] mt-1">
              {student.attendanceSummary.presentDays} <span className="text-xs font-normal text-[#43474e]">Days</span>
            </div>
          </div>

          <div className="p-3 bg-[#fff1f2] rounded-xl border border-[#ffe4e6]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#991b1b]">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              ABSENT
            </div>
            <div className="text-xl font-bold text-[#00152f] mt-1">
              {student.attendanceSummary.absentDays} <span className="text-xs font-normal text-[#991b1b]">{student.attendanceSummary.absentReason}</span>
            </div>
          </div>

          <div className="p-3 bg-[#fffbeb] rounded-xl border border-[#fef3c7]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9b4500]">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              LATE
            </div>
            <div className="text-xl font-bold text-[#00152f] mt-1">
              {student.attendanceSummary.lateDays} <span className="text-xs font-normal text-[#43474e]">Day</span>
            </div>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e2e8f0]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1e40af]">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              HOLIDAYS
            </div>
            <div className="text-xl font-bold text-[#00152f] mt-1">
              {student.attendanceSummary.holidayDays} <span className="text-xs font-normal text-[#43474e]">Days</span>
            </div>
          </div>
        </div>
      </section>

      {/* TODAY'S CLASS LOG & TEACHER REMARK */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00152f] text-[20px]">
              calendar_today
            </span>
            <h3 className="text-[16px] font-bold text-[#00152f]">Today's Class Log</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#065f46] px-2.5 py-0.5 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            PRESENT IN CLASS
          </span>
        </div>

        {/* 4 Periods row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {student.classLog.map((log) => (
            <div key={log.period} className="p-2 rounded-xl bg-[#eff4ff] border border-[#e2e8f0]">
              <p className="text-[10px] text-[#74777f] font-semibold">Period {log.period}</p>
              <p className="text-xs font-bold text-[#00152f] mt-0.5">{log.subject}</p>
              <span className="text-[10px] text-[#10b981] font-semibold mt-1 inline-block">
                {log.status}
              </span>
            </div>
          ))}
        </div>

        {/* Teacher Remark Banner */}
        <div className="p-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#fde68a] text-[#9b4500] font-bold flex items-center justify-center shrink-0">
            {student.teacherRemark.avatarInitial}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00152f]">
                {student.teacherRemark.teacher}
              </span>
              <span className="text-[10px] text-[#9b4500] font-semibold">
                {student.teacherRemark.role}
              </span>
            </div>
            <p className="text-xs text-[#43474e] mt-1 italic leading-relaxed">
              {student.teacherRemark.text}
            </p>
          </div>
        </div>
      </section>

      {/* ATTENDANCE LEDGER CALENDAR (OCTOBER 2024) */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Attendance Ledger
            </span>
            <h3 className="text-[17px] font-bold text-[#00152f]">October 2024</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#00152f] transition-colors"
              title="Previous Month"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#00152f] transition-colors"
              title="Next Month"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#f8fafc] rounded-xl p-2.5 border border-[#e2e8f0]">
          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#74777f] pb-2 border-b border-[#e2e8f0]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span className="text-[#ef4444]">Sun</span>
          </div>

          {/* Date cells (starting with padding for Oct 1st which is Tuesday) */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs pt-2">
            {/* Monday offset (Sep 30) */}
            <div className="text-[#cbd5e1] p-1.5 flex flex-col items-center">
              <span>30</span>
            </div>

            {ledger.map((item) => {
              const isSelected = selectedDay?.date === item.date;
              return (
                <button
                  key={item.date}
                  onClick={() => setSelectedDay(item)}
                  type="button"
                  className={`p-1.5 rounded-lg flex flex-col items-center justify-center transition-all relative ${
                    item.isToday
                      ? 'bg-[#00152f] text-white font-bold ring-2 ring-[#00152f]/20'
                      : isSelected
                      ? 'bg-[#dce9ff] text-[#00152f] font-bold'
                      : item.status === 'weekend'
                      ? 'text-[#ef4444]'
                      : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="text-[12px]">{item.date}</span>

                  {/* Dot status indicator */}
                  <span className="h-1.5 flex items-center justify-center mt-0.5">
                    {item.status === 'present' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    )}
                    {item.status === 'absent_medical' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                    )}
                    {item.status === 'late' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    )}
                    {item.status === 'event' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9b4500]" />
                    )}
                    {item.status === 'holiday' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Toast Popup */}
        {selectedDay && (
          <div className="p-3 bg-[#eff4ff] border border-[#b0c8f0] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#00152f]">
                Oct {selectedDay.date}, 2024 ({selectedDay.day}):
              </span>{' '}
              <span className="text-[#43474e]">{selectedDay.label}</span>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-[#74777f] hover:text-[#00152f] font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Calendar Status Legend */}
        <div className="flex flex-wrap items-center justify-around gap-2 text-[10px] font-semibold text-[#43474e] pt-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Present
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Medical Approved
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Late Entry
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#9b4500]" /> School Event
          </span>
        </div>
      </section>

      {/* APPLY FOR LEAVE FORM */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00152f] text-[20px]">
              assignment
            </span>
            <h3 className="text-[16px] font-bold text-[#00152f]">Apply for Leave</h3>
          </div>
          <p className="text-xs text-[#74777f] mt-0.5">
            Submit advance notification for teacher approval
          </p>
        </div>

        {submitSuccess && (
          <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs font-semibold text-[#065f46]">
            ✓ {submitSuccess}
          </div>
        )}

        <form onSubmit={handleLeaveSubmit} className="space-y-3">
          {/* Reason for Absence selector */}
          <div>
            <label className="block text-xs font-bold text-[#43474e] uppercase mb-1.5">
              Reason for Absence
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReasonType('Sick / Medical')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  reasonType === 'Sick / Medical'
                    ? 'bg-[#00152f] text-white border-[#00152f]'
                    : 'bg-white text-[#43474e] border-[#e2e8f0] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {reasonType === 'Sick / Medical' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <span>Sick / Medical</span>
              </button>

              <button
                type="button"
                onClick={() => setReasonType('Family Event')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  reasonType === 'Family Event'
                    ? 'bg-[#00152f] text-white border-[#00152f]'
                    : 'bg-white text-[#43474e] border-[#e2e8f0] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {reasonType === 'Family Event' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <span>Family Event</span>
              </button>
            </div>
          </div>

          {/* Date range pickers */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#00152f] bg-white focus:outline-hidden focus:border-[#00152f]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#00152f] bg-white focus:outline-hidden focus:border-[#00152f]"
                required
              />
            </div>
          </div>

          {/* Medical note / explanation */}
          <div>
            <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
              Remarks for Homeroom Teacher
            </label>
            <textarea
              rows={2}
              value={leaveNote}
              onChange={(e) => setLeaveNote(e.target.value)}
              placeholder="e.g. Advised rest by family doctor due to cough and seasonal flu."
              className="w-full p-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#00152f] bg-white focus:outline-hidden focus:border-[#00152f]"
            />
          </div>

          {/* Attachment Box */}
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00152f] text-[20px]">
                attach_file
              </span>
              <div>
                <p className="text-xs font-bold text-[#00152f]">
                  Attach Medical Certificate (Optional)
                </p>
                <p className="text-[11px] text-[#74777f]">
                  {certificateName || 'PDF or JPG up to 5MB'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateUpload}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-xs font-bold text-[#00152f] hover:bg-[#e5eeff] transition-colors"
            >
              {certificateName ? 'Attached' : 'Upload'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>{isSubmitting ? 'Submitting...' : 'Submit Leave Request'}</span>
          </button>
        </form>

        {/* Existing Leave History */}
        {leaveRequests.length > 0 && (
          <div className="pt-2 border-t border-[#e2e8f0]">
            <span className="text-[11px] font-bold text-[#74777f] uppercase">
              Recent Leave Records
            </span>
            <div className="space-y-1.5 mt-2">
              {leaveRequests.map((lr) => (
                <div
                  key={lr.id}
                  className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#00152f]">{lr.reasonType}</span>
                    <p className="text-[11px] text-[#74777f]">
                      {lr.fromDate} to {lr.toDate}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lr.status === 'Approved'
                        ? 'bg-[#ecfdf5] text-[#065f46]'
                        : 'bg-[#fffbeb] text-[#9b4500]'
                    }`}
                  >
                    {lr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CAMPUS HIGHLIGHTS & UPCOMING EVENTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Campus Highlights
            </span>
            <h3 className="text-[17px] font-bold text-[#00152f]">Upcoming Events & Holidays</h3>
          </div>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-semibold text-[#9b4500] flex items-center gap-1 hover:underline"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Sync Google Cal
          </button>
        </div>

        {/* STEM Fair Card */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm">
          <div className="relative h-44 w-full">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1XxMMyqGhYd7OyhE53ZJL6Eak2TecyaQoq6246nZc3gFvLa3_YJERWy8SiudJyPTSQmPr2jsTE8IZNqwdIq7I5-Vjm6k-Uws0_t_X1ZbyH9SWQeGgE-ANoOBGGHI3Iar2vrqN7fx9UtjQERH_YVMH45fz-w5fefvWRpMKslAmWayGeEIG9N9B_GTUtxyPd8tvl4LJhEWs2BHYEfuO8YzJBEP-v9yG80dcxQ45bLR-mjxcI4odsxN4LRrpA"
              alt="DWPS STEM Fair 2024 Showcase"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00152f] via-[#00152f]/30 to-transparent" />
            <div className="absolute top-3 left-3 bg-[#9b4500] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              SCIENCE & TECH
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] text-[#fde68a]">Thursday, October 24, 2024</span>
              <h4 className="text-[16px] font-bold drop-shadow-sm mt-0.5">
                DWPS STEM Fair 2024 Showcase
              </h4>
            </div>
          </div>
          <div className="p-3.5 space-y-2.5">
            <p className="text-xs text-[#43474e] leading-relaxed">
              Grade VI students present hands-on working solar models, digital astronomy presentations, and robotics prototypes in the Central Innovation Lab. Parents are cordially invited.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0] text-xs font-semibold">
              <span className="text-[#74777f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                09:30 AM – 01:30 PM
              </span>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-[#9b4500] hover:underline flex items-center gap-0.5"
              >
                View Schedule →
              </button>
            </div>
          </div>
        </div>

        {/* Diwali Card */}
        <div className="bg-[#fffbeb] p-3.5 rounded-2xl border border-[#fde68a] flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fde68a] text-[#9b4500] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">celebration</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-[15px] font-bold text-[#00152f]">Diwali & Festive Vacation</h4>
                <span className="bg-[#9b4500] text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                  Official Holiday
                </span>
              </div>
              <p className="text-xs text-[#43474e] mt-1">
                School remains closed for all wings from <span className="font-bold text-[#00152f]">October 31 to November 3, 2024</span>. Classes resume regularly on Monday, November 4.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
