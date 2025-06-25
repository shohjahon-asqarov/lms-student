import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  User,
  Quiz,
  QuizResult,
  DashboardStats,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  UserSettings,
  PaginatedResponse,
  ApiResponse,
  QuizSubmission,
  QuizFinishResponse,
} from "../types";
import { apiConfig, authConfig } from "../config/env";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiConfig.baseUrl,
      timeout: apiConfig.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(authConfig.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          error.config &&
          !error.config.url.includes("/auth/login")
        ) {
          localStorage.removeItem(authConfig.tokenKey);
          localStorage.removeItem(authConfig.userDataKey);
          window.location.href = authConfig.loginRedirectUrl;
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      "/auth/register",
      data
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post("/auth/logout");
  }

  async refreshToken(): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      "/auth/refresh"
    );
    return response.data;
  }

  // User Methods
  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get("/users/profile");
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(
      "/users/profile",
      data
    );
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await this.api.put("/users/change-password", data);
  }

  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const response: AxiosResponse<PaginatedResponse<User>> = await this.api.get(
      `/users?page=${page}&pageSize=${limit}`
    );
    return response.data;
  }

  // Quiz Methods
  async getQuizzes(page = 1, limit = 10): Promise<PaginatedResponse<Quiz>> {
    const response: AxiosResponse<PaginatedResponse<Quiz>> = await this.api.get(
      `/quiz?page=${page}&pageSize=${limit}`
    );

    // Transform the data to match our interface
    const transformedData = {
      data: response.data.data.map((quiz: Quiz) => ({
        ...quiz,
        description: `Quiz with ${quiz.questionCount} questions`,
        totalQuestions: quiz.questionCount,
        createdBy: quiz.teacherId,
        difficulty: "medium" as const,
        category: "General",
      })),
      meta: response.data.meta,
    };

    return transformedData;
  }

  async getQuiz(id: string): Promise<Quiz> {
    const response: AxiosResponse<Quiz> = await this.api.get(`/quiz/${id}`);
    return {
      ...response.data,
      description: `Quiz with ${response.data.questionCount} questions`,
      totalQuestions: response.data.questionCount,
      createdBy: response.data.teacherId,
      difficulty: "medium" as const,
      category: "General",
    };
  }

  async startQuiz(quizId: string): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(
      `/quiz/${quizId}/start`
    );
    return response.data;
  }

  async finishQuiz(submission: QuizSubmission): Promise<QuizFinishResponse> {
    const response: AxiosResponse<QuizFinishResponse> = await this.api.post(
      "/quiz/finish",
      submission
    );
    return response.data;
  }

  async createQuiz(
    data: Omit<Quiz, "id" | "createdAt" | "updatedAt" | "createdBy">
  ): Promise<Quiz> {
    const response: AxiosResponse<Quiz> = await this.api.post("/quiz", data);
    return response.data;
  }

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
    const response: AxiosResponse<Quiz> = await this.api.put(
      `/quiz/${id}`,
      data
    );
    return response.data;
  }

  async deleteQuiz(id: string): Promise<void> {
    await this.api.delete(`/quiz/${id}`);
  }

  // Quiz Results Methods
  async getQuizResults(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<QuizResult>> {
    const response: AxiosResponse<PaginatedResponse<QuizResult>> =
      await this.api.get(`/quiz-results?page=${page}&pageSize=${limit}`);
    return response.data;
  }

  async getQuizResult(id: string): Promise<QuizResult> {
    const response: AxiosResponse<QuizResult> = await this.api.get(
      `/quiz-results/${id}`
    );
    return response.data;
  }

  async submitQuizResult(
    data: Omit<QuizResult, "id" | "completedAt" | "user" | "quiz">
  ): Promise<QuizResult> {
    const response: AxiosResponse<QuizResult> = await this.api.post(
      "/quiz-results",
      data
    );
    return response.data;
  }

  async getUserResults(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<QuizResult>> {
    const response: AxiosResponse<PaginatedResponse<QuizResult>> =
      await this.api.get(
        `/quiz-results/user/${userId}?page=${page}&pageSize=${limit}`
      );
    return response.data;
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<DashboardStats> {
    // Since we don't have a specific dashboard endpoint, we'll create mock data
    // In a real implementation, you would call the actual endpoint
    const mockStats: DashboardStats = {
      totalUsers: 150,
      totalQuizzes: 25,
      totalResults: 450,
      averageScore: 82,
      recentQuizzes: [],
      recentResults: [],
      userGrowth: [
        { month: "Jan", users: 100 },
        { month: "Feb", users: 120 },
        { month: "Mar", users: 135 },
        { month: "Apr", users: 140 },
        { month: "May", users: 145 },
        { month: "Jun", users: 150 },
      ],
      scoreDistribution: [
        { range: "90-100%", count: 25 },
        { range: "70-89%", count: 40 },
        { range: "50-69%", count: 20 },
        { range: "Below 50%", count: 15 },
      ],
    };

    return mockStats;
  }

  // Settings Methods
  async getUserSettings(): Promise<UserSettings> {
    // Mock settings since we don't have this endpoint
    const mockSettings: UserSettings = {
      theme: "light",
      language: "en",
      notifications: true,
      emailUpdates: true,
    };

    return mockSettings;
  }

  async updateUserSettings(
    settings: Partial<UserSettings>
  ): Promise<UserSettings> {
    // Mock update since we don't have this endpoint
    const currentSettings = await this.getUserSettings();
    const updatedSettings = { ...currentSettings, ...settings };

    return updatedSettings;
  }

  async getMyQuizResult(
    quizId: string,
    page = 1,
    pageSize = 10,
    sortBy: "ASC" | "DESC" = "ASC"
  ): Promise<any> {
    const response = await this.api.get(
      `/quiz/my-quiz-result?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&quizId=${quizId}`
    );
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
