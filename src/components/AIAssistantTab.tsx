/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, ScoreLogEntry, PenaltyAssignment, QuizSubject, QuizQuestion } from '../types';
import { StudentScoreSummary, GroupScoreSummary } from '../utils/calculations';
import { 
  generateWeeklyEvaluationReport, 
  generateStudentRecoveryPlan, 
  generateAIQuizQuestions, 
  generateParentAlerts,
  callGeminiAI 
} from '../services/geminiService';
import { 
  Sparkles, 
  Brain, 
  FileText, 
  BookOpen, 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Zap,
  MessageSquare,
  Megaphone,
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIAssistantTabProps {
  currentWeek: number;
  students: Student[];
  studentSummaries: StudentScoreSummary[];
  groupSummaries: GroupScoreSummary[];
  penaltyAssignments: PenaltyAssignment[];
  scoreLogs: ScoreLogEntry[];
  subjects: QuizSubject[];
  questions: QuizQuestion[];
  preselectedStudentId?: string | null;
}

export const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  currentWeek,
  students,
  studentSummaries,
  groupSummaries,
  penaltyAssignments,
  scoreLogs,
  subjects,
  questions,
  preselectedStudentId,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'weekly_report' | 'recovery_plan' | 'chat_advisor' | 'smart_quiz' | 'agent_alerts'>('agent_alerts');
  
  // High Thinking Mode Toggle
  const [highThinkingMode, setHighThinkingMode] = useState(true);

  // SubTab 1: Weekly Report
  const [weeklyReport, setWeeklyReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [errorWeeklyReport, setErrorWeeklyReport] = useState<string>('');
  const [copiedReport, setCopiedReport] = useState(false);

  // SubTab 2: Recovery Plan
  const [selectedStudentForRecovery, setSelectedStudentForRecovery] = useState<string>(
    preselectedStudentId || (students[0]?.id || '')
  );
  const [recoveryPlanText, setRecoveryPlanText] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [errorRecoveryPlan, setErrorRecoveryPlan] = useState<string>('');

  // SubTab 3: Interactive Chat Advisor
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string; modelUsed?: string }>>([
    {
      sender: 'ai',
      text: 'Xin chào Thầy Cô và các bạn Ban cán sự lớp 12A10! Em là Trợ lý AI Cố vấn Sư phạm của lớp. Em có thể hỗ trợ phân tích số liệu thi đua, tối ưu lịch trực nhật, soạn nội dung sinh hoạt lớp hoặc giải đáp bài tập THPT. Thầy Cô và các bạn cần em hỗ trợ gì hôm nay?',
      time: 'Vừa xong',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // SubTab 4: Smart Quiz Engine
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub_toan');
  const [quizTopic, setQuizTopic] = useState('');
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<QuizQuestion[]>(questions);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [errorQuiz, setErrorQuiz] = useState<string>('');

  // SubTab 5: Agent Alerts
  const [parentAlerts, setParentAlerts] = useState<Array<{ studentId: string; type: 'khen_thuong' | 'canh_bao'; messageTemplate: string; reason: string }>>([]);
  const [isGeneratingAlerts, setIsGeneratingAlerts] = useState(false);
  const [errorAlerts, setErrorAlerts] = useState<string>('');
  const [copiedAlertId, setCopiedAlertId] = useState<string | null>(null);

  // Handler: Sinh báo cáo tổng kết tuần
  const handleGenerateWeeklyReport = async () => {
    setIsGeneratingReport(true);
    setErrorWeeklyReport('');
    try {
      const report = await generateWeeklyEvaluationReport(
        currentWeek,
        groupSummaries.map(g => ({
          group: g.group,
          totalScore: g.totalScore,
          avgScore: g.avgScore,
          topStudent: g.topStudentName,
          rank: g.rank,
        })),
        penaltyAssignments.filter(p => p.weekNumber === currentWeek),
        scoreLogs.filter(l => l.weekNumber === currentWeek),
        highThinkingMode
      );
      setWeeklyReport(report);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err: any) {
      setErrorWeeklyReport(err.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Handler: Sinh kế hoạch 7 ngày đổi mới bản thân
  const handleGenerateRecoveryPlan = async () => {
    const student = students.find(s => s.id === selectedStudentForRecovery);
    if (!student) return;

    const summary = studentSummaries.find(s => s.student.id === student.id);
    setIsGeneratingPlan(true);
    setErrorRecoveryPlan('');
    try {
      const plan = await generateStudentRecoveryPlan(
        student,
        summary?.totalScore || 90,
        penaltyAssignments.filter(p => p.weekNumber === currentWeek),
        scoreLogs.filter(l => l.studentId === student.id),
        highThinkingMode
      );
      setRecoveryPlanText(plan);
    } catch (err: any) {
      setErrorRecoveryPlan(err.message);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Handler: Gửi tin nhắn trong Chat Advisor
  const handleSendChatMessage = async (presetText?: string) => {
    const query = presetText || inputQuery;
    if (!query.trim()) return;

    const newMsgs = [
      ...chatMessages,
      { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) },
    ];
    setChatMessages(newMsgs);
    if (!presetText) setInputQuery('');
    setIsChatLoading(true);

    try {
      const systemInstruction = `
Bạn là Trợ lý AI Cố vấn Sư phạm đặc biệt của lớp 12A10 trường THPT Yên Thế (niên khóa 2026-2027).
Lớp có 40 học sinh chia đều 4 tổ, GVCN là Cô Ninh Thị Thu Hà, Lớp trưởng là bạn Nguyễn Minh Tuấn.
Bạn am hiểu sâu sắc tâm lý lứa tuổi 12 (chuẩn bị thi tốt nghiệp THPT và đại học), nội quy trường học, các biện pháp kỷ luật tích cực và kiến thức các môn học lớp 12.
Hãy trả lời một cách lịch thiệp, sâu sắc, thực tế, đầy đủ và chuẩn mực bằng tiếng Việt (sử dụng Markdown khi cần).
`;
      const aiResponse = await callGeminiAI({
        prompt: query,
        systemInstruction,
        highThinking: highThinkingMode,
      });

      setChatMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: aiResponse.text,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: aiResponse.modelUsed,
        },
      ]);
    } catch (err: any) {
      setChatMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `[LỖI HỆ THỐNG]\n${err.message}`,
          time: 'Lỗi',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handler: Sinh câu hỏi trắc nghiệm thông minh
  const handleGenerateAIQuiz = async () => {
    const subj = subjects.find(s => s.id === selectedSubjectId);
    if (!subj) return;

    setIsGeneratingQuiz(true);
    setErrorQuiz('');
    try {
      const newQuestions = await generateAIQuizQuestions(
        subj.name,
        quizTopic.trim() || 'Tổng hợp kiến thức trọng tâm',
        3,
        highThinkingMode
      );
      if (newQuestions.length > 0) {
        setCurrentQuizQuestions(newQuestions);
        setUserAnswers({});
        setQuizSubmitted(false);
        confetti({ particleCount: 60, spread: 70 });
      }
    } catch (err: any) {
      setErrorQuiz(err.message);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Handler: Sinh Cảnh báo Phụ huynh
  const handleGenerateAlerts = async () => {
    setIsGeneratingAlerts(true);
    setErrorAlerts('');
    try {
      const alerts = await generateParentAlerts(
        students,
        studentSummaries.map(s => ({ student: s.student, totalScore: s.totalScore })),
        penaltyAssignments,
        currentWeek,
        highThinkingMode
      );
      setParentAlerts(alerts);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err: any) {
      setErrorAlerts(err.message);
    } finally {
      setIsGeneratingAlerts(false);
    }
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateQuizScore = () => {
    let correct = 0;
    currentQuizQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    return { correct, total: currentQuizQuestions.length };
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Thinking Mode Status */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-500/15">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Gemini AI Sư Phạm & Cố Vấn 12A10
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trung Tâm Trí Tuệ Nhân Tạo & Báo Cáo
            </h2>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              Hỗ trợ tự động hóa báo cáo tuần, phân tích tâm lý nề nếp học sinh, soạn tin nhắn phụ huynh và luyện thi thông minh.
            </p>
          </div>

          {/* Thinking Mode Switcher Badge */}
          <div className="flex items-center bg-black/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 gap-3">
            <div className="flex items-center gap-2">
              <Brain className={`w-5 h-5 ${highThinkingMode ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-bold leading-tight">Chế Độ Tư Duy Sâu (Thinking Mode)</div>
                <div className="text-[10px] text-purple-200">Model: gemini-3.1-pro-preview • HIGH</div>
              </div>
            </div>

            <button
              onClick={() => setHighThinkingMode(!highThinkingMode)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                highThinkingMode ? 'bg-amber-400' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  highThinkingMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex bg-white dark:bg-slate-900/90 rounded-2xl p-1.5 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto gap-1 text-xs sm:text-sm font-bold transition-colors duration-200">
        <button
          onClick={() => setActiveSubTab('weekly_report')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'weekly_report'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Báo Cáo Tổng Kết Tuần (GVCN)
        </button>

        <button
          onClick={() => setActiveSubTab('recovery_plan')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'recovery_plan'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          Kế Hoạch 7 Ngày Tự Giác
        </button>

        <button
          onClick={() => setActiveSubTab('agent_alerts')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'agent_alerts'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Cảnh Báo Phụ Huynh (AI Agent)
        </button>

        <button
          onClick={() => setActiveSubTab('chat_advisor')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'chat_advisor'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Trò Chuyện Cố Vấn 12A10
        </button>

        <button
          onClick={() => setActiveSubTab('smart_quiz')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'smart_quiz'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Ôn Tập & Luyện Thi THPT
        </button>
      </div>

      {/* ================= TAB 1: WEEKLY REPORT ================= */}
      {activeSubTab === 'weekly_report' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg sm:text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Báo Cáo Đánh Giá Thi Đua & Nề Nếp Tuần {currentWeek}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tự động tổng hợp số liệu 4 tổ, phân tích điểm sáng, tồn tại và phổ biến danh sách trực nhật phạt cho tiết Sinh hoạt lớp.
              </p>
            </div>

            <button
              onClick={handleGenerateWeeklyReport}
              disabled={isGeneratingReport}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Gemini Đang Suy Nghĩ & Viết...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Tạo Báo Cáo Sinh Hoạt Lớp (AI)
                </>
              )}
            </button>
          </div>

          {weeklyReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Nội dung báo cáo chi tiết:
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(weeklyReport);
                    setCopiedReport(true);
                    setTimeout(() => setCopiedReport(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-transparent dark:border-slate-700"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedReport ? 'Đã sao chép!' : 'Sao chép nội dung'}
                </button>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {weeklyReport}
              </div>
            </div>
          ) : errorWeeklyReport ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              <h4 className="font-bold text-rose-700 dark:text-rose-400 text-sm mb-1">[LỖI HỆ THỐNG] Đã dừng do lỗi</h4>
              <p className="text-xs text-rose-600 dark:text-rose-300 font-mono">{errorWeeklyReport}</p>
            </div>
          ) : (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Chưa tạo báo cáo cho tuần {currentWeek}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Bấm vào nút "Tạo Báo Cáo Sinh Hoạt Lớp (AI)" ở trên. Gemini sẽ phân tích toàn bộ điểm số của 40 học sinh, xếp hạng 4 tổ và danh sách trực nhật phạt để tạo báo cáo hoàn chỉnh.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: RECOVERY PLAN ================= */}
      {activeSubTab === 'recovery_plan' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg sm:text-xl flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Lộ Trình 7 Ngày Đổi Mới & Khắc Phục Lỗi Vi Phạm
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tạo kế hoạch hành động cụ thể để giúp học sinh bị phạt trực nhật cải thiện nề nếp và lấy lại điểm số.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Chọn học sinh cần rèn luyện:
              </label>
              <select
                value={selectedStudentForRecovery}
                onChange={(e) => setSelectedStudentForRecovery(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {students.map((s) => {
                  const pen = penaltyAssignments.find(p => p.studentId === s.id && p.weekNumber === currentWeek);
                  return (
                    <option key={s.id} value={s.id} className="dark:bg-slate-800">
                      {s.name} ({s.code} - Tổ {s.group}) {pen ? '⚠️ [Trực nhật phạt]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateRecoveryPlan}
                disabled={isGeneratingPlan}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {isGeneratingPlan ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
                Tạo Lộ Trình 7 Ngày (AI)
              </button>
            </div>
          </div>

          {errorRecoveryPlan && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              <h4 className="font-bold text-rose-700 dark:text-rose-400 text-sm mb-1">[LỖI HỆ THỐNG] Đã dừng do lỗi</h4>
              <p className="text-xs text-rose-600 dark:text-rose-300 font-mono">{errorRecoveryPlan}</p>
            </div>
          )}

          {recoveryPlanText && (
            <div className="p-6 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {recoveryPlanText}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: CHAT ADVISOR ================= */}
      {activeSubTab === 'chat_advisor' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  Cố Vấn Sư Phạm Lớp 12A10 (Gemini AI)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hỏi đáp trực tiếp về nề nếp, kỷ luật tích cực, tâm lý học sinh lớp 12 và kiến thức học tập
                </p>
              </div>
            </div>

            {highThinkingMode && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                <Brain className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Thinking Mode Active
              </span>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'Làm thế nào để giảm vi phạm đi muộn ở Tổ 3?',
              'Gợi ý quy trình trực nhật vệ sinh 10 phút nhanh sạch',
              'Kế hoạch ôn thi THPT 3 tháng cuối cho học sinh trung bình',
              'Soạn lời chúc mừng sinh nhật ấm áp cho thành viên 12A10',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChatMessage(chip)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-700 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                💡 {chip}
              </button>
            ))}
          </div>

          {/* Chat Stream Window */}
          <div className="h-96 overflow-y-auto p-4 bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : msg.text.includes('[LỖI HỆ THỐNG]')
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-medium rounded-tl-none shadow-2xs'
                      : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-2xs'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {msg.time} {msg.modelUsed ? `• ${msg.modelUsed}` : ''}
                  </div>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300 font-semibold p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Gemini đang suy luận chi tiết câu trả lời...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi hoặc yêu cầu cho Trợ lý AI..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputQuery.trim()}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              Gửi
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 4: SMART QUIZ ================= */}
      {activeSubTab === 'smart_quiz' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg sm:text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Luyện Thi Trắc Nghiệm & Ôn Tập THPT Quốc Gia
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Luyện đề tương tác các môn học lớp 12 và Nội quy trường THPT Yên Thế kèm giải thích chi tiết.
              </p>
            </div>

            {/* Subject Selector */}
            <div className="flex flex-wrap gap-2">
              {subjects.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSubjectId === sub.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Question Generator Controls */}
          <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:flex-1">
              <input
                type="text"
                placeholder="Nhập chủ đề muốn sinh câu hỏi mới (vd: Cực trị hàm số, Sóng ánh sáng, Vợ chồng A Phủ...)"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleGenerateAIQuiz}
              disabled={isGeneratingQuiz}
              className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              {isGeneratingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              AI Tạo Đề Mới
            </button>
          </div>

          {errorQuiz && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              <h4 className="font-bold text-rose-700 dark:text-rose-400 text-sm mb-1">[LỖI HỆ THỐNG] Đã dừng do lỗi</h4>
              <p className="text-xs text-rose-600 dark:text-rose-300 font-mono">{errorQuiz}</p>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            {currentQuizQuestions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                      Câu {qIndex + 1}: {q.content}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 uppercase shrink-0 border border-transparent dark:border-blue-800">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedOpt === optIndex;
                      const isOptionCorrect = optIndex === q.correctAnswer;

                      let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600';
                      if (quizSubmitted) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-400';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-300';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-300 ring-2 ring-blue-400';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, optIndex)}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                            {['A', 'B', 'C', 'D'][optIndex]}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        )}
                        Giải thích:
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {quizSubmitted ? (
              <div className="flex items-center gap-3">
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Kết quả: {calculateQuizScore().correct} / {calculateQuizScore().total} câu đúng
                </div>
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-transparent dark:border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Làm lại
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setQuizSubmitted(true);
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer ml-auto"
              >
                Nộp Bài & Xem Điểm
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 5: AGENT ALERTS ================= */}
      {activeSubTab === 'agent_alerts' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg sm:text-xl flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-rose-500" />
                Hệ Thống Phân Tích & Cảnh Báo Phụ Huynh
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                AI Agent sẽ tự động rà soát điểm số và vi phạm, tìm ra học sinh cần chú ý và soạn sẵn tin nhắn gửi Zalo/SMS cho phụ huynh.
              </p>
            </div>

            <button
              onClick={handleGenerateAlerts}
              disabled={isGeneratingAlerts}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              {isGeneratingAlerts ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Đang quét dữ liệu...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Phân Tích Lớp Học
                </>
              )}
            </button>
          </div>

          {errorAlerts && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              <h4 className="font-bold text-rose-700 dark:text-rose-400 text-sm mb-1">[LỖI HỆ THỐNG] Đã dừng do lỗi</h4>
              <p className="text-xs text-rose-600 dark:text-rose-300 font-mono">{errorAlerts}</p>
            </div>
          )}

          {parentAlerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parentAlerts.map((alert, idx) => {
                const student = students.find(s => s.id === alert.studentId);
                const isWarning = alert.type === 'canh_bao';
                return (
                  <div key={idx} className={`p-5 rounded-2xl border ${isWarning ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60' : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'} flex flex-col justify-between`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${isWarning ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                            {isWarning ? <AlertTriangle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                            {isWarning ? 'Cảnh Báo Kỷ Luật' : 'Tuyên Dương'}
                          </div>
                          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{student?.name}</h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Lý do: {alert.reason}</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/50 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {alert.messageTemplate}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(alert.messageTemplate);
                        setCopiedAlertId(alert.studentId);
                        setTimeout(() => setCopiedAlertId(null), 2000);
                      }}
                      className={`mt-4 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        copiedAlertId === alert.studentId
                          ? 'bg-emerald-500 text-white'
                          : isWarning
                          ? 'bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {copiedAlertId === alert.studentId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedAlertId === alert.studentId ? 'Đã sao chép tin nhắn' : 'Copy tin nhắn gửi Zalo'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : !isGeneratingAlerts && !errorAlerts ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto">
                <Megaphone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Chưa có dữ liệu cảnh báo</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Hãy bấm "Phân Tích Lớp Học" để AI tự động quét điểm số, vi phạm và đưa ra các đề xuất tin nhắn gửi phụ huynh.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AIAssistantTab;
