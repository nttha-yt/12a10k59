/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RuleCriterion, CriterionCategory, UserRole } from '../types';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface RulesManagerProps {
  rules: RuleCriterion[];
  currentRole: UserRole;
  onAddRule: (rule: Omit<RuleCriterion, 'id'>) => void;
  onEditRule: (ruleId: string, updates: Partial<RuleCriterion>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const RulesManager: React.FC<RulesManagerProps> = ({
  rules,
  currentRole,
  onAddRule,
  onEditRule,
  onDeleteRule,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // New/Edit rule form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CriterionCategory>('ne_nep');
  const [points, setPoints] = useState<number>(-2);
  const [description, setDescription] = useState('');

  const filteredRules = rules.filter(r => {
    const matchCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                        r.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCreateOrEditRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingRuleId) {
      onEditRule(editingRuleId, {
        name: name.trim(),
        category,
        points,
        description: description.trim(),
      });
    } else {
      onAddRule({
        name: name.trim(),
        category,
        points,
        description: description.trim(),
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPoints(-2);
    setCategory('ne_nep');
    setIsAddingRule(false);
    setEditingRuleId(null);
  };

  const handleOpenEdit = (rule: RuleCriterion) => {
    setEditingRuleId(rule.id);
    setName(rule.name);
    setCategory(rule.category);
    setPoints(rule.points);
    setDescription(rule.description);
    setIsAddingRule(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryBadge = (cat: CriterionCategory) => {
    switch (cat) {
      case 'ne_nep':
        return {
          label: 'Nề nếp',
          className: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/70 dark:border-blue-800/60',
        };
      case 'hoc_tap':
        return {
          label: 'Học tập',
          className: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60',
        };
      case 've_sinh':
        return {
          label: 'Vệ sinh',
          className: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/60',
        };
      case 'phong_trao':
        return {
          label: 'Phong trào',
          className: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60',
        };
      default:
        return {
          label: 'Quy định',
          className: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Quy Chế Thi Đua & Bảng Điểm Chuẩn 12A10
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quy định nề nếp, học tập, vệ sinh và phong trào chuẩn hóa THPT Yên Thế (2026-2027)
          </p>
        </div>

        {currentRole === 'gvcn' || currentRole === 'lop_truong' ? (
          <button
            onClick={() => setIsAddingRule(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Thêm Tiêu Chí Mới
          </button>
        ) : null}
      </div>

      {/* 10 Core Rules Panel - Elegant & Harmonious Design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                10 ĐIỀU NỘI QUY LỚP 12A10 (K59)
              </h3>
              <p className="text-xs text-slate-400">THPT Yên Thế • Chuẩn mực hành vi & văn hóa lớp học</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs sm:text-sm">
            {[
              "Lễ phép chào hỏi khi gặp thầy cô, người lớn tuổi.",
              "Chấp hành đúng quy định ATGT. Không đi xe trong trường; xếp xe ngay ngắn.",
              "Không mang đồ ăn vào lớp học. Không vứt rác, ngăn bàn phải sạch sẽ.",
              "Ra vào lớp đúng giờ quy định; Mặc đồng phục và đeo giày dép đúng quy định.",
              "Không sử dụng điện thoại trong giờ trừ trường hợp GV cho phép.",
              "Không nói chuyện, làm việc riêng trong giờ học.",
              "Hăng hái xây dựng bài; hỗ trợ giảng bài cho các bạn nếu biết.",
              "Chuẩn bị bài và làm bài đầy đủ có chất lượng khi đến lớp.",
              "Trực nhật sạch, đúng giờ.",
              "Giữ trật tự, kỷ luật khi xếp hàng chào cờ, hoạt động tập thể."
            ].map((ruleText, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
                  {index + 1}
                </span>
                <p className="text-slate-200 leading-relaxed">{ruleText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Rule Form (collapsible) */}
      {isAddingRule && (
        <form onSubmit={handleCreateOrEditRule} className="bg-slate-50 dark:bg-slate-850 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 animate-in fade-in duration-200 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              {editingRuleId ? <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              {editingRuleId ? 'Chỉnh Sửa Tiêu Chí / Nội Quy' : 'Thêm Tiêu Chí / Nội Quy Mới'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-bold cursor-pointer"
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tên Tiêu Chí (*)</label>
              <input
                type="text"
                required
                placeholder="VD: Không mang thẻ học sinh, Đạt giải HSG tỉnh..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Danh Mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CriterionCategory)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="ne_nep" className="dark:bg-slate-800">🚫 Nề nếp (Kỷ luật, đồng phục, chuyên cần)</option>
                <option value="hoc_tap" className="dark:bg-slate-800">📚 Học tập (Kiểm tra, bài tập, phát biểu)</option>
                <option value="ve_sinh" className="dark:bg-slate-800">🧹 Vệ sinh (Trực nhật, bàn ghế, rác thải)</option>
                <option value="phong_trao" className="dark:bg-slate-800">⭐ Phong trào (Văn nghệ, thể thao, đoàn thể)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Điểm Cộng / Trừ (*)</label>
              <input
                type="number"
                required
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mô Tả & Hướng Dẫn Xử Lý</label>
            <input
              type="text"
              placeholder="VD: Trừ vào điểm thi đua tuần, nhắc nhở trước cờ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              {editingRuleId ? 'Cập Nhật Tiêu Chí' : 'Lưu Tiêu Chí'}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors duration-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Tất cả quy chế' },
            { id: 'ne_nep', label: '🚫 Nề nếp' },
            { id: 'hoc_tap', label: '📚 Học tập' },
            { id: 've_sinh', label: '🧹 Vệ sinh' },
            { id: 'phong_trao', label: '⭐ Phong trào' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm nội quy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rules Grid - Clean, Harmonious & High Readability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => {
          const isBonus = rule.points > 0;
          const badge = getCategoryBadge(rule.category);

          return (
            <div
              key={rule.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all"
            >
              <div className="space-y-2.5">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${badge.className}`}>
                    {badge.label}
                  </span>

                  <span className={`text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl border ${
                    isBonus 
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60' 
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/60'
                  }`}>
                    {isBonus ? `+${rule.points}` : rule.points} đ
                  </span>
                </div>

                {/* Rule Title & Desc */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug">
                    {rule.name}
                  </h4>
                  {rule.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {rule.description}
                    </p>
                  )}
                </div>
              </div>

              {(currentRole === 'gvcn' || currentRole === 'lop_truong') && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenEdit(rule)}
                    title="Sửa tiêu chí này"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa quy định: "${rule.name}"?`)) {
                        onDeleteRule(rule.id);
                      }
                    }}
                    title="Xóa tiêu chí này"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RulesManager;
