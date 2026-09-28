import React, { useState, useEffect } from 'react';
import { AdminStats, CircularItem, BusTrackingData, ERPConfig } from '../types';

export type AdminTabType = 'overview' | 'attendance' | 'fees' | 'circulars' | 'transport' | 'erp';

interface AdminPortalInterfaceProps {
  adminStats: AdminStats;
  circulars: CircularItem[];
  busData: BusTrackingData | null;
  adminUser: { name: string; title: string; avatar: string };
  onLogout: () => void;
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

export const AdminPortalInterface: React.FC<AdminPortalInterfaceProps> = ({
  adminStats,
  circulars,
  busData,
  adminUser,
  onLogout,
  onBroadcastAttendance,
  onBroadcastFeeReminders,
  onPublishDraftCircular,
  onCreateCircular,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');
  const [selectedGrade, setSelectedGrade] = useState('6B');
  const [isSendingAttendanceAlert, setIsSendingAttendanceAlert] = useState(false);
  const [attendanceAlertMessage, setAttendanceAlertMessage] = useState('');
  const [feeReminderMessage, setFeeReminderMessage] = useState('');
  const [showNewNoticeModal, setShowNewNoticeModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // New Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeSummary, setNewNoticeSummary] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('General');
  const [newNoticeGrades, setNewNoticeGrades] = useState('All Wings');
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);

  // ERP Integration State
  const [erpData, setErpData] = useState<ERPConfig | null>(null);
  const [activeErpSubTab, setActiveErpSubTab] = useState<'connect' | 'webhooks' | 'csv' | 'logs'>('connect');
  const [erpProvider, setErpProvider] = useState('Generic REST API / Webhook');
  const [erpApiEndpoint, setErpApiEndpoint] = useState('https://erp.disneyworldps.com/api/v2');
  const [erpApiKey, setErpApiKey] = useState('dwps_erp_live_sec_89f0291ba482');
  const [erpSyncFrequency, setErpSyncFrequency] = useState('Real-time Webhook & Hourly Cron');
  const [isTestingErp, setIsTestingErp] = useState(false);
  const [isSyncingErp, setIsSyncingErp] = useState(false);
  const [erpFeedback, setErpFeedback] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [csvInput, setCsvInput] = useState(
    'admissionNo,name,grade,rollNo,attendanceRate,dueFee\nDWPS-2024-0418,Aarav Sharma,Grade VI-B,14,94.5,14500\nDWPS-2024-0891,Dhruv Sharma,Grade IX-A,21,96.8,0\nDWPS-2024-1102,Kabir Malhotra,Grade VI-B,14,88.2,14500'
  );
  const [isImportingCsv, setIsImportingCsv] = useState(false);

  useEffect(() => {
    fetch('/api/erp/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.erp) {
          setErpData(data.erp);
          setErpProvider(data.erp.provider || 'Generic REST API / Webhook');
          setErpApiEndpoint(data.erp.apiEndpoint || 'https://erp.disneyworldps.com/api/v2');
          setErpApiKey(data.erp.apiKey || 'dwps_erp_live_sec_89f0291ba482');
          setErpSyncFrequency(data.erp.syncFrequency || 'Real-time Webhook & Hourly Cron');
        }
      })
      .catch((err) => console.error('Failed to load ERP config', err));
  }, []);

