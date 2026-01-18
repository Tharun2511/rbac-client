'use client';

import { ReactNode } from 'react';
import AppShell from '../components/layout.tsx/AppShell';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
