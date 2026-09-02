/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserAccount, UserRole } from '../types';
import { USER_ACCOUNTS } from '../data/initialData';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  FileSpreadsheet, 
  PlusCircle, 
  Award, 
  CheckSquare, 
  Users, 
  BookOpen, 
  Bot, 
  Calendar,
  School,
  ShieldAlert
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  currentUser: UserAccount;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  currentWeek: number;
  onSelectWeek: (week: number) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenScoringModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenApiKeyModal: () => void;
  onOpenExportModal: () => void;
  penaltiesCount: number;
  hasApiKey: boolean;
  totalStudents: number;
  onChangePassword?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUser,
  onOpenAuthModal,
  onLogout,
  currentWeek,
  onSelectWeek,
  activeTab,
  onChangeTab,
  onOpenScoringModal,
  onOpenSettingsModal,
  onOpenApiKeyModal,
  onOpenExportModal,
  penaltiesCount,
  hasApiKey,
  totalStudents,
  onChangePassword,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top bar with Branding & User info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg sm:text-xl">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-xl tracking-tight flex items-center gap-1.5">
                  12A10 <span className="text-blue-600">THPT Yên Thế</span>
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  2026 - 2027
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hệ thống Quản lý Thi đua, Nề nếp & Trực nhật Tự động
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Week Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <Calendar className="w-4 h-4 text-slate-500 ml-2 hidden sm:block" />
              <select
                id="week-selector"
                value={currentWeek}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-700 py-1 px-2 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                  <option key={w} value={w}>
                    Tuần {w} {w === 4 ? '(Hiện tại)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Scoring Button (for GVCN, Monitor, Group Leaders) */}
            {currentRole !== 'hoc_sinh' && (
              <button
                id="btn-quick-scoring"
                onClick={onOpenScoringModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-sm shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden md:inline">Chấm Điểm</span>
              </button>
            )}

            {/* Login/Logout Button */}
            <div className="flex items-center gap-2">
              {currentRole === 'hoc_sinh' ? (
                <button
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Đăng Nhập
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                    <span className="text-[10px] font-semibold text-blue-600">{currentUser.roleTitle}</span>
                  </div>
                  <button
                    onClick={onChangePassword}
                    className="p-1.5 ml-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                    title="Đổi mật khẩu"
                  >
                    Đổi MK
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                    title="Đăng xuất"
                  >
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>

            {/* API Key Settings Button */}
            <div className="flex items-center gap-2 ml-1">
              {!hasApiKey && (
                <span className="hidden lg:inline-block text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                  Lấy API key để sử dụng app
                </span>
              )}
              <button
                onClick={onOpenApiKeyModal}
                title="Cài đặt AI & API Key"
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline-block text-xs font-bold">AI</span>
              </button>
            </div>

            {/* Settings Button */}
            <button
              id="btn-settings-modal"
              onClick={onOpenSettingsModal}
              title="Cài đặt hệ thống"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer ml-1"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar border-t border-slate-100 text-xs sm:text-sm font-medium">
          <button
            id="nav-tab-dashboard"
            onClick={() => onChangeTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            Tổng Quan
          </button>

          <button
            id="nav-tab-rankings"
            onClick={() => onChangeTab('rankings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'rankings'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Bảng Xếp Hạng
          </button>

          <button
            id="nav-tab-penalties"
            onClick={() => onChangeTab('penalties')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'penalties'
                ? 'bg-amber-500 text-white font-semibold shadow-sm shadow-amber-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${activeTab === 'penalties' ? 'text-white' : 'text-amber-500'}`} />
            Trực Nhật
            {penaltiesCount > 0 && (
              <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'penalties' ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-700'
              }`}>
                {penaltiesCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-students"
            onClick={() => onChangeTab('students')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Danh Sách Lớp ({totalStudents} HS)
          </button>

          <button
            id="nav-tab-rules"
            onClick={() => onChangeTab('rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Nội Quy & Thang Điểm
          </button>

          <button
            id="nav-tab-ai"
            onClick={() => onChangeTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-sm shadow-purple-500/20'
                : 'text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Gemini AI Cố Vấn & Báo Cáo
          </button>

          <button
            id="nav-tab-export"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 cursor-pointer ml-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất Excel / In Báo Cáo
          </button>
        </nav>
      </div>
    </header>
  );
};
