import { Router, Response } from "express";
import prisma from "../config/database.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

// Получение всех достижений (с информацией о разблокированных)
router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const achievements = await prisma.achievement.findMany({
      include: {
        userAchievements: {
          where: { userId: req.userId },
        },
      },
      orderBy: [{ rarity: "asc" }, { points: "asc" }],
    });

    const formattedAchievements = achievements.map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      description: a.description,
      icon: a.icon,
      points: a.points,
      rarity: a.rarity,
      unlocked: a.userAchievements.length > 0,
      unlockedAt: a.userAchievements[0]?.unlockedAt || null,
    }));

    const unlockedCount = formattedAchievements.filter((a) => a.unlocked).length;
    const totalPoints = formattedAchievements
      .filter((a) => a.unlocked)
      .reduce((acc, a) => acc + a.points, 0);

    res.json({
      success: true,
      data: {
        achievements: formattedAchievements,
        stats: {
          total: achievements.length,
          unlocked: unlockedCount,
          totalPoints,
        },
      },
    });
  })
);

// Получение только разблокированных достижений
router.get(
  "/unlocked",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: req.userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: "desc" },
    });

    res.json({
      success: true,
      data: userAchievements.map((ua) => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt,
      })),
    });
  })
);

// Получение последних достижений
router.get(
  "/recent",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: req.userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: "desc" },
      take: limit,
    });

    res.json({
      success: true,
      data: userAchievements.map((ua) => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt,
      })),
    });
  })
);

export default router;

