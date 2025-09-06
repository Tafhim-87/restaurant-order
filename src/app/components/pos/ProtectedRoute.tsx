import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/signin');
    }
  }, [token, router]);

  // Optionally, show a loading spinner or nothing while redirecting
  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
