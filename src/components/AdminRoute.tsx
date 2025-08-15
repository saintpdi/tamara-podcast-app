
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();

  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['admin-check', user?.email],
    queryFn: async () => {
      if (!user?.email) return false;
      
      const { data, error } = await supabase.rpc('is_admin', {
        user_email: user.email
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data;
    },
    enabled: !!user?.email,
  });

  if (loading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
