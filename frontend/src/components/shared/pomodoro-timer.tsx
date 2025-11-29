"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain,
  X,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "./toast";

type TimerMode = "work" | "shortBreak" | "longBreak";

interface PomodoroSettings {
  workDuration: number; // minutes
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
  const [showSettings, setShowSettings] = useState(false);
  const { addToast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get duration based on mode
  const getDuration = useCallback((m: TimerMode) => {
    switch (m) {
      case "work": return settings.workDuration * 60;
      case "shortBreak": return settings.shortBreakDuration * 60;
      case "longBreak": return settings.longBreakDuration * 60;
    }
  }, [settings]);

  // Play notification sound
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

  // Handle timer completion
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
        description: `Отличная работа! Сессий сегодня: ${newSessions}`,
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

  // Timer logic
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

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress percentage
  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

  // Mode colors
  const modeColors = {
    work: "hsl(var(--primary))",
    shortBreak: "hsl(145 60% 45%)",
    longBreak: "hsl(200 80% 50%)",
  };

  const modeLabels = {
    work: "Работа",
    shortBreak: "Короткий перерыв",
    longBreak: "Длинный перерыв",
  };

  const modeIcons = {
    work: Brain,
    shortBreak: Coffee,
    longBreak: Coffee,
  };

  const ModeIcon = modeIcons[mode];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm"
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
              className="flex items-center justify-between p-4"
              style={{ borderBottom: "1px solid hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" style={{ color: modeColors[mode] }} />
                <span className="font-semibold">Pomodoro</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode tabs */}
            <div className="flex p-2 gap-1" style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}>
              {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setTimeLeft(getDuration(m));
                    setIsRunning(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: mode === m ? "hsl(var(--background))" : "transparent",
                    color: mode === m ? modeColors[m] : "hsl(var(--muted-foreground))",
                  }}
                >
                  {m === "work" ? "Работа" : m === "shortBreak" ? "Перерыв" : "Отдых"}
                </button>
              ))}
            </div>

            {/* Timer display */}
            <div className="p-8 text-center">
              {/* Circular progress */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke={modeColors[mode]}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
                
                {/* Time display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ModeIcon className="w-6 h-6 mb-2" style={{ color: modeColors[mode] }} />
                  <div className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</div>
                  <div className="text-xs text-muted-foreground mt-1">{modeLabels[mode]}</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setTimeLeft(getDuration(mode));
                    setIsRunning(false);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="glow"
                  size="lg"
                  className="w-24 gap-2"
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
              className="flex items-center justify-center gap-6 p-4 text-sm"
              style={{ 
                backgroundColor: "hsl(var(--muted) / 0.3)",
                borderTop: "1px solid hsl(var(--border))",
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: modeColors.work }}>
                  {completedSessions}
                </div>
                <div className="text-xs text-muted-foreground">Сессий</div>
              </div>
              <div className="w-px h-8" style={{ backgroundColor: "hsl(var(--border))" }} />
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(completedSessions * settings.workDuration)}
                </div>
                <div className="text-xs text-muted-foreground">Минут</div>
              </div>
              <div className="w-px h-8" style={{ backgroundColor: "hsl(var(--border))" }} />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  🍅 {completedSessions}
                </div>
                <div className="text-xs text-muted-foreground">Помидоров</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating trigger button
export function PomodoroTrigger({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      title="Pomodoro Timer"
    >
      <Timer className="w-5 h-5 text-white" />
    </motion.button>
  );
}
