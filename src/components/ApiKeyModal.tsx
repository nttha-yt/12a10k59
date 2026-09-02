import React, { useState, useEffect } from 'react';
import { Key, X, Brain, Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isForceMode?: boolean; // If true, user cannot close without a key
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, isForceMode = false }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-pro-preview');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const models = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', desc: 'Nhanh, hiệu quả cao' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', desc: 'Mặc định - Suy luận sâu sắc, chính xác' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Phiên bản cũ ổn định' }
  ];

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(savedKey);
      
      const savedModel = localStorage.getItem('gemini_preferred_model') || 'gemini-3-pro-preview';
      setSelectedModel(savedModel);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      localStorage.setItem('gemini_preferred_model', selectedModel);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
        // Dispatch an event so other components know the key changed
        window.dispatchEvent(new Event('gemini_key_updated'));
      }, 800);
    } else {
      alert('Vui lòng nhập API Key hợp lệ!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 dark:bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-sm">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Thiết Lập Gemini AI</h3>
              <p className="text-xs text-purple-200">Cấu hình API Key & Model Trợ lý</p>
            </div>
          </div>
          {!isForceMode && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* API Key Input */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              API Key (Bắt Buộc)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Để sử dụng tính năng AI, bạn cần có API Key từ Google AI Studio. 
              <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1 font-semibold">
                Lấy API Key tại đây
              </a>.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Chọn Model AI
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {models.map(model => (
                <div 
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedModel === model.id 
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{model.name}</span>
                    {selectedModel === model.id && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{model.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {isForceMode && !apiKey && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                Hệ thống nhận thấy bạn chưa cấu hình API Key. Vui lòng nhập API Key để tiếp tục sử dụng ứng dụng. Key của bạn chỉ lưu cục bộ trên trình duyệt này.
              </p>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              Đã lưu cấu hình AI thành công!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          {!isForceMode && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Lưu & Kích Hoạt AI
          </button>
        </div>
      </div>
    </div>
  );
};
