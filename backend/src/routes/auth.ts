import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import prisma from "../config/database.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Валидация
const registerValidation = [
  body("email").isEmail().withMessage("Введите корректный email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов"),
  body("name").trim().notEmpty().withMessage("Введите имя"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Введите корректный email"),
  body("password").notEmpty().withMessage("Введите пароль"),
];

// Генерация токенов
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || "refresh-secret",
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
  );

  return { accessToken, refreshToken };
};

// Регистрация
router.post(
  "/register",
  registerValidation,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { email, password, name } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Пользователь с таким email уже существует", 400);
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // Создаём пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Генерируем токены
    const tokens = generateTokens(user.id);

    // Сохраняем refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
      },
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        tokens,
      },
    });
  })
);

// Вход
router.post(
  "/login",
  loginValidation,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { email, password } = req.body;

    // Ищем пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Неверный email или пароль", 401);
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Неверный email или пароль", 401);
    }

    // Генерируем токены
    const tokens = generateTokens(user.id);

    // Сохраняем refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        tokens,
      },
    });
  })
);

// Обновление токена
router.post(
  "/refresh",
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token не предоставлен", 400);
    }

    // Проверяем refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError("Недействительный refresh token", 401);
    }

    // Генерируем новые токены
    const tokens = generateTokens(session.userId);

    // Обновляем session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      data: { tokens },
    });
  })
);

// Выход
router.post(
  "/logout",
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { refreshToken },
      });
    }

    res.json({
      success: true,
      message: "Выход выполнен успешно",
    });
  })
);

// Получение текущего пользователя
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("Пользователь не найден", 404);
    }

    res.json({
      success: true,
      data: user,
    });
  })
);

export default router;

