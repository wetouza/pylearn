import { Router, Response } from "express";
import { body, param, validationResult } from "express-validator";
import prisma from "../config/database.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

// Получение всех целей
router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: goals,
    });
  })
);

// Получение одной цели
router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const goal = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!goal) {
      throw new AppError("Цель не найдена", 404);
    }

    res.json({
      success: true,
      data: goal,
    });
  })
);

// Создание цели
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Название цели обязательно"),
    body("description").optional().trim(),
    body("targetDate").optional().isISO8601(),
    body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
    body("milestones").optional().isArray(),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { title, description, targetDate, priority, milestones } = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId!,
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        priority: priority || "MEDIUM",
        milestones: milestones
          ? {
              create: milestones.map((m: { title: string }, index: number) => ({
                title: m.title,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  })
);

// Обновление цели
router.patch(
  "/:id",
  [
    body("title").optional().trim().notEmpty(),
    body("description").optional().trim(),
    body("status").optional().isIn(["ACTIVE", "COMPLETED", "PAUSED"]),
    body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { id } = req.params;
    const { title, description, status, priority, targetDate } = req.body;

    // Проверяем, что цель принадлежит пользователю
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingGoal) {
      throw new AppError("Цель не найдена", 404);
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(targetDate !== undefined && {
          targetDate: targetDate ? new Date(targetDate) : null,
        }),
      },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    res.json({
      success: true,
      data: goal,
    });
  })
);

// Удаление цели
router.delete(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingGoal) {
      throw new AppError("Цель не найдена", 404);
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Цель удалена",
    });
  })
);

// Добавление milestone
router.post(
  "/:id/milestones",
  [body("title").trim().notEmpty().withMessage("Название этапа обязательно")],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { id } = req.params;
    const { title } = req.body;

    const goal = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
      include: { milestones: true },
    });

    if (!goal) {
      throw new AppError("Цель не найдена", 404);
    }

    const milestone = await prisma.milestone.create({
      data: {
        goalId: id,
        title,
        order: goal.milestones.length,
      },
    });

    // Пересчитываем прогресс
    await recalculateGoalProgress(id);

    res.status(201).json({
      success: true,
      data: milestone,
    });
  })
);

// Переключение статуса milestone
router.patch(
  "/:goalId/milestones/:milestoneId/toggle",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { goalId, milestoneId } = req.params;

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId: req.userId },
    });

    if (!goal) {
      throw new AppError("Цель не найдена", 404);
    }

    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, goalId },
    });

    if (!milestone) {
      throw new AppError("Этап не найден", 404);
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        completed: !milestone.completed,
        completedAt: !milestone.completed ? new Date() : null,
      },
    });

    // Пересчитываем прогресс цели
    await recalculateGoalProgress(goalId);

    res.json({
      success: true,
      data: updatedMilestone,
    });
  })
);

// Удаление milestone
router.delete(
  "/:goalId/milestones/:milestoneId",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { goalId, milestoneId } = req.params;

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId: req.userId },
    });

    if (!goal) {
      throw new AppError("Цель не найдена", 404);
    }

    await prisma.milestone.delete({
      where: { id: milestoneId },
    });

    await recalculateGoalProgress(goalId);

    res.json({
      success: true,
      message: "Этап удалён",
    });
  })
);

// Функция пересчёта прогресса
async function recalculateGoalProgress(goalId: string) {
  const milestones = await prisma.milestone.findMany({
    where: { goalId },
  });

  if (milestones.length === 0) {
    await prisma.goal.update({
      where: { id: goalId },
      data: { progress: 0 },
    });
    return;
  }

  const completedCount = milestones.filter((m) => m.completed).length;
  const progress = Math.round((completedCount / milestones.length) * 100);

  await prisma.goal.update({
    where: { id: goalId },
    data: {
      progress,
      status: progress === 100 ? "COMPLETED" : "ACTIVE",
    },
  });
}

export default router;

