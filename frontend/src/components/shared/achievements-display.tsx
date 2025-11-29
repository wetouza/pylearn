"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, Share2 } from "lucide-react";
import { achievements, getAchievementById, rarityColors, Achievement } from "@/data/achievements";
import { useProgress } from "@/hooks/useProgress";
import { ShareAchievementModal } from "./share-achievement";

interface AchievementsDisplayProps {
  showLocked?: boolean;
  compact?: boolean;
}

export function AchievementsDisplay({ showLocked = true, compact = false }: AchievementsDisplayProps) {
  const { progress } = useProgress();
  const [shareAchievement, setShareAchievement] = useState<Achievement | null>(null);
  
  const unlockedIds = new Set(progress.achievements);
  
  const displayAchievements = showLocked 
    ? achievements 
    : achievements.filter(a => unlockedIds.has(a.id));

  if (displayAchievements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Пока нет достижений</p>
        <p className="text-sm">Продолжай учиться, чтобы получить первое!</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {displayAchievements.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform hover:scale-110"
                style={{
                  background: isUnlocked 
                    ? `${rarityColors[achievement.rarity]}20` 
                    : "hsl(var(--muted))",
                  opacity: isUnlocked ? 1 : 0.4,
                }}
              >
                {isUnlocked ? achievement.icon : <Lock className="w-4 h-4" />}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              >
                <div className="font-medium text-sm">{achievement.title}</div>
                <div className="text-xs text-muted-foreground">{achievement.description}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayAchievements.map((achievement, index) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative p-4 rounded-xl transition-all group cursor-pointer"
              style={{
                background: isUnlocked 
                  ? `${rarityColors[achievement.rarity]}10` 
                  : "hsl(var(--muted))",
                border: `1px solid ${isUnlocked ? `${rarityColors[achievement.rarity]}30` : "hsl(var(--border))"}`,
                opacity: isUnlocked ? 1 : 0.6,
              }}
              onClick={() => isUnlocked && setShareAchievement(achievement)}
            >
              {/* Share button (visible on hover for unlocked) */}
              {isUnlocked && (
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareAchievement(achievement);
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}
              
              {/* Rarity indicator */}
              <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full group-hover:opacity-0 transition-opacity"
                style={{ background: rarityColors[achievement.rarity] }}
              />
              
              {/* Icon */}
              <div className="text-3xl mb-2">
                {isUnlocked ? achievement.icon : "🔒"}
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-sm mb-1">
                {achievement.title}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground">
                {achievement.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Share modal */}
      {shareAchievement && (
        <ShareAchievementModal
          achievement={shareAchievement}
          onClose={() => setShareAchievement(null)}
        />
      )}
    </>
  );
}

// Single achievement notification
export function AchievementUnlocked({ achievementId }: { achievementId: string }) {
  const achievement = getAchievementById(achievementId);
  
  if (!achievement) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
      style={{
        background: "hsl(var(--card))",
        border: `1px solid ${rarityColors[achievement.rarity]}50`,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: `${rarityColors[achievement.rarity]}20` }}
      >
        {achievement.icon}
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Достижение получено!</div>
        <div className="font-semibold">{achievement.title}</div>
      </div>
    </motion.div>
  );
}
