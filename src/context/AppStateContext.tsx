
// src/context/AppStateContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole } from '@/lib/constants';

interface StudentDetails {
  studentId: string;
  name: string;
}

interface AppState {
  role: UserRole | null;
  studentDetails: StudentDetails | null;
  electionName: string | null;
  defaultSessionStartTime: string | null;
  defaultSessionEndTime: string | null;
  appTheme: string; // e.g., "default", "theme-red"
  setRole: (role: UserRole | null) => void;
  setStudentDetails: (details: StudentDetails | null) => void;
  setElectionName: (name: string | null) => void;
  setDefaultSessionStartTime: (time: string | null) => void;
  setDefaultSessionEndTime: (time: string | null) => void;
  setAppTheme: (theme: string) => void;
  logout: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  // TEMPORARY: Initialize with mock student details for direct voting page access
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>({ studentId: 'devDefault', name: 'Dev Student' });
  const [electionName, setElectionName] = useState<string | null>("CampusVote General Election");
  const [defaultSessionStartTime, setDefaultSessionStartTime] = useState<string | null>("09:00");
  const [defaultSessionEndTime, setDefaultSessionEndTime] = useState<string | null>("17:00");
  const [appTheme, setAppTheme] = useState<string>("default"); // Default theme

  const logout = () => {
    setRole(null);
    // TEMPORARY: Reset to mock student details on logout if direct access is still desired,
    // or set to null to restore normal flow that requires verification.
    // For now, keeping it mock for continuous direct access during this dev phase.
    setStudentDetails({ studentId: 'devDefault', name: 'Dev Student' });
    // Election name, default times, and theme persist client-side for the session
  };

  return (
    <AppStateContext.Provider value={{ 
      role, 
      studentDetails, 
      electionName,
      defaultSessionStartTime,
      defaultSessionEndTime,
      appTheme,
      setRole, 
      setStudentDetails, 
      setElectionName,
      setDefaultSessionStartTime,
      setDefaultSessionEndTime,
      setAppTheme,
      logout 
    }}>
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
