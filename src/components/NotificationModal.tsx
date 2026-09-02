/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PenaltyAssignment, Student, ScoreLogEntry } from '../types';
import { generateParentMessage } from '../services/geminiService';
import { 
  X, 
  Send, 
  Copy, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Loader2
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  penalty: PenaltyAssignment | null;
  student: Student | null;
  scoreLogs: ScoreLogEntry[];
  currentWeek: number;
  onSendSuccess: (penaltyId: string, channel: 'zalo' | 'sms') => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  penalty,
  student,
  scoreLogs,
  currentWeek,
  onSendSuccess,
}) => {
  if (!isOpen || !penalty || !student) return null;

  const [channel, setChannel] = useState<'zalo' | 'sms'>('zalo');
  const [copied, setCopied] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Default Template
  const defaultMessage = `[THÔNG BÁO THI ĐUA 12A10 - THPT YÊN THẾ]
Kính gửi Bác ${student.parentName} (Phụ huynh em ${student.name} - Tổ ${student.group}),
GVCN lớp 12A10 xin trân trọng thông báo kết quả nề nếp thi đua Tuần ${currentWeek}:
- Tổng điểm thi đua tuần: ${penalty.totalScore}/100 điểm.
- Ghi nhận vi phạm: ${penalty.note || 'Cần chú ý nề nếp và bài vở'}.
- Biện pháp rèn luyện: Em được phân công trực nhật tăng cường vào ${penalty.dutyDay} (Nhiệm vụ: ${penalty.dutyTask}).

Kính mong Quý phụ huynh phối hợp cùng nhà trường và ban cán sự nhắc nhở em hoàn thành tốt nhiệm vụ, nâng cao tính tự giác trước thềm năm học mới.
Trân trọng cảm ơn Bác!
GVCN: Cô Ninh Thị Thu Hà (0982984057)`;

  const [messageContent, setMessageContent] = useState(defaultMessage);

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const aiText = await generateParentMessage(
        student,
        penalty.totalScore,
        currentWeek,
        [penalty],
        scoreLogs
      );
      setMessageContent(aiText);
    } catch (err: any) {
      alert('Lỗi AI: ' + (err.message || 'Không thể tạo tin nhắn'));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    onSendSuccess(penalty.id, channel);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                Gửi Thông Báo Thi Đua & Trực Nhật
              </h3>
              <p className="text-xs text-blue-100">
                Gửi đến: Bác <span className="font-bold text-white">{student.parentName}</span> ({student.parentPhone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Target Info card */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-amber-900 dark:text-amber-200">
                Học sinh: {student.name} ({student.code}) - Tổ {student.group}
              </div>
              <div className="text-amber-700 dark:text-amber-400 mt-0.5">
                Điểm tuần: <span className="font-bold text-rose-600 dark:text-rose-400">{penalty.totalScore}đ</span> • Trực nhật: <span className="font-bold text-slate-900 dark:text-slate-100">{penalty.dutyDay}</span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-md bg-amber-200 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold text-[10px] border border-transparent dark:border-amber-700">
              Trực nhật phạt
            </span>
          </div>

          {/* Channel selector & AI assist */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors">
              <button
                type="button"
                onClick={() => setChannel('zalo')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  channel === 'zalo' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Zalo Thông Báo
              </button>
              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  channel === 'sms' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Tin Nhắn SMS
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isGeneratingAI ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600 dark:text-purple-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              )}
              AI Soạn Lời Nhắn
            </button>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nội Dung Tin Nhắn Gửi Phụ Huynh:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã sao chép!' : 'Sao chép'}
              </button>
            </div>
            <textarea
              rows={8}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Success message banner */}
          {sentSuccess && (
            <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              Đã gửi thông báo thành công qua hệ thống {channel.toUpperCase()}!
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Xác Nhận Gửi {channel.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
