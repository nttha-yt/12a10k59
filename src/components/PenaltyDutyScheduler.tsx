/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PenaltyAssignment, DutyDay, DutyStatus, UserRole, AppSettings, SeatingDesk } from '../types';
import { DUTY_DAYS_POOL, DUTY_TASKS_POOL } from '../utils/calculations';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  RefreshCw, 
  UserX, 
  Edit3,
  Check,
  Smartphone,
  Users
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
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-amber-500/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Cơ Chế Phạt Nề Nếp Tự Giác 12A10
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Phân Công Trực Nhật Phạt (Tuần {currentWeek})
            </h2>
            <p className="text-amber-100 text-sm mt-1 max-w-2xl">
              Hệ thống tự động lọc ra 2 học sinh có điểm thi đua thấp nhất mỗi tổ (tổng 8 học sinh) để phân bổ lịch trực nhật vệ sinh nhằm răn đe tích cực và xây dựng ý thức trách nhiệm.
            </p>
            
            <div className="mt-5 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="bg-black/10 border border-white/20 rounded-xl p-3 flex-1 flex flex-col justify-center">
                <p className="text-xs text-amber-200 font-semibold mb-1 uppercase tracking-wider">Trực nhật chính Tuần {currentWeek}</p>
                <div className="text-xl font-black text-white flex items-center gap-2 drop-shadow-md">
                  <Calendar className="w-5 h-5" /> Tổ {mainDutyGroupCurrent}
                  {(currentRole === 'gvcn' || currentRole === 'lop_truong') && (
                    <select
                      value={mainDutyGroupCurrent}
                      onChange={(e) => {
                        const newOverrides = { ...(settings?.mainDutyGroupOverrides || {}) };
                        newOverrides[currentWeek] = Number(e.target.value);
                        onUpdateSettings({ ...settings, mainDutyGroupOverrides: newOverrides });
                      }}
                      className="ml-2 bg-white/20 border border-white/30 text-white text-sm rounded-lg p-1 outline-none cursor-pointer hover:bg-white/30 transition-colors"
                      title="Sửa tổ trực nhật chính"
                    >
                      <option className="text-slate-900" value={1}>Tổ 1</option>
                      <option className="text-slate-900" value={2}>Tổ 2</option>
                      <option className="text-slate-900" value={3}>Tổ 3</option>
                      <option className="text-slate-900" value={4}>Tổ 4</option>
                    </select>
                  )}
                </div>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-3 flex-1 flex flex-col justify-center">
                <p className="text-xs text-amber-200 font-semibold mb-1 uppercase tracking-wider">Học sinh bị phạt Tuần {currentWeek}</p>
                <div className="text-sm font-bold text-white leading-tight">
                  Sẽ trực nhật vào Tuần {currentWeek + 1} (cùng trực với <span className="text-amber-300 font-black underline decoration-amber-400/50 underline-offset-2">Tổ {mainDutyGroupNext}</span>)
                </div>
              </div>
            </div>
          </div>

          {currentRole !== 'hoc_sinh' && (
            <button
              id="btn-regen-penalties"
              onClick={onRegeneratePenalties}
              className="bg-white text-amber-700 hover:bg-amber-50 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm flex items-center gap-2 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              Tự Động Cập Nhật Lại
            </button>
          )}
        </div>
      </div>

      {/* Grid of 4 Groups' Penalties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((groupNum) => {
          const groupPenalties = currentWeekPenalties.filter(p => p.group === groupNum);

          return (
            <div
              key={groupNum}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center">
                    T{groupNum}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Tổ {groupNum} - Trực Nhật Phạt</h3>
                    <p className="text-xs text-slate-500">2 học sinh thấp điểm nhất tổ</p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {groupPenalties.length} học sinh
                </span>
              </div>

              {groupPenalties.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs italic">
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
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : pen.status === 'excused'
                            ? 'bg-slate-50 border-slate-200 opacity-75'
                            : 'bg-amber-50/30 border-amber-200 hover:border-amber-300'
                        }`}
                      >
                        {isEditing ? (
                          /* Edit mode */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-800">{pen.studentName} ({pen.studentCode})</span>
                              <select
                                value={editDay}
                                onChange={(e) => setEditDay(e.target.value as DutyDay)}
                                className="text-xs font-semibold bg-white border border-slate-300 rounded-lg p-1"
                              >
                                {DUTY_DAYS_POOL.map(d => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>

                            <input
                              type="text"
                              value={editTask}
                              onChange={(e) => setEditTask(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingPenaltyId(null)}
                                className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-lg"
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
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900 text-sm">
                                    {pen.studentName}
                                  </span>
                                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                    {pen.totalScore} đ
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                  Mã HS: {pen.studentCode} • Xếp hạng {pen.penaltyRankInGroup} thấp nhất Tổ {pen.group}
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
                                    ? 'bg-slate-200 text-slate-700'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
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
                                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Chưa làm
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Duty Task & Day */}
                            <div className="p-2.5 bg-white/90 rounded-xl border border-slate-200/80 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                Lịch trực: <span className="text-slate-900">{pen.dutyDay}</span>
                              </div>
                              <p className="text-slate-700">
                                Nhiệm vụ: {pen.dutyTask}
                              </p>
                              {pen.note && (
                                <p className="text-[11px] text-rose-600 italic">
                                  Vi phạm ghi nhận: {pen.note}
                                </p>
                              )}
                            </div>

                            {/* Actions bar */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                {pen.notifiedZalo ? (
                                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Đã gửi Zalo
                                  </span>
                                ) : (
                                  <span className="text-amber-600">Chưa gửi thông báo</span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onOpenAIAssistantForStudent(pen.studentId)}
                                  title="Gợi ý kế hoạch rèn luyện 7 ngày từ AI"
                                  className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  AI Khắc Phục
                                </button>

                                <button
                                  onClick={() => handleStartEdit(pen)}
                                  title="Chỉnh sửa nhiệm vụ hoặc ngày"
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => onOpenSendNotification(pen)}
                                  title="Soạn & Gửi thông báo Zalo/SMS cho phụ huynh"
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
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
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Sơ Đồ Chỗ Ngồi Lớp 12A10 (Hỗ trợ phân công trực nhật)
          </h3>
          {currentRole === 'gvcn' && (
            isEditingSeating ? (
              <div className="flex gap-2">
                <button onClick={() => { setIsEditingSeating(false); setSeatingChartState(settings?.seatingChart || {}); }} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">Hủy</button>
                <button onClick={handleSaveSeating} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors">Lưu sơ đồ</button>
              </div>
            ) : (
              <button onClick={() => setIsEditingSeating(true)} className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
                Cập nhật sơ đồ
              </button>
            )
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(groupNum => {
            const isDutyGroup = groupNum === mainDutyGroupCurrent;
            const groupDesks = seatingChartState[String(groupNum)] || [];

            return (
              <div key={groupNum} className={`border-2 rounded-2xl p-4 transition-all ${isDutyGroup ? 'border-amber-400 bg-amber-50/30 shadow-sm shadow-amber-200/50' : 'border-slate-200 bg-slate-50'}`}>
                <h4 className={`font-bold text-center mb-3 pb-2 border-b flex items-center justify-center gap-2 ${isDutyGroup ? 'text-amber-800 border-amber-200' : 'text-slate-800 border-slate-200'}`}>
                  TỔ {groupNum} 
                  {isDutyGroup && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold shadow-xs">Trực Tuần Này</span>}
                </h4>
                <div className="space-y-2 text-xs">
                  {isEditingSeating ? (
                    // Edit mode: always show 6 desks
                    [1, 2, 3, 4, 5, 6].map(deskIndex => {
                      const existingDesk = groupDesks.find(d => d.deskNumber === deskIndex) || { deskNumber: deskIndex, leftStudent: '', rightStudent: '' };
                      return (
                        <div key={deskIndex} className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                          <span className="text-slate-600 border-r border-slate-100 pr-1 flex items-center font-semibold text-[11px]">Bàn {deskIndex}</span>
                          <div className="space-y-1.5">
                            <input 
                              type="text" 
                              placeholder="Trái..."
                              value={existingDesk.leftStudent}
                              onChange={(e) => {
                                const newDesks = [...groupDesks];
                                const idx = newDesks.findIndex(d => d.deskNumber === deskIndex);
                                if (idx >= 0) newDesks[idx].leftStudent = e.target.value;
                                else newDesks.push({ deskNumber: deskIndex, leftStudent: e.target.value, rightStudent: existingDesk.rightStudent });
                                setSeatingChartState({ ...seatingChartState, [String(groupNum)]: newDesks });
                              }}
                              className="w-full text-[11px] p-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-400"
                            />
                            <input 
                              type="text" 
                              placeholder="Phải..."
                              value={existingDesk.rightStudent}
                              onChange={(e) => {
                                const newDesks = [...groupDesks];
                                const idx = newDesks.findIndex(d => d.deskNumber === deskIndex);
                                if (idx >= 0) newDesks[idx].rightStudent = e.target.value;
                                else newDesks.push({ deskNumber: deskIndex, leftStudent: existingDesk.leftStudent, rightStudent: e.target.value });
                                setSeatingChartState({ ...seatingChartState, [String(groupNum)]: newDesks });
                              }}
                              className="w-full text-[11px] p-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-400"
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    // Display mode
                    groupDesks.length > 0 ? (
                      [1, 2, 3, 4, 5, 6].map(deskIndex => {
                        const desk = groupDesks.find(d => d.deskNumber === deskIndex);
                        if (!desk || (!desk.leftStudent && !desk.rightStudent)) return null;
                        return (
                          <div key={deskIndex} className={`grid grid-cols-2 gap-2 bg-white p-2 rounded-xl shadow-sm border ${isDutyGroup ? 'border-amber-100' : 'border-slate-100'}`}>
                            <span className={`border-r pr-1 flex items-center text-[11px] ${isDutyGroup ? 'text-amber-700 border-amber-100' : 'text-slate-600 border-slate-100'}`}>Bàn {deskIndex}</span>
                            <div>
                              <div className="font-semibold text-slate-800">{desk.leftStudent || '-'}</div>
                              <div className="font-semibold text-slate-800 mt-0.5">{desk.rightStudent || '-'}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-slate-400 py-4 italic border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        Chưa cập nhật chỗ ngồi
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-[11px] text-slate-500 text-center mt-5 font-semibold bg-slate-50 py-2 rounded-lg border border-slate-100">
          Bảng / Bục Giảng nằm ở phía trên (trước Bàn 1)
        </p>
      </div>
    </div>
  );
};
