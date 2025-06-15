// Query Client Configuration
export const queryConfig = {
  retryCount: parseInt(import.meta.env.VITE_QUERY_RETRY_COUNT || "1"),
  staleTime: parseInt(import.meta.env.VITE_QUERY_STALE_TIME || "300000"), // 5 minutes
  refetchOnFocus: import.meta.env.VITE_QUERY_REFETCH_ON_FOCUS === "true",
  refetchOnWindowFocus:
    import.meta.env.VITE_QUERY_REFETCH_ON_WINDOW_FOCUS === "true",
  refetchOnReconnect:
    import.meta.env.VITE_QUERY_REFETCH_ON_RECONNECT === "true",
} as const;

export default queryConfig;
