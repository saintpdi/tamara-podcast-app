
import { Button } from '@/components/ui/button';
import { Settings, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProfileMenuProps {
  onShowInterests: () => void;
  onShowSupport: () => void;
}

const ProfileMenu = ({ onShowInterests, onShowSupport }: ProfileMenuProps) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out"
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
      <Button
        variant="ghost"
        className="w-full justify-start text-pink-600 hover:bg-pink-50"
        onClick={onShowInterests}
      >
        <Settings size={20} className="mr-2" />
        Manage Interests
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-pink-600 hover:bg-pink-50"
        onClick={onShowSupport}
      >
        <HelpCircle size={20} className="mr-2" />
        Technical Support & FAQ
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-red-600 hover:bg-red-50"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileMenu;
