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
  electionName: string | null;
  setRole: (role: UserRole | null) => void;
  setStudentDetails: (details: StudentDetails | null) => void;
  setElectionName: (name: string | null) => void;
  logout: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [electionName, setElectionName] = useState<string | null>("CampusVote General Election");

  const logout = () => {
    setRole(null);
    setStudentDetails(null);
    // Election name could persist or be reset here, for now it persists client-side until app reload
  };

  return (
    <AppStateContext.Provider value={{ 
      role, 
      studentDetails, 
      electionName,
      setRole, 
      setStudentDetails, 
      setElectionName,
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
