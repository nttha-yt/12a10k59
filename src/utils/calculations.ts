/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, ScoreLogEntry, PenaltyAssignment, DutyDay } from '../types';

export interface StudentScoreSummary {
  student: Student;
  baseScore: number;
  neNepPoints: number;
  hocTapPoints: number;
  veSinhPoints: number;
  phongTraoPoints: number;
  totalScore: number;
  rankInClass: number;
  rankInGroup: number;
  isPenalized: boolean;
  infractionCount: number;
  bonusCount: number;
}

export interface GroupScoreSummary {
  group: number;
  totalScore: number;
  avgScore: number;
  studentCount: number;
  rank: number;
  topStudentName: string;
  topStudentScore: number;
  penalizedStudents: StudentScoreSummary[];
}

export const DUTY_DAYS_POOL: DutyDay[] = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export const DUTY_TASKS_POOL = [
  'Quét lớp, giặt khăn lau bảng sạch sẽ trước 6h45 sáng',
  'Kê ngay ngắn bàn ghế các dãy và đổ thùng rác cuối buổi học',
  'Quét dọn hành lang trước cửa lớp và tưới cây xanh',
  'Lau cửa kính, kiểm tra tắt toàn bộ đèn quạt sau giờ tan học',
  'Tổng vệ sinh bục giảng, kiểm tra vệ sinh từng hộc bàn',
  'Hỗ trợ tổ trực nhật chính sắp xếp thiết bị học tập & loa đài',
];

/**
 * Tính điểm chi tiết của từng học sinh trong 1 tuần
 */
export function calculateStudentScores(
  students: Student[],
  weekNumber: number,
  logs: ScoreLogEntry[],
  baseStartingScore: number = 100,
  penaltiesPerGroup: number = 2
): StudentScoreSummary[] {
  // Step 1: Calculate raw totals
  const summaries: Omit<StudentScoreSummary, 'rankInClass' | 'rankInGroup' | 'isPenalized'>[] = students.map(std => {
    const studentLogs = logs.filter(l => l.studentId === std.id && l.weekNumber === weekNumber);
    const neNep = studentLogs.filter(l => l.category === 'ne_nep').reduce((sum, l) => sum + l.points, 0);
    const hocTap = studentLogs.filter(l => l.category === 'hoc_tap').reduce((sum, l) => sum + l.points, 0);
    const veSinh = studentLogs.filter(l => l.category === 've_sinh').reduce((sum, l) => sum + l.points, 0);
    const phongTrao = studentLogs.filter(l => l.category === 'phong_trao').reduce((sum, l) => sum + l.points, 0);

    const total = baseStartingScore + neNep + hocTap + veSinh + phongTrao;
    const infractions = studentLogs.filter(l => l.points < 0).length;
    const bonuses = studentLogs.filter(l => l.points > 0).length;

    return {
      student: std,
      baseScore: baseStartingScore,
      neNepPoints: neNep,
      hocTapPoints: hocTap,
      veSinhPoints: veSinh,
      phongTraoPoints: phongTrao,
      totalScore: total,
      infractionCount: infractions,
      bonusCount: bonuses,
    };
  });

  // Step 2: Rank in class (Highest score = Rank 1)
  const sortedByClass = [...summaries].sort((a, b) => b.totalScore - a.totalScore);
  const classRankMap = new Map<string, number>();
  let currentRank = 1;
  sortedByClass.forEach((item, index) => {
    if (index > 0 && item.totalScore < sortedByClass[index - 1].totalScore) {
      currentRank = index + 1;
    }
    classRankMap.set(item.student.id, currentRank);
  });

  // Step 3: Rank in group (Lowest score gets flagged for penalty)
  const fullSummaries: StudentScoreSummary[] = [];

  for (let g = 1; g <= 4; g++) {
    const groupStudents = summaries.filter(s => s.student.group === g);
    // Sort descending for rank in group
    groupStudents.sort((a, b) => b.totalScore - a.totalScore);

    // Lowest students are at the end of sorted array
    const groupCount = groupStudents.length;
    const penalizedCutoff = Math.max(0, groupCount - penaltiesPerGroup);

    groupStudents.forEach((item, index) => {
      // Chọn 2 học sinh có điểm thấp nhất (luôn luôn phạt 2 bạn thấp nhất)
      const isPenalized = index >= penalizedCutoff;
      fullSummaries.push({
        ...item,
        rankInClass: classRankMap.get(item.student.id) || 1,
        rankInGroup: index + 1,
        isPenalized,
      });
    });
  }

  return fullSummaries;
}

