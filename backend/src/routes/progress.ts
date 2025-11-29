import { Router, Response } from "express";
import { body, param, validationResult } from "express-validator";
import prisma from "../config/database.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

// Получение всего прогресса пользователя
router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const progress = await prisma.userProgress.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: "desc" },
    });

    const completedCount = progress.filter((p) => p.completed).length;
    const totalTimeSpent = progress.reduce((acc, p) => acc + p.timeSpent, 0);

    res.json({
      success: true,
      data: {
        progress,
        stats: {
          total: progress.length,
          completed: completedCount,
          totalTimeSpent,
        },
      },
    });
  })
);

// Получение прогресса по конкретному уроку
router.get(
  "/:lessonSlug",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { lessonSlug } = req.params;

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonSlug: {
          userId: req.userId!,
          lessonSlug,
        },
      },
    });

    res.json({
      success: true,
      data: progress || { lessonSlug, completed: false, timeSpent: 0 },
    });
  })
);

// Обновление прогресса урока
router.post(
  "/:lessonSlug",
  [
    param("lessonSlug").notEmpty().withMessage("Slug урока обязателен"),
    body("completed").optional().isBoolean(),
    body("timeSpent").optional().isInt({ min: 0 }),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { lessonSlug } = req.params;
    const { completed, timeSpent } = req.body;

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonSlug: {
          userId: req.userId!,
          lessonSlug,
        },
      },
      update: {
        ...(completed !== undefined && {
          completed,
          completedAt: completed ? new Date() : null,
        }),
        ...(timeSpent !== undefined && {
          timeSpent: { increment: timeSpent },
        }),
      },
      create: {
        userId: req.userId!,
        lessonSlug,
        completed: completed || false,
        completedAt: completed ? new Date() : null,
        timeSpent: timeSpent || 0,
      },
    });

    // Проверяем достижения
    if (completed) {
      await checkLessonAchievements(req.userId!);
    }

    res.json({
      success: true,
      data: progress,
    });
  })
);

// Отметить урок как завершённый
router.post(
  "/:lessonSlug/complete",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { lessonSlug } = req.params;

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonSlug: {
          userId: req.userId!,
          lessonSlug,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: req.userId!,
        lessonSlug,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Проверяем достижения
    const newAchievements = await checkLessonAchievements(req.userId!);

    res.json({
      success: true,
      data: {
        progress,
        newAchievements,
      },
    });
  })
);

// Функция проверки достижений
async function checkLessonAchievements(userId: string) {
  const newAchievements: string[] = [];

  // Получаем количество завершённых уроков
  const completedCount = await prisma.userProgress.count({
    where: { userId, completed: true },
  });

  // Первый урок
  if (completedCount === 1) {
    const achievement = await unlockAchievement(userId, "first_lesson");
    if (achievement) newAchievements.push("first_lesson");
  }

  // 5 уроков
  if (completedCount === 5) {
    const achievement = await unlockAchievement(userId, "five_lessons");
    if (achievement) newAchievements.push("five_lessons");
  }

  // 10 уроков
  if (completedCount === 10) {
    const achievement = await unlockAchievement(userId, "ten_lessons");
    if (achievement) newAchievements.push("ten_lessons");
  }

  return newAchievements;
}

async function unlockAchievement(userId: string, achievementType: string) {
  const achievement = await prisma.achievement.findUnique({
    where: { type: achievementType },
  });

  if (!achievement) return null;

  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (existing) return null;

  return prisma.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
    },
  });
}

export default router;

