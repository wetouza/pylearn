const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Произошла ошибка");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Неизвестная ошибка" };
    }
  }

  // Auth
  async register(email: string, password: string, name: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(refreshToken: string) {
    return this.request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe() {
    return this.request("/auth/me");
  }

  // Progress
  async getProgress() {
    return this.request("/progress");
  }

  async getLessonProgress(lessonSlug: string) {
    return this.request(`/progress/${lessonSlug}`);
  }

  async updateProgress(lessonSlug: string, data: { completed?: boolean; timeSpent?: number }) {
    return this.request(`/progress/${lessonSlug}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async completeLesson(lessonSlug: string) {
    return this.request(`/progress/${lessonSlug}/complete`, {
      method: "POST",
    });
  }

  // Goals
  async getGoals() {
    return this.request("/goals");
  }

  async createGoal(data: {
    title: string;
    description?: string;
    targetDate?: string;
    priority?: string;
    milestones?: { title: string }[];
  }) {
    return this.request("/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: string, data: Record<string, unknown>) {
    return this.request(`/goals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: string) {
    return this.request(`/goals/${id}`, {
      method: "DELETE",
    });
  }

  async toggleMilestone(goalId: string, milestoneId: string) {
    return this.request(`/goals/${goalId}/milestones/${milestoneId}/toggle`, {
      method: "PATCH",
    });
  }

  // Achievements
  async getAchievements() {
    return this.request("/achievements");
  }

  async getRecentAchievements(limit = 5) {
    return this.request(`/achievements/recent?limit=${limit}`);
  }
}

export const api = new ApiClient(API_URL);
export default api;

