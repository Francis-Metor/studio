export type Candidate = {
  id: string;
  name: string;
  photoUrl?: string;
  photoHint?: string; // For data-ai-hint
};

export type VotingCategory = {
  id: string;
  name: string;
  candidates: Candidate[];
};

export type VoteSelection = {
  [categoryId: string]: string; // candidateId
};
