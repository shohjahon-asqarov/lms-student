// API Configuration
export const apiConfig = {
  baseUrl:
    import.meta.env.VITE_API_BASE_URL || "https://api.lms.itechacademy.uz/api",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || "3"),
} as const;

export default apiConfig;
