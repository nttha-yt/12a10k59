/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudentScoreSummary, GroupScoreSummary } from '../utils/calculations';
import { GroupScoreChart } from './charts/GroupScoreChart';
import { CategoryDistributionChart } from './charts/CategoryDistributionChart';
import { PenaltyAssignment, ScoreLogEntry, UserRole } from '../types';
import { 
  Trophy, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Send, 
  Sparkles, 
  ChevronRight, 
  UserCheck, 
  Crown,
  Medal,
  CalendarDays
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardOverviewProps {
  currentWeek: number;
  studentSummaries: StudentScoreSummary[];
  groupSummaries: GroupScoreSummary[];
  penaltyAssignments: PenaltyAssignment[];
  recentLogs: ScoreLogEntry[];
  currentRole: UserRole;
  onNavigateTab: (tab: string) => void;
  onOpenScoringModal: () => void;
  onOpenSendNotification: (penalty: PenaltyAssignment) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentWeek,
  studentSummaries,
  groupSummaries,
  penaltyAssignments,
  recentLogs,
  currentRole,
  onNavigateTab,
  onOpenScoringModal,
  onOpenSendNotification,
}) => {
  // Top group
  const topGroup = [...groupSummaries].sort((a, b) => b.avgScore - a.avgScore)[0];
  
  // Top 3 students
  const topStudents = [...studentSummaries].sort((a, b) => b.totalScore - a.totalScore).slice(0, 3);
  
  // Class Average
  const totalClassPoints = studentSummaries.reduce((sum, s) => sum + s.totalScore, 0);
  const avgClassPoints = studentSummaries.length > 0 ? (totalClassPoints / studentSummaries.length).toFixed(1) : '100';

  // Total Infractions
  const totalInfractions = studentSummaries.reduce((sum, s) => sum + s.infractionCount, 0);

  // Current week penalties
  const currentPenalties = penaltyAssignments.filter(p => p.weekNumber === currentWeek);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Highlights */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white p-6 sm:p-8 shadow-lg shadow-blue-500/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Tổng kết nề nếp & thi đua Tuần {currentWeek}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Lớp 12A10 - THPT Yên Thế
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Quyết tâm rèn luyện nề nếp kỷ cương, thi đua học tốt - vững bước kỳ thi Tốt nghiệp THPT 2027!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {currentRole !== 'hoc_sinh' && (
              <button
                id="btn-dash-score-fast"
                onClick={onOpenScoringModal}
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-sm flex items-center gap-2 cursor-pointer"
              >
                <PlusCircleIcon className="w-4 h-4" />
                Chấm Điểm Nhanh
              </button>
            )}
            <button
              id="btn-dash-ai-report"
              onClick={() => onNavigateTab('ai')}
              className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-300/40 text-white font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md transition-all text-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              AI Cố Vấn Tuần
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Điểm trung bình lớp */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm TB Lớp</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{avgClassPoints}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">/100 đ</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Tổng số {studentSummaries.length} học sinh 12A10</p>
        </div>

        {/* Card 2: Tổ dẫn đầu */}
        <div 
          onClick={triggerCelebration}
          className="bg-white rounded-2xl p-5 border border-amber-200/80 bg-gradient-to-b from-amber-50/40 to-white shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Tổ Dẫn Đầu Tuần</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">Tổ {topGroup?.group || 1}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
              {topGroup?.avgScore.toFixed(1)} đ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">Xuất sắc: {topGroup?.topStudentName}</p>
        </div>

        {/* Card 3: Số lỗi vi phạm */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vi Phạm Nề Nếp</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalInfractions}</span>
            <span className="text-xs font-medium text-slate-500">lượt ghi nhận</span>
          </div>
          <p className="text-xs text-rose-600 mt-2">Chủ yếu: Đi muộn, điện thoại</p>
        </div>

        {/* Card 4: Trực nhật phạt */}
        <div 
          onClick={() => onNavigateTab('penalties')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trực Nhật Phạt</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{currentPenalties.length}</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">2 bạn/tổ</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
            Xem lịch & gửi Zalo <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[320px]">
          <GroupScoreChart groupSummaries={groupSummaries} />
        </div>
        <div className="h-[320px]">
          <CategoryDistributionChart scoreLogs={recentLogs} currentWeek={currentWeek} />
        </div>
      </div>

      {/* Main Content 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Group Standing & Penalty Roster */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bảng Xếp Hạng 4 Tổ */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Xếp Hạng Thi Đua 4 Tổ - Tuần {currentWeek}
              </h3>
              <button
                onClick={() => onNavigateTab('rankings')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                Chi tiết bảng điểm <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {groupSummaries.map((grp) => {
                const isChampion = grp.rank === 1;
                return (
                  <div
                    key={grp.group}
                    className={`rounded-2xl p-4 border transition-all ${
                      isChampion
                        ? 'bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-white border-amber-300 ring-2 ring-amber-400/20'
                        : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                          grp.rank === 1 ? 'bg-amber-500 text-white shadow-sm' :
                          grp.rank === 2 ? 'bg-slate-300 text-slate-700' :
                          grp.rank === 3 ? 'bg-amber-700/60 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {grp.rank === 1 ? <Crown className="w-4 h-4" /> : `#${grp.rank}`}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Tổ {grp.group}</h4>
                          <span className="text-[11px] text-slate-500">{grp.studentCount} thành viên</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-base font-extrabold text-slate-900">{grp.avgScore.toFixed(1)} <span className="text-xs font-normal text-slate-500">đ/hs</span></div>
                        <span className="text-[11px] font-medium text-emerald-600">Tổng: {grp.totalScore.toFixed(1)}đ</span>
                      </div>
                    </div>

                    {/* Progress Bar for Score */}
                    <div className="mt-3 w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isChampion ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (grp.avgScore / 110) * 100)}%` }}
                      />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                      <span className="truncate max-w-[140px]">⭐ {grp.topStudentName}</span>
                      <span className="text-amber-700 font-medium">⚠️ {grp.penalizedStudents.length} trực nhật phạt</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danh Sách 8 Học Sinh Nhận Lịch Trực Nhật Phạt Tuần Này */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Danh Sách Trực Nhật Phạt (2 bạn thấp điểm nhất mỗi tổ)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động phân công theo quy chế thi đua 12A10 nhằm nâng cao tính tự giác
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('penalties')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
              >
                Quản lý lịch trực nhật
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPenalties.map((pen) => (
                <div
                  key={pen.id}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors flex items-start justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{pen.studentName}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Tổ {pen.group}
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded">
                        {pen.totalScore} đ
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                      <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                      {pen.dutyDay}: <span className="text-slate-700 font-normal">{pen.dutyTask}</span>
                    </p>

                    <p className="text-[11px] text-rose-600/90 italic truncate max-w-xs">
                      Lý do: {pen.note}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenSendNotification(pen)}
                    title="Gửi thông báo nhắc nhở Zalo/SMS cho phụ huynh"
                    className="p-2 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-300 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Top 3 Podium & Live Feed */}
        <div className="space-y-6">
          
          {/* Top 3 Vinh Danh Tuần */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Vinh Danh Top 3 Tuần {currentWeek}
              </h3>
              <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                Gương mẫu
              </span>
            </div>

            <div className="space-y-3">
              {topStudents.map((std, idx) => {
                const medalColors = [
                  'from-amber-400 to-yellow-500 text-slate-950',
                  'from-slate-200 to-slate-400 text-slate-950',
                  'from-amber-700 to-amber-900 text-white'
                ];
                return (
                  <div
                    key={std.student.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${medalColors[idx]} font-extrabold flex items-center justify-center text-sm shadow-sm`}>
                        {idx + 1}
                      </div>
                      <img
                        src={std.student.avatar}
                        alt={std.student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-600"
                      />
                      <div>
                        <div className="font-bold text-sm text-white">{std.student.name}</div>
                        <div className="text-[11px] text-slate-400">Tổ {std.student.group} • {std.student.roleInClass}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-amber-400">{std.totalScore}</span>
                      <span className="text-xs text-slate-400 ml-0.5">đ</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 text-center">
              <p className="text-xs text-slate-300 italic">
                "Kỷ luật là cầu nối giữa mục tiêu và thành tựu!"
              </p>
            </div>
          </div>

          {/* Nhật Ký Chấm Điểm Gần Đây */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                Nhật Ký Chấm Điểm Mới Nhất
              </h3>
              <span className="text-xs text-slate-400">Thời gian thực</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {recentLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800">
                      {log.studentName} <span className="font-normal text-slate-500">(Tổ {log.group})</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{log.criterionName}</p>
                    {log.note && <p className="text-slate-400 text-[10px] italic">{log.note}</p>}
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      log.points > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {log.points > 0 ? `+${log.points}` : log.points}đ
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PlusCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
