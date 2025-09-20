'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function withAuth<P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) {
  const AuthenticatedComponent = (props: P) => {
    const { user, loading, isClient } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (mounted && isClient && !loading && !user) {
        router.push('/login');
      }
    }, [user, loading, isClient, mounted, router]);

    if (!mounted || !isClient || loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect to login
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}