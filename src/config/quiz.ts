// Quiz Configuration
export const quizConfig = {
  defaultDuration: parseInt(import.meta.env.VITE_DEFAULT_QUIZ_DURATION || "30"),
  defaultDifficulty: import.meta.env.VITE_DEFAULT_QUIZ_DIFFICULTY || "medium",
  defaultCategory: import.meta.env.VITE_DEFAULT_QUIZ_CATEGORY || "General",
  maxQuestions: parseInt(import.meta.env.VITE_MAX_QUIZ_QUESTIONS || "100"),
  minQuestions: parseInt(import.meta.env.VITE_MIN_QUIZ_QUESTIONS || "1"),
  autoSubmit: import.meta.env.VITE_QUIZ_AUTO_SUBMIT === "true",
} as const;

export default quizConfig;
