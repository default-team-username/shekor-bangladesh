import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard, {user?.email}!</h1>
      <p className="mb-6 text-muted-foreground">You are successfully logged in.</p>
      <Button onClick={handleLogout} variant="destructive">
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;