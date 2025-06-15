import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Quiz,
  QuizResult,
  User,
  DashboardStats,
  UserSettings,
  PaginatedResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  QuizSubmission,
  QuizFinishResponse,
} from "../types";
import { apiService } from "../utils/api";
import { paginationConfig } from "../config/env";

// Query keys
export const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["user", id] as const,
  quizzes: ["quizzes"] as const,
  quiz: (id: string) => ["quiz", id] as const,
  quizResults: ["quiz-results"] as const,
  userResults: (userId: string) => ["quiz-results", "user", userId] as const,
  dashboardStats: ["dashboard-stats"] as const,
  userSettings: ["user-settings"] as const,
} as const;

// Dashboard Queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User Queries
export const useUsers = (
  page = 1,
  limit = paginationConfig.defaultPageSize
) => {
  return useQuery({
    queryKey: [...queryKeys.users, page, limit],
    queryFn: () => apiService.getUsers(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => apiService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      // Update user data in localStorage
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => apiService.changePassword(data),
  });
};

// Quiz Queries
export const useQuizzes = (
  page = 1,
  limit = paginationConfig.defaultPageSize
) => {
  return useQuery({
    queryKey: [...queryKeys.quizzes, page, limit],
    queryFn: () => apiService.getQuizzes(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: queryKeys.quiz(id),
    queryFn: () => apiService.getQuiz(id),
    enabled: !!id,
  });
};

export const useStartQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) => apiService.startQuiz(quizId),
    onError: (error) => {
      console.error("Failed to start quiz:", error);
    },
  });
};

export const useFinishQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submission: QuizSubmission) =>
      apiService.finishQuiz(submission),
    onSuccess: (result: QuizFinishResponse) => {
      // Invalidate results queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.quizResults });
      queryClient.invalidateQueries({ queryKey: ["quiz-results", "user"] });
    },
    onError: (error) => {
      console.error("Failed to finish quiz:", error);
    },
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Quiz, "id" | "createdAt" | "updatedAt" | "createdBy">
    ) => apiService.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Quiz> }) =>
      apiService.updateQuiz(id, data),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(queryKeys.quiz(updatedQuiz.id), updatedQuiz);
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes });
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
};

// Quiz Results Queries
export const useQuizResults = (
  page = 1,
  limit = paginationConfig.defaultPageSize
) => {
  return useQuery({
    queryKey: [...queryKeys.quizResults, page, limit],
    queryFn: () => apiService.getQuizResults(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserResults = (
  userId: string,
  page = 1,
  limit = paginationConfig.defaultPageSize
) => {
  return useQuery({
    queryKey: [...queryKeys.userResults(userId), page, limit],
    queryFn: () => apiService.getUserResults(userId, page, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubmitQuizResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<QuizResult, "id" | "completedAt" | "user" | "quiz">
    ) => apiService.submitQuizResult(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizResults });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
};

// Settings Queries
export const useUserSettings = () => {
  return useQuery({
    queryKey: queryKeys.userSettings,
    queryFn: () => apiService.getUserSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<UserSettings>) =>
      apiService.updateUserSettings(settings),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.userSettings, updatedSettings);
    },
  });
};
