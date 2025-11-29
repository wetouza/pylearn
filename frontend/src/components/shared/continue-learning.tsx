"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Flame, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { guides } from "@/data/guides";

export function ContinueLearning() {
  const { progress, completionPercentage } = useProgress();

  // Find next guide to continue
  const nextGuide = useMemo(() => {
    const completedSlugs = new Set(progress.completedGuides);
    return guides.find((guide) => !completedSlugs.has(guide.slug));
  }, [progress.completedGuides]);

  // Get last completed guide
  const lastCompletedGuide = useMemo(() => {
    if (progress.completedGuides.length === 0) return null;
    const lastSlug = progress.completedGuides[progress.completedGuides.length - 1];
    return guides.find((g) => g.slug === lastSlug);
  }, [progress.completedGuides]);

  // If no progress yet, don't show this section
  if (progress.completedGuides.length === 0 && progress.typingStats.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Sparkles className="w-full h-full" style={{ color: "hsl(var(--primary))" }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--primary) / 0.2)" }}
            >
              <BookOpen className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Продолжить обучение</h2>
              <p className="text-sm text-muted-foreground">
                Ты прошёл {progress.completedGuides.length} из {guides.length} уроков
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Общий прогресс</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "hsl(var(--muted))" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(to right, hsl(var(--gradient-start)), hsl(var(--gradient-end)))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-lg font-bold">{progress.completedGuides.length}</span>
              </div>
              <span className="text-xs text-muted-foreground">Уроков</span>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold">{progress.streak.current}</span>
              </div>
              <span className="text-xs text-muted-foreground">Дней подряд</span>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-lg font-bold">{progress.achievements.length}</span>
              </div>
              <span className="text-xs text-muted-foreground">Достижений</span>
            </div>
          </div>

          {/* Next lesson */}
          {nextGuide && (
            <Link href={`/guides/${nextGuide.slug}`}>
              <motion.div
                className="flex items-center justify-between p-4 rounded-xl transition-colors"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{nextGuide.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Следующий урок</p>
                    <p className="font-medium">{nextGuide.title}</p>
                  </div>
                </div>
                <Button variant="glow" size="sm" className="gap-1">
                  Продолжить
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          )}

          {/* All completed */}
          {!nextGuide && (
            <div
              className="text-center p-6 rounded-xl"
              style={{ background: "hsl(var(--card))" }}
            >
              <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-semibold mb-1">Поздравляем! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Ты прошёл все уроки! Продолжай практиковаться на тренажёрах.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
