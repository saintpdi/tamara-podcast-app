
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccountSettings from '@/components/AccountSettings';
import SecuritySettings from '@/components/SecuritySettings';
import ContactForm from '@/components/ContactForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const { data: isAdmin } = useQuery({
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <Shield size={16} />
                Admin Panel
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="contact">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
