export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "learning" | "typing" | "streak" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const achievements: Achievement[] = [
  // Learning achievements
  {
    id: "first-lesson",
    title: "Первые шаги",
    description: "Завершил первый урок",
    icon: "🎯",
    category: "learning",
    rarity: "common",
  },
  {
    id: "five-lessons",
    title: "На пути к знаниям",
    description: "Завершил 5 уроков",
    icon: "📚",
    category: "learning",
    rarity: "common",
  },
  {
    id: "ten-lessons",
    title: "Упорный ученик",
    description: "Завершил 10 уроков",
    icon: "🏆",
    category: "learning",
    rarity: "rare",
  },
  {
    id: "perfect-quiz",
    title: "Отличник",
    description: "Получил 100% на квизе",
    icon: "💯",
    category: "learning",
    rarity: "rare",
  },
  
  // Typing achievements
  {
    id: "typing-50wpm",
    title: "Быстрые пальцы",
    description: "Достиг 50 WPM в тренажёре",
    icon: "⌨️",
    category: "typing",
    rarity: "common",
  },
  {
    id: "typing-80wpm",
    title: "Скоростной набор",
    description: "Достиг 80 WPM в тренажёре",
    icon: "🚀",
    category: "typing",
    rarity: "epic",
  },
  {
    id: "typing-perfect",
    title: "Без единой ошибки",
    description: "100% точность в тренажёре",
    icon: "✨",
    category: "typing",
    rarity: "rare",
  },
  
  // Streak achievements
  {
    id: "streak-7",
    title: "Неделя практики",
    description: "7 дней подряд на сайте",
    icon: "🔥",
    category: "streak",
    rarity: "rare",
  },
  {
    id: "streak-30",
    title: "Месяц дисциплины",
    description: "30 дней подряд на сайте",
    icon: "💎",
    category: "streak",
    rarity: "legendary",
  },
  
  // Special achievements
  {
    id: "night-owl",
    title: "Ночная сова",
    description: "Учился после полуночи",
    icon: "🦉",
    category: "special",
    rarity: "common",
  },
  {
    id: "early-bird",
    title: "Ранняя пташка",
    description: "Учился до 7 утра",
    icon: "🐦",
    category: "special",
    rarity: "common",
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

export function getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
  return achievements.filter((a) => a.category === category);
}

export const rarityColors: Record<Achievement["rarity"], string> = {
  common: "hsl(var(--muted-foreground))",
  rare: "hsl(200 80% 50%)",
  epic: "hsl(280 80% 60%)",
  legendary: "hsl(45 90% 50%)",
};
