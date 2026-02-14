'use client';

import { useAuthStore } from '@/lib/auth/store';
import { UserRole } from '@/contracts'; // Fixed import to use gymos/contracts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
        // Redirect to new login page
        router.push('/auth/login');
    } else if (!allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [user, allowedRoles, router]);

  if (!user) {
      return null; // Don't render anything while redirecting
  }

  if (!allowedRoles.includes(user.role)) {
    return null; // or loading spinner while redirecting
  }

  return <>{children}</>;
}
