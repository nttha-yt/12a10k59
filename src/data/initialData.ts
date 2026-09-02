/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FullAppData, RuleCriterion, Student, UserAccount, Subject, QuizQuestion } from '../types';

export const USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_gvcn',
    name: 'Cô Ninh Thị Thu Hà',
    role: 'gvcn',
    roleTitle: 'Giáo viên Chủ nhiệm',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'nttha.yt@gmail.com',
    phone: '0982984057',
  },
  {
    id: 'usr_lt',
    name: 'Hoàng Minh Tuấn',
    role: 'lop_truong',
    roleTitle: 'Lớp trưởng 12A10',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    studentId: 'std_01',
    phone: '0912 345 678',
  },
  {
    id: 'usr_tt1',
    name: 'Hoàng Gia Huy',
    role: 'to_truong_1',
    roleTitle: 'Tổ trưởng Tổ 1',
    groupNumber: 1,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    studentId: 'std_02',
    phone: '0971 111 222',
  },
  {
    id: 'usr_tt2',
    name: 'Dương Thị Thúy',
    role: 'to_truong_2',
    roleTitle: 'Tổ trưởng Tổ 2',
    groupNumber: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    studentId: 'std_12',
    phone: '0972 222 333',
  },
  {
    id: 'usr_tt3',
    name: 'Nguyễn Triệu Huy',
    role: 'to_truong_3',
    roleTitle: 'Tổ trưởng Tổ 3',
    groupNumber: 3,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    studentId: 'std_22',
    phone: '0973 333 444',
  },
  {
    id: 'usr_tt4',
    name: 'Phạm Thu Hương',
    role: 'to_truong_4',
    roleTitle: 'Tổ trưởng Tổ 4',
    groupNumber: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentId: 'std_32',
    phone: '0974 444 555',
  },
  {
    id: 'usr_hs',
    name: 'Học sinh & Phụ huynh',
    role: 'hoc_sinh',
    roleTitle: 'Học sinh / Phụ huynh (Chế độ xem)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '0900 000 000',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // Tổ 1 (1-10)
  { id: 'std_01', code: '12A10-01', name: 'Hoàng Minh Tuấn', group: 1, roleInClass: 'Lớp trưởng', gender: 'Nam', parentName: 'Hoàng Văn Hùng', parentPhone: '0981112201', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_02', code: '12A10-02', name: 'Nguyễn Văn An', group: 1, roleInClass: 'Tổ trưởng', gender: 'Nam', parentName: 'Nguyễn Văn Thành', parentPhone: '0981112202', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_03', code: '12A10-03', name: 'Đặng Thảo Linh', group: 1, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Đặng Văn Long', parentPhone: '0981112203', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_04', code: '12A10-04', name: 'Bùi Đức Anh', group: 1, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Bùi Quang Đạt', parentPhone: '0981112204', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_05', code: '12A10-05', name: 'Vũ Thu Trang', group: 1, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Vũ Đức Thịnh', parentPhone: '0981112205', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_06', code: '12A10-06', name: 'Phan Quốc Bảo', group: 1, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Phan Văn Hậu', parentPhone: '0981112206', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_07', code: '12A10-07', name: 'Lý Kim Ngân', group: 1, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Lý Văn Hải', parentPhone: '0981112207', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_08', code: '12A10-08', name: 'Ngô Gia Huy', group: 1, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Ngô Trọng Nghĩa', parentPhone: '0981112208', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_09', code: '12A10-09', name: 'Dương Yến Nhi', group: 1, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Dương Văn Tiến', parentPhone: '0981112209', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_10', code: '12A10-10', name: 'Chu Đình Trọng', group: 1, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Chu Văn Khang', parentPhone: '0981112210', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },

  // Tổ 2 (11-20)
  { id: 'std_11', code: '12A10-11', name: 'Nguyễn Thị Bích Ngọc', group: 2, roleInClass: 'Lớp phó học tập', gender: 'Nữ', parentName: 'Nguyễn Văn Bình', parentPhone: '0981112211', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_12', code: '12A10-12', name: 'Trần Thị Mai', group: 2, roleInClass: 'Tổ trưởng', gender: 'Nữ', parentName: 'Trần Đình Trọng', parentPhone: '0981112212', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_13', code: '12A10-13', name: 'Lê Minh Khôi', group: 2, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Lê Văn Cường', parentPhone: '0981112213', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_14', code: '12A10-14', name: 'Tạ Hoàng Oanh', group: 2, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Tạ Văn Tân', parentPhone: '0981112214', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_15', code: '12A10-15', name: 'Đỗ Hữu Phước', group: 2, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Đỗ Văn Sơn', parentPhone: '0981112215', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_16', code: '12A10-16', name: 'Hoàng Khánh Ly', group: 2, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Hoàng Văn Thái', parentPhone: '0981112216', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_17', code: '12A10-17', name: 'Vương Đình Tùng', group: 2, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Vương Văn Hiếu', parentPhone: '0981112217', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_18', code: '12A10-18', name: 'Lâm Thanh Hằng', group: 2, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Lâm Văn Khoa', parentPhone: '0981112218', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_19', code: '12A10-19', name: 'Cao Văn Việt', group: 2, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Cao Đình Nam', parentPhone: '0981112219', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_20', code: '12A10-20', name: 'Phùng Diễm My', group: 2, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Phùng Văn Đức', parentPhone: '0981112220', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },

  // Tổ 3 (21-30)
  { id: 'std_21', code: '12A10-21', name: 'Trịnh Hoài Phương', group: 3, roleInClass: 'Bí thư', gender: 'Nữ', parentName: 'Trịnh Quốc Bảo', parentPhone: '0981112221', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_22', code: '12A10-22', name: 'Lê Hoàng Nam', group: 3, roleInClass: 'Tổ trưởng', gender: 'Nam', parentName: 'Lê Trọng Tấn', parentPhone: '0981112222', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_23', code: '12A10-23', name: 'Phạm Minh Châu', group: 3, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Phạm Văn Hạnh', parentPhone: '0981112223', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_24', code: '12A10-24', name: 'Đoàn Quang Khải', group: 3, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Đoàn Văn Minh', parentPhone: '0981112224', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_25', code: '12A10-25', name: 'Hà Bảo Trâm', group: 3, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Hà Văn Quang', parentPhone: '0981112225', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_26', code: '12A10-26', name: 'Mai Thế Vinh', group: 3, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Mai Văn Dũng', parentPhone: '0981112226', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_27', code: '12A10-27', name: 'Đinh Lan Hương', group: 3, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Đinh Văn Hải', parentPhone: '0981112227', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_28', code: '12A10-28', name: 'Tạ Quốc Tuấn', group: 3, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Tạ Văn Quyết', parentPhone: '0981112228', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_29', code: '12A10-29', name: 'Vũ Cẩm Ly', group: 3, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Vũ Văn Bình', parentPhone: '0981112229', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_30', code: '12A10-30', name: 'Bùi Gia Khiêm', group: 3, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Bùi Văn Hùng', parentPhone: '0981112230', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },

  // Tổ 4 (31-40)
  { id: 'std_31', code: '12A10-31', name: 'Trần Đăng Khoa', group: 4, roleInClass: 'Lớp phó phong trào', gender: 'Nam', parentName: 'Trần Văn Thiện', parentPhone: '0981112231', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_32', code: '12A10-32', name: 'Phạm Quỳnh Chi', group: 4, roleInClass: 'Tổ trưởng', gender: 'Nữ', parentName: 'Phạm Văn Lâm', parentPhone: '0981112232', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_33', code: '12A10-33', name: 'Nguyễn Tiến Đạt', group: 4, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Nguyễn Văn Tuấn', parentPhone: '0981112233', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_34', code: '12A10-34', name: 'Lương Ánh Dương', group: 4, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Lương Văn Thái', parentPhone: '0981112234', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_35', code: '12A10-35', name: 'Hồ Sỹ Hoàng', group: 4, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Hồ Văn Toàn', parentPhone: '0981112235', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_36', code: '12A10-36', name: 'Hoàng Ngọc Ánh', group: 4, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Hoàng Văn Sáng', parentPhone: '0981112236', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_37', code: '12A10-37', name: 'Dương Văn Long', group: 4, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Dương Văn Thắng', parentPhone: '0981112237', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_38', code: '12A10-38', name: 'Tạ Minh Thư', group: 4, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Tạ Văn Đức', parentPhone: '0981112238', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_39', code: '12A10-39', name: 'Vũ Đức Thành', group: 4, roleInClass: 'Học sinh', gender: 'Nam', parentName: 'Vũ Văn Việt', parentPhone: '0981112239', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 'std_40', code: '12A10-40', name: 'Ngô Thảo Nguyên', group: 4, roleInClass: 'Học sinh', gender: 'Nữ', parentName: 'Ngô Văn Cường', parentPhone: '0981112240', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
];

export const INITIAL_RULES: RuleCriterion[] = [
  // I. Thực hiện ngày giờ công tại trường
  { id: 'r_1_1', code: '1.1', name: 'Muộn từ 1 đến 5 phút', category: 'ne_nep', points: -6, description: '', icon: 'fa-clock' },
  { id: 'r_1_2', code: '1.2', name: 'Muộn từ 6 đến 10 phút', category: 'ne_nep', points: -8, description: '', icon: 'fa-clock' },
  { id: 'r_1_3', code: '1.3', name: 'Muộn từ 10 đến 15 phút (quá 15p coi như nghỉ KP)', category: 'ne_nep', points: -12, description: '', icon: 'fa-clock' },
  { id: 'r_1_4', code: '1.4', name: 'Nghỉ có phép không bố trí người lao động thay', category: 'ne_nep', points: -4, description: 'trực nhật, trực ban', icon: 'fa-user-slash' },
  { id: 'r_1_5', code: '1.5', name: 'Nghỉ có phép có nhờ người lao động thay', category: 'ne_nep', points: -1, description: 'trực nhật, trực ban, văn nghệ, …', icon: 'fa-user-check' },
  { id: 'r_1_6', code: '1.6', name: 'Làm việc riêng trong giờ học', category: 'ne_nep', points: -8, description: '', icon: 'fa-user-xmark' },
  { id: 'r_1_7', code: '1.7', name: 'Bỏ giờ, nghỉ KP', category: 'ne_nep', points: -20, description: '', icon: 'fa-person-walking-arrow-right' },

  // II. Thực hiện nội quy lớp học
  { id: 'r_2_1', code: '2.1', name: 'Không mặc đúng trang phục quy định', category: 'ne_nep', points: -5, description: 'không đồng phục, dép lê, bò mài, áo hở..', icon: 'fa-shirt' },
  { id: 'r_2_2', code: '2.2', name: 'Không đeo thẻ học sinh', category: 'ne_nep', points: -2, description: '', icon: 'fa-id-badge' },
  { id: 'r_2_3', code: '2.3', name: 'Nhuộm tóc, móng tay dài, trang điểm, HS nam để tóc dài', category: 'ne_nep', points: -2, description: '', icon: 'fa-scissors' },
  { id: 'r_2_4', code: '2.4', name: 'Trực nhật bẩn hoặc giặt giẻ lau muộn', category: 've_sinh', points: -3, description: '', icon: 'fa-broom' },
  { id: 'r_2_5', code: '2.5', name: 'Không trực nhật', category: 've_sinh', points: -10, description: '', icon: 'fa-trash' },
  { id: 'r_2_6', code: '2.6', name: 'Xếp xe không đúng quy định', category: 'ne_nep', points: -2, description: '', icon: 'fa-bicycle' },
  { id: 'r_2_7', code: '2.7', name: 'Đi xe trong sân trường', category: 'ne_nep', points: -2, description: 'các bạn nhìn thấy', icon: 'fa-motorcycle' },
  { id: 'r_2_8', code: '2.8', name: 'Ăn sáng, ăn quà vặt, uống trà sữa trong lớp', category: 'ne_nep', points: -2, description: '', icon: 'fa-burger' },
  { id: 'r_2_9', code: '2.9', name: 'Ăn quà vặt trong giờ có giáo viên đang dạy', category: 'ne_nep', points: -4, description: '', icon: 'fa-cookie-bite' },
  { id: 'r_2_10', code: '2.10', name: 'Ngăn bàn có vỏ đồ ăn, rác quá 2 tiết chưa vứt', category: 've_sinh', points: -2, description: '', icon: 'fa-trash-can' },
  { id: 'r_2_11', code: '2.11', name: 'Không mang đầy đủ sách vở, đồ dùng học tập', category: 'hoc_tap', points: -2, description: 'để giáo viên nhắc', icon: 'fa-book' },
  { id: 'r_2_12', code: '2.12', name: 'Mất trật tự trong giờ để GV nhắc/ghi sổ đầu bài', category: 'ne_nep', points: -4, description: '', icon: 'fa-bullhorn' },
  { id: 'r_2_13', code: '2.13', name: 'Mất trật tự trong giờ tổ trưởng nhắc', category: 'ne_nep', points: -2, description: '', icon: 'fa-comment-slash' },
  { id: 'r_2_14', code: '2.14', name: 'Không để điện thoại vào tủ, tổ trưởng nhắc không cất', category: 'ne_nep', points: -2, description: '', icon: 'fa-mobile' },
  { id: 'r_2_15', code: '2.15', name: 'Sử dụng điện thoại trong giờ', category: 'ne_nep', points: -8, description: '', icon: 'fa-mobile-screen' },
  { id: 'r_2_16', code: '2.16', name: 'Tranh luận gay gắt dẫn đến mâu thuẫn', category: 'ne_nep', points: -2, description: '', icon: 'fa-hand-fist' },
  { id: 'r_2_17', code: '2.17', name: 'Thái độ với giáo viên, cãi giáo viên, cãi bố mẹ', category: 'ne_nep', points: -8, description: 'được bố mẹ phản ánh lại', icon: 'fa-face-angry' },
  { id: 'r_2_18', code: '2.18', name: 'Đánh nhau trong lớp, trong trường, cổng trường', category: 'ne_nep', points: -10, description: '', icon: 'fa-burst' },
  { id: 'r_2_19', code: '2.19', name: 'Vi phạm ATGT để giáo viên, học sinh khác nhắc', category: 'ne_nep', points: -5, description: '', icon: 'fa-traffic-light' },
  { id: 'r_2_20', code: '2.20', name: 'Vi phạm ATGT để công an đưa giấy thông báo', category: 'ne_nep', points: -20, description: '', icon: 'fa-car-burst' },
  { id: 'r_2_21', code: '2.21', name: 'HS thiếu trung thực', category: 'ne_nep', points: -10, description: 'vi phạm nhưng không tự giác nhận, bỏ chạy, khai gian dối...', icon: 'fa-mask' },
  { id: 'r_2_22', code: '2.22', name: 'Vứt giấy rác bừa bãi', category: 've_sinh', points: -2, description: '', icon: 'fa-trash' },
  { id: 'r_2_23', code: '2.23', name: 'Hút thuốc, hoặc nói tục, nói bậy, chửi bậy', category: 'ne_nep', points: -5, description: '', icon: 'fa-smoking' },
  { id: 'r_2_24', code: '2.24', name: 'Trong giờ học ở căng tin, ghế đá, truy bài bỏ ra ngoài', category: 'ne_nep', points: -3, description: '', icon: 'fa-person-running' },
  { id: 'r_2_25', code: '2.25', name: 'Gửi xe bên ngoài', category: 'ne_nep', points: -3, description: '', icon: 'fa-square-parking' },
  { id: 'r_2_27', code: '2.27', name: 'Ngồi lên bàn, dẫm chân lên ghế, lên tường, nhổ bừa bãi', category: 'ne_nep', points: -3, description: '', icon: 'fa-shoe-prints' },
  { id: 'r_2_28', code: '2.28', name: 'Hót rác, đổ rác muộn, đổ rác không đúng quy định', category: 've_sinh', points: -3, description: '', icon: 'fa-dumpster' },
  { id: 'r_2_29', code: '2.29', name: 'Ra tập trung muộn, xếp hàng, tập không nghiêm túc', category: 'ne_nep', points: -3, description: '', icon: 'fa-users-viewfinder' },
  { id: 'r_2_30', code: '2.30', name: 'Bỏ không ra chào cờ hay bỏ tập trung theo triệu tập', category: 'ne_nep', points: -5, description: '', icon: 'fa-flag' },

  // III. Việc học tập trên lớp và thi cử
  { id: 'r_3_1', code: '3.1', name: 'Không làm bài tập về nhà hoặc làm dưới 1/2', category: 'hoc_tap', points: -3, description: '', icon: 'fa-book-open-reader' },
  { id: 'r_3_2', code: '3.2', name: 'Không thuộc bài (điểm KT vấn đáp dưới 5)', category: 'hoc_tap', points: -3, description: '', icon: 'fa-face-frown' },
  { id: 'r_3_3', code: '3.3', name: 'Vi phạm quy chế thi', category: 'hoc_tap', points: -10, description: '', icon: 'fa-triangle-exclamation' },
  { id: 'r_3_4', code: '3.4', name: 'Nộp bài thuyết trình muộn, thiếu trách nhiệm làm việc nhóm', category: 'hoc_tap', points: -3, description: '', icon: 'fa-users-slash' },
  { id: 'r_3_5', code: '3.5', name: 'Điểm tốt (từ 8 trở lên) lên bảng, KT miệng, phát biểu', category: 'hoc_tap', points: 4, description: '', icon: 'fa-star' },
  { id: 'r_3_6', code: '3.6', name: 'Tham gia phong trào của lớp, trường (cộng dồn điểm)', category: 'phong_trao', points: 3, description: 'văn nghệ, kéo co, thư pháp, cắm trại, tình nguyện...', icon: 'fa-medal' },
  { id: 'r_3_7', code: '3.7', name: 'Giúp đỡ bạn khi bạn gặp khó khăn, nhặt được của rơi', category: 'phong_trao', points: 3, description: '1-5 điểm', icon: 'fa-hand-holding-heart' },
  { id: 'r_3_8', code: '3.8', name: 'Điểm thi rèn kỹ năng các môn khối từ 8 trở lên', category: 'hoc_tap', points: 5, description: '', icon: 'fa-graduation-cap' },
  { id: 'r_3_9', code: '3.9', name: 'Giơ tay phát biểu được gọi', category: 'hoc_tap', points: 2, description: '', icon: 'fa-hand' },
  { id: 'r_3_10', code: '3.10', name: 'Điểm kiểm tra dưới 5', category: 'hoc_tap', points: -4, description: '15p, 1 tiết, thi tháng, thi thử...', icon: 'fa-circle-down' },
  { id: 'r_3_11', code: '3.11', name: 'Không tham gia các cuộc thi do lớp, trường phát động', category: 'phong_trao', points: -3, description: '', icon: 'fa-ban' },
  { id: 'r_3_12', code: '3.12', name: 'Tham gia muộn các cuộc thi', category: 'phong_trao', points: -2, description: '', icon: 'fa-hourglass' },
  { id: 'r_3_13', code: '3.13', name: 'Có giải văn nghệ, cắm trại, phong trào', category: 'phong_trao', points: 5, description: 'nhất 5 - nhì 4 - Ba 3 - KK 2', icon: 'fa-trophy' },

  // IV. Công tác kiêm nhiệm
  { id: 'r_4_1', code: '4.1', name: 'Lớp trưởng, bí thư', category: 'phong_trao', points: 3, description: 'cộng 1 lần 1 tuần', icon: 'fa-user-tie' },
  { id: 'r_4_2', code: '4.2', name: 'Lớp phó', category: 'phong_trao', points: 3, description: 'cộng 1 lần 1 tuần', icon: 'fa-user-tie' },
  { id: 'r_4_3', code: '4.3', name: 'Tổ trưởng', category: 'phong_trao', points: 3, description: 'cộng 1 lần 1 tuần', icon: 'fa-user-tie' },
  { id: 'r_4_4', code: '4.4', name: 'Cờ đỏ', category: 'phong_trao', points: 2, description: 'cộng 1 lần 1 tuần', icon: 'fa-flag' },
  { id: 'r_4_5', code: '4.5', name: 'Giao xe', category: 'phong_trao', points: 2, description: 'cộng 1 lần 1 tuần', icon: 'fa-key' },
  { id: 'r_4_6', code: '4.6', name: 'Cầm chìa khóa', category: 'phong_trao', points: 2, description: 'cộng 1 lần 1 tuần', icon: 'fa-key' },
  { id: 'r_4_7', code: '4.7', name: 'Không khóa cửa lớp học (HS cầm chìa khóa)', category: 'ne_nep', points: -2, description: '', icon: 'fa-lock-open' },
  { id: 'r_4_8', code: '4.8', name: 'Không tắt điện, quạt (HS trực nhật)', category: 've_sinh', points: -3, description: '', icon: 'fa-lightbulb' },
];

export const INITIAL_SCORE_LOGS = [
  // Tuần 4 (Hiện tại)
  { id: 'log_401', studentId: 'std_08', studentName: 'Ngô Gia Huy', group: 1, criterionId: 'r_nn_01', criterionName: 'Đi học muộn (sau trống vào lớp)', category: 'ne_nep' as const, points: -2, note: 'Đến muộn 10 phút tiết 1 thứ Hai', recordedBy: 'Nguyễn Văn An (Tổ trưởng 1)', recordedByRole: 'to_truong_1' as const, timestamp: '2026-09-28T07:15:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_402', studentId: 'std_08', studentName: 'Ngô Gia Huy', group: 1, criterionId: 'r_ht_03', criterionName: 'Không chuẩn bị bài / Thiếu bài tập về nhà', category: 'hoc_tap' as const, points: -3, note: 'Thiếu bài tập Toán hình cô giao', recordedBy: 'Nguyễn Văn An (Tổ trưởng 1)', recordedByRole: 'to_truong_1' as const, timestamp: '2026-09-29T08:30:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_403', studentId: 'std_10', studentName: 'Chu Đình Trọng', group: 1, criterionId: 'r_nn_04', criterionName: 'Sử dụng điện thoại trong giờ học', category: 'ne_nep' as const, points: -5, note: 'Bị thầy dạy Lý phát hiện dùng điện thoại', recordedBy: 'Hoàng Minh Tuấn (Lớp trưởng)', recordedByRole: 'lop_truong' as const, timestamp: '2026-09-29T10:00:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_404', studentId: 'std_01', studentName: 'Hoàng Minh Tuấn', group: 1, criterionId: 'r_ht_01', criterionName: 'Điểm 9 - 10 (KT miệng, 15p, 1 tiết)', category: 'hoc_tap' as const, points: 5, note: '10 điểm kiểm tra miệng môn Hóa', recordedBy: 'Nguyễn Văn An (Tổ trưởng 1)', recordedByRole: 'to_truong_1' as const, timestamp: '2026-09-30T09:10:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_405', studentId: 'std_03', studentName: 'Đặng Thảo Linh', group: 1, criterionId: 'r_ht_01', criterionName: 'Điểm 9 - 10 (KT miệng, 15p, 1 tiết)', category: 'hoc_tap' as const, points: 5, note: '9.5 điểm kiểm tra 15p Văn', recordedBy: 'Nguyễn Văn An (Tổ trưởng 1)', recordedByRole: 'to_truong_1' as const, timestamp: '2026-09-30T10:15:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  
  // Tổ 2
  { id: 'log_406', studentId: 'std_19', studentName: 'Cao Văn Việt', group: 2, criterionId: 'r_nn_02', criterionName: 'Sai quy định đồng phục / Không đeo thẻ', category: 'ne_nep' as const, points: -2, note: 'Không đeo thẻ học sinh và đi dép lê', recordedBy: 'Trần Thị Mai (Tổ trưởng 2)', recordedByRole: 'to_truong_2' as const, timestamp: '2026-09-28T07:10:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_407', studentId: 'std_19', studentName: 'Cao Văn Việt', group: 2, criterionId: 'r_ht_04', criterionName: 'Điểm kém (< 5 điểm kiểm tra miệng/15p)', category: 'hoc_tap' as const, points: -3, note: '3 điểm kiểm tra miệng môn Sử', recordedBy: 'Trần Thị Mai (Tổ trưởng 2)', recordedByRole: 'to_truong_2' as const, timestamp: '2026-09-29T14:20:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_408', studentId: 'std_17', studentName: 'Vương Đình Tùng', group: 2, criterionId: 'r_nn_05', criterionName: 'Nói chuyện riêng, mất trật tự', category: 'ne_nep' as const, points: -2, note: 'Bị nhắc nhở trong giờ tiếng Anh', recordedBy: 'Trần Thị Mai (Tổ trưởng 2)', recordedByRole: 'to_truong_2' as const, timestamp: '2026-09-30T08:15:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_409', studentId: 'std_11', studentName: 'Nguyễn Thị Bích Ngọc', group: 2, criterionId: 'r_ht_01', criterionName: 'Điểm 9 - 10 (KT miệng, 15p, 1 tiết)', category: 'hoc_tap' as const, points: 5, note: '10 điểm kiểm tra 1 tiết Toán', recordedBy: 'Trần Thị Mai (Tổ trưởng 2)', recordedByRole: 'to_truong_2' as const, timestamp: '2026-09-30T09:40:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_410', studentId: 'std_11', studentName: 'Nguyễn Thị Bích Ngọc', group: 2, criterionId: 'r_pt_01', criterionName: 'Đạt giải Học sinh Giỏi / Cuộc thi cấp Trường, Tỉnh', category: 'phong_trao' as const, points: 15, note: 'Giải Nhất HSG cấp Trường môn Toán 12', recordedBy: 'Cô Ninh Thị Thu Hà (GVCN)', recordedByRole: 'gvcn' as const, timestamp: '2026-09-30T16:00:00.000Z', weekNumber: 4, academicYear: '2026-2027' },

  // Tổ 3
  { id: 'log_411', studentId: 'std_28', studentName: 'Tạ Quốc Tuấn', group: 3, criterionId: 'r_nn_01', criterionName: 'Đi học muộn (sau trống vào lớp)', category: 'ne_nep' as const, points: -2, note: 'Muộn 15 phút thứ Ba', recordedBy: 'Lê Hoàng Nam (Tổ trưởng 3)', recordedByRole: 'to_truong_3' as const, timestamp: '2026-09-29T07:20:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_412', studentId: 'std_28', studentName: 'Tạ Quốc Tuấn', group: 3, criterionId: 'r_ht_03', criterionName: 'Không chuẩn bị bài / Thiếu bài tập về nhà', category: 'hoc_tap' as const, points: -3, note: 'Chưa làm đề cương ôn tập Sinh', recordedBy: 'Lê Hoàng Nam (Tổ trưởng 3)', recordedByRole: 'to_truong_3' as const, timestamp: '2026-09-30T10:00:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_413', studentId: 'std_30', studentName: 'Bùi Gia Khiêm', group: 3, criterionId: 'r_vs_03', criterionName: 'Vứt rác bừa bãi trong hộc bàn / sàn lớp', category: 've_sinh' as const, points: -2, note: 'Để vỏ hộp sữa trong hộc bàn', recordedBy: 'Lê Hoàng Nam (Tổ trưởng 3)', recordedByRole: 'to_truong_3' as const, timestamp: '2026-09-29T11:30:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_414', studentId: 'std_21', studentName: 'Trịnh Hoài Phương', group: 3, criterionId: 'r_pt_02', criterionName: 'Tham gia hoạt động Văn nghệ / Thể thao / Đoàn trường', category: 'phong_trao' as const, points: 5, note: 'Dẫn chương trình Đại hội Chi đoàn 12A10', recordedBy: 'Cô Ninh Thị Thu Hà (GVCN)', recordedByRole: 'gvcn' as const, timestamp: '2026-09-28T15:30:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_415', studentId: 'std_23', studentName: 'Phạm Minh Châu', group: 3, criterionId: 'r_ht_01', criterionName: 'Điểm 9 - 10 (KT miệng, 15p, 1 tiết)', category: 'hoc_tap' as const, points: 5, note: '9.0 điểm kiểm tra tiếng Anh', recordedBy: 'Lê Hoàng Nam (Tổ trưởng 3)', recordedByRole: 'to_truong_3' as const, timestamp: '2026-09-30T14:15:00.000Z', weekNumber: 4, academicYear: '2026-2027' },

  // Tổ 4
  { id: 'log_416', studentId: 'std_37', studentName: 'Dương Văn Long', group: 4, criterionId: 'r_nn_04', criterionName: 'Sử dụng điện thoại trong giờ học', category: 'ne_nep' as const, points: -5, note: 'Chơi game trong giờ GDCD', recordedBy: 'Phạm Quỳnh Chi (Tổ trưởng 4)', recordedByRole: 'to_truong_4' as const, timestamp: '2026-09-29T09:30:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_417', studentId: 'std_39', studentName: 'Vũ Đức Thành', group: 4, criterionId: 'r_nn_01', criterionName: 'Đi học muộn (sau trống vào lớp)', category: 'ne_nep' as const, points: -2, note: 'Đi muộn tiết 1 sáng thứ Tư', recordedBy: 'Phạm Quỳnh Chi (Tổ trưởng 4)', recordedByRole: 'to_truong_4' as const, timestamp: '2026-09-30T07:12:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_418', studentId: 'std_39', studentName: 'Vũ Đức Thành', group: 4, criterionId: 'r_ht_03', criterionName: 'Không chuẩn bị bài / Thiếu bài tập về nhà', category: 'hoc_tap' as const, points: -3, note: 'Quên làm bài tập Hóa', recordedBy: 'Phạm Quỳnh Chi (Tổ trưởng 4)', recordedByRole: 'to_truong_4' as const, timestamp: '2026-09-30T10:45:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_419', studentId: 'std_31', studentName: 'Trần Đăng Khoa', group: 4, criterionId: 'r_ht_01', criterionName: 'Điểm 9 - 10 (KT miệng, 15p, 1 tiết)', category: 'hoc_tap' as const, points: 5, note: '9.0 kiểm tra 1 tiết Địa lý', recordedBy: 'Phạm Quỳnh Chi (Tổ trưởng 4)', recordedByRole: 'to_truong_4' as const, timestamp: '2026-09-29T15:00:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
  { id: 'log_420', studentId: 'std_34', studentName: 'Lương Ánh Dương', group: 4, criterionId: 'r_ht_02', criterionName: 'Tích cực phát biểu xây dựng bài (≥ 3 lần/buổi)', category: 'hoc_tap' as const, points: 2, note: 'Phát biểu 4 lần trong giờ Ngữ văn', recordedBy: 'Phạm Quỳnh Chi (Tổ trưởng 4)', recordedByRole: 'to_truong_4' as const, timestamp: '2026-09-30T11:00:00.000Z', weekNumber: 4, academicYear: '2026-2027' },
];

export const INITIAL_PENALTY_ASSIGNMENTS = [
  // Tuần 3 (đã hoàn thành)
  { id: 'pen_301', weekNumber: 3, studentId: 'std_08', studentName: 'Ngô Gia Huy', studentCode: '12A10-08', group: 1, totalScore: 92, penaltyRankInGroup: 1, dutyDay: 'Thứ 2' as const, dutyTask: 'Quét lớp và lau bảng sạch sẽ cả ngày', status: 'completed' as const, note: 'Đã hoàn thành tốt', assignedAt: '2026-09-21T07:00:00.000Z', notifiedZalo: true, notifiedSms: true },
  { id: 'pen_302', weekNumber: 3, studentId: 'std_06', studentName: 'Phan Quốc Bảo', studentCode: '12A10-06', group: 1, totalScore: 95, penaltyRankInGroup: 2, dutyDay: 'Thứ 3' as const, dutyTask: 'Kê bàn ghế ngay ngắn & đổ rác cuối buổi', status: 'completed' as const, note: '', assignedAt: '2026-09-21T07:00:00.000Z', notifiedZalo: true, notifiedSms: false },
  
  // Tuần 4 (Hiện tại - Được phân công tự động)
  { id: 'pen_401', weekNumber: 4, studentId: 'std_10', studentName: 'Chu Đình Trọng', studentCode: '12A10-10', group: 1, totalScore: 95, penaltyRankInGroup: 1, dutyDay: 'Thứ 2' as const, dutyTask: 'Quét lớp, giặt khăn lau bảng sạch sẽ trước 6h45', status: 'pending' as const, note: 'Vi phạm dùng điện thoại trong giờ', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: true, notifiedSms: true },
  { id: 'pen_402', weekNumber: 4, studentId: 'std_08', studentName: 'Ngô Gia Huy', studentCode: '12A10-08', group: 1, totalScore: 95, penaltyRankInGroup: 2, dutyDay: 'Thứ 3' as const, dutyTask: 'Kê ngay ngắn bàn ghế dãy 1-2 & đổ thùng rác', status: 'pending' as const, note: 'Đi muộn và thiếu bài tập', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: true, notifiedSms: false },
  
  { id: 'pen_403', weekNumber: 4, studentId: 'std_19', studentName: 'Cao Văn Việt', studentCode: '12A10-19', group: 2, totalScore: 95, penaltyRankInGroup: 1, dutyDay: 'Thứ 4' as const, dutyTask: 'Quét lớp, tưới cây hành lang lớp học', status: 'pending' as const, note: 'Sai đồng phục và điểm kém', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: true, notifiedSms: true },
  { id: 'pen_404', weekNumber: 4, studentId: 'std_17', studentName: 'Vương Đình Tùng', studentCode: '12A10-17', group: 2, totalScore: 98, penaltyRankInGroup: 2, dutyDay: 'Thứ 5' as const, dutyTask: 'Kiểm tra đóng cửa sổ, tắt đèn quạt sau buổi học', status: 'pending' as const, note: 'Nói chuyện riêng', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: false, notifiedSms: false },

  { id: 'pen_405', weekNumber: 4, studentId: 'std_28', studentName: 'Tạ Quốc Tuấn', studentCode: '12A10-28', group: 3, totalScore: 95, penaltyRankInGroup: 1, dutyDay: 'Thứ 6' as const, dutyTask: 'Quét dọn vệ sinh góc phòng học & bục giảng', status: 'pending' as const, note: 'Đi muộn và thiếu bài tập', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: true, notifiedSms: true },
  { id: 'pen_406', weekNumber: 4, studentId: 'std_30', studentName: 'Bùi Gia Khiêm', studentCode: '12A10-30', group: 3, totalScore: 98, penaltyRankInGroup: 2, dutyDay: 'Thứ 7' as const, dutyTask: 'Kê ngay ngắn bàn ghế & kiểm tra vệ sinh hộc bàn', status: 'pending' as const, note: 'Xả rác hộc bàn', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: true, notifiedSms: false },

  { id: 'pen_407', weekNumber: 4, studentId: 'std_37', studentName: 'Dương Văn Long', studentCode: '12A10-37', group: 4, totalScore: 95, penaltyRankInGroup: 1, dutyDay: 'Thứ 2' as const, dutyTask: 'Tổng vệ sinh lớp học đầu tuần cùng tổ trực nhật', status: 'pending' as const, note: 'Dùng điện thoại chơi game', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: true, notifiedSms: true },
  { id: 'pen_408', weekNumber: 4, studentId: 'std_39', studentName: 'Vũ Đức Thành', studentCode: '12A10-39', group: 4, totalScore: 95, penaltyRankInGroup: 2, dutyDay: 'Thứ 3' as const, dutyTask: 'Lau bảng, giặt khăn lau & đổ rác cuối giờ', status: 'pending' as const, note: 'Đi muộn và thiếu bài tập Hóa', assignedAt: '2026-09-28T07:00:00.000Z', notifiedZalo: true, notifiedSms: false },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub_toan', name: 'Toán học 12', icon: 'fa-calculator', questionsCount: 8 },
  { id: 'sub_van', name: 'Ngữ văn 12', icon: 'fa-book', questionsCount: 6 },
  { id: 'sub_anh', name: 'Tiếng Anh 12', icon: 'fa-language', questionsCount: 8 },
  { id: 'sub_ly', name: 'Vật lý 12', icon: 'fa-atom', questionsCount: 6 },
  { id: 'sub_hoa', name: 'Hóa học 12', icon: 'fa-flask', questionsCount: 6 },
  { id: 'sub_noi_quy', name: 'Nội quy & Nề nếp THPT Yên Thế', icon: 'fa-scale-balanced', questionsCount: 10 },
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q_01',
    subjectId: 'sub_noi_quy',
    content: 'Theo nội quy lớp 12A10 THPT Yên Thế, học sinh đến lớp muộn sau tiếng trống vào học sẽ bị xử lý như thế nào?',
    type: 'multiple_choice',
    options: [
      'Trừ 2 điểm thi đua tuần và ghi nhận vào sổ theo dõi tổ',
      'Được vào lớp tự do không bị trừ điểm',
      'Bị đình chỉ học ngay lập tức',
      'Chỉ cần xin lỗi bạn cùng bàn'
    ],
    correctAnswer: 0,
    explanation: 'Quy định NN01: Đi học muộn không có lý do chính đáng sẽ bị trừ 2 điểm vào quỹ điểm thi đua tuần của cá nhân và ảnh hưởng đến điểm tổng kết của Tổ.',
    difficulty: 'easy',
  },
  {
    id: 'q_02',
    subjectId: 'sub_noi_quy',
    content: 'Mỗi tuần học, hệ thống thi đua tự động chọn ra bao nhiêu học sinh thấp điểm nhất mỗi tổ để phân công trực nhật phạt?',
    type: 'multiple_choice',
    options: [
      '1 học sinh mỗi tổ',
      '2 học sinh mỗi tổ (tổng 8 học sinh toàn lớp)',
      '3 học sinh mỗi tổ',
      'Tất cả học sinh trong tổ'
    ],
    correctAnswer: 1,
    explanation: 'Hệ thống tự động xếp hạng và lọc ra 2 học sinh có điểm rèn luyện thấp nhất trong từng tổ để gán lịch trực nhật tăng cường trong tuần kế tiếp.',
    difficulty: 'easy',
  },
  {
    id: 'q_03',
    subjectId: 'sub_toan',
    content: 'Cho hàm số y = f(x) có đạo hàm f\'(x) = x(x-1)^2(x+2). Số điểm cực trị của hàm số đã cho là:',
    type: 'multiple_choice',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Đạo hàm f\'(x) đổi dấu khi đi qua x = 0 và x = -2 (nghiệm bội lẻ). Tại x = 1 là nghiệm bội chẵn nên đạo hàm không đổi dấu. Vậy hàm số có đúng 2 điểm cực trị.',
    difficulty: 'medium',
  },
  {
    id: 'q_04',
    subjectId: 'sub_van',
    content: 'Tác phẩm "Tuyên ngôn Độc lập" của Chủ tịch Hồ Chí Minh được đọc tại Quảng trường Ba Đình vào thời gian nào?',
    type: 'multiple_choice',
    options: [
      'Ngày 19 tháng 8 năm 1945',
      'Ngày 2 tháng 9 năm 1945',
      'Ngày 2 tháng 9 năm 1969',
      'Ngày 30 tháng 4 năm 1975'
    ],
    correctAnswer: 1,
    explanation: 'Bản Tuyên ngôn Độc lập lịch sử được Chủ tịch Hồ Chí Minh đọc tại Quảng trường Ba Đình Hà Nội vào sáng ngày 2 tháng 9 năm 1945, khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
    difficulty: 'easy',
  },
  {
    id: 'q_05',
    subjectId: 'sub_anh',
    content: 'Choose the word whose underlined part differs from the other three in pronunciation: /ed/ ending',
    type: 'multiple_choice',
    options: [
      'watched',
      'stopped',
      'decided',
      'booked'
    ],
    correctAnswer: 2,
    explanation: '"decided" is pronounced as /id/, whereas "watched", "stopped", and "booked" end in voiceless sounds and their -ed is pronounced as /t/.',
    difficulty: 'easy',
  },
];

export const INITIAL_ACCOUNTS = [
  { id: 'acc_gvcn', username: 'gvcn', passcode: '123456', role: 'gvcn' as const, name: 'Cô Ninh Thị Thu Hà' },
  { id: 'acc_lt', username: 'loptruong', passcode: '123456', role: 'lop_truong' as const, name: 'Lớp trưởng 12A10' },
  { id: 'acc_tt1', username: 'totruong1', passcode: '123456', role: 'to_truong_1' as const, name: 'Hoàng Gia Huy' },
  { id: 'acc_tt2', username: 'totruong2', passcode: '123456', role: 'to_truong_2' as const, name: 'Dương Thị Thúy' },
  { id: 'acc_tt3', username: 'totruong3', passcode: '123456', role: 'to_truong_3' as const, name: 'Nguyễn Triệu Huy' },
  { id: 'acc_tt4', username: 'totruong4', passcode: '123456', role: 'to_truong_4' as const, name: 'Phạm Thu Hương' },
];

export const INITIAL_APP_DATA: FullAppData = {
  students: INITIAL_STUDENTS,
  rules: INITIAL_RULES,
  scoreLogs: INITIAL_SCORE_LOGS,
  penaltyAssignments: INITIAL_PENALTY_ASSIGNMENTS,
  notifications: [
    {
      id: 'notif_01',
      recipientName: 'Phụ huynh em Chu Đình Trọng (Tổ 1)',
      recipientPhone: '0981112210',
      type: 'penalty_alert',
      channel: 'zalo',
      content: 'Kính gửi Bác Chu Văn Khang, GVCN lớp 12A10 THPT Yên Thế xin thông báo: Trong tuần 4, em Chu Đình Trọng đạt 95/100 điểm thi đua (vi phạm sử dụng điện thoại trong giờ học). Em được phân công trực nhật tăng cường vào Thứ 2 tuần tới. Kính mong gia đình nhắc nhở em thực hiện nghiêm túc!',
      timestamp: '2026-09-30T17:00:00.000Z',
      status: 'sent',
    },
    {
      id: 'notif_02',
      recipientName: 'Phụ huynh em Nguyễn Thị Bích Ngọc (Tổ 2)',
      recipientPhone: '0981112211',
      type: 'bonus_cheer',
      channel: 'zalo',
      content: 'Tin vui từ GVCN 12A10: Chúc mừng em Nguyễn Thị Bích Ngọc tuần 4 đạt danh hiệu Thủ khoa thi đua (120 điểm) và đạt giải Nhất HSG cấp Trường môn Toán. Cảm ơn sự đồng hành của gia đình!',
      timestamp: '2026-09-30T17:15:00.000Z',
      status: 'sent',
    },
  ],
  subjects: INITIAL_SUBJECTS,
  questions: INITIAL_QUESTIONS,
  quizSessions: [
    {
      id: 'qs_01',
      subjectId: 'sub_noi_quy',
      subjectName: 'Nội quy & Nề nếp THPT Yên Thế',
      score: 100,
      totalQuestions: 5,
      correctAnswers: 5,
      timeSpent: 85,
      date: '2026-09-29T19:30:00.000Z',
    },
    {
      id: 'qs_02',
      subjectId: 'sub_toan',
      subjectName: 'Toán học 12',
      score: 80,
      totalQuestions: 5,
      correctAnswers: 4,
      timeSpent: 140,
      date: '2026-09-30T20:10:00.000Z',
    },
  ],
  settings: {
    academicYear: '2026-2027',
    className: '12A10',
    schoolName: 'THPT Yên Thế',
    homeroomTeacher: 'Cô Ninh Thị Thu Hà',
    currentWeek: 4,
    penaltiesPerGroup: 2,
    baseStartingScore: 100,
    selectedModel: 'gemini-1.5-flash',
    highThinkingEnabled: false,
    theme: 'light',
    soundEnabled: true,
    autoSave: true,
    seatingChart: {
      "1": [
        { deskNumber: 1, leftStudent: '', rightStudent: '' },
        { deskNumber: 2, leftStudent: '', rightStudent: '' },
        { deskNumber: 3, leftStudent: '', rightStudent: '' },
        { deskNumber: 4, leftStudent: '', rightStudent: '' },
        { deskNumber: 5, leftStudent: '', rightStudent: '' },
        { deskNumber: 6, leftStudent: '', rightStudent: '' }
      ],
      "2": [
        { deskNumber: 1, leftStudent: 'Ánh', rightStudent: 'Thúy, Bùi Linh' },
        { deskNumber: 2, leftStudent: 'Kiệt', rightStudent: 'Phạm Dũng' },
        { deskNumber: 3, leftStudent: 'Hoài', rightStudent: 'Toàn' },
        { deskNumber: 4, leftStudent: 'Dịu', rightStudent: 'Phương Linh' },
        { deskNumber: 5, leftStudent: 'Bình Minh', rightStudent: 'Hoàng Vũ' },
        { deskNumber: 6, leftStudent: 'Bằng', rightStudent: 'Phi Vũ' }
      ],
      "3": [
        { deskNumber: 1, leftStudent: 'Huyền', rightStudent: 'Duy' },
        { deskNumber: 2, leftStudent: 'Hậu', rightStudent: 'Vỹ' },
        { deskNumber: 3, leftStudent: 'Uyên', rightStudent: 'Lê Minh' },
        { deskNumber: 4, leftStudent: 'Mã Hà', rightStudent: 'Bình' },
        { deskNumber: 5, leftStudent: 'Đăng', rightStudent: 'Khánh Linh' },
        { deskNumber: 6, leftStudent: 'Triệu Huy', rightStudent: 'Long' }
      ],
      "4": [
        { deskNumber: 1, leftStudent: '', rightStudent: '' },
        { deskNumber: 2, leftStudent: '', rightStudent: '' },
        { deskNumber: 3, leftStudent: '', rightStudent: '' },
        { deskNumber: 4, leftStudent: '', rightStudent: '' },
        { deskNumber: 5, leftStudent: '', rightStudent: '' },
        { deskNumber: 6, leftStudent: '', rightStudent: '' }
      ]
    }
  },
  accounts: INITIAL_ACCOUNTS,
  remarks: [],
};
