
export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CANDIDATES: '/admin/candidates',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_SESSIONS: '/admin/sessions',
  ADMIN_STATISTICS: '/admin/statistics', // Added new route
  STUDENT_VERIFY: '/student/verify',
  STUDENT_VOTE: '/student/vote',
} as const;

