// Pagination Configuration
export const paginationConfig = {
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10"),
  maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || "100"),
  pageSizeOptions: [5, 10, 20, 50, 100],
  showSizeChanger: import.meta.env.VITE_SHOW_SIZE_CHANGER === "true",
  showQuickJumper: import.meta.env.VITE_SHOW_QUICK_JUMPER === "true",
} as const;

export default paginationConfig;
