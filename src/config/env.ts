// Main Environment Configuration - Imports all separate configs
import apiConfig from "./api";
import authConfig from "./auth";
import appConfig from "./app";
import queryConfig from "./query";
import quizConfig from "./quiz";
import paginationConfig from "./pagination";
import devConfig from "./dev";

// Unified configuration object
export const config = {
  api: apiConfig,
  auth: authConfig,
  app: appConfig,
  query: queryConfig,
  quiz: quizConfig,
  pagination: paginationConfig,
  dev: devConfig,
} as const;

// Export individual configs for direct access
export {
  apiConfig,
  authConfig,
  appConfig,
  queryConfig,
  quizConfig,
  paginationConfig,
  devConfig,
};

export default config;
