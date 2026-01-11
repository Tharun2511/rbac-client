'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      router.replace('/login');
    }
  }, [router]);

  return (
    <section>
      <h2>Admin Dashboard</h2>
      {children}
    </section>
  );
}
