/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Student, ScoreLogEntry, PenaltyAssignment, UserRole } from '../types';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  History, 
  UserPlus, 
  Filter,
  ShieldCheck,
  ChevronRight,
  X,
  PlusCircle,
  Edit2,
  Trash2,
  BookOpen,
  Download
} from 'lucide-react';
import { downloadSampleExcel } from '../utils/excelImport';

interface StudentDirectoryProps {
  students: Student[];
  scoreLogs: ScoreLogEntry[];
  penaltyAssignments: PenaltyAssignment[];
  currentWeek: number;
  currentRole: UserRole;
  selectedStudentIdForHistory: string | null;
  onCloseHistoryModal: () => void;
  onOpenStudentHistory: (studentId: string) => void;
  onAddStudent: (student: Omit<Student, 'id' | 'avatar'>) => void;
  onEditStudent: (studentId: string, updates: Partial<Student>) => void;
  onDeleteStudent: (studentId: string) => void;
  onDeleteAllStudents: () => void;
  onImportStudents: (students: Omit<Student, 'id' | 'avatar'>[]) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  scoreLogs,
  penaltyAssignments,
  currentWeek,
  currentRole,
  selectedStudentIdForHistory,
  onCloseHistoryModal,
  onOpenStudentHistory,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onDeleteAllStudents,
  onImportStudents,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploadStudentId, setAvatarUploadStudentId] = useState<string | null>(null);
  
  // State for Add/Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'avatar'>>({
    code: '',
    phone: '',
    name: '',
    group: 1,
    roleInClass: 'Học sinh',
    parentName: '',
    parentPhone: '',
    address: '',
    gender: 'Nam',
  });

  const filteredStudents = students.filter(s => {
    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                        s.code.toLowerCase().includes(search.toLowerCase()) ||
                        s.parentName.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  const activeHistoryStudent = students.find(s => s.id === selectedStudentIdForHistory);
  const studentLogs = activeHistoryStudent
    ? scoreLogs.filter(l => l.studentId === activeHistoryStudent.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];
  const studentPenalties = activeHistoryStudent
    ? penaltyAssignments.filter(p => p.studentId === activeHistoryStudent.id)
    : [];

  const handleOpenForm = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        code: student.code,
        phone: student.phone || '',
        name: student.name,
        group: student.group,
        roleInClass: student.roleInClass,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        address: student.address || '',
        gender: student.gender,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        code: '',
        phone: '',
        name: '',
        group: 1,
        roleInClass: 'Học sinh',
        parentName: '',
        parentPhone: '',
        address: '',
        gender: 'Nam',
      });
    }
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onEditStudent(editingStudent.id, formData);
    } else {
      onAddStudent(formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá học sinh này? Tất cả dữ liệu điểm thi đua liên quan cũng có thể bị mồ côi.')) {
      onDeleteStudent(studentId);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn xoá TOÀN BỘ học sinh trong lớp? Thao tác này không thể hoàn tác!')) {
      if (window.confirm('Xác nhận lần 2: Xoá tất cả học sinh?')) {
        onDeleteAllStudents();
      }
    }
  };

  const canEditAvatar = (studentGroup: number) => {
    if (currentRole === 'gvcn' || currentRole === 'lop_truong') return true;
    if (currentRole === 'to_truong_1' && studentGroup === 1) return true;
    if (currentRole === 'to_truong_2' && studentGroup === 2) return true;
    if (currentRole === 'to_truong_3' && studentGroup === 3) return true;
    if (currentRole === 'to_truong_4' && studentGroup === 4) return true;
    return false;
  };

  const handleUpdateAvatarClick = (studentId: string) => {
    if (window.confirm('Bạn muốn chọn ảnh từ thiết bị để thay thế ảnh đại diện?')) {
      setAvatarUploadStudentId(studentId);
      fileInputRef.current?.click();
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !avatarUploadStudentId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onEditStudent(avatarUploadStudentId, { avatar: compressedDataUrl });
        setAvatarUploadStudentId(null);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { parseStudentsFromExcel } = await import('../utils/excelImport');
      const parsedStudents = await parseStudentsFromExcel(file);
      if (parsedStudents.length > 0) {
        onImportStudents(parsedStudents);
        alert(`Đã import thành công ${parsedStudents.length} học sinh!`);
      } else {
        alert('Không tìm thấy dữ liệu học sinh hợp lệ trong file Excel.');
      }
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng file.');
    } finally {
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Danh Sách Học Sinh 12A10 ({students.length} Thành Viên)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sĩ số: {students.length} học sinh • Phân bổ đồng đều vào 4 tổ
          </p>
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
          {(currentRole === 'gvcn' || currentRole === 'lop_truong') && (
            <>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                Xoá Tất Cả
              </button>
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0">
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                <BookOpen className="w-4 h-4" />
                Nhập từ Excel
              </label>
              <button
                onClick={downloadSampleExcel}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 border border-slate-200"
                title="Tải file Excel mẫu"
              >
                <Download className="w-4 h-4" />
                Tải File Mẫu
              </button>
              <button
                onClick={() => handleOpenForm()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Thêm Học Sinh
              </button>
            </>
          )}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedGroup === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Tất cả ({students.length})
            </button>
            {[1, 2, 3, 4].map(g => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedGroup === g ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Tổ {g} ({students.filter(s => s.group === g).length})
              </button>
            ))}
          </div>

          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã HS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleAvatarFileChange} 
        className="hidden" 
      />

      {/* 40 Students Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStudents.map((std) => {
          const weekLogs = scoreLogs.filter(l => l.studentId === std.id && l.weekNumber === currentWeek);
          const totalPoints = 100 + weekLogs.reduce((s, l) => s + l.points, 0);

          return (
            <div
              key={std.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="relative group/avatar shrink-0" 
                  onClick={() => canEditAvatar(std.group) && handleUpdateAvatarClick(std.id)}
                  title={canEditAvatar(std.group) ? "Nhấn để đổi ảnh đại diện (Tải lên từ thiết bị)" : ""}
                  style={{ cursor: canEditAvatar(std.group) ? 'pointer' : 'default' }}
                >
                  <img
                    src={std.avatar}
                    alt={std.name}
                    className={`w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 transition-all ${canEditAvatar(std.group) ? 'group-hover/avatar:brightness-50 group-hover:scale-105' : 'group-hover:scale-105'}`}
                  />
                  {canEditAvatar(std.group) && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Edit2 className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between">
                    {(currentRole === 'gvcn' || currentRole === 'lop_truong') ? (
                      <select
                        value={std.group}
                        onChange={(e) => onEditStudent(std.id, { group: Number(e.target.value) })}
                        className="text-[10px] font-bold px-1 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 outline-none cursor-pointer hover:bg-blue-100 transition-colors"
                        title="Chuyển tổ"
                      >
                        {[1, 2, 3, 4].map(g => (
                          <option key={g} value={g}>Tổ {g}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        Tổ {std.group}
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold text-slate-500">{std.phone || std.parentPhone || std.code}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">{std.name}</h4>
                  <p className="text-xs text-blue-600 font-medium truncate">{std.roleInClass}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Điểm tuần {currentWeek}:</span>
                  <span className={`font-black ${
                    totalPoints >= 105 ? 'text-emerald-600' : totalPoints < 95 ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {totalPoints}đ
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate">Phụ huynh:</span>
                  <span className="font-medium text-slate-700 truncate">{std.parentName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">SĐT:</span>
                  <a href={`tel:${std.parentPhone}`} className="text-blue-600 hover:underline font-mono">
                    {std.parentPhone}
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onOpenStudentHistory(std.id)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  Xem Hồ Sơ
                </button>
                {(currentRole === 'gvcn' || currentRole === 'lop_truong') && (
                  <>
                    <button
                      onClick={() => handleOpenForm(std)}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 font-semibold border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                      title="Sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(std.id)}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 font-semibold border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* STUDENT HISTORY MODAL */}
      {activeHistoryStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeHistoryStudent.avatar}
                  alt={activeHistoryStudent.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40"
                />
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {activeHistoryStudent.name} ({activeHistoryStudent.phone || activeHistoryStudent.parentPhone || activeHistoryStudent.code})
                  </h3>
                  <div className="text-xs text-blue-100 mt-1 space-y-0.5">
                    <p>
                      Tổ {activeHistoryStudent.group} • {activeHistoryStudent.roleInClass} • Phụ huynh: {activeHistoryStudent.parentName} ({activeHistoryStudent.parentPhone})
                    </p>
                    {activeHistoryStudent.address && (
                      <p>Địa chỉ: {activeHistoryStudent.address}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onCloseHistoryModal}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              
              {/* Penalty History (if any) */}
              {studentPenalties.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    Lịch Sử Trực Nhật Phạt
                  </h4>
                  <div className="space-y-2">
                    {studentPenalties.map((pen) => (
                      <div
                        key={pen.id}
                        className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-amber-900">
                            Tuần {pen.weekNumber}: {pen.dutyDay} - {pen.dutyTask}
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">Lý do: {pen.note}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          pen.status === 'completed' ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {pen.status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Timeline of Score Logs */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  Nhật Ký Điểm Cộng / Trừ Toàn Năm
                </h4>

                {studentLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Chưa có nhật ký ghi nhận vi phạm hay cộng điểm nào.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {studentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between text-xs gap-3"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            [Tuần {log.weekNumber}] {log.criterionName}
                          </div>
                          {log.note && <p className="text-slate-600 text-[11px] mt-0.5">{log.note}</p>}
                          <p className="text-[10px] text-slate-400 mt-1">
                            Ghi nhận bởi: {log.recordedBy} • {new Date(log.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>

                        <span className={`font-black text-xs px-2 py-1 rounded-xl shrink-0 ${
                          log.points > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {log.points > 0 ? `+${log.points}` : log.points} đ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={onCloseHistoryModal}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT ADD/EDIT FORM MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                {editingStudent ? <Edit2 className="w-5 h-5 text-amber-500" /> : <UserPlus className="w-5 h-5 text-emerald-500" />}
                {editingStudent ? 'Sửa Thông Tin Học Sinh' : 'Thêm Học Sinh Mới'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mã Học Sinh</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: 12A10-01"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Họ và Tên</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Số Điện Thoại Học Sinh (Nơi chữ HS-MỚI hiển thị)</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: 0912345678"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tổ</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4].map(g => <option key={g} value={g}>Tổ {g}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Chức vụ</label>
                  <input
                    type="text"
                    value={formData.roleInClass}
                    onChange={(e) => setFormData({ ...formData, roleInClass: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: Học sinh"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên Phụ Huynh</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ông/Bà..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">SĐT Phụ Huynh</label>
                  <input
                    type="text"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="09..."
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-700">Địa Chỉ Nhà</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Số 123, đường A, phường B..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Cập Nhật' : 'Thêm Học Sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
