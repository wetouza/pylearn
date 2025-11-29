"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "./toast";

type TimerMode = "work" | "shortBreak" | "longBreak";

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
};

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PomodoroTimer({ isOpen, onClose }: PomodoroTimerProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getDuration = useCallback((m: TimerMode) => {
    switch (m) {
      case "work": return settings.workDuration * 60;
      case "shortBreak": return settings.shortBreakDuration * 60;
      case "longBreak": return settings.longBreakDuration * 60;
    }
  }, [settings]);

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const notes = [523.25, 659.25, 783.99, 659.25, 523.25];
      notes.forEach((freq, i) => {
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
      });
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch {
      // Audio not supported
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    
    if (settings.soundEnabled) {
      playNotificationSound();
    }

    if (mode === "work") {
      const newSessions = completedSessions + 1;
      setCompletedSessions(newSessions);
      
      addToast({
        type: "success",
        title: "🍅 Сессия завершена!",
        description: `Отличная работа! Сессий: ${newSessions}`,
      });

      if (newSessions % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode("shortBreak");
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      addToast({
        type: "info",
        title: "☕ Перерыв окончен!",
        description: "Время вернуться к учёбе",
      });
      setMode("work");
      setTimeLeft(settings.workDuration * 60);
    }
  }, [mode, completedSessions, settings, addToast, playNotificationSound]);

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isOpen, handleTimerComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

  const modeColors = {
    work: "hsl(var(--primary))",
    shortBreak: "hsl(145 60% 45%)",
    longBreak: "hsl(200 80% 50%)",
  };

  const modeLabels = {
    work: "Работа",
    shortBreak: "Перерыв",
    longBreak: "Отдых",
  };

  const ModeIcon = mode === "work" ? Brain : Coffee;

  // SVG circle calculations
  const size = 160;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998]"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[320px] pointer-events-auto"
            >
              <div
                className="rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: "1px solid hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" style={{ color: modeColors[mode] }} />
                    <span className="font-semibold text-sm">Pomodoro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      {settings.soundEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mode tabs */}
                <div className="flex p-1.5 gap-1" style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}>
                  {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setTimeLeft(getDuration(m));
                        setIsRunning(false);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all"
                      style={{
                        backgroundColor: mode === m ? "hsl(var(--background))" : "transparent",
                        color: mode === m ? modeColors[m] : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {modeLabels[m]}
                    </button>
                  ))}
                </div>

                {/* Timer display */}
                <div className="p-6 text-center">
                  {/* Circular progress - responsive */}
                  <div className="relative mx-auto mb-4" style={{ width: size, height: size }}>
                    <svg 
                      width={size} 
                      height={size} 
                      className="transform -rotate-90"
                      viewBox={`0 0 ${size} ${size}`}
                    >
                      {/* Background circle */}
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth={strokeWidth}
                      />
                      {/* Progress circle */}
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={modeColors[mode]}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    
                    {/* Time display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <ModeIcon className="w-5 h-5 mb-1" style={{ color: modeColors[mode] }} />
                      <div className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{modeLabels[mode]}</div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setTimeLeft(getDuration(mode));
                        setIsRunning(false);
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="glow"
                      className="h-9 px-6 gap-1.5 text-sm"
                      onClick={() => setIsRunning(!isRunning)}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Пауза
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Старт
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        if (mode === "work") {
                          setMode("shortBreak");
                          setTimeLeft(settings.shortBreakDuration * 60);
                        } else {
                          setMode("work");
                          setTimeLeft(settings.workDuration * 60);
                        }
                        setIsRunning(false);
                      }}
                    >
                      {mode === "work" ? <Coffee className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div
                  className="flex items-center justify-center gap-4 px-4 py-3 text-xs"
                  style={{ 
                    backgroundColor: "hsl(var(--muted) / 0.3)",
                    borderTop: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: modeColors.work }}>
                      {completedSessions}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Сессий</div>
                  </div>
                  <div className="w-px h-6" style={{ backgroundColor: "hsl(var(--border))" }} />
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {Math.round(completedSessions * settings.workDuration)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Минут</div>
                  </div>
                  <div className="w-px h-6" style={{ backgroundColor: "hsl(var(--border))" }} />
                  <div className="text-center">
                    <div className="text-lg font-bold">🍅 {completedSessions}</div>
                    <div className="text-[10px] text-muted-foreground">Помидоров</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
