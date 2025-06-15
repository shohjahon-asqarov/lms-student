import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Quiz, 
  QuizResult, 
  User, 
  DashboardStats, 
  UserSettings,
  PaginatedResponse 
} from '../types';
import { apiService } from '../utils/api';

// Query Keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  profile: ['profile'] as const,
  quizzes: ['quizzes'] as const,
  quiz: (id: string) => ['quizzes', id] as const,
  quizResults: ['quiz-results'] as const,
  quizResult: (id: string) => ['quiz-results', id] as const,
  userResults: (userId: string) => ['quiz-results', 'user', userId] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
  userSettings: ['user', 'settings'] as const,
};

// Dashboard Queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User Queries
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => apiService.getProfile(),
  });
};

export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.users, page, limit],
    queryFn: () => apiService.getUsers(page, limit),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<User>) => apiService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.profile, updatedUser);
      // Update user data in localStorage
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: apiService.changePassword,
  });
};

// Quiz Queries
export const useQuizzes = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.quizzes, page, limit],
    queryFn: () => apiService.getQuizzes(page, limit),
  });
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: queryKeys.quiz(id),
    queryFn: () => apiService.getQuiz(id),
    enabled: !!id,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => 
      apiService.createQuiz(data),
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
export const useQuizResults = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.quizResults, page, limit],
    queryFn: () => apiService.getQuizResults(page, limit),
  });
};

export const useQuizResult = (id: string) => {
  return useQuery({
    queryKey: queryKeys.quizResult(id),
    queryFn: () => apiService.getQuizResult(id),
    enabled: !!id,
  });
};

export const useUserResults = (userId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.userResults(userId), page, limit],
    queryFn: () => apiService.getUserResults(userId, page, limit),
    enabled: !!userId,
  });
};

export const useSubmitQuizResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<QuizResult, 'id' | 'completedAt' | 'user' | 'quiz'>) => 
      apiService.submitQuizResult(data),
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