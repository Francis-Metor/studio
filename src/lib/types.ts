
export type Candidate = {
  id: string;
  name: string;
  photoUrl?: string;
  photoHint?: string; // For data-ai-hint
  categoryId?: string; // To link candidate to a category
};

export type VotingCategory = {
  id: string;
  name: string;
  candidates: Candidate[];
};

// Simplified Category type for admin management
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
