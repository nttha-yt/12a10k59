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
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Edit, 
  Sparkles,
  Shield,
  Layers
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Quy Chế Thi Đua & Bảng Điểm Chuẩn 12A10
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy định nề nếp, học tập, vệ sinh và phong trào chuẩn hóa THPT Yên Thế (2026-2027)
          </p>
        </div>

        {currentRole === 'gvcn' || currentRole === 'lop_truong' ? (
          <button
            onClick={() => setIsAddingRule(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Thêm Tiêu Chí Mới
          </button>
        ) : null}
      </div>

      {/* 10 Core Rules Panel */}
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-300" />
            10 ĐIỀU NỘI QUY LỚP 12A10 (K59)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">1.</span>
              <p>Lễ phép chào hỏi khi gặp thầy cô, người lớn tuổi.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">2.</span>
              <p>Chấp hành đúng quy định ATGT. Không đi xe trong trường; xếp xe ngay ngắn.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">3.</span>
              <p>Không mang đồ ăn vào lớp học. Không vứt rác, ngăn bàn phải sạch sẽ.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">4.</span>
              <p>Ra vào lớp đúng giờ quy định; Mặc đồng phục và đeo giày dép đúng quy định.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">5.</span>
              <p>Không sử dụng điện thoại trong giờ trừ trường hợp GV cho phép.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">6.</span>
              <p>Không nói chuyện, làm việc riêng trong giờ học.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">7.</span>
              <p>Hăng hái xây dựng bài; hỗ trợ giảng bài cho các bạn nếu biết.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">8.</span>
              <p>Chuẩn bị bài và làm bài đầy đủ có chất lượng khi đến lớp.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">9.</span>
              <p>Trực nhật sạch, đúng giờ.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 min-w-[20px]">10.</span>
              <p>Giữ trật tự, kỷ luật khi xếp hàng chào cờ, hoạt động tập thể.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Rule Form (collapsible) */}
      {isAddingRule && (
        <form onSubmit={handleCreateOrEditRule} className="bg-blue-50/60 rounded-3xl p-6 border border-blue-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <h3 className="font-extrabold text-blue-900 text-base flex items-center gap-2">
              {editingRuleId ? <Edit className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
              {editingRuleId ? 'Chỉnh Sửa Tiêu Chí / Nội Quy' : 'Thêm Tiêu Chí / Nội Quy Mới'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên Tiêu Chí (*)</label>
              <input
                type="text"
                required
                placeholder="VD: Không mang thẻ học sinh, Đạt giải HSG tỉnh..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Danh Mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CriterionCategory)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                <option value="ne_nep">🚫 Nề nếp (Kỷ luật, đồng phục, chuyên cần)</option>
                <option value="hoc_tap">📚 Học tập (Kiểm tra, bài tập, phát biểu)</option>
                <option value="ve_sinh">🧹 Vệ sinh (Trực nhật, bàn ghế, rác thải)</option>
                <option value="phong_trao">⭐ Phong trào (Văn nghệ, thể thao, đoàn thể)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Điểm Cộng / Trừ (*)</label>
              <input
                type="number"
                required
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả & Hướng Dẫn Xử Lý</label>
            <input
              type="text"
              placeholder="VD: Trừ vào điểm thi đua tuần, nhắc nhở trước cờ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              {editingRuleId ? 'Cập Nhật Tiêu Chí' : 'Lưu Tiêu Chí'}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => {
          const isBonus = rule.points > 0;

          return (
            <div
              key={rule.id}
              className={`bg-white rounded-2xl p-4 border shadow-sm flex flex-col justify-between space-y-3 transition-all ${
                isBonus ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    rule.category === 'ne_nep' ? 'bg-amber-100 text-amber-800' :
                    rule.category === 'hoc_tap' ? 'bg-blue-100 text-blue-800' :
                    rule.category === 've_sinh' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {rule.category === 'ne_nep' ? 'Nề nếp' : rule.category === 'hoc_tap' ? 'Học tập' : rule.category === 've_sinh' ? 'Vệ sinh' : 'Phong trào'}
                  </span>

                  <span className={`text-sm font-black px-2.5 py-0.5 rounded-xl ${
                    isBonus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isBonus ? `+${rule.points}` : rule.points} đ
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{rule.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>
              </div>

              {(currentRole === 'gvcn' || currentRole === 'lop_truong') && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(rule)}
                    title="Sửa tiêu chí này"
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer text-xs flex items-center gap-1"
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
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-xs flex items-center gap-1"
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
