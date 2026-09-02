import { FullAppData } from '../types';
import { StudentScoreSummary, GroupScoreSummary } from './calculations';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import PptxGenJS from 'pptxgenjs';

export async function exportToWord(
  data: FullAppData,
  weekNumber: number,
  studentSummaries: StudentScoreSummary[],
  groupSummaries: GroupScoreSummary[]
) {
  const topStudents = [...studentSummaries].sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
  const weekPenalties = data.penaltyAssignments.filter(p => p.weekNumber === weekNumber);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "SỞ GD&ĐT BẮC GIANG\nTRƯỜNG THPT YÊN THẾ", bold: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true }),
          ],
        }),
        new Paragraph({
          text: "\n",
        }),

        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: `BẢNG TỔNG HỢP THI ĐUA & PHÂN CÔNG TRỰC NHẬT TUẦN ${weekNumber}`, bold: true, size: 28 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "(Áp dụng nề nếp kỷ cương & rèn luyện tự giác lớp 12A10)", italics: true, size: 20 }),
          ],
        }),
        new Paragraph({ text: "\n" }),

        // Group Rankings Title
        new Paragraph({
          children: [
            new TextRun({ text: "I. BẢNG TỔNG HỢP XẾP HẠNG 4 TỔ", bold: true, size: 24 }),
          ],
        }),
        
        // Group Rankings Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hạng", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tổ", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sĩ số", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Điểm TB", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Học sinh xuất sắc nhất", bold: true })], alignment: AlignmentType.CENTER })] }),
              ],
            }),
            ...groupSummaries.map(g => 
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: `#${g.rank}`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: `Tổ ${g.group}`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: `${g.studentCount}`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: `${g.avgScore.toFixed(1)}đ`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: `${g.topStudentName} (${g.topStudentScore}đ)`, alignment: AlignmentType.CENTER })] }),
                ]
              })
            )
          ]
        }),
        new Paragraph({ text: "\n" }),

        // Top Students
        new Paragraph({
          children: [
            new TextRun({ text: "II. TUYÊN DƯƠNG TOP 5 HỌC SINH XUẤT SẮC TUẦN", bold: true, size: 24 }),
          ],
        }),
        ...topStudents.map((s, idx) => 
          new Paragraph({
            children: [
              new TextRun({ text: `${idx + 1}. ${s.student.name} (Tổ ${s.student.group}) - ${s.totalScore}đ` })
            ]
          })
        ),
        new Paragraph({ text: "\n" }),

        // Penalties Table Title
        new Paragraph({
          children: [
            new TextRun({ text: "III. DANH SÁCH PHÂN CÔNG TRỰC NHẬT PHẠT", bold: true, size: 24 }),
          ],
        }),

        // Penalties Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "STT", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Học sinh", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tổ", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ngày trực", bold: true })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Nhiệm vụ", bold: true })], alignment: AlignmentType.CENTER })] }),
              ],
            }),
            ...weekPenalties.map((p, idx) => 
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: `${idx + 1}`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: p.studentName, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: `Tổ ${p.group}`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: p.dutyDay, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: p.dutyTask, alignment: AlignmentType.CENTER })] }),
                ]
              })
            )
          ]
        }),

      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `BienBanSinhHoat_12A10_Tuan${weekNumber}.docx`);
}

export async function exportToPowerPoint(
  data: FullAppData,
  weekNumber: number,
  studentSummaries: StudentScoreSummary[],
  groupSummaries: GroupScoreSummary[]
) {
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Lop 12A10 - THPT Yen The';
  pres.company = 'THPT Yen The';
  pres.title = `Bao Cao Tuan ${weekNumber}`;

  // Slide 1: Title
  const slide1 = pres.addSlide();
  slide1.background = { color: 'F1F5F9' };
  
  slide1.addText('TỔNG KẾT THI ĐUA & NỀ NẾP', {
    x: 1, y: 2, w: '80%', h: 1,
    fontSize: 40, bold: true, color: '1E40AF', align: 'center'
  });
  
  slide1.addText(`Tuần ${weekNumber} | Lớp 12A10 - THPT Yên Thế`, {
    x: 1, y: 3, w: '80%', h: 1,
    fontSize: 24, color: '64748B', align: 'center'
  });

  // Slide 2: Group Rankings
  const slide2 = pres.addSlide();
  slide2.addText('XẾP HẠNG 4 TỔ', { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '1E40AF' });
  
  const groupData = groupSummaries.map(g => [
    { text: `Hạng ${g.rank}` },
    { text: `Tổ ${g.group}` },
    { text: `${g.avgScore.toFixed(1)}` },
    { text: g.topStudentName }
  ]);
  
  slide2.addTable(
    [
      [{ text: 'Hạng', options: { bold: true, fill: { color: 'DBEAFE' }, color: '1E40AF' } }, 
       { text: 'Tổ', options: { bold: true, fill: { color: 'DBEAFE' }, color: '1E40AF' } }, 
       { text: 'Điểm TB', options: { bold: true, fill: { color: 'DBEAFE' }, color: '1E40AF' } }, 
       { text: 'HS Xuất sắc', options: { bold: true, fill: { color: 'DBEAFE' }, color: '1E40AF' } }],
      ...groupData
    ],
    { x: 0.5, y: 1.5, w: 9, rowH: 0.8, fontSize: 16, border: { type: 'solid', color: 'CBD5E1', pt: 1 } }
  );

  // Slide 3: Top Students
  const slide3 = pres.addSlide();
  slide3.addText('VINH DANH TOP 5 HỌC SINH', { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '10B981' });
  
  const topStudents = [...studentSummaries].sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
  topStudents.forEach((s, idx) => {
    slide3.addText(`${idx + 1}. ${s.student.name} (Tổ ${s.student.group}) - ${s.totalScore}đ`, {
      x: 1, y: 1.5 + (idx * 0.8), fontSize: 20, color: '334155', bold: true
    });
  });

  // Slide 4: Penalty Duties
  const slide4 = pres.addSlide();
  slide4.addText('DANH SÁCH TRỰC NHẬT PHẠT', { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: 'D97706' });
  
  const weekPenalties = data.penaltyAssignments.filter(p => p.weekNumber === weekNumber);
  
  if (weekPenalties.length > 0) {
    const penaltyData = weekPenalties.map(p => [
      { text: p.studentName },
      { text: `Tổ ${p.group}` },
      { text: p.dutyDay },
      { text: p.dutyTask }
    ]);
    
    slide4.addTable(
      [
        [{ text: 'Học sinh', options: { bold: true, fill: { color: 'FEF3C7' }, color: '92400E' } }, 
         { text: 'Tổ', options: { bold: true, fill: { color: 'FEF3C7' }, color: '92400E' } }, 
         { text: 'Ngày trực', options: { bold: true, fill: { color: 'FEF3C7' }, color: '92400E' } }, 
         { text: 'Nhiệm vụ', options: { bold: true, fill: { color: 'FEF3C7' }, color: '92400E' } }],
        ...penaltyData
      ],
      { x: 0.5, y: 1.5, w: 9, rowH: 0.6, fontSize: 14, border: { type: 'solid', color: 'CBD5E1', pt: 1 } }
    );
  } else {
    slide4.addText('Tuyệt vời! Không có học sinh nào bị phạt trực nhật trong tuần này.', {
      x: 1, y: 2.5, fontSize: 20, color: '10B981', italic: true, align: 'center'
    });
  }

  pres.writeFile({ fileName: `SlideSinhHoat_12A10_Tuan${weekNumber}.pptx` });
}
