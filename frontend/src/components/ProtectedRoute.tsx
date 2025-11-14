'use client';

import { useAuth, UserRole } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      redirect('/');
    }
    setChecked(true);
  }, [isAuthenticated, user, allowedRoles]);

  if (!checked) return null;
  return <>{children}</>;
}
