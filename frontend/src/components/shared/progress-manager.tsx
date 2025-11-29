"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress, UserProgress } from "@/hooks/useProgress";
import { useToast } from "./toast";

interface ProgressManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressManager({ isOpen, onClose }: ProgressManagerProps) {
  const { progress, resetProgress } = useProgress();
  const { addToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Export progress as JSON file
  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(progress, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `pylearn-progress-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        type: "success",
        title: "Прогресс экспортирован",
        description: "Файл сохранён на ваш компьютер",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать прогресс",
      });
    }
  }, [progress, addToast]);

  // Import progress from JSON file
  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text) as UserProgress;

        // Validate structure
        if (
          !imported.completedGuides ||
          !Array.isArray(imported.completedGuides) ||
          !imported.achievements ||
          !Array.isArray(imported.achievements)
        ) {
          throw new Error("Invalid format");
        }

        // Save to localStorage
        localStorage.setItem("pylearn-progress", JSON.stringify(imported));
        
        addToast({
          type: "success",
          title: "Прогресс импортирован",
          description: "Перезагрузите страницу для применения",
        });

        // Reload after short delay
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        addToast({
          type: "error",
          title: "Ошибка импорта",
          description: "Неверный формат файла",
        });
      }
    };

    input.click();
  }, [addToast]);

  // Reset all progress
  const handleReset = useCallback(() => {
    resetProgress();
    setShowResetConfirm(false);
    addToast({
      type: "success",
      title: "Прогресс сброшен",
      description: "Все данные удалены",
    });
    onClose();
  }, [resetProgress, addToast, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div
              className="rounded-xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <h2 className="font-semibold">Управление прогрессом</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Stats summary */}
                <div
                  className="p-4 rounded-xl mb-4"
                  style={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                >
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-lg font-bold">{progress.completedGuides.length}</div>
                      <div className="text-muted-foreground text-xs">Уроков</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{progress.achievements.length}</div>
                      <div className="text-muted-foreground text-xs">Достижений</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{progress.typingStats.length}</div>
                      <div className="text-muted-foreground text-xs">Тренировок</div>
                    </div>
                  </div>
                </div>

                {/* Export button */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4" />
                  Экспортировать прогресс
                </Button>

                {/* Import button */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleImport}
                >
                  <Upload className="w-4 h-4" />
                  Импортировать прогресс
                </Button>

                {/* Reset button */}
                {!showResetConfirm ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:border-red-500/50"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Сбросить весь прогресс
                  </Button>
                ) : (
                  <div
                    className="p-4 rounded-xl space-y-3"
                    style={{
                      backgroundColor: "hsl(0 70% 50% / 0.1)",
                      border: "1px solid hsl(0 70% 50% / 0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Вы уверены?</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Это действие нельзя отменить. Весь прогресс будет удалён.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Отмена
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleReset}
                      >
                        Да, сбросить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
