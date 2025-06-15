// Development Configuration
export const devConfig = {
  mode: import.meta.env.VITE_DEV_MODE === "true",
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "true",
  enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",
  mockApi: import.meta.env.VITE_MOCK_API === "true",
  showPerformanceMetrics:
    import.meta.env.VITE_SHOW_PERFORMANCE_METRICS === "true",
} as const;

export default devConfig;
