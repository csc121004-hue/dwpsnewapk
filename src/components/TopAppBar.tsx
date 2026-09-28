import React from 'react';
import { Student } from '../types';

interface TopAppBarProps {
  activeStudent: Student;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenSiblingModal: () => void;
  onOpenApkModal: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeStudent,
  onOpenMenu,
  onOpenNotifications,
  onOpenSiblingModal,
  onOpenApkModal,
  onLogout,
  unreadCount = 3,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-[#00152f] text-white shadow-md select-none">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMenu}
          aria-label="Open Navigation Drawer"
          className="flex items-center justify-center p-1.5 rounded-lg hover:bg-[#0f2a4a] active:scale-95 transition-all text-white"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Official Disney World Public School Crest Logo */}
          <div className="w-8 h-9 rounded-md overflow-hidden flex items-center justify-center bg-transparent shrink-0">
            <img
              src="/disney-world-logo.svg"
              alt="Disney World Public School Crest Logo"
              className="h-full w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-[15px] sm:text-[17px] font-bold tracking-tight text-white leading-tight font-['Outfit']">
              Disney World Public School
            </span>
            <span className="text-[10px] tracking-wider text-[#fde68a] uppercase font-bold">
              Parent Portal • 2024-25
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* APK / Download Quick Button */}
        <button
          onClick={onOpenApkModal}
          className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fde68a]/20 border border-[#fde68a]/40 text-[#fde68a] hover:bg-[#fde68a]/30 active:scale-95 transition-all"
          title="Download APK / Install App"
        >
          <span className="material-symbols-outlined text-[15px]">android</span>
          <span>APK</span>
        </button>

        {/* Notification Button */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative p-1.5 rounded-lg hover:bg-[#0f2a4a] active:scale-95 transition-all text-white"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef4444] text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-[#00152f]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar Toggle */}
        <button
          onClick={onOpenSiblingModal}
          className="w-8 h-8 rounded-full bg-[#fffbeb] border-2 border-[#fde68a] flex items-center justify-center text-[#9b4500] font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-transform"
          title={`Active Ward: ${activeStudent.name}. Click to switch sibling.`}
        >
          {activeStudent.avatarText}
        </button>

        {/* Prominent Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#dc2626]/20 border border-[#dc2626]/50 text-[#fca5a5] hover:bg-[#dc2626]/30 active:scale-95 transition-all text-xs font-bold"
          title="Logout from Parent Portal to Login Screen"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">logout</span>
          <span className="hidden xs:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
