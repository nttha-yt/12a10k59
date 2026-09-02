/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  FileSpreadsheet, 
  PlusCircle, 
  Award, 
  CheckSquare, 
  Users, 
  BookOpen, 
  Calendar,
  School,
  ShieldAlert,
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  LogOut,
  KeyRound,
  Sliders,
  ChevronRight
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
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ================= TOP BAR ================= */}
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-base sm:text-xl shrink-0">
              <School className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-xl tracking-tight flex items-center gap-1">
                  12A10 <span className="text-blue-600 dark:text-blue-400">Yên Thế</span>
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  2026 - 2027
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Hệ thống Quản lý Thi đua, Nề nếp & Trực nhật Tự động
              </p>
            </div>
          </div>

          {/* DESKTOP CONTROLS (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
            
            {/* Week Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-200 dark:border-slate-700 transition-colors">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-2" />
              <select
                id="week-selector"
                value={currentWeek}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 py-1 px-2 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                  <option key={w} value={w} className="dark:bg-slate-800 dark:text-slate-200">
                    Tuần {w} {w === 4 ? '(Hiện tại)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Scoring Button */}
            {currentRole !== 'hoc_sinh' && (
              <button
                id="btn-quick-scoring"
                onClick={onOpenScoringModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-sm shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Chấm Điểm</span>
              </button>
            )}

            {/* Login / User Info */}
            <div className="flex items-center gap-2">
              {currentRole === 'hoc_sinh' ? (
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer border border-transparent dark:border-slate-700"
                >
                  Đăng Nhập
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 transition-colors">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</span>
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">{currentUser.roleTitle}</span>
                  </div>
                  <button
                    onClick={onChangePassword}
                    className="p-1.5 ml-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                    title="Đổi mật khẩu"
                  >
                    Đổi MK
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                    title="Đăng xuất"
                  >
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              title={isDark ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              aria-label="Chuyển chế độ sáng tối"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all transform active:scale-90 cursor-pointer flex items-center justify-center"
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* API Key Settings Button */}
            <button
              onClick={onOpenApiKeyModal}
              title="Cài đặt AI & API Key"
              className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-300" />
              <span className="text-xs font-bold">AI</span>
            </button>

            {/* Settings Button */}
            <button
              id="btn-settings-modal"
              onClick={onOpenSettingsModal}
              title="Cài đặt hệ thống"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* MOBILE ACTION CLUSTER (Visible ONLY on Mobile) */}
          <div className="flex md:hidden items-center gap-1.5">
            
            {/* Mobile Quick Scoring (if authorized) */}
            {currentRole !== 'hoc_sinh' && (
              <button
                onClick={onOpenScoringModal}
                aria-label="Chấm điểm thi đua"
                className="p-2 rounded-xl bg-blue-600 active:bg-blue-700 text-white shadow-xs transition-transform active:scale-90 cursor-pointer flex items-center justify-center"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Quick Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Chuyển chế độ sáng tối"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-transform active:scale-90 cursor-pointer flex items-center justify-center"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile 3-Gạch Hamburger Menu Button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Mở menu quản lý"
              className={`p-2 rounded-xl border transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
                isMobileMenuOpen
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm font-medium transition-colors">
          <button
            id="nav-tab-dashboard"
            onClick={() => onChangeTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
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
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            Xếp Hạng
          </button>

          <button
            id="nav-tab-penalties"
            onClick={() => onChangeTab('penalties')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'penalties'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Trực Nhật
            {penaltiesCount > 0 && (
              <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'penalties' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Học Sinh ({totalStudents})
          </button>

          <button
            id="nav-tab-rules"
            onClick={() => onChangeTab('rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Nội Quy
          </button>

          <button
            id="nav-tab-ai"
            onClick={() => onChangeTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-sm shadow-purple-500/20'
                : 'text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200/50 dark:border-purple-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Gemini AI
          </button>

          <button
            id="nav-tab-export"
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/50 dark:border-emerald-800/50 cursor-pointer ml-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất Báo Cáo
          </button>
        </nav>
      </div>

      {/* ================= MOBILE 3-GACH SLIDE-OVER DRAWER ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-in Menu Panel */}
          <div className="fixed inset-y-0 right-0 max-w-[320px] w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-250 z-10">
            
            <div className="space-y-5">
              {/* Drawer Top Title & Close */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    12A
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Menu Điều Khiển</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">12A10 THPT Yên Thế</p>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Account Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                {currentRole === 'hoc_sinh' ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Chế độ xem: Khách / Học sinh
                    </div>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        onOpenAuthModal();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      Đăng Nhập Quản Trị
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-slate-100">{currentUser.name}</div>
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{currentUser.roleTitle}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                        Đang hoạt động
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          onChangePassword?.();
                        }}
                        className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                        Đổi MK
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          onLogout();
                        }}
                        className="py-1.5 px-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Đăng Xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Selector (Light / Dark) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Giao Diện Ứng Dụng
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setTheme('light')}
                    className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    Sáng
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    Tối
                  </button>
                </div>
              </div>

              {/* Week Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Chọn Tuần Học
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={currentWeek}
                    onChange={(e) => {
                      onSelectWeek(Number(e.target.value));
                      closeMobileMenu();
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                      <option key={w} value={w} className="dark:bg-slate-800">
                        Tuần học {w} {w === 4 ? '(Hiện tại)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* System Quick Actions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Chức Năng & Tiện Ích
                </label>
                
                <div className="space-y-1.5">
                  {currentRole !== 'hoc_sinh' && (
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        onOpenScoringModal();
                      }}
                      className="w-full p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Chấm Điểm Thi Đua</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      closeMobileMenu();
                      onOpenApiKeyModal();
                    }}
                    className="w-full p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 border border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Cấu Hình Gemini AI</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </button>

                  <button
                    onClick={() => {
                      closeMobileMenu();
                      onOpenExportModal();
                    }}
                    className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Xuất Báo Cáo (Excel / Word / PPT)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => {
                      closeMobileMenu();
                      onOpenSettingsModal();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span>Cài Đặt Hệ Thống</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                12A10 K59 • THPT Yên Thế (2026-2027)
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
