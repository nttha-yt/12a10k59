/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentScoreSummary, GroupScoreSummary } from '../utils/calculations';
import { ScoreLogEntry, PenaltyAssignment, WeeklyRemark, UserAccount } from '../types';
import { 
  Trophy, 
  Search, 
  Crown, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  History, 
  MessageSquare
} from 'lucide-react';

interface WeeklyRankingsProps {
  currentWeek: number;
  studentSummaries: StudentScoreSummary[];
  groupSummaries: GroupScoreSummary[];
  penaltyAssignments: PenaltyAssignment[];
  scoreLogs: ScoreLogEntry[];
  onOpenSendNotification: (penalty: PenaltyAssignment) => void;
  onOpenStudentHistory: (studentId: string) => void;
  remarks: WeeklyRemark[];
  currentUser: UserAccount;
  onSaveRemark: (remark: WeeklyRemark) => void;
  onDeleteRemark: (remarkId: string) => void;
}

export const WeeklyRankings: React.FC<WeeklyRankingsProps> = ({
  currentWeek,
  studentSummaries,
  groupSummaries,
  penaltyAssignments,
  onOpenSendNotification,
  onOpenStudentHistory,
  remarks,
  currentUser,
  onSaveRemark,
  onDeleteRemark,
}) => {
  const [activeView, setActiveView] = useState<'individual' | 'groups'>('individual');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'total_desc' | 'total_asc' | 'name' | 'infractions'>('total_desc');

  // Filter and sort students
  const filteredStudents = studentSummaries
    .filter(s => {
      const matchGroup = selectedGroupFilter === 'all' || s.student.group === selectedGroupFilter;
      const matchSearch = s.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.student.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroup && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'total_desc') return b.totalScore - a.totalScore;
      if (sortBy === 'total_asc') return a.totalScore - b.totalScore;
      if (sortBy === 'infractions') return b.infractionCount - a.infractionCount;
      if (sortBy === 'name') return a.student.name.localeCompare(b.student.name);
      return 0;
    });

  const handleEditRemark = (targetType: 'group' | 'student', targetId: string, currentText: string) => {
    const newText = window.prompt(`Nhập nhận xét tuần ${currentWeek}:`, currentText);
    if (newText !== null) {
      const existing = remarks.find(r => r.targetType === targetType && r.targetId === targetId && r.weekNumber === currentWeek);
      if (newText.trim() === '') {
        if (existing) onDeleteRemark(existing.id);
      } else {
        onSaveRemark({
          id: existing ? existing.id : `rmk_${Date.now()}_${Math.random().toString(36).substr(2,5)}`,
          weekNumber: currentWeek,
          targetType,
          targetId,
          content: newText.trim(),
          authorName: currentUser.name,
          authorRole: currentUser.role,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const checkRemarkPermission = (targetGroup: number) => {
    if (currentUser.role === 'gvcn' || currentUser.role === 'lop_truong') return true;
    if (currentUser.role === `to_truong_${targetGroup}`) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & View Switcher */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Bảng Xếp Hạng Thi Đua Tuần {currentWeek}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tổng hợp thời gian thực theo thang điểm 100 và các quy chế khen thưởng, kỷ luật
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors">
          <button
            onClick={() => setActiveView('individual')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeView === 'individual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Cá Nhân ({studentSummaries.length} Học Sinh)
          </button>
          <button
            onClick={() => setActiveView('groups')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeView === 'groups'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Thi Đua 4 Tổ
          </button>
        </div>
      </div>

      {/* VIEW 1: INDIVIDUAL STUDENTS */}
      {activeView === 'individual' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Group filter, Search, Sort */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors duration-200">
            
            {/* Group Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedGroupFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedGroupFilter === 'all'
                    ? 'bg-slate-900 dark:bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Toàn Lớp ({studentSummaries.length})
              </button>
              {[1, 2, 3, 4].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGroupFilter(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedGroupFilter === g
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tổ {g}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm học sinh theo tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="total_desc" className="dark:bg-slate-800">Điểm cao nhất</option>
                <option value="total_asc" className="dark:bg-slate-800">Điểm thấp nhất</option>
                <option value="infractions" className="dark:bg-slate-800">Nhiều vi phạm nhất</option>
                <option value="name" className="dark:bg-slate-800">Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* Table of Students */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 text-center w-16">Hạng</th>
                    <th className="py-3.5 px-4">Học Sinh</th>
                    <th className="py-3.5 px-3 text-center">Tổ</th>
                    <th className="py-3.5 px-3 text-center hidden md:table-cell">Nề nếp</th>
                    <th className="py-3.5 px-3 text-center hidden md:table-cell">Học tập</th>
                    <th className="py-3.5 px-3 text-center hidden lg:table-cell">Vệ sinh</th>
                    <th className="py-3.5 px-3 text-center hidden lg:table-cell">Phong trào</th>
                    <th className="py-3.5 px-4 text-center">Tổng Điểm</th>
                    <th className="py-3.5 px-4 text-center">Tình Trạng</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredStudents.map((item) => {
                    const penalty = penaltyAssignments.find(
                      p => p.studentId === item.student.id && p.weekNumber === currentWeek
                    );
                    const isTop1 = item.rankInClass === 1;
                    const isTop2 = item.rankInClass === 2;
                    const isTop3 = item.rankInClass === 3;

                    return (
                      <tr
                        key={item.student.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          item.isPenalized ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center font-bold">
                          {isTop1 ? (
                            <span className="inline-flex w-7 h-7 rounded-xl bg-amber-400 text-slate-900 items-center justify-center shadow-xs">
                              <Crown className="w-4 h-4" />
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex w-7 h-7 rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 items-center justify-center font-black">
                              2
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex w-7 h-7 rounded-xl bg-amber-700/70 text-white items-center justify-center font-black">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400 font-semibold">#{item.rankInClass}</span>
                          )}
                        </td>

                        {/* Student Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.student.avatar}
                              alt={item.student.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                {item.student.name}
                                {item.student.roleInClass !== 'Học sinh' && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-100 dark:border-blue-900">
                                    {item.student.roleInClass}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{item.student.phone || item.student.parentPhone || item.student.code} • Phụ huynh: {item.student.parentPhone || item.student.parentName}</div>
                              {/* Hiển thị nhận xét cá nhân */}
                              {(() => {
                                const rmk = remarks.find(r => r.targetType === 'student' && r.targetId === item.student.id && r.weekNumber === currentWeek);
                                if (rmk) {
                                  return (
                                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                      <span className="font-semibold text-blue-700 dark:text-blue-400">{rmk.authorName}:</span> {rmk.content}
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </td>

                        {/* Group */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-transparent dark:border-slate-700">
                            Tổ {item.student.group}
                          </span>
                        </td>

                        {/* Nề nếp */}
                        <td className="py-3.5 px-3 text-center hidden md:table-cell">
                          <span className={`font-semibold ${
                            item.neNepPoints < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {item.neNepPoints > 0 ? `+${item.neNepPoints}` : item.neNepPoints}
                          </span>
                        </td>

                        {/* Học tập */}
                        <td className="py-3.5 px-3 text-center hidden md:table-cell">
                          <span className={`font-semibold ${
                            item.hocTapPoints > 0 ? 'text-emerald-600 dark:text-emerald-400' : item.hocTapPoints < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {item.hocTapPoints > 0 ? `+${item.hocTapPoints}` : item.hocTapPoints}
                          </span>
                        </td>

                        {/* Vệ sinh */}
                        <td className="py-3.5 px-3 text-center hidden lg:table-cell">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">
                            {item.veSinhPoints > 0 ? `+${item.veSinhPoints}` : item.veSinhPoints}
                          </span>
                        </td>

                        {/* Phong trào */}
                        <td className="py-3.5 px-3 text-center hidden lg:table-cell">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {item.phongTraoPoints > 0 ? `+${item.phongTraoPoints}` : item.phongTraoPoints}
                          </span>
                        </td>

                        {/* Total Score */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-xl font-black text-sm ${
                            item.totalScore >= 110 ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700' :
                            item.totalScore >= 100 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                            item.totalScore >= 95 ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}>
                            {item.totalScore} đ
                          </span>
                        </td>

                        {/* Status / Penalty Tag */}
                        <td className="py-3.5 px-4 text-center">
                          {item.isPenalized ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              Trực nhật phạt (Tổ {item.student.group})
                            </span>
                          ) : item.totalScore >= 105 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Khen thưởng
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đạt yêu cầu</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenStudentHistory(item.student.id)}
                              title="Xem chi tiết nhật ký điểm"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                              <History className="w-4 h-4" />
                            </button>

                            {penalty && (
                              <button
                                onClick={() => onOpenSendNotification(penalty)}
                                title="Gửi thông báo Zalo cho phụ huynh"
                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            
                            {checkRemarkPermission(item.student.group) && (
                              <button
                                onClick={() => {
                                  const rmk = remarks.find(r => r.targetType === 'student' && r.targetId === item.student.id && r.weekNumber === currentWeek);
                                  handleEditRemark('student', item.student.id, rmk ? rmk.content : '');
                                }}
                                title="Nhận xét học sinh này"
                                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GROUP COMPARISON */}
      {activeView === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupSummaries.map((grp) => {
            const isChampion = grp.rank === 1;
            const members = studentSummaries.filter(s => s.student.group === grp.group);
            const groupRemark = remarks.find(r => r.targetType === 'group' && r.targetId === grp.group.toString() && r.weekNumber === currentWeek);
            const canEditGroup = checkRemarkPermission(grp.group);

            return (
              <div
                key={grp.group}
                className={`bg-white dark:bg-slate-900/90 rounded-3xl p-6 border shadow-sm transition-all ${
                  isChampion 
                    ? 'border-amber-300 dark:border-amber-600/50 ring-2 ring-amber-400/20 dark:ring-amber-500/20' 
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                      isChampion ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}>
                      {isChampion ? <Crown className="w-6 h-6" /> : `#${grp.rank}`}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">Tổ {grp.group}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{grp.studentCount} thành viên 12A10</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{grp.avgScore.toFixed(1)} <span className="text-xs font-normal text-slate-400">đ/hs</span></div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Tổng điểm: {grp.totalScore.toFixed(1)}đ</span>
                  </div>
                </div>

                {/* Group Member List Preview */}
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Thành viên trong tổ:
                  </span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {members.map((m) => (
                      <div
                        key={m.student.id}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                          m.isPenalized ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60' : 'bg-slate-50 dark:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{m.student.name}</span>
                          {m.student.roleInClass !== 'Học sinh' && (
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">({m.student.roleInClass})</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {m.isPenalized && (
                            <span className="text-[10px] bg-amber-200 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded border border-transparent dark:border-amber-700">
                              Phạt trực nhật
                            </span>
                          )}
                          <span className="font-bold text-slate-900 dark:text-slate-100">{m.totalScore}đ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group Remark */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Nhận xét Tổ {grp.group}:
                    </span>
                    {canEditGroup && (
                      <button
                        onClick={() => handleEditRemark('group', grp.group.toString(), groupRemark ? groupRemark.content : '')}
                        className="text-[11px] flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {groupRemark ? 'Sửa' : 'Thêm nhận xét'}
                      </button>
                    )}
                  </div>
                  {groupRemark ? (
                    <div className="bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-3 border border-blue-100/50 dark:border-blue-900/40 text-sm text-slate-700 dark:text-slate-300">
                      <p>"{groupRemark.content}"</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-semibold flex items-center gap-1 opacity-80">
                        ✍️ Viết bởi: {groupRemark.authorName}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 italic text-center">
                      Chưa có nhận xét nào trong tuần này.
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeeklyRankings;
