'use client';

import { ReactNode } from 'react';
import { getAuthUser } from '@/lib/auth';
import Navigation from '../components/Navigation';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = getAuthUser();

  if (!user) return null; // redirect already handled earlier

  return (
    <div>
      <Navigation role={user.role} />
      <main style={{ padding: '1rem' }}>{children}</main>
    </div>
  );
}
