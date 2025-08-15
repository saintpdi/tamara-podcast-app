
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Circle } from 'lucide-react';

interface InterestCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface InterestSelectionProps {
  onComplete: () => void;
  isOnboarding?: boolean;
}

const InterestSelection = ({ onComplete, isOnboarding = false }: InterestSelectionProps) => {
  const [categories, setCategories] = useState<InterestCategory[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    if (!isOnboarding) {
      fetchUserInterests();
    }
  }, [isOnboarding]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('interest_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load interest categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInterests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select('category_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSelectedInterests(data?.map(item => item.category_id) || []);
    } catch (error) {
      console.error('Error fetching user interests:', error);
    }
  };

  const toggleInterest = (categoryId: string) => {
    setSelectedInterests(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const saveInterests = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Delete existing interests
      const { error: deleteError } = await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new interests
      if (selectedInterests.length > 0) {
        const { error: insertError } = await supabase
          .from('user_interests')
          .insert(
            selectedInterests.map(categoryId => ({
              user_id: user.id,
              category_id: categoryId
            }))
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Interests Updated",
        description: "Your interests have been saved successfully!"
      });

      onComplete();
    } catch (error) {
      console.error('Error saving interests:', error);
      toast({
        title: "Error",
        description: "Failed to save your interests",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="pink-text text-center">
          {isOnboarding ? 'What interests you?' : 'Update Your Interests'}
        </CardTitle>
        <p className="text-gray-600 text-center">
          {isOnboarding 
            ? 'Select topics you\'d like to see in your feed'
            : 'Customize your content preferences'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const isSelected = selectedInterests.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleInterest(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{category.icon === 'laptop' ? '💻' : 
                    category.icon === 'heart' ? '💖' :
                    category.icon === 'briefcase' ? '💼' :
                    category.icon === 'activity' ? '🏃‍♀️' :
                    category.icon === 'film' ? '🎬' :
                    category.icon === 'book' ? '📚' :
                    category.icon === 'map' ? '🗺️' :
                    category.icon === 'chef-hat' ? '👩‍🍳' :
                    category.icon === 'palette' ? '🎨' :
                    category.icon === 'trophy' ? '🏆' : '✨'
                  }</span>
                  {isSelected ? (
                    <CheckCircle2 size={20} className="text-pink-500" />
                  ) : (
                    <Circle size={20} className="text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-left">{category.name}</h3>
                <p className="text-xs text-gray-600 text-left mt-1">{category.description}</p>
              </button>
            );
          })}
        </div>

        {selectedInterests.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected interests:</p>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Badge key={categoryId} className="bg-pink-100 text-pink-700">
                    {category.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        <Button
          onClick={saveInterests}
          disabled={saving || selectedInterests.length === 0}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          {saving ? 'Saving...' : (isOnboarding ? 'Get Started' : 'Update Interests')}
        </Button>

        {isOnboarding && (
          <Button
            onClick={onComplete}
            variant="ghost"
            className="w-full text-gray-600"
          >
            Skip for now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default InterestSelection;
