"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, Trophy } from "lucide-react";

type ToastType = "success" | "error" | "info" | "achievement";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  icon?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto remove after duration
    const duration = toast.duration || (toast.type === "achievement" ? 5000 : 3000);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastElements = (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {mounted && createPortal(toastElements, document.body)}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    achievement: <Trophy className="w-5 h-5 text-yellow-500" />,
  };

  const bgColors = {
    success: "from-green-500/20 to-green-500/5",
    error: "from-red-500/20 to-red-500/5",
    info: "from-blue-500/20 to-blue-500/5",
    achievement: "from-yellow-500/20 to-yellow-500/5",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="pointer-events-auto"
    >
      <div
        className={`relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r ${bgColors[toast.type]}`}
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-start gap-3 p-4">
          <div className="flex-shrink-0">
            {toast.icon ? (
              <span className="text-2xl">{toast.icon}</span>
            ) : (
              icons[toast.type]
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: toast.duration ? toast.duration / 1000 : 3, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
          style={{
            backgroundColor: toast.type === "achievement" 
              ? "hsl(45 90% 50%)" 
              : toast.type === "success"
              ? "hsl(145 60% 45%)"
              : toast.type === "error"
              ? "hsl(0 70% 50%)"
              : "hsl(200 80% 50%)",
          }}
        />
      </div>
    </motion.div>
  );
}
