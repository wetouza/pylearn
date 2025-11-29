"use client";

import { useEffect, useRef, useCallback } from "react";
import { useProgress } from "./useProgress";
import { useToast } from "@/components/shared/toast";
import { getAchievementById } from "@/data/achievements";

export function useAchievementNotification() {
  const { progress } = useProgress();
  const { addToast } = useToast();
  const previousAchievementsRef = useRef<string[]>([]);
  const isInitializedRef = useRef(false);

  // Check for new achievements
  useEffect(() => {
    // Skip first render to avoid showing all existing achievements
    if (!isInitializedRef.current) {
      previousAchievementsRef.current = [...progress.achievements];
      isInitializedRef.current = true;
      return;
    }

    // Find new achievements
    const newAchievements = progress.achievements.filter(
      (id) => !previousAchievementsRef.current.includes(id)
    );

    // Show toast for each new achievement
    newAchievements.forEach((achievementId) => {
      const achievement = getAchievementById(achievementId);
      if (achievement) {
        addToast({
          type: "achievement",
          title: `🏆 ${achievement.title}`,
          description: achievement.description,
          icon: achievement.icon,
          duration: 5000,
        });
      }
    });

    // Update previous achievements
    previousAchievementsRef.current = [...progress.achievements];
  }, [progress.achievements, addToast]);

  // Manual trigger for testing
  const triggerAchievementNotification = useCallback(
    (achievementId: string) => {
      const achievement = getAchievementById(achievementId);
      if (achievement) {
        addToast({
          type: "achievement",
          title: `🏆 ${achievement.title}`,
          description: achievement.description,
          icon: achievement.icon,
          duration: 5000,
        });
      }
    },
    [addToast]
  );

  return { triggerAchievementNotification };
}
