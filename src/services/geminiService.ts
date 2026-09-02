/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, ScoreLogEntry, PenaltyAssignment, QuizQuestion } from '../types';

const FALLBACK_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
];

export interface GeminiCallParams {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  highThinking?: boolean;
  temperature?: number;
  responseMimeType?: string;
  customApiKey?: string;
}

export async function callGeminiAI(params: GeminiCallParams): Promise<{ text: string; modelUsed: string }> {
  const {
    prompt,
    systemInstruction,
    highThinking = false,
    temperature = 0.7,
    responseMimeType,
    customApiKey,
  } = params;

  // Prefer custom key or one from localStorage
  const localKey = customApiKey || (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null);
  if (!localKey) {
    throw new Error('Chưa thể kết nối tới dịch vụ Gemini AI. Vui lòng lấy API Key để tiếp tục.');
  }

  // Get preferred model from localStorage or use default
  let preferredModel = (typeof window !== 'undefined' ? localStorage.getItem('gemini_preferred_model') : null) || 'gemini-3-pro-preview';
  
  // If highThinking is enabled, we force gemini-3.1-pro-preview according to previous code, 
  // but AI_INSTRUCTIONS says to use gemini-3-pro-preview for default.
  // For safety and compatibility with previous UI, if highThinking is enabled, we use gemini-3.1-pro-preview or gemini-3-pro-preview.
  if (highThinking) {
    preferredModel = 'gemini-3.1-pro-preview'; // Or gemini-3-pro-preview depending on what they actually have access to
  }

  // Determine the sequence of models to try
  const modelsToTry = [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)];
  let lastError: Error | null = null;

  for (const currentModel of modelsToTry) {
    try {
      const bodyPayload: any = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: highThinking ? undefined : temperature,
        },
      };

      if (systemInstruction) {
        bodyPayload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      if (responseMimeType) {
        bodyPayload.generationConfig.responseMimeType = responseMimeType;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${localKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        }
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error(`Lỗi Xác Thực (${response.status}): API Key không hợp lệ hoặc không có quyền truy cập.`);
      }
      if (response.status === 429) {
        // Quota error, try next model or throw if last
        lastError = new Error(`429 RESOURCE_EXHAUSTED: Model ${currentModel} đã hết quota.`);
        console.warn(lastError.message);
        continue;
      }
      if (!response.ok) {
        throw new Error(`Lỗi API (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text, modelUsed: currentModel };
      }
    } catch (e: any) {
      lastError = e;
      console.warn(`Error with ${currentModel}:`, e);
      // If it's an auth error, don't bother trying other models because the key is invalid
      if (e.message.includes('Lỗi Xác Thực')) {
        throw e;
      }
    }
  }

  throw lastError || new Error('Không thể tạo nội dung từ AI. Vui lòng thử lại sau.');
}

/**
 * Sinh Báo cáo Tổng kết Thi đua Tuần cho Giáo viên Chủ nhiệm
 */
export async function generateWeeklyEvaluationReport(
  weekNumber: number,
  groupScores: { group: number; totalScore: number; avgScore: number; topStudent: string; rank: number }[],
  penalties: PenaltyAssignment[],
  logs: ScoreLogEntry[],
  highThinking: boolean = false
): Promise<string> {
  const prompt = `
Dưới đây là số liệu thi đua tuần ${weekNumber} của lớp 12A10 trường THPT Yên Thế (niên khóa 2026-2027):

1. Bảng xếp hạng các Tổ:
${groupScores.map(g => `- Hạng ${g.rank}: Tổ ${g.group} (Tổng điểm: ${g.totalScore.toFixed(1)}, Trung bình: ${g.avgScore.toFixed(1)}, Xuất sắc nhất: ${g.topStudent})`).join('\n')}

2. Danh sách học sinh xếp cuối mỗi tổ và được phân công trực nhật phạt:
${penalties.map(p => `- Em ${p.studentName} (${p.studentCode}, Tổ ${p.group}): ${p.totalScore}đ. Lỗi: ${p.note}. Nhiệm vụ: ${p.dutyTask} vào ${p.dutyDay}`).join('\n')}

3. Tóm tắt một số vi phạm và điểm thưởng trong tuần:
${logs.slice(0, 10).map(l => `- [${l.category.toUpperCase()}] ${l.studentName} (Tổ ${l.group}): ${l.points > 0 ? '+' : ''}${l.points}đ - ${l.criterionName} (${l.note || ''})`).join('\n')}

YÊU CẦU:
Hãy viết một bản "BÁO CÁO ĐÁNH GIÁ THI ĐUA & NỀ NẾP TUẦN ${weekNumber}" cho Giáo viên Chủ nhiệm (Cô Ninh Thị Thu Hà) để phổ biến trong tiết Sinh hoạt lớp thứ Bảy.
Báo cáo gồm các mục:
1. Đánh giá chung (Khái quát tinh thần thi đua, điểm trung bình lớp).
2. Tuyên dương tập thể & cá nhân xuất sắc (Khen ngợi tổ dẫn đầu, các bạn đạt điểm 10/giải thưởng).
3. Nhận xét kỷ luật & Nhắc nhở nghiêm túc (Phân tích các vi phạm còn tồn tại như đi muộn, điện thoại, thiếu bài tập).
4. Phổ biến lịch trực nhật khắc phục (Nhắc nhở 8 học sinh trực nhật phạt làm tròn trách nhiệm với thái độ tích cực).
5. Kế hoạch & Mục tiêu tuần tiếp theo (Chỉ tiêu cụ thể để đưa lớp 12A10 vào Top 3 khối 12 toàn trường THPT Yên Thế).

Phong cách: Trang trọng, chuẩn mực sư phạm, vừa nghiêm khắc răn đe vừa bao dung, khích lệ tinh thần học trò lớp 12. Định dạng Markdown đẹp mắt.
`;

  const result = await callGeminiAI({
    prompt,
    highThinking,
    systemInstruction: 'Bạn là Trợ lý Cố vấn Sư phạm của lớp 12A10 THPT Yên Thế. Hãy tạo báo cáo tổng kết tuần sâu sắc và truyền cảm hứng.',
  });

  return result.text;
}

/**
 * Sinh Tin nhắn Zalo/SMS cá nhân hóa gửi Phụ huynh học sinh
 */
export async function generateParentMessage(
  student: Student,
  score: number,
  weekNumber: number,
  penalties: PenaltyAssignment[],
  logs: ScoreLogEntry[],
  highThinking: boolean = false
): Promise<string> {
  const penalty = penalties.find(p => p.studentId === student.id);
  const studentLogs = logs.filter(l => l.studentId === student.id);

  const prompt = `
Hãy soạn một tin nhắn Zalo gửi đến phụ huynh của học sinh lớp 12A10 THPT Yên Thế:
- Tên học sinh: ${student.name} (${student.code}, Tổ ${student.group})
- Tên phụ huynh: Bác ${student.parentName}
- Tuần học: Tuần ${weekNumber}
- Tổng điểm thi đua tuần: ${score}/100 điểm
- Tình trạng: ${penalty ? `Thuộc nhóm 2 bạn thấp điểm nhất Tổ ${student.group} do vi phạm (${penalty.note}) và được phân công trực nhật phạt vào ${penalty.dutyDay}` : 'Rèn luyện và học tập tốt, không có vi phạm lớn'}
- Chi tiết ghi nhận trong tuần:
${studentLogs.length > 0 ? studentLogs.map(l => `+ ${l.criterionName}: ${l.points > 0 ? '+' : ''}${l.points}đ (${l.note || ''})`).join('\n') : '+ Không có vi phạm'}

YÊU CẦU:
1. Lời chào kính trọng: "Kính gửi Bác ${student.parentName}, GVCN lớp 12A10 THPT Yên Thế xin thông báo..."
2. Nêu rõ kết quả thi đua và các điểm cần gia đình phối hợp nhắc nhở (nếu có phạt trực nhật) hoặc chúc mừng biểu dương (nếu điểm cao).
3. Giữ lời văn nhẹ nhàng, xây dựng, chân thành vì sự tiến bộ của học sinh trước kỳ thi tốt nghiệp THPT.
4. Độ dài vừa phải, phù hợp để gửi trực tiếp qua Zalo/SMS.
`;

  const result = await callGeminiAI({
    prompt,
    highThinking,
    systemInstruction: 'Bạn là Giáo viên chủ nhiệm lớp 12A10. Hãy soạn tin nhắn Zalo chuẩn mực, tôn trọng và ấm áp gửi phụ huynh.',
  });

  return result.text;
}

/**
 * Sinh Kế hoạch Rèn luyện & Khắc phục cho Học sinh
 */
export async function generateStudentRecoveryPlan(
  student: Student,
  score: number,
  penalties: PenaltyAssignment[],
  logs: ScoreLogEntry[],
  highThinking: boolean = false
): Promise<string> {
  const prompt = `
Học sinh ${student.name} (Tổ ${student.group}, Lớp 12A10 THPT Yên Thế) tuần này đạt ${score}/100 điểm thi đua.
Các lỗi vi phạm gần đây:
${logs.filter(l => l.studentId === student.id && l.points < 0).map(l => `- ${l.criterionName}: ${l.note || ''}`).join('\n') || '- Cần cải thiện tính chuyên cần'}

Hãy thiết kế một "KẾ HOẠCH HÀNH ĐỘNG 7 NGÀY ĐỔI MỚI BẢN THÂN" cho bạn ${student.name}:
1. Phân tích nguyên nhân thói quen (đi muộn, điện thoại, thiếu bài tập...).
2. Lộ trình 7 ngày thay đổi (Mỗi ngày 1 thói quen nhỏ: dậy sớm hơn 15p, cất điện thoại trước 22h, kiểm tra bài vở trước khi ngủ...).
3. Cách ghi điểm cộng bù lại trong tuần sau (Phát biểu xây dựng bài, làm bài tập đầy đủ, trực nhật gương mẫu).
4. Lời chúc và động viên ngắn gọn từ Ban cán sự và GVCN.

Định dạng Markdown dễ đọc, thân thiện với học sinh cấp 3.
`;

  const result = await callGeminiAI({
    prompt,
    highThinking,
  });

  return result.text;
}

/**
 * Tạo câu hỏi trắc nghiệm ôn tập thông minh
 */
export async function generateAIQuizQuestions(
  subjectName: string,
  topic: string,
  count: number = 3,
  highThinking: boolean = false
): Promise<QuizQuestion[]> {
  const prompt = `
Hãy tạo ${count} câu hỏi trắc nghiệm khách quan 4 lựa chọn (A, B, C, D) cho môn ${subjectName}, chủ đề: "${topic}" theo chương trình THPT lớp 12.
Yêu cầu trả về đúng định dạng JSON:
[
  {
    "id": "gen_1",
    "subjectId": "ai_gen",
    "content": "Nội dung câu hỏi...",
    "type": "multiple_choice",
    "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
    "correctAnswer": 0,
    "explanation": "Lời giải chi tiết và căn cứ kiến thức...",
    "difficulty": "medium"
  }
]
`;

  const result = await callGeminiAI({
    prompt,
    highThinking,
    responseMimeType: 'application/json',
    systemInstruction: 'Bạn là chuyên gia ra đề thi THPT Quốc gia. Hãy trả về JSON hợp lệ theo đúng schema được yêu cầu.',
  });

  try {
    const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(cleaned);
    return questions.map((q: any, i: number) => ({
      ...q,
      id: `ai_q_${Date.now()}_${i}`,
      subjectId: 'sub_ai',
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
    }));
  } catch (err) {
    console.error('Failed to parse AI questions JSON:', err);
    return [];
  }
}

/**
 * Tự động phân tích và tạo tin nhắn Cảnh báo / Tuyên dương Phụ huynh cho toàn lớp
 */
export async function generateParentAlerts(
  students: Student[],
  studentSummaries: { student: Student; totalScore: number }[],
  penalties: PenaltyAssignment[],
  currentWeek: number,
  highThinking: boolean = false
): Promise<Array<{ studentId: string; type: 'khen_thuong' | 'canh_bao'; messageTemplate: string; reason: string }>> {
  // Lọc ra các học sinh xuất sắc (Top 5) và học sinh bị phạt
  const sortedSummaries = [...studentSummaries].sort((a, b) => b.totalScore - a.totalScore);
  const topStudents = sortedSummaries.slice(0, 5);
  const penalizedStudentIds = penalties.filter(p => p.weekNumber === currentWeek).map(p => p.studentId);
  
  // Chỉ gửi API cho những học sinh cần chú ý (Top 5 hoặc bị phạt) để tiết kiệm token
  const targetStudents = sortedSummaries.filter(
    s => topStudents.some(ts => ts.student.id === s.student.id) || penalizedStudentIds.includes(s.student.id)
  );

  const studentDataStr = targetStudents.map(s => {
    const isPenalized = penalizedStudentIds.includes(s.student.id);
    const penaltyDetail = isPenalized ? penalties.find(p => p.studentId === s.student.id) : null;
    return `
    - ID: ${s.student.id}
    - Tên: ${s.student.name} (Phụ huynh: ${s.student.parentName})
    - Điểm thi đua: ${s.totalScore}
    - Bị phạt: ${isPenalized ? `Có (Nhiệm vụ: ${penaltyDetail?.dutyTask}, Lỗi: ${penaltyDetail?.note})` : 'Không'}
    `;
  }).join('\n');

  const prompt = `
Dưới đây là danh sách các học sinh cần chú ý trong tuần ${currentWeek} của lớp 12A10:
${studentDataStr}

Yêu cầu:
Với mỗi học sinh trong danh sách trên, hãy tự động phân tích và đóng vai Giáo viên Chủ nhiệm (Cô Thu Hà) soạn 1 tin nhắn Zalo/SMS ngắn gọn gọn (khoảng 2-3 câu) để gửi cho phụ huynh.
- Nếu học sinh không bị phạt và có điểm cao: Viết tin nhắn 'khen_thuong'.
- Nếu học sinh bị phạt: Viết tin nhắn 'canh_bao' khéo léo, nhắc phụ huynh phối hợp rèn luyện.

Trả về kết quả chuẩn định dạng JSON mảng các object:
[
  {
    "studentId": "ID học sinh",
    "type": "khen_thuong" hoặc "canh_bao",
    "messageTemplate": "Nội dung tin nhắn hoàn chỉnh...",
    "reason": "Lý do ngắn gọn vì sao lại nhắn tin này (Vd: Nằm trong top 5 xuất sắc, hoặc bị phạt trực nhật do nói chuyện riêng)"
  }
]
`;

  const result = await callGeminiAI({
    prompt,
    highThinking,
    responseMimeType: 'application/json',
    systemInstruction: 'Bạn là Hệ thống AI phân tích dữ liệu lớp học và soạn tin nhắn tự động. Luôn trả về JSON.',
  });

  try {
    const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse Parent Alerts JSON:', err);
    throw new Error('Định dạng dữ liệu trả về từ AI không hợp lệ.');
  }
}
