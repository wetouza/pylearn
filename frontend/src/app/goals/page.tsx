"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Trophy,
  Flame,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Star,
  Zap,
  Settings,
  Keyboard,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { useProgress } from "@/hooks/useProgress";
import { useAchievementNotification } from "@/hooks/useAchievementNotification";
import { AchievementsDisplay } from "@/components/shared/achievements-display";
import { ProgressManager } from "@/components/shared/progress-manager";
import { achievements as allAchievements } from "@/data/achievements";
import { guides } from "@/data/guides";

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  milestones: Milestone[];
  createdAt: Date;
  priority: "low" | "medium" | "high";
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

// Demo data
const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Изучить основы Python",
    description: "Пройти все уроки раздела 'Основы'",
    progress: 60,
    priority: "high",
    createdAt: new Date(),
    milestones: [
      { id: "1-1", title: "Что такое Python", completed: true },
      { id: "1-2", title: "Первая программа", completed: true },
      { id: "1-3", title: "Переменные", completed: true },
      { id: "1-4", title: "Типы данных", completed: false },
      { id: "1-5", title: "Ввод/вывод", completed: false },
    ],
  },
  {
    id: "2",
    title: "Настроить рабочее окружение",
    description: "Установить VS Code и Python",
    progress: 100,
    priority: "medium",
    createdAt: new Date(Date.now() - 86400000 * 3),
    milestones: [
      { id: "2-1", title: "Установить VS Code", completed: true },
      { id: "2-2", title: "Установить Python", completed: true },
      { id: "2-3", title: "Настроить расширения", completed: true },
    ],
  },
  {
    id: "3",
    title: "Решить 10 задач на Codewars",
    description: "Практика на реальных задачах",
    progress: 30,
    priority: "low",
    createdAt: new Date(Date.now() - 86400000),
    milestones: [
      { id: "3-1", title: "Зарегистрироваться", completed: true },
      { id: "3-2", title: "Решить 5 задач 8 kyu", completed: true },
      { id: "3-3", title: "Решить 5 задач 7 kyu", completed: true },
      { id: "3-4", title: "Решить 10 задач", completed: false },
    ],
  },
];

const achievements: Achievement[] = [
  {
    id: "first-lesson",
    title: "Первый шаг",
    description: "Пройди свой первый урок",
    icon: "🎯",
    unlocked: true,
    rarity: "common",
  },
  {
    id: "streak-3",
    title: "На волне",
    description: "Учись 3 дня подряд",
    icon: "🔥",
    unlocked: true,
    rarity: "common",
  },
  {
    id: "streak-7",
    title: "Недельный марафон",
    description: "Учись 7 дней подряд",
    icon: "⚡",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "basics-complete",
    title: "Основы освоены",
    description: "Пройди все уроки раздела 'Основы'",
    icon: "🐍",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "first-project",
    title: "Творец",
    description: "Создай свой первый проект",
    icon: "🚀",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "all-lessons",
    title: "Мастер Python",
    description: "Пройди все уроки на платформе",
    icon: "👑",
    unlocked: false,
    rarity: "legendary",
  },
];

const rarityColors = {
  common: "border-gray-500/30 bg-gray-500/10",
  rare: "border-blue-500/30 bg-blue-500/10",
  epic: "border-purple-500/30 bg-purple-500/10",
  legendary: "border-yellow-500/30 bg-yellow-500/10",
};

const priorityColors = {
  low: "badge-beginner",
  medium: "badge-basic",
  high: "badge-practice",
};

