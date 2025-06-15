export interface User {
  id: string;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  file: string;
  groupId: string;
  startDate: string;
  duration: number; // in minutes
  teacherId: string;
  questionCount: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  // Computed properties for compatibility
  description?: string;
  questions?: Question[];
  isActive?: boolean;
  createdBy?: string;
  totalQuestions?: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
}

export interface Question {
  id: string;
  text: string;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  id: string;
  label: string;
  text: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalScore: number;
  percentage: number;
  timeSpent: number; // in minutes
  answers: QuizAnswer[];
  completedAt: string;
  user?: User;
  quiz?: Quiz;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalQuizzes: number;
  totalResults: number;
  averageScore: number;
  recentQuizzes: Quiz[];
  recentResults: QuizResult[];
  userGrowth: Array<{ month: string; users: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "TEACHER";
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserSettings {
  theme: "light" | "dark";
  language: "en" | "uz" | "ru";
  notifications: boolean;
  emailUpdates: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

export interface QuizSession {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  timeRemaining: number;
}

export interface QuizSubmission {
  quizId: string;
  questions: QuizSubmissionQuestion[];
}

export interface QuizSubmissionQuestion {
  questionId: string;
  questionType: string;
  answers: string[]; // Array of answer UUIDs
}

export interface QuizFinishResponse {
  data: QuizQuestionResult[];
  correntCount: number;
  inCorrentCount: number;
}

export interface QuizQuestionResult {
  id: string;
  text: string;
  result: QuizAnswerResult;
  user_result: boolean;
}

export interface QuizAnswerResult {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}
