import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Podcast, 
  Settings,
  Crown,
  Eye,
  EyeOff,
  Gift
} from 'lucide-react';
import SubscriptionButton from './SubscriptionButton';
import SubscriptionStatus from './SubscriptionStatus';
import TipJar from './TipJar';
import CreatorEarnings from './CreatorEarnings';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [userPodcasts, setUserPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({
    total: 0,
    thisMonth: 0,
    subscribers: 0
  });

  const fetchUserPodcasts = async () => {
    if (!user) return;

    try {
      // Fetch user's podcasts only
      const { data: podcasts, error: podcastsError } = await supabase
        .from('podcasts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (podcastsError) throw podcastsError;

      setUserPodcasts(podcasts || []);

      // Calculate revenue metrics (mock data for now)
      const totalContent = podcasts?.length || 0;
      setRevenue({
        total: totalContent * 45.67, // Mock revenue
        thisMonth: totalContent * 15.23, // Mock monthly revenue
        subscribers: Math.floor(totalContent * 3.2) // Mock subscriber count
      });

    } catch (error) {
      console.error('Error fetching podcasts:', error);
      toast({
        title: "Error",
        description: "Failed to load your podcasts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePodcastMonetization = async (
    podcastId: string, 
    monthlyFee: number,
    privacyLevel: 'public' | 'private' | 'followers_only'
  ) => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .update({ 
          monthly_fee: monthlyFee,
          privacy_level: privacyLevel
        })
        .eq('id', podcastId);

      if (error) throw error;

      toast({
        title: "Podcast Updated",
        description: `Monetization settings saved successfully`
      });

      fetchUserPodcasts(); // Refresh data
    } catch (error) {
      console.error('Error updating podcast:', error);
      toast({
        title: "Error",
        description: "Failed to update podcast settings",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUserPodcasts();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Creator Dashboard</h1>
          <p className="text-gray-600">Manage your podcast monetization</p>
        </div>
        <div className="flex gap-2">
          <TipJar 
            creatorId={user?.id || 'demo'}
            creatorName="You"
          />
          <SubscriptionButton variant="creator" />
        </div>
      </div>

      {/* Tabs for different dashboard views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenue.total.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenue.thisMonth.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenue.subscribers}</div>
                <p className="text-xs text-muted-foreference">Active subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Podcasts</CardTitle>
                <Podcast className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userPodcasts.length}</div>
                <p className="text-xs text-muted-foreground">Total uploads</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Status */}
          <SubscriptionStatus />
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <CreatorEarnings />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Podcast Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Podcast size={20} />
                Podcast Monetization ({userPodcasts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PodcastManagementTab
                podcasts={userPodcasts}
                onUpdate={updatePodcastMonetization}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PodcastManagementTabProps {
  podcasts: any[];
  onUpdate: (id: string, fee: number, privacy: 'public' | 'private' | 'followers_only') => void;
}

const PodcastManagementTab = ({ podcasts, onUpdate }: PodcastManagementTabProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (podcasts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <Podcast size={48} className="text-gray-400 mb-2 mx-auto" />
          <p className="text-gray-600">No podcasts uploaded yet</p>
          <p className="text-sm text-gray-500">Start creating podcast content to monetize your work!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {podcasts.map((podcast) => (
        <PodcastItemCard
          key={podcast.id}
          podcast={podcast}
          isEditing={editingId === podcast.id}
          onEdit={() => setEditingId(editingId === podcast.id ? null : podcast.id)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

interface PodcastItemCardProps {
  podcast: any;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (id: string, fee: number, privacy: 'public' | 'private' | 'followers_only') => void;
}

const PodcastItemCard = ({ podcast, isEditing, onEdit, onUpdate }: PodcastItemCardProps) => {
  const [monthlyFee, setMonthlyFee] = useState(podcast.monthly_fee || 0);
  const [privacyLevel, setPrivacyLevel] = useState(podcast.privacy_level || 'public');

  const handleSave = () => {
    onUpdate(podcast.id, monthlyFee, privacyLevel);
    onEdit();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{podcast.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={podcast.privacy_level === 'public' ? 'default' : 'secondary'}>
                {podcast.privacy_level === 'public' ? <Eye size={12} className="mr-1" /> : <EyeOff size={12} className="mr-1" />}
                {podcast.privacy_level}
              </Badge>
              {podcast.monthly_fee > 0 && (
                <Badge variant="outline" className="text-green-600">
                  ${podcast.monthly_fee}/month
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <TipJar 
              creatorId={podcast.user_id}
              creatorName="Creator"
              contentId={podcast.id}
              contentType="podcast"
            />
            <Button onClick={onEdit} variant="outline" size="sm">
              <Settings size={16} className="mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isEditing && (
        <CardContent className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`fee-${podcast.id}`}>Monthly Subscription Fee ($)</Label>
              <Input
                id={`fee-${podcast.id}`}
                type="number"
                step="0.01"
                min="0"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              {monthlyFee > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Subscribers will pay ${monthlyFee}/month to access this podcast
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor={`privacy-${podcast.id}`}>Access Level</Label>
              <select
                id={`privacy-${podcast.id}`}
                value={privacyLevel}
                onChange={(e) => setPrivacyLevel(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="public">Public (Free Access)</option>
                <option value="private">Private (Subscription Required)</option>
                <option value="followers_only">Followers Only</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {privacyLevel === 'private' && monthlyFee > 0 && 'Only paying subscribers can access'}
                {privacyLevel === 'public' && 'Anyone can access for free'}
                {privacyLevel === 'followers_only' && 'Only your followers can access'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-pink-500 hover:bg-pink-600">
              Save Monetization Settings
            </Button>
            <Button onClick={onEdit} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CreatorDashboard;
