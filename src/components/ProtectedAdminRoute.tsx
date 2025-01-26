import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkIfAdmin } from '../lib/supabase';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (user?.email) {
        const adminStatus = await checkIfAdmin(user.email, ''); // Password check already done during login
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
} 