const priorityLabels = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [showProgressManager, setShowProgressManager] = useState(false);
  
  const { progress, completionPercentage, averageWpm, updateStreak } = useProgress();
  
  // Enable achievement notifications
  useAchievementNotification();
  
  // Update streak on page visit
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;

        const updatedMilestones = goal.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );

        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progressVal = Math.round(
          (completedCount / updatedMilestones.length) * 100
        );

        return { ...goal, milestones: updatedMilestones, progress: progressVal };
      })
    );
  };

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      progress: 0,
      priority: "medium",
      createdAt: new Date(),
      milestones: [],
    };

    setGoals((prev) => [newGoal, ...prev]);
    setNewGoalTitle("");
    setIsAddingGoal(false);
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const totalProgress = Math.round(
    goals.reduce((acc, g) => acc + g.progress, 0) / goals.length || 0
  );

  const completedGoals = goals.filter((g) => g.progress === 100).length;
  const unlockedAchievements = progress.achievements.length;
  const totalAchievements = allAchievements.length;

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Target className="w-4 h-4 text-neon-purple" />
                <span className="text-sm text-muted-foreground">
                  Отслеживай свой прогресс
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Твои{" "}
                <span className="gradient-text">цели</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Ставь цели, отслеживай прогресс и получай достижения.
                Каждый маленький шаг приближает тебя к мастерству!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProgressManager(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Управление прогрессом
              </Button>
            </ScrollReveal>
          </div>
        </section>

        {/* Progress Manager Modal */}
        <ProgressManager
          isOpen={showProgressManager}
          onClose={() => setShowProgressManager(false)}
        />

        {/* Stats */}
        <section className="py-8 border-y border-white/10 bg-background/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                {
                  icon: BookOpen,
                  value: progress.completedGuides.length,
                  label: "Уроков пройдено",
                  color: "text-neon-cyan",
                },
                {
                  icon: Trophy,
                  value: `${unlockedAchievements}/${totalAchievements}`,
                  label: "Достижений",
                  color: "text-python-yellow",
                },
                {
                  icon: Flame,
                  value: `${progress.streak.current} дн.`,
                  label: "Серия",
                  color: "text-orange-500",
                },
                {
                  icon: Keyboard,
                  value: averageWpm,
                  label: "Средний WPM",
                  color: "text-neon-green",
                },
                {
                  icon: Star,
                  value: progress.streak.best,
                  label: "Лучшая серия",
                  color: "text-neon-purple",
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Goals */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Мои цели</h2>
                  <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                    <DialogTrigger asChild>
                      <Button variant="glow" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Новая цель
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Создать новую цель</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          placeholder="Название цели..."
                          value={newGoalTitle}
                          onChange={(e) => setNewGoalTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addGoal()}
                        />
                        <Button onClick={addGoal} className="w-full">
                          Создать цель
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Overall progress */}
                <Card variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Общий прогресс</h3>
                      <p className="text-sm text-muted-foreground">
                        {completedGoals} из {goals.length} целей выполнено
                      </p>
                    </div>
                    <div className="text-3xl font-bold gradient-text">
                      {totalProgress}%
                    </div>
                  </div>
                  <Progress value={totalProgress} variant="gradient" />
                </Card>

                {/* Goals list */}
                <StaggerContainer className="space-y-4">
                  <AnimatePresence>
                    {goals.map((goal) => (
                      <StaggerItem key={goal.id}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                        >
                          <Card variant="glow" className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{goal.title}</h3>
                                  <Badge className={priorityColors[goal.priority]}>
                                    {priorityLabels[goal.priority]}
                                  </Badge>
                                </div>
                                {goal.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {goal.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">
                                  {goal.progress}%
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => deleteGoal(goal.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <Progress
                              value={goal.progress}
                              variant={goal.progress === 100 ? "glow" : "gradient"}
                              className="mb-4"
                            />

                            {/* Milestones */}
                            {goal.milestones.length > 0 && (
                              <div className="space-y-2">
                                {goal.milestones.map((milestone) => (
                                  <motion.button
                                    key={milestone.id}
                                    onClick={() =>
                                      toggleMilestone(goal.id, milestone.id)
                                    }
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {milestone.completed ? (
                                      <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span
                                      className={
                                        milestone.completed
                                          ? "text-muted-foreground line-through"
                                          : ""
                                      }
                                    >
                                      {milestone.title}
                                    </span>
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </Card>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </AnimatePresence>
                </StaggerContainer>
              </div>

              {/* Achievements sidebar */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Достижения</h2>

                <Card variant="glass" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-python-yellow to-orange-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-background" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {unlockedAchievements} / {totalAchievements}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        достижений получено
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={(unlockedAchievements / totalAchievements) * 100}
                    variant="gradient"
                  />
                </Card>

                <AchievementsDisplay showLocked={true} />

                {/* Motivation card */}
                <Card
                  variant="glow"
                  className="p-6 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-python-yellow" />
                    <span className="font-semibold">Совет дня</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Лучше учиться по 15 минут каждый день, чем 2 часа раз в
                    неделю. Постоянство — ключ к успеху! 🚀
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

