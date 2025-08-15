
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/profile';

interface ProfilePrivacySettingsProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  user: any;
}

const ProfilePrivacySettings = ({ profile, setProfile, user }: ProfilePrivacySettingsProps) => {
  const updatePrivacySetting = async (field: 'hide_videos_tab' | 'hide_subscriptions_tab', value: boolean) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, [field]: value });
      toast({
        title: "Privacy Updated",
        description: `${field === 'hide_videos_tab' ? 'Videos' : 'Subscriptions'} tab visibility updated`
      });
    } catch (error) {
      console.error('Error updating privacy setting:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy setting",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
      <h3 className="font-semibold text-gray-800 mb-4">Privacy Settings</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {profile.hide_videos_tab ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
          <span className="text-sm text-gray-700">Show Videos Tab</span>
        </div>
        <Switch
          checked={!profile.hide_videos_tab}
          onCheckedChange={(checked) => updatePrivacySetting('hide_videos_tab', !checked)}
          className="data-[state=checked]:bg-pink-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {profile.hide_subscriptions_tab ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
          <span className="text-sm text-gray-700">Show Subscriptions Tab</span>
        </div>
        <Switch
          checked={!profile.hide_subscriptions_tab}
          onCheckedChange={(checked) => updatePrivacySetting('hide_subscriptions_tab', !checked)}
          className="data-[state=checked]:bg-pink-500"
        />
      </div>
    </div>
  );
};

export default ProfilePrivacySettings;
