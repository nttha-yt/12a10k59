/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'gvcn' | 'lop_truong' | 'to_truong_1' | 'to_truong_2' | 'to_truong_3' | 'to_truong_4' | 'hoc_sinh';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  groupNumber?: number; // 1, 2, 3, 4
  avatar: string;
  studentId?: string;
  email?: string;
  phone?: string;
}

export interface Student {
  id: string;
  code: string; // e.g. '12A10-01'
  phone?: string;
  name: string;
  group: number; // 1, 2, 3, 4
  roleInClass: 'Lớp trưởng' | 'Lớp phó học tập' | 'Lớp phó phong trào' | 'Bí thư' | 'Tổ trưởng' | 'Tổ phó' | 'Học sinh';
  avatar: string;
  gender: 'Nam' | 'Nữ';
  parentName: string;
  parentPhone: string;
  address?: string;
  email?: string;
  birthday?: string;
}

export type CriterionCategory = 'ne_nep' | 'hoc_tap' | 've_sinh' | 'phong_trao' | 'khac';

export interface RuleCriterion {
  id: string;
  code: string;
  name: string;
  category: CriterionCategory;
  points: number; // positive for bonus, negative for deduction
  description: string;
  icon: string;
  isDefault?: boolean;
}

export interface ScoreLogEntry {
  id: string;
  studentId: string;
  studentName: string;
  group: number;
  criterionId: string;
  criterionName: string;
  category: CriterionCategory;
  points: number;
  note?: string;
  recordedBy: string; // e.g. "Tổ trưởng Tổ 1 - Nguyễn Văn An"
  recordedByRole: UserRole;
  timestamp: string; // ISO string
  weekNumber: number;
  academicYear: string;
}

export interface WeeklyRemark {
  id: string;
  weekNumber: number;
  targetType: 'group' | 'student';
  targetId: string; // group number (1,2,3,4) as string, or studentId
  content: string;
  authorName: string;
  authorRole: UserRole;
  timestamp: string;
}

export type DutyDay = 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7';
export type DutyStatus = 'pending' | 'completed' | 'excused';

export interface PenaltyAssignment {
  id: string;
  weekNumber: number;
  studentId: string;
  studentName: string;
  studentCode: string;
  group: number;
  totalScore: number;
  penaltyRankInGroup: number; // 1 (lowest) or 2 (2nd lowest)
  dutyDay: DutyDay;
  dutyTask: string;
  status: DutyStatus;
  note?: string;
  assignedAt: string;
  notifiedZalo: boolean;
  notifiedSms: boolean;
}

export interface NotificationLog {
  id: string;
  recipientName: string;
  recipientPhone: string;
  type: 'penalty_alert' | 'weekly_summary' | 'bonus_cheer' | 'general';
  channel: 'zalo' | 'sms' | 'in_app';
  content: string;
  timestamp: string;
  status: 'sent' | 'simulated';
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  questionsCount: number;
}

export type QuizSubject = Subject;

export interface QuizQuestion {
  id: string;
  subjectId: string;
  content: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSession {
  id: string;
  subjectId: string;
  subjectName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  date: string;
}

export interface SeatingDesk {
  deskNumber: number;
  leftStudent: string;
  rightStudent: string;
}

export interface AppSettings {
  academicYear: string;
  className: string;
  schoolName: string;
  homeroomTeacher: string;
  currentWeek: number;
  penaltiesPerGroup: number; // default 2
  baseStartingScore: number; // default 100
  geminiApiKey?: string;
  selectedModel: string;
  highThinkingEnabled: boolean;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  autoSave: boolean;
  mainDutyGroupOverrides?: Record<string, number>;
  seatingChart?: Record<string, SeatingDesk[]>;
}

export interface AppAccount {
  id: string;
  username: string;
  passcode: string;
  role: UserRole;
  name: string;
}

export interface FullAppData {
  students: Student[];
  rules: RuleCriterion[];
  scoreLogs: ScoreLogEntry[];
  penaltyAssignments: PenaltyAssignment[];
  notifications: NotificationLog[];
  subjects: Subject[];
  questions: QuizQuestion[];
  quizSessions: QuizSession[];
  settings: AppSettings;
  accounts: AppAccount[];
  remarks: WeeklyRemark[];
}
