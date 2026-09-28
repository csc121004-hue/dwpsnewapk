import React, { useState, useEffect } from 'react';
import { LoginScreen, UserRole } from './components/LoginScreen';
import { AdminPortalInterface } from './components/AdminPortalInterface';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { DashboardTab } from './components/DashboardTab';
import { AttendanceTab } from './components/AttendanceTab';
import { FeesTab } from './components/FeesTab';
import { CalendarTab } from './components/CalendarTab';

import { BusTrackingModal } from './components/BusTrackingModal';
import { ReportCardModal } from './components/ReportCardModal';
import { TeacherChatModal } from './components/TeacherChatModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { SiblingSwitchModal } from './components/SiblingSwitchModal';
import { ReceiptInvoiceModal } from './components/ReceiptInvoiceModal';
import { CircularDetailModal } from './components/CircularDetailModal';
import { SideDrawer } from './components/SideDrawer';
import { NotificationDrawer } from './components/NotificationDrawer';

import {
  Student,
  LedgerDay,
  LeaveRequest,
  HomeworkItem,
  CircularItem,
  CalendarEvent,
  BusTrackingData,
  AdminStats,
  PastReceipt,
} from './types';

export default function App() {
  // Authentication Role State ('parent' | 'admin' | null)
  // Default to null so the user is welcomed by the Login Page for Parents and School Admin
  const [authRole, setAuthRole] = useState<UserRole | null>(() => {
    return (sessionStorage.getItem('dwps_auth_role') as UserRole) || null;
  });

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    title: string;
    avatar: string;
  } | null>(() => {
    const saved = sessionStorage.getItem('dwps_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Parent Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [student, setStudent] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [ledger, setLedger] = useState<LedgerDay[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [busData, setBusData] = useState<BusTrackingData | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  // Modals
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isSiblingModalOpen, setIsSiblingModalOpen] = useState(false);
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isReportCardModalOpen, setIsReportCardModalOpen] = useState(false);
  const [isTeacherChatModalOpen, setIsTeacherChatModalOpen] = useState(false);
  const [selectedCircular, setSelectedCircular] = useState<CircularItem | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PastReceipt | null>(null);

  // Initial Load from Backend
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        studentRes,
        allStudentsRes,
        attendanceRes,
        homeworkRes,
        circularsRes,
        calendarRes,
        busRes,
        adminRes,
      ] = await Promise.all([
        fetch('/api/student').then((r) => r.json()),
        fetch('/api/students').then((r) => r.json()),
        fetch('/api/attendance').then((r) => r.json()),
        fetch('/api/homework').then((r) => r.json()),
        fetch('/api/circulars').then((r) => r.json()),
        fetch('/api/calendar').then((r) => r.json()),
        fetch('/api/bus-tracking').then((r) => r.json()),
        fetch('/api/admin/overview').then((r) => r.json()),
      ]);

      if (studentRes.success) setStudent(studentRes.student);
      if (allStudentsRes.success) setAllStudents(allStudentsRes.students);
      if (attendanceRes.success) {
        setLedger(attendanceRes.ledger);
        setLeaveRequests(attendanceRes.leaveRequests);
      }
      if (homeworkRes.success) setHomeworkList(homeworkRes.homework);
      if (circularsRes.success) setCirculars(circularsRes.circulars);
      if (calendarRes.success) setCalendarEvents(calendarRes.events);
      if (busRes.success) setBusData(busRes.bus);
      if (adminRes.success) setAdminStats(adminRes.admin);
    } catch (err) {
      console.error('Failed to load application data from server:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auth Handlers
  const handleLogin = (
    role: UserRole,
    userDetails: { name: string; title: string; avatar: string }
  ) => {
    sessionStorage.setItem('dwps_auth_role', role);
    sessionStorage.setItem('dwps_auth_user', JSON.stringify(userDetails));
    localStorage.setItem('dwps_auth_role', role);
    localStorage.setItem('dwps_auth_user', JSON.stringify(userDetails));
    setAuthRole(role);
    setCurrentUser(userDetails);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dwps_auth_role');
    sessionStorage.removeItem('dwps_auth_user');
    localStorage.removeItem('dwps_auth_role');
    localStorage.removeItem('dwps_auth_user');
    setAuthRole(null);
    setCurrentUser(null);
    setIsSideDrawerOpen(false);
  };

  // Switch Student Account (Parent only)
  const handleSelectStudent = async (studentId: string) => {
    try {
      const res = await fetch('/api/student/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      }).then((r) => r.json());

      if (res.success) {
        setStudent(res.activeStudent);
        const attRes = await fetch('/api/attendance').then((r) => r.json());
        if (attRes.success) {
          setLedger(attRes.ledger);
          setLeaveRequests(attRes.leaveRequests);
        }
      }
    } catch (err) {
      console.error('Failed to switch student:', err);
    }
  };

  // Apply Leave (Parent only)
  const handleApplyLeave = async (leaveData: {
    reasonType: string;
    fromDate: string;
    toDate: string;
    note: string;
    certificateName?: string;
  }) => {
    try {
      const res = await fetch('/api/attendance/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData),
      }).then((r) => r.json());

      if (res.success) {
        setLeaveRequests((prev) => [res.leave, ...prev]);
        return true;
      }
    } catch (err) {
      console.error('Error applying leave:', err);
    }
    return false;
  };

  // Pay Fee (Parent only)
  const handlePayFee = async (mode: string) => {
    try {
      const res = await fetch('/api/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMode: mode }),
      }).then((r) => r.json());

      if (res.success && res.receipt) {
        if (student) {
          const updatedStudent = {
            ...student,
            fee: {
              ...student.fee,
              isPaid: true,
              totalOutstanding: 0,
              pastReceipts: [res.receipt, ...student.fee.pastReceipts],
            },
          };
          setStudent(updatedStudent);
        }
        return { success: true, receipt: res.receipt, message: res.message };
      }
    } catch (err) {
      console.error('Error processing fee payment:', err);
    }
    return { success: false, message: 'Payment authorization failed' };
  };

  // Toggle Homework Item
  const handleToggleHomework = async (id: string) => {
    try {
      const res = await fetch('/api/homework/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).then((r) => r.json());

      if (res.success) {
        setHomeworkList((prev) =>
          prev.map((hw) => (hw.id === id ? { ...hw, isCompleted: !hw.isCompleted } : hw))
        );
      }
    } catch (err) {
      console.error('Error toggling homework:', err);
    }
  };

  // Admin Broadcast Actions
  const handleBroadcastAttendance = async (grade: string) => {
    try {
      const res = await fetch('/api/admin/broadcast-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gradeSection: grade }),
      }).then((r) => r.json());

      return res;
    } catch (err) {
      return { success: false, message: 'Failed to broadcast alert' };
    }
  };

  const handleBroadcastFeeReminders = async (channel: 'whatsapp' | 'sms') => {
    try {
      const res = await fetch('/api/admin/broadcast-fee-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel }),
      }).then((r) => r.json());

      return res;
    } catch (err) {
      return { success: false, message: 'Failed to broadcast reminders' };
    }
  };

  const handlePublishDraftCircular = async (id: string) => {
    try {
      const res = await fetch('/api/circulars/publish-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).then((r) => r.json());

      if (res.success) {
        setCirculars((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: 'Published' } : c))
        );
        return true;
      }
    } catch (err) {
      console.error('Error publishing draft:', err);
    }
    return false;
  };

  const handleCreateCircular = async (circ: {
    title: string;
    summary: string;
    category: string;
    targetGrades: string;
  }) => {
    try {
      const res = await fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(circ),
      }).then((r) => r.json());

      if (res.success) {
        setCirculars((prev) => [res.circular, ...prev]);
        return true;
      }
    } catch (err) {
      console.error('Error creating circular:', err);
    }
    return false;
  };

  // If data is still loading
  if (loading || !student || !adminStats) {
    return (
      <div className="min-h-screen bg-[#00152f] text-white flex flex-col items-center justify-center space-y-3 font-['Outfit']">
        <div className="w-14 h-14 rounded-2xl bg-[#0f2a4a] border border-[#fde68a] flex items-center justify-center animate-spin">
          <span className="material-symbols-outlined text-[#fde68a] text-3xl">school</span>
        </div>
        <p className="text-sm font-semibold tracking-wider text-[#d4e3ff]">
          Connecting to Disney World Public School Portal...
        </p>
      </div>
    );
  }

  // 1. IF NOT LOGGED IN: SHOW AUTHENTICATION LOGIN SCREEN
  if (!authRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // 2. IF LOGGED IN AS ADMIN: DEDICATED ADMIN & STAFF INTERFACE (NO PARENT TABS, NO SWITCHING)
  if (authRole === 'admin') {
    return (
      <AdminPortalInterface
        adminStats={adminStats}
        circulars={circulars}
        busData={busData}
        adminUser={
          currentUser || {
            name: 'Mr. Rohit Choudhary',
            title: 'Director Principal • Disney World Public School',
            avatar: 'RC',
          }
        }
        onLogout={handleLogout}
        onBroadcastAttendance={handleBroadcastAttendance}
        onBroadcastFeeReminders={handleBroadcastFeeReminders}
        onPublishDraftCircular={handlePublishDraftCircular}
        onCreateCircular={handleCreateCircular}
      />
    );
  }

  // 3. IF LOGGED IN AS PARENT: DEDICATED PARENT INTERFACE (NO ADMIN ACCESS, NO SWITCHING)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1c30] flex flex-col font-['Outfit'] select-none">
      {/* Top App Bar for Parents */}
      <TopAppBar
        activeStudent={student}
        onOpenMenu={() => setIsSideDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenSiblingModal={() => setIsSiblingModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Parent Portal Content */}
      <main className="flex-1 pt-18 pb-24 px-4">
        {activeTab === 'dashboard' && (
          <DashboardTab
            student={student}
            homeworkList={homeworkList}
            circulars={circulars}
            onSwitchStudent={() => setIsSiblingModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenBusTracking={() => setIsBusModalOpen(true)}
            onOpenReportCard={() => setIsReportCardModalOpen(true)}
            onOpenTeacherChat={() => setIsTeacherChatModalOpen(true)}
            onSelectCircular={(circ) => setSelectedCircular(circ)}
            onToggleHomework={handleToggleHomework}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab
            student={student}
            ledger={ledger}
            leaveRequests={leaveRequests}
            onApplyLeave={handleApplyLeave}
            onSwitchStudent={() => setIsSiblingModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'fees' && (
          <FeesTab
            student={student}
            onPayFee={handlePayFee}
            onSwitchStudent={() => setIsSiblingModalOpen(true)}
            onViewReceipt={(receipt) => setSelectedReceipt(receipt)}
          />
        )}

        {activeTab === 'calendar' && <CalendarTab events={calendarEvents} />}
      </main>

      {/* Parent Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* PARENT MODALS & DRAWERS */}
      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        activeStudent={student}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenBusTracking={() => setIsBusModalOpen(true)}
        onOpenReportCard={() => setIsReportCardModalOpen(true)}
        onOpenTeacherChat={() => setIsTeacherChatModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenSiblingModal={() => setIsSiblingModalOpen(true)}
        onLogout={handleLogout}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {isApkModalOpen && (
        <ApkDownloadModal onClose={() => setIsApkModalOpen(false)} />
      )}

      {isSiblingModalOpen && (
        <SiblingSwitchModal
          students={allStudents}
          activeStudentId={student.id}
          onSelectStudent={handleSelectStudent}
          onClose={() => setIsSiblingModalOpen(false)}
        />
      )}

      {isBusModalOpen && busData && (
        <BusTrackingModal
          busData={busData}
          onClose={() => setIsBusModalOpen(false)}
        />
      )}

      {isReportCardModalOpen && (
        <ReportCardModal
          student={student}
          onClose={() => setIsReportCardModalOpen(false)}
        />
      )}

      {isTeacherChatModalOpen && (
        <TeacherChatModal
          student={student}
          onClose={() => setIsTeacherChatModalOpen(false)}
        />
      )}

      {selectedCircular && (
        <CircularDetailModal
          circular={selectedCircular}
          onClose={() => setSelectedCircular(null)}
        />
      )}

      {selectedReceipt && (
        <ReceiptInvoiceModal
          receipt={selectedReceipt}
          student={student}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
