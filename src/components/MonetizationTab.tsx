
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, DollarSign, TrendingUp, Users, Gift } from 'lucide-react';
import CreatorDashboard from './CreatorDashboard';
import SubscriptionStatus from './SubscriptionStatus';
import SubscriptionButton from './SubscriptionButton';
import TipJar from './TipJar';
import CreatorEarnings from './CreatorEarnings';

const MonetizationTab = () => {
  const [activeView, setActiveView] = useState<'overview' | 'creator' | 'subscriber'>('overview');

  if (activeView === 'creator') {
    return (
      <div className="pb-20">
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <Button 
            onClick={() => setActiveView('overview')} 
            variant="outline" 
            size="sm"
          >
            ← Back to Overview
          </Button>
        </div>
        <div className="p-6 space-y-6">
          <CreatorEarnings />
          <CreatorDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold pink-gradient-text flex items-center justify-center gap-2">
            <Crown className="text-yellow-500" size={32} />
            SheTalks Premium Podcasts
          </h1>
          <p className="text-gray-600">Monetize your podcast content and support your favorite creators</p>
        </div>

        {/* Subscription Status */}
        <SubscriptionStatus />

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="text-green-500" size={24} />
                For Podcast Creators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Turn your podcast into profit. Set up subscriptions, receive tips, manage your audience, and earn from your premium content.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  Revenue analytics & insights
                </li>
                <li className="flex items-center gap-2">
                  <Users size={16} className="text-blue-500" />
                  Subscriber management
                </li>
                <li className="flex items-center gap-2">
                  <Crown size={16} className="text-yellow-500" />
                  Premium podcast control
                </li>
                <li className="flex items-center gap-2">
                  <Gift size={16} className="text-pink-500" />
                  Tip jar & donations
                </li>
              </ul>
              <Button 
                onClick={() => setActiveView('creator')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                Creator Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="text-purple-500" size={24} />
                For Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Support your favorite podcast creators with subscriptions and tips. Unlock exclusive premium episodes.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Crown size={16} className="text-purple-500" />
                  Exclusive premium podcasts
                </li>
                <li className="flex items-center gap-2">
                  <Users size={16} className="text-pink-500" />
                  Direct creator support
                </li>
                <li className="flex items-center gap-2">
                  <Gift size={16} className="text-red-500" />
                  Send tips & appreciation
                </li>
              </ul>
              <div className="space-y-2">
                <SubscriptionButton 
                  defaultPrice={9.99}
                  defaultTitle="Premium Podcast Subscription"
                  variant="premium"
                />
                <TipJar 
                  creatorId="sample-creator"
                  creatorName="Your Favorite Creator"
                  variant="card"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Podcast Monetization Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="subscriptions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="tips">Tips & Donations</TabsTrigger>
                <TabsTrigger value="premium">Premium Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscriptions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={<DollarSign className="text-green-500" />}
                    title="Monthly Subscriptions"
                    description="Set up recurring payments for consistent podcast revenue"
                  />
                  <FeatureCard
                    icon={<Users className="text-blue-500" />}
                    title="Subscriber Management"
                    description="Track and manage your podcast subscriber base"
                  />
                  <FeatureCard
                    icon={<TrendingUp className="text-purple-500" />}
                    title="Revenue Analytics"
                    description="Detailed insights into your podcast earnings"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="tips" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={<Gift className="text-pink-500" />}
                    title="One-Time Tips"
                    description="Receive appreciation tips from your audience"
                  />
                  <FeatureCard
                    icon={<DollarSign className="text-green-500" />}
                    title="Custom Tip Amounts"
                    description="Let supporters choose their own tip amounts"
                  />
                  <FeatureCard
                    icon={<Users className="text-blue-500" />}
                    title="Tip Messages"
                    description="Receive personalized messages with tips"
                  />
                </div>
                <div className="mt-6 p-6 bg-pink-50 rounded-lg border-2 border-pink-200">
                  <div className="text-center space-y-4">
                    <Gift size={48} className="mx-auto text-pink-500" />
                    <h3 className="text-xl font-semibold">Tip Jar Now Available!</h3>
                    <p className="text-gray-600">
                      Your audience can now show appreciation with one-time tips for your amazing podcast content.
                    </p>
                    <TipJar 
                      creatorId="demo-creator"
                      creatorName="Demo Creator"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="premium" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FeatureCard
                    icon={<Crown className="text-yellow-500" />}
                    title="Premium Podcasts"
                    description="Restrict access to your best podcast content"
                  />
                  <FeatureCard
                    icon={<Crown className="text-purple-500" />}
                    title="Exclusive Episodes"
                    description="Create subscriber-only podcast episodes"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-4 border rounded-lg space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <h4 className="font-semibold">{title}</h4>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default MonetizationTab;
