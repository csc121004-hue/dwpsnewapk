import React from 'react';
import { Student } from '../types';
import { TabType } from './BottomNavBar';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudent: Student;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenBusTracking: () => void;
  onOpenReportCard: () => void;
  onOpenTeacherChat: () => void;
  onOpenApkModal: () => void;
  onOpenSiblingModal: () => void;
  onLogout: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  activeStudent,
  activeTab,
  onSelectTab,
  onOpenBusTracking,
  onOpenReportCard,
  onOpenTeacherChat,
  onOpenApkModal,
  onOpenSiblingModal,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Body */}
      <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Top Brand Banner */}
          <div className="p-4 bg-[#00152f] text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-11 rounded-lg overflow-hidden flex items-center justify-center bg-transparent shrink-0">
                <img
                  src="/disney-world-logo.svg"
                  alt="Disney World Public School Crest"
                  className="h-full w-auto object-contain drop-shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icon.svg';
                  }}
                />
              </div>
              <button
                onClick={onClose}
                className="p-1 text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="font-bold text-[16px] tracking-tight">Disney World Public School</h3>
            <p className="text-[11px] text-[#fde68a] font-medium">
              Knowledge is Our Magic • CBSE Affiliated
            </p>

            {/* Active Student Switcher preview */}
            <div
              onClick={() => {
                onClose();
                onOpenSiblingModal();
              }}
              className="mt-3 p-2 bg-[#0f2a4a] rounded-xl border border-[#304869] flex items-center justify-between cursor-pointer hover:bg-[#1a3d66] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#fde68a] text-[#9b4500] font-bold text-xs flex items-center justify-center">
                  {activeStudent.avatarText}
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{activeStudent.name}</p>
                  <p className="text-[10px] text-[#b0c8f0]">{activeStudent.grade}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#b0c8f0]">
                swap_horiz
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1 text-xs font-semibold overflow-y-auto max-h-[calc(100vh-280px)]">
            <button
              onClick={() => {
                onSelectTab('dashboard');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#eff4ff] text-[#00152f] font-bold'
                  : 'text-[#43474e] hover:bg-[#f8fafc]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('attendance');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'attendance'
                  ? 'bg-[#eff4ff] text-[#00152f] font-bold'
                  : 'text-[#43474e] hover:bg-[#f8fafc]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              <span>Attendance &amp; Leave</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('fees');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'fees'
                  ? 'bg-[#eff4ff] text-[#00152f] font-bold'
                  : 'text-[#43474e] hover:bg-[#f8fafc]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              <span>Fee Invoices &amp; Pay</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('calendar');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'calendar'
                  ? 'bg-[#eff4ff] text-[#00152f] font-bold'
                  : 'text-[#43474e] hover:bg-[#f8fafc]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>School Calendar</span>
            </button>

            <div className="pt-2 my-1 border-t border-[#e2e8f0]">
              <span className="px-3 text-[10px] font-bold text-[#74777f] uppercase tracking-wider">
                Academic Utilities
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenBusTracking();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#43474e] hover:bg-[#f8fafc]"
            >
              <span className="material-symbols-outlined text-[20px] text-[#10b981]">
                directions_bus
              </span>
              <span>Live Bus Tracking</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenReportCard();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#43474e] hover:bg-[#f8fafc]"
            >
              <span className="material-symbols-outlined text-[20px] text-[#00152f]">
                assignment
              </span>
              <span>Term-1 Report Card</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenTeacherChat();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#43474e] hover:bg-[#f8fafc]"
            >
              <span className="material-symbols-outlined text-[20px] text-[#9b4500]">forum</span>
              <span>Teacher Chat</span>
            </button>
          </div>
        </div>

        {/* Footer with Sign Out and APK Download button */}
        <div className="p-3 border-t border-[#e2e8f0] bg-[#f8fafc] space-y-2">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-[#fca5a5]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Logout (Parent Portal)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenApkModal();
            }}
            className="w-full py-2.5 bg-[#00152f] hover:bg-[#0f2a4a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">android</span>
            <span>Download Android APK</span>
          </button>

          <p className="text-[10px] text-center text-[#74777f]">
            Disney World Public School Portal v1.0.1
          </p>
        </div>
      </div>
    </div>
  );
};
