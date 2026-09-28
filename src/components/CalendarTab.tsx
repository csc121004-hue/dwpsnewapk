import React, { useState } from 'react';
import { CalendarEvent } from '../types';

interface CalendarTabProps {
  events: CalendarEvent[];
  onOpenCircularDetail?: (title: string) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ events }) => {
  const [filter, setFilter] = useState<'ALL' | 'EXAMS' | 'HOLIDAYS' | 'EVENTS'>('ALL');
  const [syncedToast, setSyncedToast] = useState('');

  const fullEvents: (CalendarEvent & { filterType: 'EXAMS' | 'HOLIDAYS' | 'EVENTS' })[] = [
    {
      id: 'evt_stem',
      title: 'DWPS STEM Fair 2024 Showcase',
      date: 'Thursday, October 24, 2024',
      time: '09:30 AM – 01:30 PM',
      category: 'SCIENCE & TECH',
      filterType: 'EVENTS',
      description: 'Grade VI to X students present hands-on working solar models, digital astronomy presentations, and robotics prototypes in the Central Innovation Lab.',
      imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XxMMyqGhYd7OyhE53ZJL6Eak2TecyaQoq6246nZc3gFvLa3_YJERWy8SiudJyPTSQmPr2jsTE8IZNqwdIq7I5-Vjm6k-Uws0_t_X1ZbyH9SWQeGgE-ANoOBGGHI3Iar2vrqN7fx9UtjQERH_YVMH45fz-w5fefvWRpMKslAmWayGeEIG9N9B_GTUtxyPd8tvl4LJhEWs2BHYEfuO8YzJBEP-v9yG80dcxQ45bLR-mjxcI4odsxN4LRrpA',
    },
    {
      id: 'evt_diwali',
      title: 'Diwali & Festive Vacation',
      date: 'October 31 to November 3, 2024',
      time: 'All Day',
      category: 'OFFICIAL HOLIDAY',
      filterType: 'HOLIDAYS',
      description: 'School remains closed for all wings from October 31 to November 3, 2024. Classes resume regularly on Monday, November 4.',
    },
    {
      id: 'evt_annual_day',
      title: 'Traditional Rhythms: Annual Day & Dance Fest',
      date: 'Tuesday, November 12, 2024',
      time: '04:00 PM – 07:30 PM',
      category: 'PERFORMING ARTS',
      filterType: 'EVENTS',
      description: 'Celebration of classical music, folk choreographies, and theatrical productions at the DWPS Auditorium. Senior choir ensemble featured.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSBpG08f1su2Dq8R_J34Y7YFeV3f42QfBxqRzQwQcCeejXDBNjIzuRGw-A51-6KmqO7b80nUW4_KQQ0D8AeHD2UJEHQh_fNLVDuPIS56zi7SCaS9KrVa96Wc6vvmaS1SUWos5gKp87E3uCz4-MdEN0bi30YLNIft-z9uCTY1kQr9zE7zqbSI5iRibCBiUVuv6A8-oTDPFFjbz0IXEn1YFC1xlcn2lEPMtq54eH7UtzT0-b6T0svVew',
    },
    {
      id: 'evt_half_yearly',
      title: 'Half Yearly Examination Assessment Window',
      date: 'October 14 to October 22, 2024',
      time: '08:30 AM – 11:45 AM',
      category: 'EXAMINATIONS',
      filterType: 'EXAMS',
      description: 'Summative Assessment-I for Grades VI to XII. Detailed date-sheet and subject guidelines have been circulated to parents.',
    },
    {
      id: 'evt_ptm',
      title: 'Parent-Teacher Meeting (PTM Term-1)',
      date: 'Saturday, November 23, 2024',
      time: '09:00 AM – 01:00 PM',
      category: 'ACADEMIC CONSULTATION',
      filterType: 'EVENTS',
      description: 'Individual parent consultation with homeroom & subject teachers to discuss Term-1 report card and holistic progress.',
    },
  ];

  const filteredEvents = fullEvents.filter((e) => {
    if (filter === 'ALL') return true;
    return e.filterType === filter;
  });

  const handleSyncGoogle = (title: string, date: string) => {
    // Generate Google Calendar Event URL
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Disney World Public School: ${title}`
    )}&details=${encodeURIComponent(`Disney World Public School official event: ${title}`)}`;
    const link = document.createElement('a');
    link.href = googleCalUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSyncedToast(`Opened Google Calendar for "${title}"`);
    setTimeout(() => setSyncedToast(''), 3500);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* HEADER */}
      <section className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-[#9b4500] uppercase">
            Institutional Schedule
          </span>
          <h2 className="text-[18px] font-bold text-[#00152f]">School Calendar & Events</h2>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#00152f] flex items-center justify-center border border-[#dce9ff]">
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
        </div>
      </section>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1.5 p-1 bg-[#eff4ff] rounded-xl border border-[#e2e8f0] overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            filter === 'ALL'
              ? 'bg-[#00152f] text-white shadow-2xs'
              : 'text-[#43474e] hover:text-[#00152f]'
          }`}
          type="button"
        >
          All (5)
        </button>
        <button
          onClick={() => setFilter('EXAMS')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            filter === 'EXAMS'
              ? 'bg-[#00152f] text-white shadow-2xs'
              : 'text-[#43474e] hover:text-[#00152f]'
          }`}
          type="button"
        >
          Exams
        </button>
        <button
          onClick={() => setFilter('HOLIDAYS')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            filter === 'HOLIDAYS'
              ? 'bg-[#00152f] text-white shadow-2xs'
              : 'text-[#43474e] hover:text-[#00152f]'
          }`}
          type="button"
        >
          Holidays
        </button>
        <button
          onClick={() => setFilter('EVENTS')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
            filter === 'EVENTS'
              ? 'bg-[#00152f] text-white shadow-2xs'
              : 'text-[#43474e] hover:text-[#00152f]'
          }`}
          type="button"
        >
          Campus Events
        </button>
      </div>

      {syncedToast && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs font-semibold text-[#065f46] flex items-center justify-between">
          <span>✓ {syncedToast}</span>
          <button onClick={() => setSyncedToast('')} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* EVENT CARDS LIST */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden"
          >
            {evt.imageUrl && (
              <div className="relative h-36 w-full">
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00152f] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#00152f]/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  {evt.category}
                </span>
              </div>
            )}

            <div className="p-4 space-y-2">
              {!evt.imageUrl && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      evt.filterType === 'HOLIDAYS'
                        ? 'bg-[#fffbeb] text-[#9b4500] border border-[#fde68a]'
                        : evt.filterType === 'EXAMS'
                        ? 'bg-[#eff4ff] text-[#00152f] border border-[#dce9ff]'
                        : 'bg-[#ecfdf5] text-[#065f46]'
                    }`}
                  >
                    {evt.category}
                  </span>
                </div>
              )}

              <h3 className="text-[16px] font-bold text-[#00152f]">{evt.title}</h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#74777f]">
                <span className="flex items-center gap-1 font-semibold text-[#00152f]">
                  <span className="material-symbols-outlined text-[16px] text-[#9b4500]">
                    event
                  </span>
                  {evt.date}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {evt.time}
                </span>
              </div>

              <p className="text-xs text-[#43474e] leading-relaxed pt-1">{evt.description}</p>

              <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between">
                <span className="text-[11px] text-[#74777f]">Ballabgarh Campus</span>
                <button
                  onClick={() => handleSyncGoogle(evt.title, evt.date)}
                  className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00152f] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#9b4500]">
                    add_circle
                  </span>
                  <span>Sync Google Cal</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
