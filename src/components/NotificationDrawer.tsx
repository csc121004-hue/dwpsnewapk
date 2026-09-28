import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'fee' | 'attendance' | 'event';
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Term 2 Fee Due Reminder',
      desc: 'Quarter 3 fee of ₹14,500 due by 15th Oct. Late fee waiver active.',
      time: '10 mins ago',
      unread: true,
      type: 'fee',
    },
    {
      id: 'n2',
      title: 'Roll Call Attendance Marked',
      desc: 'Aarav marked Present in Homeroom 204. Science lab session active.',
      time: '1 hour ago',
      unread: true,
      type: 'attendance',
    },
    {
      id: 'n3',
      title: 'STEM Fair 2024 Showcase Tomorrow',
      desc: 'Exhibition commences at 09:30 AM in the Central Innovation Wing.',
      time: '3 hours ago',
      unread: true,
      type: 'event',
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        <div>
          <div className="p-4 bg-[#00152f] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <h3 className="font-bold text-sm">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllRead}
                className="text-[11px] text-[#fde68a] hover:underline"
              >
                Mark Read
              </button>
              <button
                onClick={onClose}
                className="p-1 text-white hover:text-[#fde68a] font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-3 divide-y divide-[#e2e8f0] overflow-y-auto max-h-[calc(100vh-100px)]">
            {notifications.map((item) => (
              <div key={item.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#00152f]">{item.title}</span>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  )}
                </div>
                <p className="text-[#43474e] leading-snug">{item.desc}</p>
                <span className="text-[10px] text-[#74777f]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#eff4ff] text-[#00152f] font-bold text-xs rounded-xl hover:bg-[#dce9ff]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
