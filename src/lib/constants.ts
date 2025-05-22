export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  ADMIN_DASHBOARD: '/admin/dashboard',
  STUDENT_VERIFY: '/student/verify',
  STUDENT_VOTE: '/student/vote',
} as const;
