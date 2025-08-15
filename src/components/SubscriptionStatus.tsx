
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, CreditCard, RefreshCw, Calendar } from 'lucide-react';

const SubscriptionStatus = () => {
  const { subscribed, activeSubscriptions, loading, checkSubscription, openCustomerPortal } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="animate-spin mr-2" size={20} />
          <span>Loading subscription status...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown size={20} className={subscribed ? 'text-yellow-500' : 'text-gray-400'} />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Status:</span>
          <Badge variant={subscribed ? 'default' : 'secondary'} className={subscribed ? 'bg-green-500' : ''}>
            {subscribed ? 'Active' : 'No Active Subscriptions'}
          </Badge>
        </div>

        {activeSubscriptions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Active Subscriptions:</h4>
            {activeSubscriptions.map((sub) => (
              <div key={sub.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">${(sub.amount / 100).toFixed(2)}/month</span>
                  <Badge variant="outline" className="text-xs">
                    {sub.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>Renews: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={checkSubscription} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
          {subscribed && (
            <Button 
              onClick={openCustomerPortal} 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <CreditCard size={14} className="mr-1" />
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
