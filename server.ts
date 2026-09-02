import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy init Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(customKey?: string): GoogleGenAI {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: 'Hệ thống Quản lý Thi đua 12A10',
    timestamp: new Date().toISOString(),
  });
});

// Server-side Gemini API Proxy
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const {
      prompt,
      model = 'gemini-3.7-flash',
      systemInstruction,
      highThinking = false,
      apiKey: customKey,
      temperature = 0.7,
      responseMimeType,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Nội dung prompt không được để trống.' });
    }

    const ai = getGeminiClient(customKey);
    
    // Choose selected model
    const selectedModel = highThinking ? 'gemini-3.1-pro-preview' : model;

    const config: any = {
      systemInstruction: systemInstruction || 'Bạn là Trợ lý AI Cố vấn Học tập và Thi đua của lớp 12A10 trường THPT Yên Thế (niên khóa 2026-2027). Hãy trả lời bằng tiếng Việt trang nhã, truyền cảm hứng, chuyên nghiệp và chính xác.',
      temperature: highThinking ? undefined : temperature,
    };

    if (highThinking) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    if (responseMimeType) {
      config.responseMimeType = responseMimeType;
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config,
    });

    const text = response.text || '';
    res.json({ text, modelUsed: selectedModel });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error.message || 'Lỗi xử lý yêu cầu AI.',
      details: error.toString(),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