  const handleTestErpConnection = async () => {
    setIsTestingErp(true);
    setErpFeedback('');
    try {
      const res = await fetch('/api/erp/sync/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: erpProvider, endpoint: erpApiEndpoint }),
      }).then((r) => r.json());

      if (res.success) {
        setErpFeedback(`✓ ${res.message}`);
      } else {
        setErpFeedback(`✕ Connection failed: ${res.message}`);
      }
    } catch (err) {
      setErpFeedback('✕ Network error while contacting ERP gateway.');
    } finally {
      setIsTestingErp(false);
    }
  };

  const handleTriggerErpSync = async (scope: 'all' | 'students' | 'attendance' | 'fees' = 'all') => {
    setIsSyncingErp(true);
    setErpFeedback('');
    try {
      const res = await fetch('/api/erp/sync/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope }),
      }).then((r) => r.json());

      if (res.success) {
        setErpData(res.erp);
        setErpFeedback(`✓ ${res.message}`);
      }
    } catch (err) {
      setErpFeedback('✕ Synchronization error.');
    } finally {
      setIsSyncingErp(false);
    }
  };

  const handleSaveErpConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/erp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: erpProvider,
          apiEndpoint: erpApiEndpoint,
          apiKey: erpApiKey,
          syncFrequency: erpSyncFrequency,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setErpData(res.erp);
        setErpFeedback(`✓ Configuration saved for ${res.erp.provider}.`);
      }
    } catch (err) {
      setErpFeedback('✕ Failed to save ERP configuration.');
    }
  };

  const handleImportCsv = async () => {
    if (!csvInput.trim()) return;
    setIsImportingCsv(true);
    try {
      const res = await fetch('/api/erp/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: csvInput, type: 'Students' }),
      }).then((r) => r.json());

      if (res.success) {
        setErpFeedback(`✓ ${res.message}`);
        // Refresh status
        fetch('/api/erp/status')
          .then((r) => r.json())
          .then((data) => data.erp && setErpData(data.erp));
      }
    } catch (err) {
      setErpFeedback('✕ Error processing CSV import.');
    } finally {
      setIsImportingCsv(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopyFeedback(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopyFeedback(''), 3000);
  };

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
    link.download = 'disney-world-fee-defaulters-q3.csv';
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
    <div className="min-h-screen bg-[#f1f5f9] text-[#0b1c30] flex flex-col font-['Outfit'] select-none">
      {/* EXECUTIVE ADMIN TOP BAR */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#00152f] text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-10 rounded-md overflow-hidden flex items-center justify-center bg-transparent shrink-0">
            <img
              src="/disney-world-logo.svg"
              alt="Disney World Public School Crest"
              className="h-full w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white leading-tight">
              Disney World Public School
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[10px] tracking-wider text-[#fde68a] uppercase font-bold">
                Admin &amp; Staff Terminal
              </span>
            </div>
          </div>
        </div>

        {/* Staff Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white leading-tight">{adminUser.name}</span>
            <span className="text-[10px] text-[#b0c8f0] line-clamp-1">{adminUser.title}</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#fde68a] text-[#9b4500] font-bold text-xs flex items-center justify-center border border-[#fde68a]/50 shadow-sm">
            {adminUser.avatar}
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#dc2626]/20 border border-[#dc2626]/50 text-[#fca5a5] hover:bg-[#dc2626]/30 text-xs font-bold active:scale-95 transition-all shadow-xs"
            type="button"
            title="Logout from School Admin Portal"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ADMIN SUB-NAVIGATION HEADER BAR */}
      <div className="fixed top-16 left-0 w-full z-40 bg-white border-b border-[#e2e8f0] px-4 py-2 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-[#00152f] text-white shadow-xs'
                : 'text-[#43474e] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">dashboard</span>
            <span>Staff Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'attendance'
                ? 'bg-[#00152f] text-white shadow-xs'
                : 'text-[#43474e] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">how_to_reg</span>
            <span>Attendance Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'fees'
                ? 'bg-[#00152f] text-white shadow-xs'
                : 'text-[#43474e] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">send_money</span>
            <span>Fee Reminders</span>
          </button>

          <button
            onClick={() => setActiveTab('circulars')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'circulars'
                ? 'bg-[#00152f] text-white shadow-xs'
                : 'text-[#43474e] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">campaign</span>
            <span>Bulletins &amp; Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'transport'
                ? 'bg-[#00152f] text-white shadow-xs'
                : 'text-[#43474e] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">directions_bus</span>
            <span>Fleet Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab('erp')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'erp'
                ? 'bg-[#9b4500] text-white shadow-xs font-bold'
                : 'text-[#43474e] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">sync_alt</span>
            <span>ERP Integration &amp; Sync</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          </button>
        </div>
      </div>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 pt-32 pb-16 px-4 max-w-4xl mx-auto w-full space-y-4">
        {/* TOAST FEEDBACK */}
        {erpFeedback && (
          <div className="p-3.5 bg-[#eff4ff] border border-[#dce9ff] rounded-2xl text-xs font-bold text-[#00152f] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#10b981]">hub</span>
              {erpFeedback}
            </span>
            <button onClick={() => setErpFeedback('')}>✕</button>
          </div>
        )}

        {copyFeedback && (
          <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl text-xs font-bold text-[#065f46] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              {copyFeedback}
            </span>
            <button onClick={() => setCopyFeedback('')}>✕</button>
          </div>
        )}
        {attendanceAlertMessage && (
          <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl text-xs font-bold text-[#065f46] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {attendanceAlertMessage}
            </span>
            <button onClick={() => setAttendanceAlertMessage('')}>✕</button>
          </div>
        )}

        {feeReminderMessage && (
          <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl text-xs font-bold text-[#065f46] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {feeReminderMessage}
            </span>
            <button onClick={() => setFeeReminderMessage('')}>✕</button>
          </div>
        )}

        {/* TAB 1: OVERVIEW & PRINCIPAL DESK */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Principal Hero Card */}
            <div className="relative overflow-hidden bg-[#00152f] text-white rounded-3xl p-5 sm:p-6 shadow-md">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#0f2a4a] pointer-events-none blur-2xl" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#fde68a] border-2 border-[#fde68a]/60 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
                    <span className="material-symbols-outlined text-[#9b4500] text-4xl">school</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0f2a4a] text-[#fde68a] text-[10px] font-bold uppercase tracking-wider border border-[#304869] mb-1">
                      <span className="material-symbols-outlined text-[12px]">verified_user</span>
                      Director Principal
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {adminStats.principalName}
                    </h2>
                    <p className="text-xs text-[#b0c8f0]">{adminStats.principalTitle}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#304869]">
                  <span className="text-[11px] font-semibold text-[#b0c8f0]">
                    Campus Attendance Today
                  </span>
                  <span className="text-2xl font-extrabold text-[#fde68a]">
                    {adminStats.campusAttendance}
                  </span>
                  <span className="text-xs text-white/80">
                    {adminStats.presentCount} / {adminStats.totalCount} Students
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setActiveTab('attendance')}
                className="p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs hover:border-[#b0c8f0] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
                </div>
                <h4 className="text-sm font-bold text-[#00152f]">Attendance Alert</h4>
                <p className="text-[11px] text-[#ef4444] font-bold mt-0.5">3 Absent Today</p>
              </div>

              <div
                onClick={() => setActiveTab('fees')}
                className="p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs hover:border-[#b0c8f0] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#fffbeb] text-[#9b4500] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
                <h4 className="text-sm font-bold text-[#00152f]">Fee Reminders</h4>
                <p className="text-[11px] text-[#9b4500] font-bold mt-0.5">38 Pending Accounts</p>
              </div>

              <div
                onClick={() => setShowNewNoticeModal(true)}
                className="p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs hover:border-[#b0c8f0] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[22px]">campaign</span>
                </div>
                <h4 className="text-sm font-bold text-[#00152f]">Broadcast Notice</h4>
                <p className="text-[11px] text-[#10b981] font-bold mt-0.5">New Bulletin</p>
              </div>

              <div
                onClick={() => setActiveTab('transport')}
                className="p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs hover:border-[#b0c8f0] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[22px]">directions_bus</span>
                </div>
                <h4 className="text-sm font-bold text-[#00152f]">Campus Fleet</h4>
                <p className="text-[11px] text-[#10b981] font-bold mt-0.5">All Buses Active</p>
              </div>
            </div>

            {/* Recent Broadcast Log */}
            <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#00152f]">Recent Administrative Dispatches</h3>
                <span className="text-xs font-semibold text-[#74777f]">Today</span>
              </div>

              <div className="divide-y divide-[#e2e8f0]">
                {adminStats.broadcastLog.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#00152f]">{log.title}</p>
                      <p className="text-[#74777f]">{log.type} • Dispatched to {log.count} recipients</p>
                    </div>
                    <span className="text-[11px] font-mono text-[#74777f]">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Contact & Secretariat Information Card */}
            <div className="p-4 bg-white rounded-3xl border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fffbeb] text-[#9b4500] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">contact_support</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#00152f]">School Secretariat &amp; Accounts Desk</h4>
                  <p className="text-[#74777f]">Official communication channel for parents and regulatory bodies</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="tel:+919899638676"
                  className="px-3 py-1.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] font-bold flex items-center gap-1.5 hover:bg-[#d1fae5] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>+91 98996 38676</span>
                </a>
                <a
                  href="mailto:dwpsballabgarh@gmail.com"
                  className="px-3 py-1.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[#00152f] font-bold flex items-center gap-1.5 hover:bg-[#dce9ff] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>dwpsballabgarh@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE BROADCAST SENDER */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">how_to_reg</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#00152f]">Attendance Alert Sender Tool</h3>
                  <p className="text-xs text-[#74777f]">Broadcast SMS / Push notifications to parents of absent students</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#dce9ff] text-[#00152f] text-xs font-bold">
                Morning Roll Call
              </span>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                  Select Grade &amp; Section
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 text-xs font-bold text-[#00152f] focus:outline-hidden focus:border-[#00152f]"
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
                <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                  Date &amp; Time Stamp
                </label>
                <div className="h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 flex items-center justify-between text-xs text-[#00152f]">
                  <span className="font-semibold">Today, Oct 14, 2024</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#00152f]">
                    09:45 AM
                  </span>
                </div>
              </div>
            </div>

            {/* Absentee Preview List */}
            <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#00152f]">
                <span className="flex items-center gap-1.5 text-[#ef4444]">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  3 Students Marked Absent Today
                </span>
                <span className="text-[#74777f]">Class Strength: 38</span>
              </div>

              <div className="space-y-1.5">
                {adminStats.rollCallAbsentees.map((abs, i) => (
                  <div
                    key={abs.id}
                    className="p-2.5 bg-white rounded-xl border border-[#e2e8f0] flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-[#00152f]">
                      {i + 1}. {abs.name} (Roll No: {abs.rollNo})
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                        abs.status.includes('Medical')
                          ? 'bg-[#fffbeb] text-[#9b4500]'
                          : 'bg-[#fee2e2] text-[#991b1b]'
                      }`}
                    >
                      {abs.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Broadcast Action */}
            <button
              onClick={handleSendAttendanceAlert}
              disabled={isSendingAttendanceAlert}
              className="w-full h-12 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md disabled:opacity-50"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">sms</span>
              <span>
                {isSendingAttendanceAlert
                  ? 'Dispatching SMS & Push Notifications...'
                  : 'Send Push & SMS Notification to Absent Parents'}
              </span>
            </button>
          </div>
        )}

        {/* TAB 3: FEE REMINDERS & DEFAULTER LEDGER */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fffbeb] text-[#9b4500] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">send_money</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#00152f]">Fee Reminder Dispatch Center</h3>
                  <p className="text-xs text-[#74777f]">Quarter 3 Outstanding Dues &amp; Recovery</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#fffbeb] text-[#9b4500] border border-[#fde68a] text-xs font-bold">
                Term 2
              </span>
            </div>

            <div className="p-4 bg-[#fffbeb]/60 rounded-2xl border border-[#fde68a] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-bold text-[#9b4500] uppercase tracking-wider">
                  Outstanding Accounts Ledger
                </span>
                <p className="text-xl font-extrabold text-[#00152f] mt-0.5">
                  {adminStats.feeDefaultersCount} Students Pending
                </p>
                <p className="text-xs text-[#74777f]">
                  Consolidated Balance:{' '}
                  <strong className="text-[#00152f]">
                    ₹{adminStats.consolidatedDues.toLocaleString('en-IN')}
                  </strong>
                </p>
              </div>

              <button
                onClick={handleExportDefaulters}
                className="px-3.5 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[#00152f] text-xs font-bold flex items-center gap-2 hover:bg-[#eff4ff] active:scale-95 transition-all shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export Defaulter List (.csv)</span>
              </button>
            </div>

            {/* Standard Template Preview */}
            <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-[#e2e8f0] space-y-1.5">
              <label className="text-xs font-bold text-[#00152f] uppercase">
                Automated Message Template
              </label>
              <div className="p-3 bg-white rounded-xl border border-[#e2e8f0] text-xs text-[#43474e] italic leading-relaxed">
                "Dear Parent, gentle reminder to clear Term 2 dues of ₹14,500 by Oct 15 to avoid late charges. For assistance contact accounts desk. - Disney World Public School"
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSendFeeReminder('whatsapp')}
                className="h-12 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Send via WhatsApp</span>
              </button>

              <button
                onClick={() => handleSendFeeReminder('sms')}
                className="h-12 bg-[#00152f] hover:bg-[#0f2a4a] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">send_to_mobile</span>
                <span>Send via SMS</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: BULLETINS & CIRCULARS FEED */}
        {activeTab === 'circulars' && (
          <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">campaign</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#00152f]">Circulars &amp; Notice Feed</h3>
                  <p className="text-xs text-[#74777f]">Publish institutional bulletins for parent &amp; student apps</p>
                </div>
              </div>

              <button
                onClick={() => setShowNewNoticeModal(true)}
                className="px-3.5 py-2 bg-[#00152f] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#0f2a4a] active:scale-95 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Draft Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {circulars.map((circ) => (
                <div
                  key={circ.id}
                  className="p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col sm:flex-row gap-3 items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          circ.status === 'Published'
                            ? 'bg-[#ecfdf5] text-[#065f46]'
                            : 'bg-[#fffbeb] text-[#9b4500]'
                        }`}
                      >
                        {circ.status}
                      </span>
                      <span className="text-[11px] text-[#74777f]">{circ.targetGrades}</span>
                      <span className="text-[11px] text-[#74777f]">• {circ.publishedTime}</span>
                    </div>

                    <h4 className="text-[15px] font-bold text-[#00152f] mt-1">{circ.title}</h4>
                    <p className="text-xs text-[#43474e] mt-0.5 line-clamp-2">{circ.summary}</p>
                  </div>

                  {circ.status === 'Draft' ? (
                    <button
                      onClick={() => onPublishDraftCircular(circ.id)}
                      className="px-3 py-1.5 bg-[#00152f] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shrink-0"
                    >
                      Publish Live
                    </button>
                  ) : (
                    <span className="text-xs text-[#10b981] font-bold flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Active Feed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FLEET MONITOR */}
        {activeTab === 'transport' && busData && (
          <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">directions_bus</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#00152f]">Campus Fleet &amp; Route Monitor</h3>
                  <p className="text-xs text-[#74777f]">GPS telematics and transit logs</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] text-xs font-bold">
                ● 100% Vehicles Online
              </span>
            </div>

            <div className="p-4 bg-[#00152f] text-white rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{busData.busNumber} • {busData.registrationNo}</span>
                <span className="text-xs text-[#fde68a] font-bold">ETA: ~{busData.etaMinutes} Mins</span>
              </div>
              <p className="text-xs text-[#b0c8f0]">Route: {busData.route}</p>
              <p className="text-xs text-[#10b981]">Current Location: {busData.currentLocation}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#00152f] uppercase">Route Waypoints</h4>
              <div className="divide-y divide-[#e2e8f0]">
                {busData.stops.map((stop, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <span className={stop.current ? 'font-bold text-[#10b981]' : 'text-[#00152f]'}>
                      {idx + 1}. {stop.name} {stop.current && '(Active Transit)'}
                    </span>
                    <span className="font-mono text-[#74777f]">{stop.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: THIRD-PARTY ERP INTEGRATION & SYNC CONSOLE */}
        {activeTab === 'erp' && (
          <div className="space-y-4">
            {/* Header Status Card */}
            <div className="relative overflow-hidden bg-[#00152f] text-white rounded-3xl p-5 sm:p-6 shadow-md">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#0f2a4a] pointer-events-none blur-xl" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#fffbeb] text-[#9b4500] flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
                    <span className="material-symbols-outlined text-3xl">hub</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#6ee7b7] text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                        Live Bridge Active
                      </span>
                      <span className="text-[11px] text-[#fde68a] font-bold">
                        {erpData?.provider || erpProvider}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Third-Party ERP Synchronizer
                    </h2>
                    <p className="text-xs text-[#b0c8f0]">
                      Bi-directional connector for Student Information Systems (SIS), Biometrics &amp; Fee Ledgers
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#304869]">
                  <span className="text-[11px] font-semibold text-[#b0c8f0]">Last Sync Cycle</span>
                  <span className="text-base font-extrabold text-[#fde68a]">
                    {erpData?.lastSyncTimestamp || 'Today, 09:30 AM'}
                  </span>
                  <span className="text-[11px] text-white/80">
                    {erpData?.totalSyncedStudents || 1482} Active Student Records
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 pt-3 border-t border-[#304869] flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestErpConnection}
                  disabled={isTestingErp}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/20 active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isTestingErp ? 'autorenew' : 'wifi_tethering'}
                  </span>
                  <span>{isTestingErp ? 'Testing Handshake...' : 'Test ERP Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerErpSync('all')}
                  disabled={isSyncingErp}
                  className="px-3.5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isSyncingErp ? 'hourglass_top' : 'sync'}
                  </span>
                  <span>{isSyncingErp ? 'Synchronizing...' : 'Trigger Full Sync Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyText(erpData?.apiKey || erpApiKey, 'API Secret Key')}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#d4e3ff] text-xs font-medium flex items-center gap-1.5 transition-all border border-white/10 ml-auto active:scale-95"
                >
                  <span className="material-symbols-outlined text-[15px]">key</span>
                  <span>Copy Auth Token</span>
                </button>
              </div>
            </div>

            {/* ERP Navigation Sub-Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-2xl border border-[#e2e8f0] text-xs font-bold shadow-xs">
              <button
                type="button"
                onClick={() => setActiveErpSubTab('connect')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  activeErpSubTab === 'connect'
                    ? 'bg-[#00152f] text-white shadow-xs'
                    : 'text-[#43474e] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                <span className="hidden sm:inline">Connector Config</span>
                <span className="sm:hidden">Config</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveErpSubTab('webhooks')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  activeErpSubTab === 'webhooks'
                    ? 'bg-[#00152f] text-white shadow-xs'
                    : 'text-[#43474e] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">webhook</span>
                <span className="hidden sm:inline">Webhooks &amp; API</span>
                <span className="sm:hidden">API</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveErpSubTab('csv')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  activeErpSubTab === 'csv'
                    ? 'bg-[#00152f] text-white shadow-xs'
                    : 'text-[#43474e] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span className="hidden sm:inline">CSV Batch Import</span>
                <span className="sm:hidden">CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveErpSubTab('logs')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  activeErpSubTab === 'logs'
                    ? 'bg-[#00152f] text-white shadow-xs'
                    : 'text-[#43474e] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span className="hidden sm:inline">Sync Audit Logs</span>
                <span className="sm:hidden">Logs</span>
              </button>
            </div>

            {/* SUB-TAB 1: CONNECTOR CONFIGURATION */}
            {activeErpSubTab === 'connect' && (
              <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                  <div>
                    <h3 className="text-base font-bold text-[#00152f]">
                      Third-Party ERP Provider &amp; Gateway Settings
                    </h3>
                    <p className="text-xs text-[#74777f]">
                      Connect Entab CampusCare, Fedena, Teachmint, Edunext, CampusPro, or custom database APIs
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#00152f] text-[11px] font-bold">
                    AES-256 Auth
                  </span>
                </div>

                <form onSubmit={handleSaveErpConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                        ERP System / Provider
                      </label>
                      <select
                        value={erpProvider}
                        onChange={(e) => setErpProvider(e.target.value)}
                        className="w-full h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 text-xs font-bold text-[#00152f]"
                      >
                        <option>Generic REST API / Webhook</option>
                        <option>Entab CampusCare ERP</option>
                        <option>Fedena School ERP</option>
                        <option>Teachmint School OS</option>
                        <option>CampusPro ERP</option>
                        <option>Edunext Technologies</option>
                        <option>Custom SQL Database / Direct Sync</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                        Sync Schedule &amp; Frequency
                      </label>
                      <select
                        value={erpSyncFrequency}
                        onChange={(e) => setErpSyncFrequency(e.target.value)}
                        className="w-full h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 text-xs font-bold text-[#00152f]"
                      >
                        <option>Real-time Webhook &amp; Hourly Cron</option>
                        <option>Every 15 Minutes (High Priority)</option>
                        <option>Daily Nightly Cron (02:00 AM)</option>
                        <option>Manual Trigger Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                      Third-Party ERP Base URL / Endpoint
                    </label>
                    <input
                      type="url"
                      required
                      value={erpApiEndpoint}
                      onChange={(e) => setErpApiEndpoint(e.target.value)}
                      placeholder="https://your-school-erp.com/api/v1"
                      className="w-full h-11 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-semibold text-[#00152f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                      ERP Authorization Token / Bearer Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={erpApiKey}
                        onChange={(e) => setErpApiKey(e.target.value)}
                        className="flex-1 h-11 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl font-mono text-xs text-[#00152f]"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyText(erpApiKey, 'API Key')}
                        className="px-3 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00152f] text-xs font-bold rounded-xl active:scale-95"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] text-xs space-y-1.5">
                    <p className="font-bold text-[#00152f] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#10b981]">verified</span>
                      How the 3-Way ERP Bridge Operates:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[#43474e]">
                      <li>
                        <strong>Student Roster &amp; Profiles:</strong> Admission numbers from your ERP are matched as the single source of truth.
                      </li>
                      <li>
                        <strong>Attendance &amp; Biometrics:</strong> Morning RFID turnstile or teacher roll calls push directly to parent push alerts.
                      </li>
                      <li>
                        <strong>Fee Payments:</strong> Offline bank challans and counter cash receipts in your ERP instantly reflect in parents' fee balances here.
                      </li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    <span>Save Connector Settings</span>
                  </button>
                </form>
              </div>
            )}

            {/* SUB-TAB 2: WEBHOOKS & API SPECS */}
            {activeErpSubTab === 'webhooks' && (
              <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                  <div>
                    <h3 className="text-base font-bold text-[#00152f]">
                      Live Webhook Ingestion Endpoints
                    </h3>
                    <p className="text-xs text-[#74777f]">
                      Configure your ERP to send POST HTTP payloads directly to this portal
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] text-[11px] font-bold">
                    JSON Payloads
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Webhook 1: Students */}
                  <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#00152f] flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#10b981] text-white text-[10px] font-mono">
                          POST
                        </span>
                        <span>/api/erp/sync/students</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            `${window.location.origin}/api/erp/sync/students`,
                            'Student Webhook URL'
                          )
                        }
                        className="text-[#9b4500] font-bold hover:underline"
                      >
                        Copy URL
                      </button>
                    </div>
                    <p className="text-[#43474e]">
                      Pushes new student admissions, grade transfers, and contact updates from ERP.
                    </p>
                    <div className="p-2.5 bg-[#00152f] text-[#6ee7b7] font-mono text-[11px] rounded-xl overflow-x-auto">
                      {`// Header: X-API-Key: ${erpApiKey}
{
  "students": [
    { "admissionNo": "DWPS-2024-0418", "name": "Aarav Sharma", "grade": "Grade VI-B", "rollNo": 14 }
  ]
}`}
                    </div>
                  </div>

                  {/* Webhook 2: Attendance */}
                  <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#00152f] flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#00152f] text-white text-[10px] font-mono">
                          POST
                        </span>
                        <span>/api/erp/sync/attendance</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            `${window.location.origin}/api/erp/sync/attendance`,
                            'Attendance Webhook URL'
                          )
                        }
                        className="text-[#9b4500] font-bold hover:underline"
                      >
                        Copy URL
                      </button>
                    </div>
                    <p className="text-[#43474e]">
                      Pushes daily morning RFID machine punches and homeroom attendance.
                    </p>
                    <div className="p-2.5 bg-[#00152f] text-[#6ee7b7] font-mono text-[11px] rounded-xl overflow-x-auto">
                      {`{
  "attendance": [
    { "admissionNo": "DWPS-2024-0418", "date": "2024-10-14", "status": "Present", "timestamp": "08:12 AM" }
  ]
}`}
                    </div>
                  </div>

                  {/* Webhook 3: Fees */}
                  <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#00152f] flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#9b4500] text-white text-[10px] font-mono">
                          POST
                        </span>
                        <span>/api/erp/sync/fees</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            `${window.location.origin}/api/erp/sync/fees`,
                            'Fees Webhook URL'
                          )
                        }
                        className="text-[#9b4500] font-bold hover:underline"
                      >
                        Copy URL
                      </button>
                    </div>
                    <p className="text-[#43474e]">
                      Pushes fee receipts generated at the school fee counter or ERP banking bridge.
                    </p>
                    <div className="p-2.5 bg-[#00152f] text-[#6ee7b7] font-mono text-[11px] rounded-xl overflow-x-auto">
                      {`{
  "admissionNo": "DWPS-2024-0418",
  "amountPaid": 14500,
  "receiptNo": "ERP-REC-8921",
  "paymentMode": "Direct Bank Deposit",
  "term": "Term 2 (2024)"
}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: CSV BATCH IMPORT */}
            {activeErpSubTab === 'csv' && (
              <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                  <div>
                    <h3 className="text-base font-bold text-[#00152f]">
                      Direct CSV Roster &amp; Fee Ledger Ingestion
                    </h3>
                    <p className="text-xs text-[#74777f]">
                      If your ERP exports to CSV / Excel, paste or upload rows here for immediate batch update
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#fffbeb] text-[#9b4500] text-[11px] font-bold">
                    Instant Import
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                      Paste CSV Data (Header: admissionNo,name,grade,rollNo,attendanceRate,dueFee)
                    </label>
                    <textarea
                      rows={6}
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-[#e2e8f0] font-mono text-xs text-[#00152f] bg-[#f8fafc]"
                      placeholder="admissionNo,name,grade,rollNo,attendanceRate,dueFee"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleImportCsv}
                      disabled={isImportingCsv || !csvInput.trim()}
                      className="flex-1 h-12 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[20px]">file_upload</span>
                      <span>{isImportingCsv ? 'Processing CSV...' : 'Ingest CSV Records'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCsvInput(
                          'admissionNo,name,grade,rollNo,attendanceRate,dueFee\nDWPS-2024-0418,Aarav Sharma,Grade VI-B,14,94.5,14500\nDWPS-2024-0891,Dhruv Sharma,Grade IX-A,21,96.8,0\nDWPS-2024-1102,Kabir Malhotra,Grade VI-B,14,88.2,14500\nDWPS-2024-1240,Ananya Deshmukh,Grade VI-B,22,91.0,14500'
                        )
                      }
                      className="px-4 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00152f] font-bold text-xs rounded-xl transition-all"
                    >
                      Load Sample
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: SYNC AUDIT LOGS */}
            {activeErpSubTab === 'logs' && (
              <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                  <div>
                    <h3 className="text-base font-bold text-[#00152f]">ERP Synchronization Audit Log</h3>
                    <p className="text-xs text-[#74777f]">
                      Real-time ledger of inbound webhooks, cron jobs, and batch reconciliations
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTriggerErpSync('all')}
                    className="px-3 py-1.5 rounded-xl bg-[#eff4ff] text-[#00152f] text-xs font-bold hover:bg-[#dce9ff] active:scale-95"
                  >
                    Refresh Logs
                  </button>
                </div>

                <div className="divide-y divide-[#e2e8f0]">
                  {(erpData?.syncLogs || []).map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#00152f]">{log.type}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#065f46]">
                            {log.status}
                          </span>
                          <span className="text-[#74777f] font-semibold">{log.records} Records</span>
                        </div>
                        <p className="text-[#43474e] mt-1">{log.message}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[#74777f] shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* DRAFT NOTICE MODAL */}
      {showNewNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
              <h3 className="text-base font-bold text-[#00152f]">Draft Circular / Bulletin</h3>
              <button onClick={() => setShowNewNoticeModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateNoticeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g. Science Exhibition Registration"
                  className="w-full h-10 px-3 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#00152f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                  Summary / Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={newNoticeSummary}
                  onChange={(e) => setNewNoticeSummary(e.target.value)}
                  placeholder="Provide instructions and date details..."
                  className="w-full p-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#00152f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#00152f] bg-white"
                  >
                    <option>Academics</option>
                    <option>Sports</option>
                    <option>Pre-Primary</option>
                    <option>Exams</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00152f] uppercase mb-1">
                    Target Grades
                  </label>
                  <select
                    value={newNoticeGrades}
                    onChange={(e) => setNewNoticeGrades(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#00152f] bg-white"
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
                className="w-full h-11 bg-[#00152f] hover:bg-[#0f2a4a] text-white font-bold text-xs rounded-xl active:scale-98 transition-all disabled:opacity-50"
              >
                {isCreatingNotice ? 'Publishing...' : 'Publish to Feed'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl border border-[#e2e8f0] space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#fee2e2] text-[#dc2626] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#00152f]">Logout from School Admin?</h3>
              <p className="text-xs text-[#74777f] mt-1">
                You will be returned to the Login Page for Parents and School Admin.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 bg-[#f1f5f9] text-[#00152f] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-bold active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
