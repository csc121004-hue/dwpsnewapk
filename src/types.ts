export interface StudentSummary {
  presentDays: number;
  absentDays: number;
  absentReason: string;
  lateDays: number;
  holidayDays: number;
  annualRatio: string;
  status: string;
}

export interface ClassLogItem {
  period: number;
  subject: string;
  status: string;
}

export interface TeacherRemark {
  teacher: string;
  role: string;
  avatarInitial: string;
  text: string;
}

export interface FeeBreakdownItem {
  title: string;
  subtitle: string;
  amount: number;
  type: 'charge' | 'discount';
}

export interface PastReceipt {
  id: string;
  term: string;
  paidOn: string;
  amount: number;
  status: string;
  ref: string;
  mode: string;
}

export interface StudentFee {
  termName: string;
  dueDaysLeft: number;
  dueDate: string;
  totalOutstanding: number;
  isPaid: boolean;
  lateWaiverNotice: string;
  breakdown: FeeBreakdownItem[];
  pastReceipts: PastReceipt[];
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  rollNo: number;
  admissionNo: string;
  regNo: string;
  avatarText: string;
  homeroom: string;
  classTeacher: string;
  attendanceRate: number;
  term: string;
  attendanceSummary: StudentSummary;
  classLog: ClassLogItem[];
  teacherRemark: TeacherRemark;
  fee: StudentFee;
}

export interface LedgerDay {
  date: number;
  day: string;
  status: 'present' | 'late' | 'absent_medical' | 'event' | 'weekend' | 'holiday' | 'scheduled';
  label: string;
  isToday?: boolean;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  reasonType: string;
  fromDate: string;
  toDate: string;
  note?: string;
  status: string;
  approvedBy: string;
  certificateUploaded?: boolean;
  certificateName?: string;
}

export interface HomeworkItem {
  id: string;
  subject: string;
  badgeColor: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface CircularItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  publishedTime: string;
  views: number;
  targetGrades: string;
  status: string;
  imageUrl?: string;
  isPdf?: boolean;
  featured?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  imageUrl?: string;
}

export interface BusTrackingData {
  busNumber: string;
  driverName: string;
  driverPhone: string;
  registrationNo: string;
  route: string;
  currentLocation: string;
  nextStop: string;
  etaMinutes: number;
  status: string;
  stops: {
    name: string;
    time: string;
    passed: boolean;
    current?: boolean;
  }[];
}

export interface AdminStats {
  principalName: string;
  principalTitle: string;
  campusAttendance: string;
  presentCount: number;
  totalCount: number;
  absentCountToday: number;
  feeDefaultersCount: number;
  consolidatedDues: number;
  activeGradeSection: string;
  rollCallAbsentees: {
    id: string;
    name: string;
    rollNo: number;
    status: string;
  }[];
  broadcastLog: {
    id: string;
    type: string;
    title: string;
    timestamp: string;
    count: number;
  }[];
}

export interface ERPSyncLog {
  id: string;
  timestamp: string;
  type: string;
  records: number;
  status: 'Success' | 'Warning' | 'Error';
  message: string;
}

export interface ERPConfig {
  provider: string;
  status: 'Connected' | 'Idle' | 'Syncing' | 'Error';
  apiKey: string;
  webhookBaseUrl: string;
  apiEndpoint: string;
  syncFrequency: string;
  lastSyncTimestamp: string;
  totalSyncedStudents: number;
  totalSyncedAttendance: number;
  totalSyncedTransactions: number;
  syncLogs: ERPSyncLog[];
}

