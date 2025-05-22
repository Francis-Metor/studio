
'use client';

import Link from 'next/link';
import { Vote } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';

export default function Header() {
  const { electionName } = useAppState();

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Vote size={28} />
          <div>
            <h1 className="text-2xl font-bold">CampusVote</h1>
            {electionName && (
              <p className="text-xs text-muted-foreground -mt-1">{electionName}</p>
            )}
          </div>
        </Link>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}
