
// src/context/AppStateContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback }
from 'react';
import type { UserRole } from '@/lib/constants';
import type { VoteSelection } from '@/lib/types';

interface StudentDetails {
  studentId: string;
  name: string;
}

interface VoteCounts {
  [candidateId: string]: number;
}

interface AppState {
  role: UserRole | null;
  studentDetails: StudentDetails | null;
  electionName: string | null;
  defaultSessionStartTime: string | null;
  defaultSessionEndTime: string | null;
  appTheme: string; // e.g., "default", "theme-red"
  voteCounts: VoteCounts;
  totalVotesCasted: number;
  setRole: (role: UserRole | null) => void;
  setStudentDetails: (details: StudentDetails | null) => void;
  setElectionName: (name: string | null) => void;
  setDefaultSessionStartTime: (time: string | null) => void;
  setDefaultSessionEndTime: (time: string | null) => void;
  setAppTheme: (theme: string) => void;
  recordVote: (selections: VoteSelection) => void;
  clearVoteCounts: () => void;
  logout: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [electionName, setElectionName] = useState<string | null>("CampusVote General Election");
  const [defaultSessionStartTime, setDefaultSessionStartTime] = useState<string | null>("09:00");
  const [defaultSessionEndTime, setDefaultSessionEndTime] = useState<string | null>("17:00");
  const [appTheme, setAppTheme] = useState<string>("default");
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({});
  const [totalVotesCasted, setTotalVotesCasted] = useState<number>(0);

  const recordVote = useCallback((selections: VoteSelection) => {
    setVoteCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      for (const categoryId in selections) {
        const candidateId = selections[categoryId];
        if (candidateId) {
          newCounts[candidateId] = (newCounts[candidateId] || 0) + 1;
        }
      }
      return newCounts;
    });
  }, []);

  const clearVoteCounts = useCallback(() => {
    setVoteCounts({});
  }, []);

  useEffect(() => {
    const total = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
    setTotalVotesCasted(total);
  }, [voteCounts]);

  const logout = () => {
    setRole(null);
    setStudentDetails(null);
    // Election name, default times, theme, and vote counts persist client-side for the session for now
  };

  return (
    <AppStateContext.Provider value={{ 
      role, 
      studentDetails, 
      electionName,
      defaultSessionStartTime,
      defaultSessionEndTime,
      appTheme,
      voteCounts,
      totalVotesCasted,
      setRole, 
      setStudentDetails, 
      setElectionName,
      setDefaultSessionStartTime,
      setDefaultSessionEndTime,
      setAppTheme,
      recordVote,
      clearVoteCounts,
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