/**
 * Tính điểm và xếp hạng 4 Tổ
 */
export function calculateGroupSummaries(
  studentSummaries: StudentScoreSummary[]
): GroupScoreSummary[] {
  const groupResults: GroupScoreSummary[] = [];

  for (let g = 1; g <= 4; g++) {
    const members = studentSummaries.filter(s => s.student.group === g);
    const totalScore = members.reduce((sum, m) => sum + m.totalScore, 0);
    const avgScore = members.length > 0 ? totalScore / members.length : 0;
    
    // Top student in group
    const sorted = [...members].sort((a, b) => b.totalScore - a.totalScore);
    const top = sorted[0];
    const penalized = members.filter(m => m.isPenalized);

    groupResults.push({
      group: g,
      totalScore,
      avgScore,
      studentCount: members.length,
      rank: 1, // calculated next
      topStudentName: top ? top.student.name : 'Chưa có',
      topStudentScore: top ? top.totalScore : 0,
      penalizedStudents: penalized,
    });
  }

  // Sort groups by avgScore descending
  groupResults.sort((a, b) => b.avgScore - a.avgScore);
  let currentGrpRank = 1;
  groupResults.forEach((grp, idx) => {
    if (idx > 0 && grp.avgScore < groupResults[idx - 1].avgScore) {
      currentGrpRank = idx + 1;
    }
    grp.rank = currentGrpRank;
  });

  // Return sorted by group number 1-4
  return groupResults.sort((a, b) => a.group - b.group);
}

/**
 * Tự động tạo / đồng bộ danh sách 2 học sinh trực nhật phạt mỗi tổ cho tuần
 */
export function generateAutoPenaltyAssignments(
  students: Student[],
  weekNumber: number,
  logs: ScoreLogEntry[],
  existingPenalties: PenaltyAssignment[],
  penaltiesPerGroup: number = 2
): PenaltyAssignment[] {
  const summaries = calculateStudentScores(students, weekNumber, logs, 100, penaltiesPerGroup);
  
  // Filter out existing penalties for this week that were manually modified or already created
  const otherWeeksPenalties = existingPenalties.filter(p => p.weekNumber !== weekNumber);
  const currentWeekExisting = existingPenalties.filter(p => p.weekNumber === weekNumber);

  const newPenalties: PenaltyAssignment[] = [];
  let dayIndex = 0;

  for (let g = 1; g <= 4; g++) {
    const groupMembers = summaries.filter(s => s.student.group === g);
    // Lọc ra những học sinh thực sự bị phạt (đã được tính toán trong calculateStudentScores)
    const penalizedMembers = groupMembers.filter(s => s.isPenalized);
    
    // Sort ascending (lowest score first)
    penalizedMembers.sort((a, b) => a.totalScore - b.totalScore);
    const lowestStudents = penalizedMembers.slice(0, penaltiesPerGroup);

    lowestStudents.forEach((item, index) => {
      const existing = currentWeekExisting.find(p => p.studentId === item.student.id);
      
      const studentLogs = logs.filter(l => l.studentId === item.student.id && l.weekNumber === weekNumber && l.points < 0);
      const mainInfraction = studentLogs.length > 0 ? studentLogs.map(l => l.criterionName).join(', ') : 'Điểm rèn luyện thấp nhất tổ';

      const dutyDay = existing?.dutyDay || DUTY_DAYS_POOL[dayIndex % DUTY_DAYS_POOL.length];
      const dutyTask = existing?.dutyTask || DUTY_TASKS_POOL[dayIndex % DUTY_TASKS_POOL.length];

      newPenalties.push({
        id: existing?.id || `pen_w${weekNumber}_std_${item.student.id}`,
        weekNumber,
        studentId: item.student.id,
        studentName: item.student.name,
        studentCode: item.student.code,
        group: g,
        totalScore: item.totalScore,
        penaltyRankInGroup: index + 1, // 1 = lowest, 2 = 2nd lowest
        dutyDay,
        dutyTask,
        status: existing?.status || 'pending',
        note: existing?.note || mainInfraction,
        assignedAt: existing?.assignedAt || new Date().toISOString(),
        notifiedZalo: existing?.notifiedZalo || false,
        notifiedSms: existing?.notifiedSms || false,
      });

      dayIndex++;
    });
  }

  return [...otherWeeksPenalties, ...newPenalties];
}
