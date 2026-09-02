/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FullAppData, UserRole, ScoreLogEntry, PenaltyAssignment, RuleCriterion, Student } from './types';
import { USER_ACCOUNTS } from './data/initialData';
import { INITIAL_APP_DATA } from './data/initialData';
import { fetchAppData, saveAppData } from './services/firestore';
import { useAuth } from './contexts/AuthContext';
import { calculateStudentScores, calculateGroupSummaries, generateAutoPenaltyAssignments } from './utils/calculations';

// Components
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { WeeklyRankings } from './components/WeeklyRankings';
import { PenaltyDutyScheduler } from './components/PenaltyDutyScheduler';
import { StudentDirectory } from './components/StudentDirectory';
import { RulesManager } from './components/RulesManager';
import { AIAssistantTab } from './components/AIAssistantTab';
import { ScoringModal } from './components/ScoringModal';
import { NotificationModal } from './components/NotificationModal';
import { ReportsExporter } from './components/ReportsExporter';
import { SettingsModal } from './components/SettingsModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AuthModal } from './components/AuthModal';

export function App() {
  const [data, setData] = useState<FullAppData>(INITIAL_APP_DATA);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [currentWeek, setCurrentWeek] = useState<number>(4);
  const [currentRole, setCurrentRole] = useState<UserRole>('hoc_sinh');
  const [loggedInAccount, setLoggedInAccount] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [selectedPenaltyForNotification, setSelectedPenaltyForNotification] = useState<PenaltyAssignment | null>(null);
  const [selectedStudentIdForHistory, setSelectedStudentIdForHistory] = useState<string | null>(null);
  const [aiPreselectedStudentId, setAiPreselectedStudentId] = useState<string | null>(null);

  // API Key state
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    const checkApiKey = () => {
      if (typeof window !== 'undefined') {
        const key = localStorage.getItem('gemini_api_key');
        setHasApiKey(!!key);
        if (!key && currentRole === 'gvcn') setIsApiKeyModalOpen(true);
      }
    };
    checkApiKey();
    window.addEventListener('gemini_key_updated', checkApiKey);
    return () => window.removeEventListener('gemini_key_updated', checkApiKey);
  }, [currentRole]);

  const { user, loading: authLoading } = useAuth();

  // Load from Firestore
  useEffect(() => {
    fetchAppData().then((cloudData) => {
      setData(cloudData);
      if (cloudData.settings?.currentWeek) {
        setCurrentWeek(cloudData.settings.currentWeek);
      }
      setIsDataLoaded(true);
    });
  }, []);

  // Sync with Firestore on data changes
  useEffect(() => {
    if (isDataLoaded) {
      saveAppData(data);
    }
  }, [data, isDataLoaded]);

  // Migrate HS-MỚI- codes to STT (index-based) automatically
  useEffect(() => {
    if (isDataLoaded && data.students.some(s => s.code.startsWith('HS-MỚI-'))) {
      setData(prev => ({
        ...prev,
        students: prev.students.map((s, idx) => {
          if (s.code.startsWith('HS-MỚI-')) {
            return { ...s, code: String(idx + 1).padStart(2, '0') };
          }
          return s;
        })
      }));
    }
  }, [isDataLoaded, data.students]);

  // Migrate to the new comprehensive rules list if using old rules (length < 20)
  useEffect(() => {
    if (isDataLoaded && data.rules && data.rules.length < 20) {
      setData(prev => ({
        ...prev,
        rules: INITIAL_APP_DATA.rules
      }));
    }
  }, [isDataLoaded, data.rules?.length]);

  // Migrate Seating Chart (Auto-add Tổ 2 and Tổ 3 if missing)
  useEffect(() => {
    if (isDataLoaded) {
      const currentSeating = data.settings.seatingChart || {};
      const needsUpdateGroup2 = !currentSeating["2"] || currentSeating["2"].length === 0;
      const needsUpdateGroup3 = !currentSeating["3"] || currentSeating["3"].length === 0;
      
      if (needsUpdateGroup2 || needsUpdateGroup3) {
        setData(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            seatingChart: {
              ...currentSeating,
              ...(needsUpdateGroup2 ? { "2": INITIAL_APP_DATA.settings.seatingChart!["2"] } : {}),
              ...(needsUpdateGroup3 ? { "3": INITIAL_APP_DATA.settings.seatingChart!["3"] } : {}),
            }
          }
        }));
      }
    }
  }, [isDataLoaded]);

  // Current active user object
  const currentUser = useMemo(() => {
    const baseAccount = USER_ACCOUNTS.find(a => a.role === currentRole) || USER_ACCOUNTS.find(a => a.role === 'hoc_sinh')!;
    if (loggedInAccount) {
      return { ...baseAccount, name: loggedInAccount.name };
    }
    return baseAccount;
  }, [currentRole, loggedInAccount]);

  const handleLoginSuccess = (role: UserRole, account: any) => {
    setCurrentRole(role);
    setLoggedInAccount(account);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      setCurrentRole('hoc_sinh');
      setLoggedInAccount(null);
    }
  };

  const handleChangePassword = () => {
    if (currentRole === 'hoc_sinh') return;
    const currentAcc = data.accounts?.find(a => a.role === currentRole);
    if (!currentAcc) return;

    const oldPass = window.prompt('Vui lòng nhập mật khẩu HIỆN TẠI của bạn:');
    if (oldPass === null) return;
    if (oldPass !== currentAcc.passcode) {
      alert('Mật khẩu hiện tại không đúng!');
      return;
    }

    const newPass = window.prompt('Nhập mật khẩu MỚI:');
    if (newPass === null) return;
    if (newPass.trim() === '') {
      alert('Mật khẩu mới không được để trống!');
      return;
    }

    const confirmPass = window.prompt('Nhập LẠI mật khẩu mới để xác nhận:');
    if (confirmPass === null) return;
    if (newPass !== confirmPass) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    const newAccounts = data.accounts.map(a => a.role === currentRole ? { ...a, passcode: newPass.trim() } : a);
    setData(prev => ({ ...prev, accounts: newAccounts }));
    alert('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.');
  };

  // Calculate Student Scores & Rankings for Current Week
  const studentSummaries = useMemo(() => {
    return calculateStudentScores(
      data.students,
      currentWeek,
      data.scoreLogs,
      data.settings.baseStartingScore || 100,
      data.settings.penaltiesPerGroup || 2
    );
  }, [data.students, currentWeek, data.scoreLogs, data.settings]);

  // Calculate Group Summaries for Current Week
  const groupSummaries = useMemo(() => {
    return calculateGroupSummaries(studentSummaries);
  }, [studentSummaries]);

  // Sync / Auto-generate Penalties for Current Week
  useEffect(() => {
    const updatedPenalties = generateAutoPenaltyAssignments(
      data.students,
      currentWeek,
      data.scoreLogs,
      data.penaltyAssignments,
      data.settings.penaltiesPerGroup || 2
    );

    // If penalties count changed or needs update
    if (JSON.stringify(updatedPenalties) !== JSON.stringify(data.penaltyAssignments)) {
      setData(prev => ({
        ...prev,
        penaltyAssignments: updatedPenalties,
      }));
    }
  }, [currentWeek, data.scoreLogs, data.students, data.settings.penaltiesPerGroup]);

  // Handler: Add new score entry (live scoring)
  const handleAddScoreLog = (params: {
    studentId: string;
    studentName: string;
    group: number;
    criterionId: string;
    criterionName: string;
    category: any;
    points: number;
    note?: string;
  }) => {
    const newLog: ScoreLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      weekNumber: currentWeek,
      academicYear: '2026-2027',
      studentId: params.studentId,
      studentName: params.studentName,
      group: params.group,
      criterionId: params.criterionId,
      criterionName: params.criterionName,
      category: params.category,
      points: params.points,
      note: params.note,
      recordedBy: currentUser.name,
      recordedByRole: currentUser.roleTitle,
      timestamp: new Date().toISOString(),
    };

    setData(prev => ({
      ...prev,
      scoreLogs: [newLog, ...prev.scoreLogs],
    }));
  };

  // Handler: Update penalty assignment task or status
  const handleUpdatePenalty = (penaltyId: string, updates: Partial<PenaltyAssignment>) => {
    setData(prev => ({
      ...prev,
      penaltyAssignments: prev.penaltyAssignments.map(p =>
        p.id === penaltyId ? { ...p, ...updates } : p
      ),
    }));
  };

  // Handler: Re-generate penalties manually
  const handleRegeneratePenalties = () => {
    const freshPenalties = generateAutoPenaltyAssignments(
      data.students,
      currentWeek,
      data.scoreLogs,
      [], // Reset existing to force fresh assignment
      data.settings.penaltiesPerGroup || 2
    );
    setData(prev => ({
      ...prev,
      penaltyAssignments: freshPenalties,
    }));
  };

  // Handler: Add Student
  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'avatar'>) => {
    const student: Student = {
      ...newStudent,
      id: `std_${Date.now()}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      students: [...prev.students, student],
    }));
  };

  // Handler: Edit Student
  const handleEditStudent = (studentId: string, updates: Partial<Student>) => {
    setData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, ...updates } : s),
    }));
  };

  // Handler: Delete Student
  const handleDeleteStudent = (studentId: string) => {
    setData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId),
    }));
  };

  // Handler: Delete All Students
  const handleDeleteAllStudents = () => {
    setData(prev => ({
      ...prev,
      students: [],
      scoreLogs: [], // optional: you might want to clear related score logs or keep them
    }));
  };

  // Handler: Import Students
  const handleImportStudents = (newStudents: Omit<Student, 'id' | 'avatar'>[]) => {
    const students: Student[] = newStudents.map((s, idx) => ({
      ...s,
      id: `std_imported_${Date.now()}_${idx}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}_${idx}`,
    }));

    setData(prev => ({
      ...prev,
      students: [...prev.students, ...students], // Append imported students
    }));
  };

  // Handler: Add new rule
  const handleAddRule = (newRule: Omit<RuleCriterion, 'id'>) => {
    const rule: RuleCriterion = {
      ...newRule,
      id: `rule_${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      rules: [rule, ...prev.rules],
    }));
  };

  // Handler: Edit rule
  const handleEditRule = (ruleId: string, updates: Partial<RuleCriterion>) => {
    setData(prev => ({
      ...prev,
      rules: prev.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r),
    }));
  };

  // Handler: Delete rule
  const handleDeleteRule = (ruleId: string) => {
    setData(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== ruleId),
    }));
  };

  const handleSendNotificationSuccess = (penaltyId: string, channel: 'zalo' | 'sms') => {
    handleUpdatePenalty(penaltyId, {
      notifiedZalo: channel === 'zalo' ? true : undefined,
      notifiedSms: channel === 'sms' ? true : undefined,
    });
  };

  // Handler: Save Remark
  const handleSaveRemark = (remark: import('./types').WeeklyRemark) => {
    setData(prev => {
      const exists = prev.remarks?.find(r => r.id === remark.id);
      if (exists) {
        return {
          ...prev,
          remarks: prev.remarks.map(r => r.id === remark.id ? remark : r)
        };
      }
      return {
        ...prev,
        remarks: [...(prev.remarks || []), remark]
      };
    });
  };

  // Handler: Delete Remark
  const handleDeleteRemark = (remarkId: string) => {
    setData(prev => ({
      ...prev,
      remarks: prev.remarks?.filter(r => r.id !== remarkId) || []
    }));
  };

  // Handlers for Resetting Scores
  const handleNextWeek = () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc tuần hiện tại và chuyển sang tuần mới?')) {
      const nextWeek = currentWeek + 1;
      setCurrentWeek(nextWeek);
      setData(prev => ({
        ...prev,
        settings: { ...prev.settings, currentWeek: nextWeek }
      }));
    }
  };

  const handleResetCurrentWeek = () => {
    if (window.confirm('CẢNH BÁO: Xoá tất cả log điểm của tuần hiện tại? Mọi người sẽ trở về 100 điểm.')) {
      setData(prev => ({
        ...prev,
        scoreLogs: prev.scoreLogs.filter(log => log.weekNumber !== currentWeek)
      }));
    }
  };

  const handleResetAllScores = () => {
    if (window.confirm('NGUY HIỂM: Bạn có chắc chắn muốn XOÁ TOÀN BỘ lịch sử chấm điểm từ đầu năm đến giờ?')) {
      if (window.confirm('Xác nhận lần 2: XOÁ TRẮNG ĐIỂM THI ĐUA?')) {
        setData(prev => ({
          ...prev,
          scoreLogs: []
        }));
      }
    }
  };

  const currentWeekPenalties = data.penaltyAssignments.filter(p => p.weekNumber === currentWeek);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white pb-16">

      {/* Top Header Navigation */}
      <Header
        currentRole={currentRole}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        currentWeek={currentWeek}
        onSelectWeek={setCurrentWeek}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenScoringModal={() => setIsScoringModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        penaltiesCount={data.penaltyAssignments.filter(p => p.status === 'pending').length}
        hasApiKey={Boolean(data.settings.geminiApiKey)}
        totalStudents={data.students.length}
        onChangePassword={handleChangePassword}
      />

      {/* Main Body Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1">

        {activeTab === 'dashboard' && (
          <DashboardOverview
            currentWeek={currentWeek}
            studentSummaries={studentSummaries}
            groupSummaries={groupSummaries}
            penaltyAssignments={data.penaltyAssignments}
            recentLogs={data.scoreLogs}
            currentRole={currentRole}
            onNavigateTab={setActiveTab}
            onOpenScoringModal={() => setIsScoringModalOpen(true)}
            onOpenSendNotification={(pen) => setSelectedPenaltyForNotification(pen)}
          />
        )}

        {activeTab === 'rankings' && (
          <WeeklyRankings
            currentWeek={currentWeek}
            studentSummaries={studentSummaries}
            groupSummaries={groupSummaries}
            penaltyAssignments={data.penaltyAssignments}
            scoreLogs={data.scoreLogs}
            remarks={data.remarks || []}
            currentUser={currentUser}
            onOpenSendNotification={(pen) => setSelectedPenaltyForNotification(pen)}
            onOpenStudentHistory={(id) => setSelectedStudentIdForHistory(id)}
            onSaveRemark={handleSaveRemark}
            onDeleteRemark={handleDeleteRemark}
          />
        )}

        {activeTab === 'penalties' && (
          <PenaltyDutyScheduler
            currentWeek={currentWeek}
            penalties={data.penaltyAssignments}
            currentRole={currentRole}
            settings={data.settings}
            onUpdateSettings={(newSettings) => setData(prev => ({ ...prev, settings: newSettings }))}
            onUpdatePenalty={handleUpdatePenalty}
            onRegeneratePenalties={handleRegeneratePenalties}
            onOpenSendNotification={(pen) => setSelectedPenaltyForNotification(pen)}
            onOpenAIAssistantForStudent={(id) => {
              setAiPreselectedStudentId(id);
              setActiveTab('ai');
            }}
          />
        )}

        {activeTab === 'students' && (
          <StudentDirectory
            students={data.students}
            scoreLogs={data.scoreLogs}
            penaltyAssignments={data.penaltyAssignments}
            currentWeek={currentWeek}
            currentRole={currentRole}
            selectedStudentIdForHistory={selectedStudentIdForHistory}
            onCloseHistoryModal={() => setSelectedStudentIdForHistory(null)}
            onOpenStudentHistory={(id) => setSelectedStudentIdForHistory(id)}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onDeleteAllStudents={handleDeleteAllStudents}
            onImportStudents={handleImportStudents}
          />
        )}

        {activeTab === 'rules' && (
          <RulesManager
            rules={data.rules}
            currentRole={currentRole}
            onAddRule={handleAddRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistantTab
            currentWeek={currentWeek}
            students={data.students}
            studentSummaries={studentSummaries}
            groupSummaries={groupSummaries}
            penaltyAssignments={data.penaltyAssignments}
            scoreLogs={data.scoreLogs}
            subjects={data.subjects}
            questions={data.questions}
            preselectedStudentId={aiPreselectedStudentId}
          />
        )}
      </main>

      {/* MODALS */}
      <ScoringModal
        isOpen={isScoringModalOpen}
        onClose={() => setIsScoringModalOpen(false)}
        studentSummaries={studentSummaries}
        rules={data.rules}
        currentWeek={currentWeek}
        currentUser={currentUser}
        onAddScoreLog={handleAddScoreLog}
      />

      <NotificationModal
        isOpen={selectedPenaltyForNotification !== null}
        onClose={() => setSelectedPenaltyForNotification(null)}
        penalty={selectedPenaltyForNotification}
        student={
          selectedPenaltyForNotification
            ? data.students.find(s => s.id === selectedPenaltyForNotification.studentId) || null
            : null
        }
        scoreLogs={data.scoreLogs}
        currentWeek={currentWeek}
        onSendSuccess={handleSendNotificationSuccess}
      />

      <ReportsExporter
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        currentWeek={currentWeek}
        studentSummaries={studentSummaries}
        groupSummaries={groupSummaries}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        data={data}
        currentRole={currentRole}
        onUpdateSettings={(newSettings) => setData(prev => ({ ...prev, settings: newSettings }))}
        onUpdateAccounts={(accounts) => setData(prev => ({ ...prev, accounts }))}
        onRestoreData={(restored) => setData(restored)}
        onNextWeek={handleNextWeek}
        onResetCurrentWeek={handleResetCurrentWeek}
        onResetAllScores={handleResetAllScores}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        isForceMode={!hasApiKey && currentRole === 'gvcn'}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        accounts={data.accounts || []}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026-2027 Lớp 12A10 - THPT Yên Thế. Hệ thống Quản lý Thi đua & Trực nhật Tự động.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Tích hợp Gemini 3.1 Thinking AI • GVCN: Cô Ninh Thị Thu Hà
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
