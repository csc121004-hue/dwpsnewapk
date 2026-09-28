import React from 'react';

export type TabType = 'dashboard' | 'attendance' | 'fees' | 'calendar';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'attendance', label: 'Attendance', icon: 'how_to_reg' },
    { id: 'fees', label: 'Fees', icon: 'receipt_long' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-1.5 h-16 bg-white shadow-lg border-t border-[#e2e8f0] select-none">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-[#fffbeb] text-[#9b4500] rounded-xl px-4 py-1 font-semibold shadow-xs border border-[#fde68a]/50'
                : 'text-[#43474e] hover:bg-[#eff4ff] px-3.5 py-1 font-normal rounded-xl'
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1' : ''}`}
            >
              {item.icon}
            </span>
            <span className="text-[11px] mt-0.5 font-medium tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

