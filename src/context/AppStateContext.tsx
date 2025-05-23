
// src/context/AppStateContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserRole } from '@/lib/constants';
import type { VoteSelection, VotingSession, VotingSessionStatus, Student, VotingCategory, CandidateInVotingData } from '@/lib/types';
import { format } from 'date-fns';
import initialSessionsData from '@/lib/sessions-data.json';
import initialStudentsData from '@/lib/students-data.json';
import initialVotingData from '@/lib/voting-data.json';

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
  votedStudentIds: Set<string>; // Tracks unique student IDs that have voted

  sessions: VotingSession[];
  students: Student[];
  votingCategories: VotingCategory[]; // Manages categories and their candidates

  setRole: (role: UserRole | null) => void;
  setStudentDetails: (details: StudentDetails | null) => void;
  setElectionName: (name: string | null) => void;
  setDefaultSessionStartTime: (time: string | null) => void;
  setDefaultSessionEndTime: (time: string | null) => void;
  setAppTheme: (theme: string) => void;
  setAllowSkipVote: (allow: boolean) => void;
  
  recordVote: (selections: VoteSelection) => void;
  clearVoteCounts: () => void; // Will also clear votedStudentIds
  logout: () => void;
  
  setSessions: (sessions: VotingSession[]) => void;
  addSession: (sessionDetails: { name: string }) => void;
  updateSessionStatus: (sessionId: string, newStatus: VotingSessionStatus) => void;

  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;

  setVotingCategories: (categories: VotingCategory[]) => void;
  addCategory: (category: Omit<VotingCategory, 'candidates'>) => void;
  updateCategoryName: (categoryId: string, newName: string) => void;
  deleteCategory: (categoryId: string) => void;
  addCandidateToCategory: (categoryId: string, candidate: CandidateInVotingData) => void;
  updateCandidateInCategory: (categoryId: string, candidate: CandidateInVotingData) => void;
  deleteCandidateFromCategory: (categoryId: string, candidateId: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

const generateId = (prefix = 'id_') => `${prefix}${Math.random().toString(36).substr(2, 9)}`;

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
  const [votedStudentIds, setVotedStudentIds] = useState<Set<string>>(new Set());

  const [sessions, setSessionsState] = useState<VotingSession[]>(initialSessionsData as VotingSession[]);
  const [students, setStudentsState] = useState<Student[]>(initialStudentsData as Student[]);
  const [votingCategories, setVotingCategoriesState] = useState<VotingCategory[]>(initialVotingData as VotingCategory[]);


  // --- Voting Logic ---
  const recordVote = useCallback((selections: VoteSelection) => {
    if (studentDetails?.studentId) {
      setVotedStudentIds(prev => new Set(prev).add(studentDetails.studentId));
    }

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
  }, [studentDetails?.studentId]);

  const clearVoteCounts = useCallback(() => {
    setVoteCounts({});
    setSkipCountsByCategory({});
    setVotedStudentIds(new Set());
  }, []);

  const logout = () => {
    setRole(null);
    setStudentDetails(null);
    // Optionally, clear votes on student logout if that's desired behavior,
    // or only clear them when an admin starts a new election cycle.
    // clearVoteCounts(); 
  };

  // --- Session Management ---
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
      id: generateId('sess_'),
      name: sessionDetails.name,
      startDate: startDateString,
      endDate: endDateString, 
      status: 'Pending',
    };
    setSessionsState(prevSessions => [newSession, ...prevSessions]);
  }, [defaultSessionStartTime, defaultSessionEndTime]);

  const updateSessionStatus = useCallback((sessionId: string, newStatus: VotingSessionStatus) => {
    setSessionsState(prevSessions => 
      prevSessions.map(s => s.id === sessionId ? { ...s, status: newStatus } : s)
    );
  }, []);

  // --- Student Management ---
  const setGlobalStudents = useCallback((newStudents: Student[]) => {
    setStudentsState(newStudents);
  }, []);

  const addStudent = useCallback((student: Student) => {
    setStudentsState(prev => [...prev, { ...student, id: student.id || generateId('s_') }]);
  }, []);

  const updateStudent = useCallback((updatedStudent: Student) => {
    setStudentsState(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  }, []);

  const deleteStudent = useCallback((studentId: string) => {
    setStudentsState(prev => prev.filter(s => s.id !== studentId));
  }, []);

  // --- Voting Category & Candidate Management (operates on votingCategories state) ---
   const setGlobalVotingCategories = useCallback((categories: VotingCategory[]) => {
    setVotingCategoriesState(categories);
  }, []);

  const addCategory = useCallback((category: Omit<VotingCategory, 'candidates'>) => {
    setVotingCategoriesState(prev => [...prev, { ...category, id: category.id || generateId('cat_'), candidates: [] }]);
  }, []);

  const updateCategoryName = useCallback((categoryId: string, newName: string) => {
    setVotingCategoriesState(prev => prev.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat));
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setVotingCategoriesState(prev => prev.filter(cat => cat.id !== categoryId));
    // Also clean up votes for candidates in this category
    setVoteCounts(prevCounts => {
        const newCounts = {...prevCounts};
        const categoryToDelete = votingCategories.find(c => c.id === categoryId);
        categoryToDelete?.candidates.forEach(cand => {
            delete newCounts[cand.id];
        });
        return newCounts;
    });
    setSkipCountsByCategory(prevSkips => {
        const newSkips = {...prevSkips};
        delete newSkips[categoryId];
        return newSkips;
    });
  }, [votingCategories]);

  const addCandidateToCategory = useCallback((categoryId: string, candidate: CandidateInVotingData) => {
    setVotingCategoriesState(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, candidates: [...cat.candidates, { ...candidate, id: candidate.id || generateId('cand_') }] };
      }
      return cat;
    }));
  }, []);

  const updateCandidateInCategory = useCallback((categoryId: string, updatedCandidate: CandidateInVotingData) => {
    setVotingCategoriesState(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, candidates: cat.candidates.map(cand => cand.id === updatedCandidate.id ? updatedCandidate : cand) };
      }
      return cat;
    }));
  }, []);

  const deleteCandidateFromCategory = useCallback((categoryId: string, candidateId: string) => {
    setVotingCategoriesState(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, candidates: cat.candidates.filter(cand => cand.id !== candidateId) };
      }
      return cat;
    }));
    // Also clean up votes for this candidate
     setVoteCounts(prevCounts => {
        const newCounts = {...prevCounts};
        delete newCounts[candidateId];
        return newCounts;
    });
  }, []);


  return (
    <AppStateContext.Provider value={{ 
      role, studentDetails, electionName, defaultSessionStartTime, defaultSessionEndTime, appTheme, allowSkipVote,
      voteCounts, skipCountsByCategory, votedStudentIds,
      sessions, students, votingCategories,
      setRole, setStudentDetails, setElectionName, setDefaultSessionStartTime, setDefaultSessionEndTime, setAppTheme, setAllowSkipVote,
      recordVote, clearVoteCounts, logout,
      setSessions, addSession, updateSessionStatus,
      setStudents: setGlobalStudents, addStudent, updateStudent, deleteStudent,
      setVotingCategories: setGlobalVotingCategories, addCategory, updateCategoryName, deleteCategory,
      addCandidateToCategory, updateCandidateInCategory, deleteCandidateFromCategory
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
