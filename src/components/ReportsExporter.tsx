/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FullAppData, UserRole } from '../types';
import { StudentScoreSummary, GroupScoreSummary } from '../utils/calculations';
import { exportToExcel } from '../utils/storage';
import { exportToWord, exportToPowerPoint } from '../utils/exportHelpers';
import { 
  FileSpreadsheet, 
  Printer, 
  Download,
  Calendar,
  Award,
  CheckCircle,
  X,
  School,
  Sparkles,
  Presentation,
  FileText
} from 'lucide-react';

interface ReportsExporterProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullAppData;
  currentWeek: number;
  studentSummaries: StudentScoreSummary[];
  groupSummaries: GroupScoreSummary[];
}

export const ReportsExporter: React.FC<ReportsExporterProps> = ({
  isOpen,
  onClose,
  data,
  currentWeek,
  studentSummaries,
  groupSummaries,
}) => {
  if (!isOpen) return null;

  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const weekPenalties = data.penaltyAssignments.filter(p => p.weekNumber === selectedWeek);
  const topStudents = [...studentSummaries].sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
  const topGroup = [...groupSummaries].sort((a, b) => b.totalScore - a.totalScore)[0];

  const handleExportExcel = () => {
    exportToExcel(data, selectedWeek);
  };

  const handleExportWord = async () => {
    await exportToWord(data, selectedWeek, studentSummaries, groupSummaries);
  };

  const handleExportPPT = async () => {
    await exportToPowerPoint(data, selectedWeek, studentSummaries, groupSummaries);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                Xuất Báo Cáo & Thống Kê Thi Đua
              </h3>
              <p className="text-xs text-slate-400">
                Lớp 12A10 - THPT Yên Thế (Niên khóa 2026-2027)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Word
            </button>
            <button
              onClick={handleExportPPT}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              Slide PPT
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              In Báo Cáo
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Formal Vietnamese Document View */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-50 text-slate-900 font-sans print:p-0 print:bg-white">
          
          {/* Week Selector bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs print:hidden">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Chọn tuần báo cáo:</span>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="bg-slate-100 font-bold text-xs rounded-lg p-1.5 border border-slate-300"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(w => (
                  <option key={w} value={w}>Tuần {w}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500 italic">
              Định dạng chuẩn trình bày cho Tiết Sinh Hoạt Lớp Thứ 7
            </span>
          </div>

          {/* Document Sheet */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none">
            
            {/* Header: School and Class Name */}
            <div className="flex justify-between items-start text-center border-b pb-4 border-slate-200">
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">SỞ GD&ĐT BẮC GIANG</div>
                <div className="text-sm font-extrabold text-slate-900">TRƯỜNG THPT YÊN THẾ</div>
                <div className="text-xs text-slate-500">Lớp 12A10 - Khóa 2024-2027</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="text-xs font-bold text-slate-800">Độc lập - Tự do - Hạnh phúc</div>
                <div className="text-[11px] text-slate-400 italic mt-1">Yên Thế, ngày {new Date().toLocaleDateString('vi-VN')}</div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                BẢNG TỔNG HỢP THI ĐUA & PHÂN CÔNG TRỰC NHẬT TUẦN {selectedWeek}
              </h2>
              <p className="text-xs text-slate-500">
                (Áp dụng nề nếp kỷ cương & rèn luyện tự giác lớp 12A10)
              </p>
            </div>

            {/* 1. Xếp hạng 4 tổ */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                I. BẢNG TỔNG HỢP XẾP HẠNG 4 TỔ
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2 border border-slate-200 text-center w-12">Hạng</th>
                      <th className="p-2 border border-slate-200">Tổ</th>
                      <th className="p-2 border border-slate-200 text-center">Sĩ số</th>
                      <th className="p-2 border border-slate-200 text-center">Điểm Trung Bình</th>
                      <th className="p-2 border border-slate-200 text-center">Tổng Điểm</th>
                      <th className="p-2 border border-slate-200">Học sinh xuất sắc nhất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupSummaries.map((g) => (
                      <tr key={g.group} className="hover:bg-slate-50">
                        <td className="p-2 border border-slate-200 text-center font-bold">#{g.rank}</td>
                        <td className="p-2 border border-slate-200 font-semibold">Tổ {g.group}</td>
                        <td className="p-2 border border-slate-200 text-center">{g.studentCount}</td>
                        <td className="p-2 border border-slate-200 text-center font-bold text-blue-600">{g.avgScore.toFixed(1)}đ</td>
                        <td className="p-2 border border-slate-200 text-center font-semibold">{g.totalScore.toFixed(1)}đ</td>
                        <td className="p-2 border border-slate-200">{g.topStudentName} ({g.topStudentScore}đ)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Top 5 Học sinh xuất sắc */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                II. TUYÊN DƯƠNG TOP 5 HỌC SINH XUẤT SẮC TUẦN
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {topStudents.map((s, idx) => (
                  <div key={s.student.id} className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-center">
                    <div className="font-bold text-emerald-900 truncate">#{idx + 1}. {s.student.name}</div>
                    <div className="text-[11px] text-emerald-700">Tổ {s.student.group} • {s.totalScore}đ</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Danh sách 8 học sinh trực nhật phạt */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                III. DANH SÁCH PHÂN CÔNG TRỰC NHẬT PHẠT (2 bạn/tổ)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead className="bg-amber-50 text-amber-900 font-bold">
                    <tr>
                      <th className="p-2 border border-slate-200 text-center w-10">STT</th>
                      <th className="p-2 border border-slate-200">Học sinh</th>
                      <th className="p-2 border border-slate-200 text-center">Tổ</th>
                      <th className="p-2 border border-slate-200 text-center">Điểm tuần</th>
                      <th className="p-2 border border-slate-200 text-center">Ngày trực nhật</th>
                      <th className="p-2 border border-slate-200">Nhiệm vụ phân công</th>
                      <th className="p-2 border border-slate-200 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekPenalties.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-2 border border-slate-200 text-center">{idx + 1}</td>
                        <td className="p-2 border border-slate-200 font-semibold">{p.studentName}</td>
                        <td className="p-2 border border-slate-200 text-center">Tổ {p.group}</td>
                        <td className="p-2 border border-slate-200 text-center font-bold text-rose-600">{p.totalScore}đ</td>
                        <td className="p-2 border border-slate-200 text-center font-bold text-slate-800">{p.dutyDay}</td>
                        <td className="p-2 border border-slate-200 text-[11px]">{p.dutyTask}</td>
                        <td className="p-2 border border-slate-200 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status === 'completed' ? 'Đã làm' : 'Chưa làm'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-8 grid grid-cols-3 text-center text-xs gap-4">
              <div>
                <div className="font-bold text-slate-800">LỚP TRƯỞNG</div>
                <div className="text-slate-400 italic text-[10px] mt-0.5">(Ký và ghi rõ họ tên)</div>
                <div className="mt-12 font-bold text-slate-900">Nguyễn Minh Tuấn</div>
              </div>

              <div>
                <div className="font-bold text-slate-800">BÍ THƯ CHI ĐOÀN</div>
                <div className="text-slate-400 italic text-[10px] mt-0.5">(Ký và ghi rõ họ tên)</div>
                <div className="mt-12 font-bold text-slate-900">Lê Thu Trang</div>
              </div>

              <div>
                <div className="font-bold text-slate-800">GIÁO VIÊN CHỦ NHIỆM</div>
                <div className="text-slate-400 italic text-[10px] mt-0.5">(Ký và duyệt)</div>
                <div className="mt-12 font-bold text-slate-900">Cô Ninh Thị Thu Hà</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
