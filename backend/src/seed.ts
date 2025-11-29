import prisma from "./config/database.js";

const achievements = [
  {
    type: "first_lesson",
    title: "Первый шаг",
    description: "Пройди свой первый урок",
    icon: "🎯",
    points: 10,
    rarity: "COMMON" as const,
  },
  {
    type: "five_lessons",
    title: "Начинающий ученик",
    description: "Пройди 5 уроков",
    icon: "📚",
    points: 25,
    rarity: "COMMON" as const,
  },
  {
    type: "ten_lessons",
    title: "Усердный ученик",
    description: "Пройди 10 уроков",
    icon: "🌟",
    points: 50,
    rarity: "RARE" as const,
  },
  {
    type: "streak_3",
    title: "На волне",
    description: "Учись 3 дня подряд",
    icon: "🔥",
    points: 15,
    rarity: "COMMON" as const,
  },
  {
    type: "streak_7",
    title: "Недельный марафон",
    description: "Учись 7 дней подряд",
    icon: "⚡",
    points: 50,
    rarity: "RARE" as const,
  },
  {
    type: "streak_30",
    title: "Месяц без перерыва",
    description: "Учись 30 дней подряд",
    icon: "💪",
    points: 200,
    rarity: "EPIC" as const,
  },
  {
    type: "basics_complete",
    title: "Основы освоены",
    description: "Пройди все уроки раздела 'Основы Python'",
    icon: "🐍",
    points: 100,
    rarity: "RARE" as const,
  },
  {
    type: "first_goal",
    title: "Целеустремлённый",
    description: "Создай свою первую цель",
    icon: "🎯",
    points: 10,
    rarity: "COMMON" as const,
  },
  {
    type: "goal_complete",
    title: "Цель достигнута",
    description: "Выполни цель на 100%",
    icon: "✅",
    points: 30,
    rarity: "COMMON" as const,
  },
  {
    type: "five_goals",
    title: "Планировщик",
    description: "Выполни 5 целей",
    icon: "📋",
    points: 75,
    rarity: "RARE" as const,
  },
  {
    type: "early_bird",
    title: "Ранняя пташка",
    description: "Пройди урок до 8 утра",
    icon: "🌅",
    points: 20,
    rarity: "COMMON" as const,
  },
  {
    type: "night_owl",
    title: "Ночная сова",
    description: "Пройди урок после полуночи",
    icon: "🦉",
    points: 20,
    rarity: "COMMON" as const,
  },
  {
    type: "speed_learner",
    title: "Быстрый ученик",
    description: "Пройди 3 урока за один день",
    icon: "🚀",
    points: 40,
    rarity: "RARE" as const,
  },
  {
    type: "all_lessons",
    title: "Мастер Python",
    description: "Пройди все уроки на платформе",
    icon: "👑",
    points: 500,
    rarity: "LEGENDARY" as const,
  },
  {
    type: "first_project",
    title: "Творец",
    description: "Создай свой первый проект",
    icon: "🛠️",
    points: 100,
    rarity: "EPIC" as const,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Создаём достижения
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { type: achievement.type },
      update: achievement,
      create: achievement,
    });
    console.log(`✅ Achievement: ${achievement.title}`);
  }

  console.log("✨ Seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

