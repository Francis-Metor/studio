// src/context/AppStateContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { UserRole } from '@/lib/constants';

interface StudentDetails {
  studentId: string;
  name: string;
}

interface AppState {
  role: UserRole | null;
  studentDetails: StudentDetails | null;
  setRole: (role: UserRole | null) => void;
  setStudentDetails: (details: StudentDetails | null) => void;
  logout: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);

  const logout = () => {
    setRole(null);
    setStudentDetails(null);
    // Potentially redirect to login, handled by components
  };

  return (
    <AppStateContext.Provider value={{ role, studentDetails, setRole, setStudentDetails, logout }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
