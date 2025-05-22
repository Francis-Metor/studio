import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      {children}
    </main>
  );
}
