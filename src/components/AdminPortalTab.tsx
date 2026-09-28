import React, { useState } from 'react';
import { CircularItem, AdminStats } from '../types';

interface AdminPortalTabProps {
  adminStats: AdminStats;
  circulars: CircularItem[];
  onSwitchToParentView: () => void;
  onBroadcastAttendance: (grade: string) => Promise<{ success: boolean; message: string }>;
  onBroadcastFeeReminders: (channel: 'whatsapp' | 'sms') => Promise<{ success: boolean; message: string }>;
  onPublishDraftCircular: (id: string) => Promise<boolean>;
  onCreateCircular: (circ: {
    title: string;
    summary: string;
    category: string;
    targetGrades: string;
  }) => Promise<boolean>;
}

export const AdminPortalTab: React.FC<AdminPortalTabProps> = ({
  adminStats,
  circulars,
  onSwitchToParentView,
  onBroadcastAttendance,
  onBroadcastFeeReminders,
  onPublishDraftCircular,
  onCreateCircular,
}) => {
  const [selectedGrade, setSelectedGrade] = useState('6B');
  const [isSendingAttendanceAlert, setIsSendingAttendanceAlert] = useState(false);
  const [attendanceAlertMessage, setAttendanceAlertMessage] = useState('');
  const [feeReminderMessage, setFeeReminderMessage] = useState('');
  const [showNewNoticeModal, setShowNewNoticeModal] = useState(false);

  // New Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeSummary, setNewNoticeSummary] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('General');
  const [newNoticeGrades, setNewNoticeGrades] = useState('All Wings');
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);

  const handleSendAttendanceAlert = async () => {
    setIsSendingAttendanceAlert(true);
    const result = await onBroadcastAttendance(
      selectedGrade === '6B'
        ? 'Class VI-B (Homeroom 204)'
        : `Class ${selectedGrade}`
    );
    setIsSendingAttendanceAlert(false);
    setAttendanceAlertMessage(result.message);
    setTimeout(() => setAttendanceAlertMessage(''), 5000);
  };

  const handleSendFeeReminder = async (channel: 'whatsapp' | 'sms') => {
    const result = await onBroadcastFeeReminders(channel);
    setFeeReminderMessage(result.message);
    setTimeout(() => setFeeReminderMessage(''), 5000);
  };

  const handleExportDefaulters = () => {
    const link = document.createElement('a');
    link.href = '/api/admin/export-defaulters';
    link.download = 'dwps-ballabgarh-fee-defaulters-q3.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle) return;
    setIsCreatingNotice(true);
    const success = await onCreateCircular({
      title: newNoticeTitle,
      summary: newNoticeSummary,
      category: newNoticeCategory,
      targetGrades: newNoticeGrades,
    });
    setIsCreatingNotice(false);
    if (success) {
      setShowNewNoticeModal(false);
      setNewNoticeTitle('');
      setNewNoticeSummary('');
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Institutional Brand & Mode Switch Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <img
            alt="Disney World Public School Logo"
            className="h-11 w-auto object-contain shrink-0"
            src="/disney-world-logo.svg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icon.svg';
            }}
          />
          <div className="border-l border-[#e2e8f0] pl-3">
            <p className="text-[16px] font-bold text-[#00152f] leading-tight">
              Disney World Public School
            </p>
            <p className="text-xs text-[#74777f]">Admin &amp; Teacher Portal • Session 2024-25</p>
          </div>
        </div>

        <button
          onClick={onSwitchToParentView}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 bg-[#fffbeb] text-[#9b4500] border border-[#fde68a] rounded-xl text-xs font-bold active:scale-95 transition-all hover:bg-[#fde68a]/40"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">cached</span>
          <span>Switch to Parent View</span>
        </button>
      </div>

      {/* Admin Profile Hero Banner */}
      <div className="relative overflow-hidden bg-[#00152f] text-white rounded-2xl p-4 sm:p-5 shadow-md">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#0f2a4a]/60 pointer-events-none blur-2xl" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#fde68a] border-2 border-[#fde68a]/60 flex items-center justify-center shadow-inner overflow-hidden">
                <span className="material-symbols-outlined text-[#9b4500] text-3xl">school</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10b981] border-2 border-[#00152f] rounded-full" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0f2a4a] text-[#d4e3ff] text-[10px] font-bold uppercase mb-1 border border-[#304869]">
                <span className="material-symbols-outlined text-xs">verified_user</span>
                Principal Desk
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Playfair_Display']">
                {adminStats.principalName}
              </h1>
              <p className="text-xs text-[#b0c8f0]">{adminStats.principalTitle}</p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[11px] font-semibold text-[#b0c8f0]">
              Campus Attendance Today
            </span>
            <span className="text-xl font-extrabold text-[#fde68a]">
              {adminStats.campusAttendance}
            </span>
            <span className="text-xs text-white/80">
              {adminStats.presentCount} / {adminStats.totalCount} Students
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Quick Broadcast Hub (4 Primary Action Cards) */}
      <section>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 rounded-full bg-[#9b4500]" />
            <h2 className="text-[16px] font-bold text-[#00152f]">Quick Broadcast Hub</h2>
          </div>
          <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider">
            Fast Execution
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Action Card 1: Post Notice */}
          <button
            onClick={() => setShowNewNoticeModal(true)}
            className="flex flex-col text-left p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#b0c8f0] hover:shadow-md transition-all group active:scale-98"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center group-hover:bg-[#00152f] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">campaign</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#fffbeb] text-[#9b4500] text-[10px] font-bold border border-[#fde68a]">
                New Notice
              </span>
            </div>
            <h3 className="text-[14px] font-bold text-[#00152f] group-hover:text-[#9b4500] transition-colors leading-snug">
              Post News &amp; Bulletin
            </h3>
            <p className="text-xs text-[#74777f] mt-1">
              Draft notice, target grades, publish instant notification
            </p>
          </button>

          {/* Action Card 2: Attendance Alert */}
          <button
            onClick={handleSendAttendanceAlert}
            className="flex flex-col text-left p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#b0c8f0] hover:shadow-md transition-all group active:scale-98"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center group-hover:bg-[#00152f] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#991b1b] text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" /> 3 Absent
              </span>
            </div>
            <h3 className="text-[14px] font-bold text-[#00152f] group-hover:text-[#9b4500] transition-colors leading-snug">
              Mark &amp; Broadcast Attendance
            </h3>
            <p className="text-xs text-[#74777f] mt-1">
              Grade-wise submission &amp; instant SMS alert to absent parents
            </p>
          </button>

          {/* Action Card 3: Send Fee Due Reminders */}
          <button
            onClick={() => handleSendFeeReminder('whatsapp')}
            className="flex flex-col text-left p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#b0c8f0] hover:shadow-md transition-all group active:scale-98"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center group-hover:bg-[#00152f] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">send_money</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#fffbeb] text-[#9b4500] text-[10px] font-bold border border-[#fde68a]">
                38 Pending
              </span>
            </div>
            <h3 className="text-[14px] font-bold text-[#00152f] group-hover:text-[#9b4500] transition-colors leading-snug">
              Send Fee Due Reminders
            </h3>
            <p className="text-xs text-[#74777f] mt-1">
              1-click WhatsApp &amp; SMS reminder to overdue accounts
            </p>
          </button>

          {/* Action Card 4: Update School Calendar */}
          <button
            onClick={() => onSwitchToParentView()}
            className="flex flex-col text-left p-3.5 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#b0c8f0] hover:shadow-md transition-all group active:scale-98"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center group-hover:bg-[#00152f] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">edit_calendar</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#00152f] text-[10px] font-bold">
                Term 2
              </span>
            </div>
            <h3 className="text-[14px] font-bold text-[#00152f] group-hover:text-[#9b4500] transition-colors leading-snug">
              Update School Calendar
            </h3>
            <p className="text-xs text-[#74777f] mt-1">
              Add exam schedules, holidays, and sports day events
            </p>
          </button>
        </div>
      </section>

      {/* FEEDBACK TOASTS */}
      {attendanceAlertMessage && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs font-semibold text-[#065f46]">
          ✓ {attendanceAlertMessage}
        </div>
      )}
      {feeReminderMessage && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs font-semibold text-[#065f46]">
          ✓ {feeReminderMessage}
        </div>
      )}

      {/* SECTION 2: Active Bulletins & Circulars Management */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Circular Feed Dispatch
            </span>
            <h2 className="text-[16px] font-bold text-[#00152f]">
              Active Bulletins &amp; Circulars
            </h2>
          </div>
          <button
            onClick={() => setShowNewNoticeModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#00152f] hover:text-[#9b4500] transition-colors"
            type="button"
          >
            <span>+ Add Notice</span>
          </button>
        </div>

        <div className="space-y-3">
          {circulars.map((circ) => (
            <div
              key={circ.id}
              className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors"
            >
              {circ.imageUrl ? (
                <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden shrink-0 bg-[#e5eeff] relative">
                  <img
                    alt={circ.title}
                    className="w-full h-full object-cover"
                    src={circ.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 left-1 bg-[#00152f]/80 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {circ.targetGrades}
                  </span>
                </div>
              ) : (
                <div className="w-full sm:w-28 h-24 rounded-lg bg-[#eff4ff] flex flex-col items-center justify-center shrink-0 border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-[28px] text-[#00152f]">
                    description
                  </span>
                  <span className="text-[10px] font-bold text-[#74777f] mt-1">
                    {circ.targetGrades}
                  </span>
                </div>
              )}

              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        circ.status === 'Published'
                          ? 'bg-[#ecfdf5] text-[#065f46]'
                          : 'bg-[#fffbeb] text-[#9b4500]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          circ.status === 'Published' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'
                        }`}
                      />
                      {circ.status}
                    </span>
                    <span className="text-xs text-[#74777f] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">visibility</span>{' '}
                      {circ.views} views
                    </span>
                  </div>

                  <h3 className="text-[14px] font-bold text-[#00152f] mt-1.5 leading-snug">
                    {circ.title}
                  </h3>
                  <p className="text-xs text-[#43474e] line-clamp-1 mt-0.5">{circ.summary}</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e2e8f0]">
                  <span className="text-[11px] text-[#74777f]">
                    Dispatched: {circ.publishedTime}
                  </span>
                  <div className="flex items-center gap-2">
                    {circ.status === 'Draft' ? (
                      <button
                        onClick={() => onPublishDraftCircular(circ.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#00152f] text-white text-[11px] font-bold hover:bg-[#0f2a4a] active:scale-95 transition-all"
                        type="button"
                      >
                        Publish Now
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#10b981] font-bold">✓ Live Feed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Attendance Alert Sender Tool */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#991b1b] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">notification_important</span>
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#00152f]">
                Attendance Alert Sender Tool
              </h2>
              <p className="text-xs text-[#74777f]">Classroom absentee broadcast dispatch</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#00152f] text-xs font-bold">
            Morning Roll Call
          </span>
        </div>

        <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#e2e8f0] space-y-3">
          {/* Selector Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-1">
                Select Grade &amp; Section
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full h-11 bg-white border border-[#e2e8f0] rounded-xl px-3 text-xs font-bold text-[#00152f] focus:border-[#00152f] focus:outline-hidden"
              >
                <option value="6B">Class VI-B (Homeroom 204)</option>
                <option value="6A">Class VI-A</option>
                <option value="7A">Class VII-A</option>
                <option value="8B">Class VIII-B</option>
                <option value="9A">Class IX-A</option>
                <option value="NUR-A">Nursery - Daffodils</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-1">
                Date &amp; Time Stamp
              </label>
              <div className="h-11 bg-white border border-[#e2e8f0] rounded-xl px-3 flex items-center justify-between text-xs text-[#00152f]">
                <span className="font-semibold">Today, Oct 14, 2024</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#00152f]">
                  09:45 AM
                </span>
              </div>
            </div>
          </div>

          {/* Absentee List Preview */}
          <div className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00152f] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                3 Students Marked Absent Today
              </span>
              <span className="text-xs text-[#74777f]">Class Strength: 38</span>
            </div>

            <div className="space-y-1.5">
              {adminStats.rollCallAbsentees.map((abs, i) => (
                <div
                  key={abs.id}
                  className={`flex items-center justify-between text-xs py-1 ${
                    i < adminStats.rollCallAbsentees.length - 1 ? 'border-b border-[#f8fafc]' : ''
                  }`}
                >
                  <span className="font-semibold text-[#00152f]">
                    {i + 1}. {abs.name} (Roll {abs.rollNo})
                  </span>
                  <span
                    className={`font-bold ${
                      abs.status.includes('Medical') ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                    }`}
                  >
                    {abs.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Button */}
          <button
            onClick={handleSendAttendanceAlert}
            disabled={isSendingAttendanceAlert}
            className="w-full h-12 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">sms</span>
            <span>
              {isSendingAttendanceAlert
                ? 'Broadcasting via School SMS Gateway...'
                : 'Send Push & SMS Notification to Absent Parents'}
            </span>
          </button>
        </div>
      </section>

      {/* SECTION 4: Fee Reminder Dispatch Center */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
              Finance &amp; Accounts Module
            </span>
            <h2 className="text-[16px] font-bold text-[#00152f]">
              Fee Reminder Dispatch Center
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#fffbeb] text-[#9b4500] border border-[#fde68a] text-xs font-bold">
            Term 2 Outstanding
          </span>
        </div>

        <div className="p-3.5 bg-[#fffbeb]/60 rounded-xl border border-[#fde68a]/70 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#9b4500] uppercase">Pending Ledger</span>
            <p className="text-[17px] font-extrabold text-[#00152f] mt-0.5">
              Quarter 3 Outstanding Dues: {adminStats.feeDefaultersCount} Students
            </p>
            <p className="text-xs text-[#74777f]">
              Consolidated Dues:{' '}
              <span className="font-bold text-[#00152f]">
                ₹{adminStats.consolidatedDues.toLocaleString('en-IN')}
              </span>{' '}
              across middle and senior wings.
            </p>
          </div>

          <button
            onClick={handleExportDefaulters}
            className="px-3 py-2 bg-white border border-[#e2e8f0] rounded-xl text-[#00152f] text-xs font-bold flex items-center gap-1.5 hover:bg-[#eff4ff] active:scale-95 transition-all w-fit shadow-2xs"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export Defaulter List</span>
          </button>
        </div>

        {/* Template Preview */}
        <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
          <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-1">
            Standard Dispatch Template
          </label>
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] text-xs text-[#00152f] leading-relaxed italic text-[#43474e]">
            "Dear Parent, gentle reminder to clear Term 2 dues of ₹14,500 by Oct 15 to avoid late charges. For assistance contact accounts desk. - Disney World Public School"
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleSendFeeReminder('whatsapp')}
            className="h-11 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Send via WhatsApp</span>
          </button>

          <button
            onClick={() => handleSendFeeReminder('sms')}
            className="h-11 bg-[#00152f] hover:bg-[#0f2a4a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
            <span>Send via SMS</span>
          </button>
        </div>
      </section>

      {/* SECTION 5: School Helpdesk & Contact Card */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00152f] flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">business</span>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#00152f]">
              Campus Administration &amp; Helpdesk
            </h2>
            <p className="text-xs text-[#74777f]">Authorised institutional directory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <span className="text-[10px] font-bold text-[#9b4500] uppercase">
              Official School Address
            </span>
            <p className="font-semibold text-[#00152f] mt-1">
              1838, Sec 2, Ballabgarh, Faridabad - 121004, Haryana
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#74777f]">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span>Landmark: Near Milk Plant Road</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#9b4500] uppercase">
                Administrative Support
              </span>
              <p className="font-semibold text-[#00152f] mt-1">+91 98996 38676</p>
              <p className="text-xs text-[#74777f]">dwpsballabgarh@gmail.com</p>
            </div>
            <div className="mt-2 text-xs text-[#10b981] font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Office Hours: 08:00 AM - 03:30 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick System Sync Diagnostic Bar */}
      <div className="bg-[#f8fafc] p-3 rounded-xl border border-dashed border-[#e2e8f0] text-center text-xs text-[#74777f] flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm text-[#10b981]">cloud_done</span>
        <span>
          Cloud Sync Active: All teacher records and attendance rosters synchronized 4 mins ago.
        </span>
      </div>

      {/* NEW NOTICE MODAL */}
      {showNewNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
              <h3 className="text-[16px] font-bold text-[#00152f]">Draft Circular / Bulletin</h3>
              <button
                onClick={() => setShowNewNoticeModal(false)}
                className="p-1 text-[#74777f] hover:text-[#00152f] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNoticeSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g. Science Exhibition Registration"
                  className="w-full h-10 px-3 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#00152f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                  Summary / Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={newNoticeSummary}
                  onChange={(e) => setNewNoticeSummary(e.target.value)}
                  placeholder="Provide instructions and date details for parents..."
                  className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-xs text-[#00152f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#00152f] bg-white"
                  >
                    <option>Academics</option>
                    <option>Sports</option>
                    <option>Pre-Primary</option>
                    <option>Exams</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                    Target Grades
                  </label>
                  <select
                    value={newNoticeGrades}
                    onChange={(e) => setNewNoticeGrades(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#00152f] bg-white"
                  >
                    <option>All Wings</option>
                    <option>Class VI - X</option>
                    <option>Class XI - XII</option>
                    <option>Pre-Primary</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingNotice}
                className="w-full h-11 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">publish</span>
                <span>{isCreatingNotice ? 'Publishing...' : 'Publish to School Feed'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
