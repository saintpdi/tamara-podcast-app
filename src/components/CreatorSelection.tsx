
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  followers: string;
  category: string;
  avatar: string;
  description: string;
}

const mockCreators: Creator[] = [
  {
    id: 'creator-1',
    username: 'sarah_dance',
    displayName: 'Sarah Martinez',
    followers: '1.2M',
    category: 'Dance & Fitness',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
    description: 'Professional dancer sharing tutorials and motivation'
  },
  {
    id: 'creator-2',
    username: 'foodie_mike',
    displayName: 'Mike Chen',
    followers: '850K',
    category: 'Cooking',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    description: 'Chef sharing easy recipes and cooking hacks'
  },
  {
    id: 'creator-3',
    username: 'art_lover_emma',
    displayName: 'Emma Wilson',
    followers: '920K',
    category: 'Art & Creativity',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    description: 'Artist creating beautiful paintings and tutorials'
  },
  {
    id: 'creator-4',
    username: 'tech_guru_alex',
    displayName: 'Alex Thompson',
    followers: '1.5M',
    category: 'Technology',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    description: 'Tech tips, reviews, and the latest gadgets'
  },
  {
    id: 'creator-5',
    username: 'travel_jenny',
    displayName: 'Jenny Parker',
    followers: '750K',
    category: 'Travel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    description: 'Travel blogger sharing amazing destinations'
  },
  {
    id: 'creator-6',
    username: 'yap_queen',
    displayName: 'Maya Johnson',
    followers: '680K',
    category: 'Lifestyle',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    description: 'Life talks, daily vlogs, and real conversations'
  }
];

interface CreatorSelectionProps {
  onComplete: () => void;
}

const CreatorSelection = ({ onComplete }: CreatorSelectionProps) => {
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const toggleCreator = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleContinue = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // In a real app, you would insert follows into the database
      // For now, we'll simulate the follow action
      if (selectedCreators.length > 0) {
        // Simulate following creators
        console.log('Following creators:', selectedCreators);
        
        toast({
          title: "Following Complete!",
          description: `You're now following ${selectedCreators.length} creator${selectedCreators.length > 1 ? 's' : ''}!`
        });
      }

      onComplete();
    } catch (error) {
      console.error('Error following creators:', error);
      toast({
        title: "Error",
        description: "Failed to follow creators",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="pink-text text-center flex items-center justify-center gap-2">
          <Users size={24} />
          Follow Your Favorite Creators
        </CardTitle>
        <p className="text-gray-600 text-center">
          Discover amazing content from creators you love
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mockCreators.map((creator) => {
            const isSelected = selectedCreators.includes(creator.id);
            return (
              <div
                key={creator.id}
                onClick={() => toggleCreator(creator.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback className="bg-pink-100 text-pink-600">
                        {creator.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{creator.displayName}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {creator.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">@{creator.username}</p>
                      <p className="text-xs text-gray-600 mt-1">{creator.description}</p>
                      <p className="text-xs text-pink-600 font-medium">{creator.followers} followers</p>
                    </div>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 size={20} className="text-pink-500 flex-shrink-0" />
                  ) : (
                    <Circle size={20} className="text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedCreators.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected creators:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCreators.map(creatorId => {
                const creator = mockCreators.find(c => c.id === creatorId);
                return creator ? (
                  <Badge key={creatorId} className="bg-pink-100 text-pink-700">
                    @{creator.username}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          {loading ? 'Following...' : 'Continue'}
        </Button>

        <Button
          onClick={onComplete}
          variant="ghost"
          className="w-full text-gray-600"
        >
          Skip for now
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreatorSelection;
