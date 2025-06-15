// Authentication Configuration
export const authConfig = {
  tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || "auth_token",
  userDataKey: import.meta.env.VITE_USER_DATA_KEY || "user_data",
  loginRedirectUrl: "/login",
  tokenExpiryBuffer: parseInt(
    import.meta.env.VITE_TOKEN_EXPIRY_BUFFER || "300"
  ), // 5 minutes in seconds
} as const;

export default authConfig;
