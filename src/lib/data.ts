import type { VotingCategory } from './types';

export const votingCategoriesData: VotingCategory[] = [
  {
    id: 'president',
    name: 'President',
    candidates: [
      { id: 'p1', name: 'Alice Wonderland', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'woman smiling' },
      { id: 'p2', name: 'Bob The Builder', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'man confident' },
      { id: 'p3', name: 'Charlie Brown', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'person friendly' },
    ],
  },
  {
    id: 'secretary',
    name: 'Secretary',
    candidates: [
      { id: 's1', name: 'Diana Prince', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'professional woman' },
      { id: 's2', name: 'Edward Scissorhands', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'quirky man' },
    ],
  },
  {
    id: 'treasurer',
    name: 'Treasurer',
    candidates: [
      { id: 't1', name: 'Fiona Apple', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'thoughtful person' },
      { id: 't2', name: 'George Jetson', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'futuristic man' },
      { id: 't3', name: 'Hannah Montana', photoUrl: 'https://placehold.co/150x150.png', photoHint: 'energetic youth' },
    ],
  },
];
