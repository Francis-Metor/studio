
export type Candidate = {
  id: string;
  name: string;
  photoUrl?: string;
  photoHint?: string; // For data-ai-hint
  categoryId: string; // Made mandatory for candidates when managed in a flat list
};

// This type represents how candidates are structured within voting-data.json,
// where categoryId is implicit from the parent VotingCategory.
export type CandidateInVotingData = Omit<Candidate, 'categoryId'> & { photoUrl?: string; photoHint?: string; };


export type VotingCategory = {
  id: string;
  name: string;
  candidates: CandidateInVotingData[];
};

// Simplified Category type for admin management and dropdowns
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

// Helper type for displaying candidate with category name in the table
export interface DisplayCandidate extends Candidate {
  categoryName?: string;
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
  totalVotesCasted: number;
  totalEligibleStudents: number;
  turnoutPercentage: number;
  voteCounts: { [candidateId: string]: number };
  skipCountsByCategory: { [categoryId: string]: number };
  electionSetup: ArchivedCategoryResult[]; // The categories and candidates for that election
}

// For displaying stats consistently, whether live or archived
export interface DisplayedStatistic {
  electionName: string;
  totalVotesCasted: number;
  totalEligibleStudents: number;
  turnoutPercentage: number;
  voteCounts: { [candidateId: string]: number };
  skipCountsByCategory: { [categoryId: string]: number };
  categoriesToDisplay: VotingCategory[]; // Using VotingCategory structure for consistency
}
