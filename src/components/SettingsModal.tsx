/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FullAppData, UserRole, AppAccount } from '../types';
import { exportDataAsJSON, resetToDemoData } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  X, 
  Users,
  Sun,
  Moon,
  Palette
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullAppData;
  currentRole: UserRole;
  onUpdateSettings: (newSettings: any) => void;
  onUpdateAccounts: (accounts: AppAccount[]) => void;
  onRestoreData: (restoredData: FullAppData) => void;
  onNextWeek?: () => void;
  onResetCurrentWeek?: () => void;
  onResetAllScores?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  data,
  currentRole,
  onUpdateSettings,
  onUpdateAccounts,
  onRestoreData,
  onNextWeek,
  onResetCurrentWeek,
  onResetAllScores,
}) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const [baseScore, setBaseScore] = useState(data.settings.baseStartingScore || 100);
  const [penaltiesPerGroup, setPenaltiesPerGroup] = useState(data.settings.penaltiesPerGroup || 2);
  const [currentWeek, setCurrentWeek] = useState(data.settings.currentWeek || 1);
  const [accountsTemp, setAccountsTemp] = useState<AppAccount[]>(data.accounts || []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onUpdateSettings({
      ...data.settings,
      baseStartingScore: Number(baseScore),
      penaltiesPerGroup: Number(penaltiesPerGroup),
      currentWeek: Number(currentWeek),
    });

    onUpdateAccounts(accountsTemp);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.students && parsed.rules) {
          onRestoreData(parsed);
          alert('Khôi phục dữ liệu thành công!');
          onClose();
        } else {
          alert('Tệp dữ liệu không đúng định dạng!');
        }
      } catch (err) {
        alert('Lỗi đọc tệp JSON: ' + err);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại dữ liệu lớp 12A10 về trạng thái mẫu ban đầu? Mọi điểm số mới sẽ bị xóa.')) {
      const demoData = resetToDemoData();
      onRestoreData(demoData);
      alert('Đã đặt lại dữ liệu mẫu thành công!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                Cài Đặt Hệ Thống & Giao Diện
              </h3>
              <p className="text-xs text-slate-400">
                12A10 THPT Yên Thế • Niên khóa 2026-2027
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Section 0: Theme Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Chế Độ Giao Diện (Theme)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Giao diện Sáng</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Trang nhã & sắc nét</div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-indigo-900/60 text-amber-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Giao diện Tối</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Dịu mắt ban đêm</div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />}
              </button>
            </div>
          </div>

          {/* Section 1: Core Emulation Rules */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Tham Số Tính Điểm & Xếp Hạng
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Điểm xuất phát mỗi tuần:
                </label>
                <input
                  type="number"
                  value={baseScore}
                  onChange={(e) => setBaseScore(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Tuần học hiện tại:
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={currentWeek}
                  onChange={(e) => setCurrentWeek(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Tăng tuần để bắt đầu chấm điểm mới (lịch sử giữ nguyên)</p>
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Số HS phạt trực nhật / tổ:
                </label>
                <input
                  type="number"
                  value={penaltiesPerGroup}
                  onChange={(e) => setPenaltiesPerGroup(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Manage Accounts (GVCN only) */}
          {currentRole === 'gvcn' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Quản lý Tài Khoản Đăng Nhập
              </label>
              
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {accountsTemp.map((acc, idx) => (
                  <div key={acc.id} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{acc.name}</span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                        {acc.role}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Tên đăng nhập</label>
                        <input
                          type="text"
                          value={acc.username}
                          onChange={(e) => {
                            const newAccs = [...accountsTemp];
                            newAccs[idx].username = e.target.value;
                            setAccountsTemp(newAccs);
                          }}
                          className="w-full text-xs p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Mật khẩu</label>
                        <input
                          type="text"
                          value={acc.passcode}
                          onChange={(e) => {
                            const newAccs = [...accountsTemp];
                            newAccs[idx].passcode = e.target.value;
                            setAccountsTemp(newAccs);
                          }}
                          className="w-full text-xs p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Reset Scores (GVCN only) */}
          {currentRole === 'gvcn' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Quản Lý Dữ Liệu Điểm Số Tuần
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onNextWeek}
                  className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex flex-col items-start gap-1 cursor-pointer transition-colors"
                >
                  Bắt Đầu Tuần Mới
                  <span className="text-[10px] font-normal text-blue-600/80 dark:text-blue-400/80">
                    Lưu lịch sử tuần {currentWeek} và làm mới điểm (100đ)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onResetCurrentWeek}
                  className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs flex flex-col items-start gap-1 cursor-pointer transition-colors"
                >
                  Xoá Điểm Tuần Này
                  <span className="text-[10px] font-normal text-amber-600/80 dark:text-amber-400/80">
                    Làm lại từ 100đ cho tuần {currentWeek} hiện tại
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={onResetAllScores}
                  className="p-2.5 sm:col-span-2 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex flex-col items-start gap-1 cursor-pointer transition-colors mt-2"
                >
                  Xoá Trắng Toàn Bộ Điểm (Reset Cả Năm)
                  <span className="text-[10px] font-normal text-rose-600/80 dark:text-rose-400/80">
                    Chỉ dùng khi làm nháp xong và muốn bắt đầu học kỳ mới
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Section 3: Backup & Restore */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Sao Lưu & Khôi Phục Dữ Liệu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => exportDataAsJSON(data)}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Xuất File JSON
              </button>

              <label className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Nạp Lại File JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Reset Demo Data */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetData}
              className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại dữ liệu mẫu ban đầu
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              Đã lưu cài đặt thành công!
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 cursor-pointer"
            >
              Lưu Thiết Lập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
