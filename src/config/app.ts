// App Configuration
export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || "Quiz LMS Dashboard",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  description:
    import.meta.env.VITE_APP_DESCRIPTION ||
    "Learning Management System for Quizzes",
  author: import.meta.env.VITE_APP_AUTHOR || "ITech Academy",
} as const;

export const APP_NAME = "iTech Academy";

export default appConfig;
