import * as XLSX from 'xlsx';
import { Student } from '../types';

/**
 * Parses an Excel file and returns a list of Student objects.
 * Expected columns: Họ tên, Ngày sinh, Giới tính, Điện thoại, Tổ, Chức vụ
 */
export const parseStudentsFromExcel = async (file: File): Promise<Omit<Student, 'id' | 'avatar'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Use the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const parsedStudents: Omit<Student, 'id' | 'avatar'>[] = jsonData.map((row, index) => {
          // Attempt to map columns flexibly (handling minor variations in header names)
          const name = row['Họ tên'] || row['Họ và tên'] || row['Name'] || `Học sinh ${index + 1}`;
          const birthday = row['Ngày sinh'] || row['Ngay sinh'] || row['Birthday'] || '';
          const groupRaw = row['Tổ'] || row['To'] || row['Group'] || 1;
          const roleRaw = row['Chức vụ'] || row['Chuc vu'] || row['Role'] || 'Học sinh';
          const genderRaw = row['Giới tính'] || row['Gioi tinh'] || row['Gender'] || 'Nam';
          const phone = row['Điện thoại'] || row['SDT'] || row['Phone'] || '';
          const parentName = row['Tên Phụ Huynh'] || row['Tên phụ huynh'] || row['Phụ huynh'] || '';
          const parentPhone = row['SĐT Phụ Huynh'] || row['SĐT phụ huynh'] || row['Điện thoại phụ huynh'] || '';
          const address = row['Địa Chỉ Nhà'] || row['Địa chỉ nhà'] || row['Địa chỉ'] || '';

          // Normalize group to a number between 1 and 4
          let group = Number(groupRaw);
          if (isNaN(group) || group < 1 || group > 4) {
            group = 1;
          }

          // Normalize role
          const roleInClass = normalizeRole(roleRaw);
          const gender = String(genderRaw).toLowerCase().includes('nữ') ? 'Nữ' : 'Nam';

          const sttRaw = row['STT'] || row['Stt'] || row['stt'];
          const studentCode = sttRaw ? String(sttRaw).trim().padStart(2, '0') : String(index + 1).padStart(2, '0');

          return {
            code: studentCode,
            phone: String(phone).trim(),
            name: String(name).trim(),
            birthday: String(birthday).trim(),
            group: group,
            roleInClass: roleInClass,
            gender: gender,
            parentName: String(parentName).trim(),
            parentPhone: String(parentPhone || phone).trim(),
            address: String(address).trim(),
          };
        });

        resolve(parsedStudents);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

const normalizeRole = (role: string): 'Lớp trưởng' | 'Lớp phó học tập' | 'Lớp phó phong trào' | 'Bí thư' | 'Tổ trưởng' | 'Tổ phó' | 'Học sinh' => {
  const r = String(role).toLowerCase().trim();
  if (r.includes('lớp trưởng')) return 'Lớp trưởng';
  if (r.includes('phó học tập')) return 'Lớp phó học tập';
  if (r.includes('phó phong trào')) return 'Lớp phó phong trào';
  if (r.includes('bí thư')) return 'Bí thư';
  if (r.includes('tổ trưởng')) return 'Tổ trưởng';
  if (r.includes('tổ phó')) return 'Tổ phó';
  return 'Học sinh';
};

/**
 * Generates and triggers download of a sample Excel file.
 */
export const downloadSampleExcel = () => {
  const sampleData = [
    {
      'STT': 1,
      'Họ tên': 'Nguyễn Văn A',
      'Ngày sinh': '01/01/2009',
      'Giới tính': 'Nam',
      'Điện thoại': '0912345678',
      'Chức vụ': 'Lớp trưởng',
      'Tổ': 1,
      'Tên Phụ Huynh': 'Ông Nguyễn Văn X',
      'SĐT Phụ Huynh': '0988111222',
      'Địa Chỉ Nhà': 'Số 1, Phố Víp, Hà Nội'
    },
    {
      'STT': 2,
      'Họ tên': 'Trần Thị B',
      'Ngày sinh': '15/05/2009',
      'Giới tính': 'Nữ',
      'Điện thoại': '0987654321',
      'Chức vụ': 'Tổ trưởng',
      'Tổ': 2,
      'Tên Phụ Huynh': 'Bà Trần Thị Y',
      'SĐT Phụ Huynh': '0977222333',
      'Địa Chỉ Nhà': 'Số 2, Đường Láng'
    },
    {
      'STT': 3,
      'Họ tên': 'Lê Văn C',
      'Ngày sinh': '20/10/2009',
      'Giới tính': 'Nam',
      'Điện thoại': '0909111222',
      'Chức vụ': 'Học sinh',
      'Tổ': 3,
      'Tên Phụ Huynh': 'Ông Lê Văn Z',
      'SĐT Phụ Huynh': '0966444555',
      'Địa Chỉ Nhà': 'Số 3, Ngõ Chợ'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh Sach Mau');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // STT
    { wch: 25 }, // Họ tên
    { wch: 15 }, // Ngày sinh
    { wch: 10 }, // Giới tính
    { wch: 15 }, // Điện thoại
    { wch: 15 }, // Chức vụ
    { wch: 5 },  // Tổ
    { wch: 25 }, // Tên Phụ Huynh
    { wch: 15 }, // SĐT Phụ Huynh
    { wch: 35 }, // Địa Chỉ Nhà
  ];

  XLSX.writeFile(workbook, 'Mau_Danh_Sach_Hoc_Sinh.xlsx');
};
