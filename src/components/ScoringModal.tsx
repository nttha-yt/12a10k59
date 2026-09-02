/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RuleCriterion, UserAccount, CriterionCategory } from '../types';
import { StudentScoreSummary } from '../utils/calculations';
import { 
  X, 
  Search, 
  PlusCircle, 
  CheckCircle2
} from 'lucide-react';

interface ScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentSummaries: StudentScoreSummary[];
  rules: RuleCriterion[];
  currentWeek: number;
  currentUser: UserAccount;
  onAddScoreLog: (params: {
    studentId: string;
    studentName: string;
    group: number;
    criterionId: string;
    criterionName: string;
    category: CriterionCategory;
    points: number;
    note?: string;
  }) => void;
}

export const ScoringModal: React.FC<ScoringModalProps> = ({
  isOpen,
  onClose,
  studentSummaries,
  rules,
  currentWeek,
  currentUser,
  onAddScoreLog,
}) => {
  if (!isOpen) return null;

  // Selected student
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>(
    currentUser.groupNumber || 'all'
  );
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Selected rule
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  // Filter students
  const filteredStudents = studentSummaries.filter(s => {
    const matchGroup = selectedGroup === 'all' || s.student.group === selectedGroup;
    const matchSearch = s.student.name.toLowerCase().includes(searchStudent.toLowerCase()) || 
                        s.student.code.toLowerCase().includes(searchStudent.toLowerCase());
    return matchGroup && matchSearch;
  });

  const selectedStudentSummary = studentSummaries.find(s => s.student.id === selectedStudentId);
  const selectedStudent = selectedStudentSummary?.student;
  const selectedRules = rules.filter(r => selectedRuleIds.includes(r.id));
  const totalSelectedPoints = selectedRules.reduce((sum, r) => sum + r.points, 0);

  // Filter rules
  const filteredRules = rules.filter(r => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  const handleSelectRule = (rule: RuleCriterion) => {
    setSelectedRuleIds(prev => 
      prev.includes(rule.id) ? prev.filter(id => id !== rule.id) : [...prev, rule.id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || selectedRuleIds.length === 0) {
      alert('Vui lòng chọn học sinh và ít nhất một nội dung chấm điểm.');
      return;
    }

    selectedRules.forEach(rule => {
      onAddScoreLog({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        group: selectedStudent.group,
        criterionId: rule.id,
        criterionName: rule.name,
        category: rule.category,
        points: rule.points,
        note: note.trim() || undefined,
      });
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      // Reset form but keep modal open for fast consecutive scoring
      setSelectedRuleIds([]);
      setNote('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-300" />
              Chấm Điểm Thi Đua Thời Gian Thực (Tuần {currentWeek})
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Người chấm: <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.roleTitle})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Step 1: Chọn Học Sinh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              1. Chọn Học Sinh Cần Chấm Điểm
            </label>

            {/* Filter Group Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {!currentUser.role.startsWith('to_truong_') && (
                <button
                  type="button"
                  onClick={() => setSelectedGroup('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedGroup === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tất Cả Lớp
                </button>
              )}
              {[1, 2, 3, 4].map((g) => {
                const isToTruong = currentUser.role.startsWith('to_truong_');
                const isAllowedGroup = !isToTruong || currentUser.groupNumber === g;
                
                if (!isAllowedGroup) return null;

                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGroup(g)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedGroup === g
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Tổ {g}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm học sinh theo tên hoặc mã (vd: Tuấn, 12A10-01)..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Student Horizontal / Grid Selector */}
            <div className="max-h-36 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40">
              {filteredStudents.map((std) => (
                <button
                  type="button"
                  key={std.student.id}
                  onClick={() => setSelectedStudentId(std.student.id)}
                  className={`p-2 rounded-xl text-left flex items-center gap-2 border transition-all cursor-pointer ${
                    selectedStudentId === std.student.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <img
                    src={std.student.avatar}
                    alt={std.student.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{std.student.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center w-full">
                      <span>Tổ {std.student.group}</span>
                      <span className={`font-bold ${
                        std.totalScore >= 105 ? 'text-emerald-600 dark:text-emerald-400' : std.totalScore < 95 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                      }`}>{std.totalScore}đ</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Chọn Tiêu Chí Chấm Điểm */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              2. Chọn Tiêu Chí Vi Phạm / Khen Thưởng
            </label>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {[
                { id: 'all', label: 'Tất cả tiêu chí' },
                { id: 'ne_nep', label: '🚫 Nề nếp (-)' },
                { id: 'hoc_tap', label: '📚 Học tập (+/-)' },
                { id: 've_sinh', label: '🧹 Vệ sinh (+/-)' },
                { id: 'phong_trao', label: '⭐ Phong trào (+)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-800 dark:bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Rules Quick Select Cards */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredRules.map((rule) => {
                const isBonus = rule.points > 0;
                const isSelected = selectedRuleIds.includes(rule.id);
                return (
                  <div
                    key={rule.id}
                    onClick={() => handleSelectRule(rule)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isBonus ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      }`}>
                        {isBonus ? '+' : '-'}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{rule.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{rule.description}</div>
                      </div>
                    </div>

                    <div className="shrink-0 font-extrabold text-xs">
                      <span className={`px-2 py-0.5 rounded-md ${
                        isBonus ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {isBonus ? `+${rule.points}` : rule.points} đ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Ghi Chú & Tổng Điểm */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Ghi chú chung (Tiết học, môn học, hành vi cụ thể):
              </label>
              <input
                type="text"
                placeholder="VD: Đến muộn 10p tiết 1; 10đ miệng môn Toán;..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tổng điểm áp dụng:
              </label>
              <div className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex items-center justify-between ${
                totalSelectedPoints > 0 ? 'text-emerald-600 dark:text-emerald-400' : totalSelectedPoints < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
              }`}>
                <span>{selectedRuleIds.length} tiêu chí</span>
                <span>{totalSelectedPoints > 0 ? `+${totalSelectedPoints}` : totalSelectedPoints} đ</span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {successToast && (
            <div className="p-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Đã ghi nhận điểm thành công cho học sinh!
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={!selectedStudentId || selectedRuleIds.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                selectedStudentId && selectedRuleIds.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                  : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Lưu & Cập Nhật Điểm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoringModal;
