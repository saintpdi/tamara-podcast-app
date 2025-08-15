
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Hash } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Tag {
  id: string;
  name: string;
  description: string;
  icon: string;
  popularity: string;
}

const popularTags: Tag[] = [
  {
    id: 'cooking',
    name: 'cooking',
    description: 'Recipes, cooking tips, and food adventures',
    icon: '👩‍🍳',
    popularity: '2.1M posts'
  },
  {
    id: 'travel',
    name: 'travel',
    description: 'Travel destinations, tips, and experiences',
    icon: '✈️',
    popularity: '1.8M posts'
  },
  {
    id: 'yap',
    name: 'yap',
    description: 'Life talks, daily stories, and conversations',
    icon: '💬',
    popularity: '3.5M posts'
  },
  {
    id: 'fitness',
    name: 'fitness',
    description: 'Workouts, health tips, and motivation',
    icon: '💪',
    popularity: '1.6M posts'
  },
  {
    id: 'beauty',
    name: 'beauty',
    description: 'Makeup, skincare, and beauty tutorials',
    icon: '💄',
    popularity: '2.3M posts'
  },
  {
    id: 'dance',
    name: 'dance',
    description: 'Dance tutorials, performances, and trends',
    icon: '💃',
    popularity: '1.9M posts'
  },
  {
    id: 'tech',
    name: 'tech',
    description: 'Technology reviews, tips, and tutorials',
    icon: '📱',
    popularity: '1.2M posts'
  },
  {
    id: 'art',
    name: 'art',
    description: 'Creative processes, tutorials, and inspiration',
    icon: '🎨',
    popularity: '1.4M posts'
  },
  {
    id: 'fashion',
    name: 'fashion',
    description: 'Style inspiration, outfits, and trends',
    icon: '👗',
    popularity: '2.0M posts'
  },
  {
    id: 'music',
    name: 'music',
    description: 'Music covers, original songs, and tutorials',
    icon: '🎵',
    popularity: '1.7M posts'
  }
];

interface TagSelectionProps {
  onComplete: () => void;
}

const TagSelection = ({ onComplete }: TagSelectionProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // In a real app, you would save user's tag preferences
      if (selectedTags.length > 0) {
        console.log('Selected tags:', selectedTags);
        
        toast({
          title: "Preferences Saved!",
          description: `Your feed will be personalized with ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}!`
        });
      }

      // Mark onboarding as complete and navigate to main app
      toast({
        title: "Welcome to SheTalks!",
        description: "Your personalized experience is ready!"
      });

      onComplete();
    } catch (error) {
      console.error('Error saving tag preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
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
          <Hash size={24} />
          Choose Your Interests
        </CardTitle>
        <p className="text-gray-600 text-center">
          Select tags to personalize your "What's Happening" feed
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {popularTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{tag.icon}</span>
                  {isSelected ? (
                    <CheckCircle2 size={16} className="text-pink-500" />
                  ) : (
                    <Circle size={16} className="text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-sm">#{tag.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{tag.description}</p>
                <p className="text-xs text-pink-500 font-medium mt-1">{tag.popularity}</p>
              </button>
            );
          })}
        </div>

        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected tags:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tagId => {
                const tag = popularTags.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} className="bg-pink-100 text-pink-700">
                    #{tag.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        <Button
          onClick={handleComplete}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          {loading ? 'Saving...' : 'Complete Setup'}
        </Button>

        <Button
          onClick={onComplete}
          variant="ghost"
          className="w-full text-gray-600"
        >
          Skip and explore
        </Button>
      </CardContent>
    </Card>
  );
};

export default TagSelection;
