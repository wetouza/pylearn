import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import prisma from "../config/database.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Все маршруты требуют авторизации
router.use(authenticate);

// Получение профиля
router.get(
  "/profile",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            progress: { where: { completed: true } },
            goals: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("Пользователь не найден", 404);
    }

    res.json({
      success: true,
      data: {
        ...user,
        stats: {
          completedLessons: user._count.progress,
          totalGoals: user._count.goals,
          achievements: user._count.achievements,
        },
      },
    });
  })
);

// Обновление профиля
router.patch(
  "/profile",
  [body("name").optional().trim().notEmpty().withMessage("Имя не может быть пустым")],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  })
);

// Изменение пароля
router.post(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Введите текущий пароль"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Новый пароль должен содержать минимум 6 символов"),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError("Пользователь не найден", 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError("Неверный текущий пароль", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: "Пароль успешно изменён",
    });
  })
);

// Удаление аккаунта
router.delete(
  "/account",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.user.delete({
      where: { id: req.userId },
    });

    res.json({
      success: true,
      message: "Аккаунт удалён",
    });
  })
);

export default router;

