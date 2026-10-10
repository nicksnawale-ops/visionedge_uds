import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'critical';
  duration?: number; // ms, or 0 for persistent
}

interface ToastContextType {
  showToast: (message: string, type?: ToastItem['type'], duration?: number) => void;
  copyToClipboard: (text: string, label?: string) => Promise<void>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'info', duration = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, label?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(label ? `Copied ${label}` : `Copied: ${text}`, 'success', 2500);
      } catch {
        // Fallback for older browsers or constrained contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(label ? `Copied ${label}` : `Copied: ${text}`, 'success', 2500);
      }
    },
    [showToast]
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, copyToClipboard }}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          let leftBorder = 'border-l-[#1E63FF]'; // Royal blue info
          let icon = <Info className="w-4 h-4 text-[#1E63FF] shrink-0" />;

          if (toast.type === 'success') {
            leftBorder = 'border-l-[#00C6FF]'; // Cyan accent
            icon = <CheckCircle2 className="w-4 h-4 text-[#00C6FF] shrink-0" />;
          } else if (toast.type === 'critical') {
            leftBorder = 'border-l-[#0B2D6B]'; // Deep navy critical
            icon = <AlertCircle className="w-4 h-4 text-[#0B2D6B] shrink-0" />;
          } else if (toast.type === 'warning') {
            leftBorder = 'border-l-[#D97706]';
            icon = <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto bg-white border border-[#DDE2EA] border-l-4 ${leftBorder} rounded-[8px] p-3 shadow-[0_4px_12px_rgba(11,45,107,0.12)] flex items-center justify-between gap-3 text-[14px] text-[#121722] font-medium transition-all duration-200 animate-in fade-in slide-in-from-top-2`}
              role="status"
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#6B7485] hover:text-[#121722] p-1 rounded hover:bg-[#F7F9FC] transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
