/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FullAppData, Student, ScoreLogEntry, PenaltyAssignment, DutyDay } from '../types';
import { INITIAL_APP_DATA } from '../data/initialData';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'quanly_thidua_12a10_v1';

export function getStoredData(): FullAppData {
  if (typeof window === 'undefined') return INITIAL_APP_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APP_DATA));
      return INITIAL_APP_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading stored data, returning defaults:', e);
    return INITIAL_APP_DATA;
  }
}

export function saveStoredData(data: FullAppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving app data:', e);
  }
}

export function resetToDemoData(): FullAppData {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_APP_DATA;
}

export function exportDataAsJSON(data: FullAppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_thidua_12A10_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: FullAppData, weekNumber: number): void {
  const { students, scoreLogs, penaltyAssignments, settings } = data;
  const baseScore = settings.baseStartingScore || 100;

  // 1. Student Scores Sheet
  const studentRows = students.map(std => {
    const logs = scoreLogs.filter(l => l.studentId === std.id && l.weekNumber === weekNumber);
    const neNep = logs.filter(l => l.category === 'ne_nep').reduce((s, c) => s + c.points, 0);
    const hocTap = logs.filter(l => l.category === 'hoc_tap').reduce((s, c) => s + c.points, 0);
    const veSinh = logs.filter(l => l.category === 've_sinh').reduce((s, c) => s + c.points, 0);
    const phongTrao = logs.filter(l => l.category === 'phong_trao').reduce((s, c) => s + c.points, 0);
    const total = baseScore + neNep + hocTap + veSinh + phongTrao;

    return {
      'Mã HS': std.code,
      'Họ và Tên': std.name,
      'Tổ': `Tổ ${std.group}`,
      'Chức Vụ': std.roleInClass,
      'Điểm Khởi Điểm': baseScore,
      'Điểm Nề Nếp': neNep,
      'Điểm Học Tập': hocTap,
      'Điểm Vệ Sinh': veSinh,
      'Điểm Phong Trào': phongTrao,
      'Tổng Điểm Thi Đua': total,
      'Xếp Loại': total >= 105 ? 'Xuất sắc' : total >= 100 ? 'Tốt' : total >= 90 ? 'Khá' : 'Cần rèn luyện',
      'Số ĐT Phụ Huynh': std.parentPhone,
    };
  });

  // Sort by score descending
  studentRows.sort((a, b) => b['Tổng Điểm Thi Đua'] - a['Tổng Điểm Thi Đua']);

  // 2. Penalty Duty Sheet
  const weekPenalties = penaltyAssignments.filter(p => p.weekNumber === weekNumber);
  const penaltyRows = weekPenalties.map((p, idx) => ({
    'STT': idx + 1,
    'Mã HS': p.studentCode,
    'Họ và Tên': p.studentName,
    'Tổ': `Tổ ${p.group}`,
    'Điểm Thi Đua': p.totalScore,
    'Thứ Tự Phạt': `Hạng ${p.penaltyRankInGroup} thấp nhất tổ`,
    'Ngày Trực Nhật': p.dutyDay,
    'Nhiệm Vụ Phân Công': p.dutyTask,
    'Trạng Thái': p.status === 'completed' ? 'Đã hoàn thành' : p.status === 'excused' ? 'Được miễn' : 'Chưa thực hiện',
    'Ghi Chú Vi Phạm': p.note || '',
  }));

  // 3. Score Logs Sheet
  const weekLogs = scoreLogs.filter(l => l.weekNumber === weekNumber);
  const logRows = weekLogs.map((l, idx) => ({
    'STT': idx + 1,
    'Thời Gian': new Date(l.timestamp).toLocaleString('vi-VN'),
    'Học Sinh': l.studentName,
    'Tổ': `Tổ ${l.group}`,
    'Danh Mục': l.category === 'ne_nep' ? 'Nề nếp' : l.category === 'hoc_tap' ? 'Học tập' : l.category === 've_sinh' ? 'Vệ sinh' : 'Phong trào',
    'Nội Dung Vi Phạm / Khen Thưởng': l.criterionName,
    'Điểm Cộng / Trừ': l.points > 0 ? `+${l.points}` : l.points,
    'Người Ghi Nhận': l.recordedBy,
    'Ghi Chú': l.note || '',
  }));

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(studentRows);
  const ws2 = XLSX.utils.json_to_sheet(penaltyRows);
  const ws3 = XLSX.utils.json_to_sheet(logRows);

  XLSX.utils.book_append_sheet(wb, ws1, 'BangDiemThiDua');
  XLSX.utils.book_append_sheet(wb, ws2, 'TrucNhatPhat');
  XLSX.utils.book_append_sheet(wb, ws3, 'NhatKyChamDiem');

  XLSX.writeFile(wb, `BaoCao_ThiDua_12A10_Tuan_${weekNumber}.xlsx`);
}
