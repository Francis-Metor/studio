
export type Candidate = {
  id: string;
  name: string;
  photoUrl?: string;
  photoHint?: string; // For data-ai-hint
  categoryId: string; // Made mandatory for candidates when managed in a flat list
};

// This type represents how candidates are structured within voting-data.json,
// and now also how they are managed in the global state via AppStateContext.
export type CandidateInVotingData = {
  id: string;
  name: string;
  photoUrl?: string;
  photoHint?: string;
};


export type VotingCategory = {
  id: string;
  name: string;
  candidates: CandidateInVotingData[];
};

// Simplified Category type for admin management and dropdowns (extracted from VotingCategory)
export type Category = {
  id: string;
  name: string;
};

export type VoteSelection = {
  [categoryId: string]: string | 'skipped'; // candidateId or 'skipped'
};

// Updated Student type
export type Student = {
  id: string; // Student ID
  name: string;
  status: 'Eligible' | 'Voted' | 'Ineligible';
  // department?: string; // Optional: if we were to add department data
};

// Basic Voting Session type for admin management
export type VotingSessionStatus = 'Pending' | 'Active' | 'Paused' | 'Closed';
export type VotingSession = {
  id: string;
  name: string;
  startDate: string; // ISO string date or descriptive string
  endDate: string; // ISO string date or descriptive string
  status: VotingSessionStatus;
};

// Helper type for displaying candidate with category name in the table (used in AdminCandidatesPage)
export interface DisplayCandidate extends CandidateInVotingData {
  categoryId: string; // The ID of the category this candidate belongs to
  categoryName?: string; // The name of the category
}

// For archived election results
export interface ArchivedCandidateResult extends CandidateInVotingData {
  // No 'categoryId' here as it's part of ArchivedCategoryResult
}

export interface ArchivedCategoryResult {
  id: string;
  name: string;
  candidates: ArchivedCandidateResult[]; // Candidate structure as it was for that election
}

export interface ArchivedElection {
  id: string;
  name: string;
  endDate: string;
  totalStudentsVoted: number; // Renamed from totalVotesCasted
  totalEligibleStudents: number;
  turnoutPercentage: number;
  voteCounts: { [candidateId: string]: number };
  skipCountsByCategory: { [categoryId: string]: number };
  electionSetup: ArchivedCategoryResult[]; // The categories and candidates for that election
}

// For displaying stats consistently, whether live or archived
export interface DisplayedStatistic {
  electionName: string;
  totalStudentsVoted: number; // Renamed from totalVotesCasted
  totalEligibleStudents: number;
  turnoutPercentage: number;
  voteCounts: { [candidateId: string]: number };
  skipCountsByCategory: { [categoryId: string]: number };
  categoriesToDisplay: VotingCategory[]; // Using VotingCategory structure for consistency
}
