/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PenaltyAssignment, DutyDay, DutyStatus, UserRole, AppSettings, SeatingDesk } from '../types';
import { DUTY_DAYS_POOL } from '../utils/calculations';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Edit3,
  Check, 
  Users,
  ShieldAlert,
  Info,
  CalendarCheck
} from 'lucide-react';

interface PenaltyDutySchedulerProps {
  currentWeek: number;
  penalties: PenaltyAssignment[];
  currentRole: UserRole;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdatePenalty: (penaltyId: string, updates: Partial<PenaltyAssignment>) => void;
  onRegeneratePenalties: () => void;
  onOpenSendNotification: (penalty: PenaltyAssignment) => void;
  onOpenAIAssistantForStudent: (studentId: string) => void;
}

export const PenaltyDutyScheduler: React.FC<PenaltyDutySchedulerProps> = ({
  currentWeek,
  penalties = [],
  currentRole,
  settings = {} as AppSettings,
  onUpdateSettings,
  onUpdatePenalty,
  onRegeneratePenalties,
  onOpenSendNotification,
  onOpenAIAssistantForStudent,
}) => {
  const currentWeekPenalties = penalties?.filter(p => p.weekNumber === currentWeek) || [];
  
  const defaultMainDutyGroupCurrent = ((currentWeek - 1) % 4) + 1;
  const mainDutyGroupCurrent = settings?.mainDutyGroupOverrides?.[currentWeek] || defaultMainDutyGroupCurrent;
  
  const defaultMainDutyGroupNext = (currentWeek % 4) + 1;
  const mainDutyGroupNext = settings?.mainDutyGroupOverrides?.[currentWeek + 1] || defaultMainDutyGroupNext;

  const [editingPenaltyId, setEditingPenaltyId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState('');
  const [editDay, setEditDay] = useState<DutyDay>('Thứ 2');

  const [isEditingSeating, setIsEditingSeating] = useState(false);
  const [seatingChartState, setSeatingChartState] = useState<Record<string, SeatingDesk[]>>(
    settings?.seatingChart || {}
  );

  React.useEffect(() => {
    if (settings?.seatingChart) {
      setSeatingChartState(settings.seatingChart);
    }
  }, [settings?.seatingChart]);

  const handleSaveSeating = () => {
    onUpdateSettings({ ...settings, seatingChart: seatingChartState });
    setIsEditingSeating(false);
  };

  const handleStartEdit = (pen: PenaltyAssignment) => {
    setEditingPenaltyId(pen.id);
    setEditTask(pen.dutyTask);
    setEditDay(pen.dutyDay);
  };

  const handleSaveEdit = (penId: string) => {
    onUpdatePenalty(penId, {
      dutyTask: editTask,
      dutyDay: editDay,
    });
    setEditingPenaltyId(null);
  };

  const toggleStatus = (pen: PenaltyAssignment) => {
    const nextStatus: DutyStatus = 
      pen.status === 'pending' ? 'completed' : 
      pen.status === 'completed' ? 'excused' : 'pending';
    onUpdatePenalty(pen.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Sophisticated Slate / Indigo Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-semibold text-blue-300">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              Kế Hoạch Phân Công & Rèn Luyện 12A10
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Phân Công Trực Nhật & Vệ Sinh Lớp <span className="text-blue-400">(Tuần {currentWeek})</span>
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Hệ thống tự động phân bổ 2 bạn học sinh có điểm thi đua thấp nhất mỗi tổ vào lịch trực nhật vệ sinh tăng cường nhằm nâng cao tính tự giác và tinh thần trách nhiệm tập thể.
            </p>
            
            {/* 2 Harmonious Glassmorphism Info Cards */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex-1 flex flex-col justify-center backdrop-blur-md">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
                  Trực Nhật Chính Tuần {currentWeek}
                </p>
                <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <span className="text-blue-400">Tổ {mainDutyGroupCurrent}</span>
                  {(currentRole === 'gvcn' || currentRole === 'lop_truong') && (
                    <select
                      value={mainDutyGroupCurrent}
                      onChange={(e) => {
                        const newOverrides = { ...(settings?.mainDutyGroupOverrides || {}) };
                        newOverrides[currentWeek] = Number(e.target.value);
                        onUpdateSettings({ ...settings, mainDutyGroupOverrides: newOverrides });
                      }}
                      className="ml-2 bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg p-1 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
                      title="Sửa tổ trực nhật chính"
                    >
                      <option value={1}>Tổ 1</option>
                      <option value={2}>Tổ 2</option>
                      <option value={3}>Tổ 3</option>
                      <option value={4}>Tổ 4</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex-1 flex flex-col justify-center backdrop-blur-md">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  Kế Hoạch Thực Hiện
                </p>
                <div className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                  Các bạn bị phạt tuần {currentWeek} sẽ trực nhật vào <span className="text-amber-300 font-bold">Tuần {currentWeek + 1}</span> (cùng với <span className="text-blue-300 font-bold">Tổ {mainDutyGroupNext}</span>).
                </div>
              </div>
            </div>
          </div>

          {currentRole !== 'hoc_sinh' && (
            <button
              id="btn-regen-penalties"
              onClick={onRegeneratePenalties}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm flex items-center gap-2 cursor-pointer shrink-0 border border-blue-500"
            >
              <RefreshCw className="w-4 h-4" />
              Tự Động Cập Nhật
            </button>
          )}
        </div>
      </div>

      {/* Grid of 4 Groups' Penalties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {[1, 2, 3, 4].map((groupNum) => {
          const groupPenalties = currentWeekPenalties.filter(p => p.group === groupNum);

          return (
            <div
              key={groupNum}
              className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black text-sm flex items-center justify-center border border-blue-100 dark:border-blue-900">
                    T{groupNum}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                      Tổ {groupNum} - Danh Sách Trực Nhật
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">2 bạn cần rèn luyện thêm</p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {groupPenalties.length} học sinh
                </span>
              </div>

              {groupPenalties.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs italic">
                  Không có học sinh nào bị phạt trực nhật trong tuần này.
                </div>
              ) : (
                <div className="space-y-3">
                  {groupPenalties.map((pen) => {
                    const isEditing = editingPenaltyId === pen.id;

                    return (
                      <div
                        key={pen.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          pen.status === 'completed'
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50'
                            : pen.status === 'excused'
                            ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/60 opacity-75'
                            : 'bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/60'
                        }`}
                      >
                        {isEditing ? (
                          /* Edit mode */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{pen.studentName} ({pen.studentCode})</span>
                              <select
                                value={editDay}
                                onChange={(e) => setEditDay(e.target.value as DutyDay)}
                                className="text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg p-1"
                              >
                                {DUTY_DAYS_POOL.map(d => (
                                  <option key={d} value={d} className="dark:bg-slate-800">{d}</option>
                                ))}
                              </select>
                            </div>

                            <input
                              type="text"
                              value={editTask}
                              onChange={(e) => setEditTask(e.target.value)}
                              className="w-full text-xs p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingPenaltyId(null)}
                                className="px-3 py-1 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() => handleSaveEdit(pen.id)}
                                className="px-3 py-1 text-xs bg-blue-600 text-white font-bold rounded-lg"
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Display mode */
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                                    {pen.studentName}
                                  </span>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                                    {pen.totalScore} đ
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  Mã: {pen.studentCode} • Xếp hạng {pen.penaltyRankInGroup} thấp nhất Tổ {pen.group}
                                </span>
                              </div>

                              {/* Status badge & toggle button */}
                              <button
                                onClick={() => toggleStatus(pen)}
                                title="Bấm để đổi trạng thái hoàn thành"
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                  pen.status === 'completed'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : pen.status === 'excused'
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                                }`}
                              >
                                {pen.status === 'completed' ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã làm
                                  </>
                                ) : pen.status === 'excused' ? (
                                  <>Miễn</>
                                ) : (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Chưa làm
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Duty Task & Day - Clean container */}
                            <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400">
                                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                Lịch trực: <span className="text-slate-900 dark:text-slate-100">{pen.dutyDay}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {pen.dutyTask}
                              </p>
                              {pen.note && (
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                                  Ghi nhận: {pen.note}
                                </p>
                              )}
                            </div>

                            {/* Actions bar */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                {pen.notifiedZalo ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Đã gửi Zalo
                                  </span>
                                ) : (
                                  <span className="text-slate-400 dark:text-slate-500">Chưa gửi tin</span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onOpenAIAssistantForStudent(pen.studentId)}
                                  title="Gợi ý kế hoạch rèn luyện 7 ngày từ AI"
                                  className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors text-xs flex items-center gap-1 cursor-pointer font-semibold"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  AI Khắc Phục
                                </button>

                                <button
                                  onClick={() => handleStartEdit(pen)}
                                  title="Chỉnh sửa nhiệm vụ hoặc ngày"
                                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-transparent dark:border-slate-700"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => onOpenSendNotification(pen)}
                                  title="Soạn & Gửi thông báo Zalo/SMS cho phụ huynh"
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  Gửi Zalo / SMS
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sơ đồ lớp học (Seating Chart) */}
      <div className="bg-white dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm mt-8 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Sơ Đồ Chỗ Ngồi Lớp 12A10
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Mỗi bàn gồm 2 vị trí (Trái & Phải) nhìn từ bục giảng xuống • Hỗ trợ theo dõi nề nếp và phân công trực nhật
            </p>
          </div>
          {currentRole === 'gvcn' && (
            isEditingSeating ? (
              <div className="flex gap-2">
                <button onClick={() => { setIsEditingSeating(false); setSeatingChartState(settings?.seatingChart || {}); }} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors">Hủy</button>
                <button onClick={handleSaveSeating} className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer transition-colors shadow-md shadow-blue-500/20">Lưu sơ đồ</button>
              </div>
            ) : (
              <button onClick={() => setIsEditingSeating(true)} className="px-4 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                <Edit3 className="w-4 h-4" />
                Cập nhật sơ đồ
              </button>
            )
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(groupNum => {
            const isDutyGroup = groupNum === mainDutyGroupCurrent;
            const groupDesks = seatingChartState[String(groupNum)] || [];
            const groupLeaders: Record<number, string> = {
              1: 'Hoàng Gia Huy',
              2: 'Dương Thị Thúy',
              3: 'Nguyễn Triệu Huy',
              4: 'Phạm Thu Hương',
            };
            const leaderName = groupLeaders[groupNum];

            return (
              <div 
                key={groupNum} 
                className={`rounded-3xl p-4 sm:p-5 transition-all flex flex-col justify-between ${
                  isDutyGroup 
                    ? 'bg-gradient-to-b from-blue-50/90 via-indigo-50/30 to-white dark:from-blue-950/70 dark:via-slate-900 dark:to-slate-900 border-2 border-blue-500 dark:border-blue-400 shadow-xl shadow-blue-500/15 ring-2 ring-blue-400/30' 
                    : 'bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Group Header Card */}
                  <div className={`pb-3.5 mb-3.5 border-b space-y-2.5 ${isDutyGroup ? 'border-blue-200 dark:border-blue-900/80' : 'border-slate-100 dark:border-slate-800'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center ${
                          isDutyGroup 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}>
                          T{groupNum}
                        </span>
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                          DÃY TỔ {groupNum}
                        </h4>
                      </div>

                      {isDutyGroup && (
                        <span className="text-[11px] bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm flex items-center gap-1 shrink-0 animate-pulse">
                          ✨ Trực Tuần {currentWeek}
                        </span>
                      )}
                    </div>

                    {/* Tổ trưởng badge - High contrast & prominent */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                      isDutyGroup
                        ? 'bg-blue-600/10 dark:bg-blue-900/50 border-blue-300/80 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}>
                      <span className="text-amber-500">👑</span>
                      <span>Tổ trưởng:</span>
                      <span className="font-extrabold text-blue-700 dark:text-blue-300 truncate">{leaderName}</span>
                    </div>
                  </div>

                  {/* 6 Desks Container */}
                  <div className="space-y-2">
                    {isEditingSeating ? (
                      // Edit mode: 3 horizontal columns (Compact Desk + Left Input + Right Input)
                      [1, 2, 3, 4, 5, 6].map(deskIndex => {
                        const existingDesk = groupDesks.find(d => d.deskNumber === deskIndex) || { deskNumber: deskIndex, leftStudent: '', rightStudent: '' };
                        return (
                          <div key={deskIndex} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-2xs border border-slate-200 dark:border-slate-700">
                            <span className="w-13 shrink-0 text-center py-1.5 rounded-lg text-[11px] font-black bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              Bàn {deskIndex}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5 flex-1 min-w-0">
                              <input 
                                type="text" 
                                placeholder="HS Trái..."
                                value={existingDesk.leftStudent}
                                onChange={(e) => {
                                  const newDesks = [...groupDesks];
                                  const idx = newDesks.findIndex(d => d.deskNumber === deskIndex);
                                  if (idx >= 0) newDesks[idx].leftStudent = e.target.value;
                                  else newDesks.push({ deskNumber: deskIndex, leftStudent: e.target.value, rightStudent: existingDesk.rightStudent });
                                  setSeatingChartState({ ...seatingChartState, [String(groupNum)]: newDesks });
                                }}
                                className="w-full text-xs font-semibold p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <input 
                                type="text" 
                                placeholder="HS Phải..."
                                value={existingDesk.rightStudent}
                                onChange={(e) => {
                                  const newDesks = [...groupDesks];
                                  const idx = newDesks.findIndex(d => d.deskNumber === deskIndex);
                                  if (idx >= 0) newDesks[idx].rightStudent = e.target.value;
                                  else newDesks.push({ deskNumber: deskIndex, leftStudent: existingDesk.leftStudent, rightStudent: e.target.value });
                                  setSeatingChartState({ ...seatingChartState, [String(groupNum)]: newDesks });
                                }}
                                className="w-full text-xs font-semibold p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Display mode: always show 6 desks consistently
                      [1, 2, 3, 4, 5, 6].map(deskIndex => {
                        const desk = groupDesks.find(d => d.deskNumber === deskIndex);
                        const hasLeft = Boolean(desk?.leftStudent);
                        const hasRight = Boolean(desk?.rightStudent);
                        const hasAny = hasLeft || hasRight;

                        return (
                          <div 
                            key={deskIndex} 
                            className={`flex items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl border shadow-2xs transition-all ${
                              isDutyGroup 
                                ? 'bg-white dark:bg-slate-800/90 border-blue-200/90 dark:border-blue-900/80 hover:border-blue-400 dark:hover:border-blue-600' 
                                : 'bg-slate-50/90 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {/* Compact Desk Badge */}
                            <span className={`w-13 shrink-0 text-center py-1.5 rounded-xl text-[11px] font-black ${
                              isDutyGroup 
                                ? 'bg-blue-600 text-white shadow-xs' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            }`}>
                              Bàn {deskIndex}
                            </span>

                            {/* 2 Equal Horizontal Slots for Student Names */}
                            <div className="grid grid-cols-2 gap-1.5 flex-1 min-w-0">
                              <div 
                                className={`px-2 py-1.5 rounded-xl text-xs font-bold text-center truncate ${
                                  hasLeft 
                                    ? isDutyGroup 
                                      ? 'bg-blue-50/70 dark:bg-slate-900/90 border border-blue-100 dark:border-blue-900/60 text-slate-900 dark:text-slate-100'
                                      : 'bg-white dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                                    : 'border border-dashed border-slate-200 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 font-normal italic'
                                }`}
                                title={desk?.leftStudent || 'Chưa xếp'}
                              >
                                {desk?.leftStudent || '—'}
                              </div>

                              <div 
                                className={`px-2 py-1.5 rounded-xl text-xs font-bold text-center truncate ${
                                  hasRight 
                                    ? isDutyGroup 
                                      ? 'bg-blue-50/70 dark:bg-slate-900/90 border border-blue-100 dark:border-blue-900/60 text-slate-900 dark:text-slate-100'
                                      : 'bg-white dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                                    : 'border border-dashed border-slate-200 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 font-normal italic'
                                }`}
                                title={desk?.rightStudent || 'Chưa xếp'}
                              >
                                {desk?.rightStudent || '—'}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-6 font-semibold bg-slate-50 dark:bg-slate-800/50 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          🏫 Bục Giảng & Bảng Đen nằm ở phía trên (phía trước Bàn 1 của các dãy)
        </p>
      </div>
    </div>
  );
};

export default PenaltyDutyScheduler;
