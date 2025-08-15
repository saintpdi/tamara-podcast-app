
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  activeSubscriptions: Array<{
    id: string;
    status: string;
    currentPeriodEnd: string;
    priceId: string;
    amount: number;
    metadata: Record<string, string>;
  }>;
  customerId?: string;
  loading: boolean;
  error?: string;
}

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    activeSubscriptions: [],
    loading: true
  });
  const { user, session } = useAuth();

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setSubscriptionData(prev => ({ ...prev, loading: true, error: undefined }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscriptionData({
        ...data,
        loading: false
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription'
      }));
    }
  };

  const createCheckout = async (priceAmount: number, productName: string, contentId?: string, contentType?: string) => {
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        priceAmount,
        productName: productName || 'Premium Podcast Access',
        contentId,
        contentType: contentType || 'podcast'
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    return data;
  };

  const openCustomerPortal = async () => {
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    window.open(data.url, '_blank');
  };

  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  return {
    ...subscriptionData,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };
};
