// Authentication Configuration
export const authConfig = {
  tokenKey: "auth_token",
  userDataKey: "user_data",
  loginRedirectUrl: "/login",
  tokenExpiryBuffer: 300, // 5 minutes in seconds
} as const;

export default authConfig;
