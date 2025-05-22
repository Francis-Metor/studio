
export type Candidate = {
  id: string;
  name: string;
  photoUrl?: string;
  photoHint?: string; // For data-ai-hint
  categoryId: string; // Made mandatory for candidates when managed in a flat list
};

// This type represents how candidates are structured within voting-data.json,
// where categoryId is implicit from the parent VotingCategory.
export type CandidateInVotingData = Omit<Candidate, 'categoryId'>;

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
  [categoryId: string]: string; // candidateId
};

// Basic Student type for admin management
export type Student = {
  id: string; // Could be student ID
  name: string;
  status: 'Eligible' | 'Voted' | 'Ineligible';
};

// Basic Voting Session type for admin management
export type VotingSession = {
  id: string;
  name: string;
  startDate: string; // ISO string date
  endDate: string; // ISO string date
  status: 'Pending' | 'Active' | 'Paused' | 'Closed';
};

// Helper type for displaying candidate with category name in the table
export interface DisplayCandidate extends Candidate {
  categoryName?: string;
}
