
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Gift,
  Crown,
  Calendar,
  PieChart
} from 'lucide-react';

const CreatorEarnings = () => {
  const { user } = useAuth();
  const { activeSubscriptions } = useSubscription();
  const [earnings, setEarnings] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    tipRevenue: 0,
    subscriptionRevenue: 0,
    activeSubscribers: 0,
    totalTips: 0
  });

  // Mock earnings calculation - in a real app, this would come from your backend
  useEffect(() => {
    if (activeSubscriptions.length > 0) {
      const monthlySubscriptionRevenue = activeSubscriptions.reduce((total, sub) => {
        return total + (sub.amount / 100);
      }, 0);

      // Mock tip revenue and calculations
      const mockTipRevenue = 127.50;
      const mockTotalTips = 23;

      setEarnings({
        totalRevenue: monthlySubscriptionRevenue * 6 + mockTipRevenue, // 6 months average
        monthlyRevenue: monthlySubscriptionRevenue,
        tipRevenue: mockTipRevenue,
        subscriptionRevenue: monthlySubscriptionRevenue,
        activeSubscribers: activeSubscriptions.length,
        totalTips: mockTotalTips
      });
    }
  }, [activeSubscriptions]);

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Recurring income</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">Paying subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tips Received</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.tipRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{earnings.totalTips} tips total</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Earnings Breakdown */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="tips">Tips & Donations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart size={20} />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Crown size={16} className="text-purple-500" />
                    Subscription Revenue
                  </span>
                  <span className="font-semibold">${earnings.subscriptionRevenue.toFixed(2)}/month</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ 
                      width: `${earnings.totalRevenue > 0 ? (earnings.subscriptionRevenue / earnings.monthlyRevenue) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Gift size={16} className="text-pink-500" />
                    One-time Tips
                  </span>
                  <span className="font-semibold">${earnings.tipRevenue.toFixed(2)} total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full" 
                    style={{ 
                      width: `${earnings.totalRevenue > 0 ? (earnings.tipRevenue / earnings.totalRevenue) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {activeSubscriptions.length > 0 ? (
                <div className="space-y-3">
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
                        <span>Next billing: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No active subscriptions</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock tip data - in a real app, this would come from your backend */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">$25.00</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">"Love your podcast content!"</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">$10.00</span>
                    <span className="text-xs text-gray-500">5 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">"Keep up the great work!"</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">$50.00</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="text-sm text-gray-600">"Your episode on entrepreneurship was amazing!"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorEarnings;
