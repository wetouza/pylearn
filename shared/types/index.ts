// Общие типы для frontend и backend

// ==================== User Types ====================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // в секундах
}

// ==================== Lesson Types ====================

export type LessonDifficulty = 'beginner' | 'basic' | 'practice';

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: LessonDifficulty;
  duration: number; // в минутах
  order: number;
  categoryId: string;
  content: LessonContent[];
  codeExamples: CodeExample[];
}

export interface LessonCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface LessonContent {
  type: 'text' | 'code' | 'tip' | 'warning' | 'exercise';
  content: string;
  language?: string;
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  output?: string;
  explanation: string;
}

// ==================== Goal Types ====================

export type GoalStatus = 'active' | 'completed' | 'paused';
export type GoalPriority = 'low' | 'medium' | 'high';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: Date;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  order: number;
}

// ==================== Achievement Types ====================

export type AchievementType = 
  | 'first_lesson'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'category_complete'
  | 'all_basics'
  | 'first_project'
  | 'goal_complete'
  | 'early_bird'
  | 'night_owl';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

// ==================== Glossary Types ====================

export type GlossaryCategory = 
  | 'programming'
  | 'python'
  | 'web'
  | 'database'
  | 'tools'
  | 'general';

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  simpleExplanation: string;
  analogy?: string;
  category: GlossaryCategory;
  relatedTerms: string[];
  examples?: string[];
}

// ==================== Trainer Types ====================

export type TrainerDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Trainer {
  id: string;
  name: string;
  description: string;
  url: string;
  logo: string;
  difficulty: TrainerDifficulty[];
  features: string[];
  pros: string[];
  cons: string[];
  tips: string[];
  isPaid: boolean;
  rating: number;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== Auth Types ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

