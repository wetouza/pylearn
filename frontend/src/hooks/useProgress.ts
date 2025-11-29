"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface UserProgress {
  completedGuides: string[];
  completedQuizzes: Record<string, number>; // guideId -> score
  achievements: string[];
  typingStats: TypingStats[];
  lastVisited: string | null;
  streak: {
    current: number;
    lastDate: string | null;
    best: number;
  };
}

export interface TypingStats {
  date: string;
  wpm: number;
  accuracy: number;
  mode: string;
  duration: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  completedGuides: [],
  completedQuizzes: {},
  achievements: [],
  typingStats: [],
  lastVisited: null,
  streak: {
    current: 0,
    lastDate: null,
    best: 0,
  },
};

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    "pylearn-progress",
    DEFAULT_PROGRESS
  );

  // Mark guide as completed
  const completeGuide = useCallback(
    (guideId: string) => {
      setProgress((prev) => {
        if (prev.completedGuides.includes(guideId)) return prev;
        
        const newCompleted = [...prev.completedGuides, guideId];
        const newAchievements = [...prev.achievements];
        
        // Check for achievements
        if (newCompleted.length === 1 && !newAchievements.includes("first-lesson")) {
          newAchievements.push("first-lesson");
        }
        if (newCompleted.length === 5 && !newAchievements.includes("five-lessons")) {
          newAchievements.push("five-lessons");
        }
        if (newCompleted.length === 10 && !newAchievements.includes("ten-lessons")) {
          newAchievements.push("ten-lessons");
        }
        
        return {
          ...prev,
          completedGuides: newCompleted,
          achievements: newAchievements,
        };
      });
    },
    [setProgress]
  );

  // Save quiz result
  const saveQuizResult = useCallback(
    (guideId: string, score: number) => {
      setProgress((prev) => {
        const currentScore = prev.completedQuizzes[guideId] || 0;
        if (score <= currentScore) return prev;
        
        const newAchievements = [...prev.achievements];
        
        // Perfect score achievement
        if (score === 100 && !newAchievements.includes("perfect-quiz")) {
          newAchievements.push("perfect-quiz");
        }
        
        return {
          ...prev,
          completedQuizzes: {
            ...prev.completedQuizzes,
            [guideId]: score,
          },
          achievements: newAchievements,
        };
      });
    },
    [setProgress]
  );

  // Save typing stats
  const saveTypingStats = useCallback(
    (stats: Omit<TypingStats, "date">) => {
      setProgress((prev) => {
        const newStats: TypingStats = {
          ...stats,
          date: new Date().toISOString(),
        };
        
        const newAchievements = [...prev.achievements];
        
        // Typing achievements
        if (stats.wpm >= 50 && !newAchievements.includes("typing-50wpm")) {
          newAchievements.push("typing-50wpm");
        }
        if (stats.wpm >= 80 && !newAchievements.includes("typing-80wpm")) {
          newAchievements.push("typing-80wpm");
        }
        if (stats.accuracy === 100 && !newAchievements.includes("typing-perfect")) {
          newAchievements.push("typing-perfect");
        }
        
        // Keep only last 100 stats
        const typingStats = [...prev.typingStats, newStats].slice(-100);
        
        return {
          ...prev,
          typingStats,
          achievements: newAchievements,
        };
      });
    },
    [setProgress]
  );

  // Update streak
  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const today = new Date().toISOString().split("T")[0];
      const lastDate = prev.streak.lastDate;
      
      if (lastDate === today) return prev;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      let newCurrent = 1;
      if (lastDate === yesterdayStr) {
        newCurrent = prev.streak.current + 1;
      }
      
      const newBest = Math.max(prev.streak.best, newCurrent);
      const newAchievements = [...prev.achievements];
      
      // Streak achievements
      if (newCurrent >= 7 && !newAchievements.includes("streak-7")) {
        newAchievements.push("streak-7");
      }
      if (newCurrent >= 30 && !newAchievements.includes("streak-30")) {
        newAchievements.push("streak-30");
      }
      
      return {
        ...prev,
        streak: {
          current: newCurrent,
          lastDate: today,
          best: newBest,
        },
        achievements: newAchievements,
        lastVisited: today,
      };
    });
  }, [setProgress]);

  // Check if guide is completed
  const isGuideCompleted = useCallback(
    (guideId: string) => progress.completedGuides.includes(guideId),
    [progress.completedGuides]
  );

  // Get completion percentage
  const completionPercentage = useMemo(() => {
    const totalGuides = 10; // Update this based on actual guide count
    return Math.round((progress.completedGuides.length / totalGuides) * 100);
  }, [progress.completedGuides]);

  // Get average typing WPM
  const averageWpm = useMemo(() => {
    if (progress.typingStats.length === 0) return 0;
    const sum = progress.typingStats.reduce((acc, stat) => acc + stat.wpm, 0);
    return Math.round(sum / progress.typingStats.length);
  }, [progress.typingStats]);

  // Reset progress
  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, [setProgress]);

  return {
    progress,
    completeGuide,
    saveQuizResult,
    saveTypingStats,
    updateStreak,
    isGuideCompleted,
    completionPercentage,
    averageWpm,
    resetProgress,
  };
}
