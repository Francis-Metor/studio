
// src/context/AppStateContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserRole } from '@/lib/constants';
import type { VoteSelection, VotingSession, VotingSessionStatus } from '@/lib/types'; // Added VotingSession, VotingSessionStatus
import { format } from 'date-fns';
import initialSessionsData from '@/lib/sessions-data.json'; // Import initial sessions

interface StudentDetails {
  studentId: string;
  name: string;
}

interface VoteCounts {
  [candidateId: string]: number;
}

interface SkipCountsByCategory {
  [categoryId: string]: number;
}

interface AppState {
  role: UserRole | null;
  studentDetails: StudentDetails | null;
  electionName: string | null;
  defaultSessionStartTime: string | null;
  defaultSessionEndTime: string | null;
  appTheme: string;
  allowSkipVote: boolean;
  voteCounts: VoteCounts;
  skipCountsByCategory: SkipCountsByCategory;
  totalVotesCasted: number;
  sessions: VotingSession[]; // Added sessions to global state
  setRole: (role: UserRole | null) => void;
  setStudentDetails: (details: StudentDetails | null) => void;
  setElectionName: (name: string | null) => void;
  setDefaultSessionStartTime: (time: string | null) => void;
  setDefaultSessionEndTime: (time: string | null) => void;
  setAppTheme: (theme: string) => void;
  setAllowSkipVote: (allow: boolean) => void;
  recordVote: (selections: VoteSelection) => void;
  clearVoteCounts: () => void;
  logout: () => void;
  setSessions: (sessions: VotingSession[]) => void; // Setter for sessions
  addSession: (sessionDetails: { name: string }) => void; // Function to add a new session
  updateSessionStatus: (sessionId: string, newStatus: VotingSessionStatus) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

// Helper to generate unique session IDs
const generateSessionId = () => `sess_${new Date().getTime()}`;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [electionName, setElectionName] = useState<string | null>("CampusVote General Election");
  const [defaultSessionStartTime, setDefaultSessionStartTime] = useState<string | null>("09:00");
  const [defaultSessionEndTime, setDefaultSessionEndTime] = useState<string | null>("17:00");
  const [appTheme, setAppTheme] = useState<string>("default");
  const [allowSkipVote, setAllowSkipVote] = useState<boolean>(true);
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({});
  const [skipCountsByCategory, setSkipCountsByCategory] = useState<SkipCountsByCategory>({});
  const [totalVotesCasted, setTotalVotesCasted] = useState<number>(0);
  const [sessions, setSessionsState] = useState<VotingSession[]>(initialSessionsData as VotingSession[]);

  const setSessions = useCallback((updatedSessions: VotingSession[]) => {
    setSessionsState(updatedSessions);
  }, []);

  const addSession = useCallback((sessionDetails: { name: string }) => {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    const startTime = defaultSessionStartTime || "09:00";
    const endTime = defaultSessionEndTime || "17:00";
    
    const startDateString = `${format(today, 'yyyy-MM-dd')} ${startTime}`;
    const endDateString = `${format(twoDaysLater, 'yyyy-MM-dd')} ${endTime}`;

    const newSession: VotingSession = {
      id: generateSessionId(),
      name: sessionDetails.name,
      startDate: startDateString,
      endDate: endDateString, 
      status: 'Pending',
    };
    setSessionsState(prevSessions => [newSession, ...prevSessions]); // Add to the beginning
  }, [defaultSessionStartTime, defaultSessionEndTime]);

  const updateSessionStatus = useCallback((sessionId: string, newStatus: VotingSessionStatus) => {
    setSessionsState(prevSessions => 
      prevSessions.map(s => s.id === sessionId ? { ...s, status: newStatus } : s)
    );
  }, []);

  const recordVote = useCallback((selections: VoteSelection) => {
    setVoteCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      Object.values(selections).forEach(selectionValue => {
        if (selectionValue !== 'skipped') {
          newCounts[selectionValue] = (newCounts[selectionValue] || 0) + 1;
        }
      });
      return newCounts;
    });

    setSkipCountsByCategory(prevSkips => {
      const newSkips = { ...prevSkips };
      for (const categoryId in selections) {
        if (selections[categoryId] === 'skipped') {
          newSkips[categoryId] = (newSkips[categoryId] || 0) + 1;
        }
      }
      return newSkips;
    });
  }, []);

  const clearVoteCounts = useCallback(() => {
    setVoteCounts({});
    setSkipCountsByCategory({});
  }, []);

  useEffect(() => {
    const total = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
    setTotalVotesCasted(total);
  }, [voteCounts]);

  const logout = () => {
    setRole(null);
    setStudentDetails(null);
  };

  return (
    <AppStateContext.Provider value={{ 
      role, 
      studentDetails, 
      electionName,
      defaultSessionStartTime,
      defaultSessionEndTime,
      appTheme,
      allowSkipVote,
      voteCounts,
      skipCountsByCategory,
      totalVotesCasted,
      sessions,
      setRole, 
      setStudentDetails, 
      setElectionName,
      setDefaultSessionStartTime,
      setDefaultSessionEndTime,
      setAppTheme,
      setAllowSkipVote,
      recordVote,
      clearVoteCounts,
      logout,
      setSessions,
      addSession,
      updateSessionStatus
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
