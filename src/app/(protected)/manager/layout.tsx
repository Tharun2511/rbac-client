'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requireRole } from '@/lib/gaurd';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = requireRole(['MANAGER']);
    if (!user) {
      router.replace('/login');
    }
  }, [router]);

  return <>{children}</>;
}
