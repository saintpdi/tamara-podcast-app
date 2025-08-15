import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface SubscriptionButtonProps {
  contentId?: string;
  creatorId?: string;
  monthlyFee?: number;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  // Additional props for enhanced functionality
  contentType?: string;
  defaultPrice?: number;
  defaultTitle?: string;
  variant?: string;
}

const SubscriptionButton = ({ 
  contentId, 
  creatorId, 
  monthlyFee = 0, 
  isFollowing = false, 
  onToggleFollow,
  contentType,
  defaultPrice,
  defaultTitle,
  variant
}: SubscriptionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { createCheckout } = useSubscription();

  const handleFreeSubscribe = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow creators",
        variant: "destructive"
      });
      return;
    }
    onToggleFollow?.();
    setIsOpen(false);
  };

  const handlePaidSubscribe = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe",
        variant: "destructive"
      });
      return;
    }

    try {
      const { url } = await createCheckout(
        Math.round(monthlyFee * 100), // Convert to cents
        `Podcast Subscription - $${monthlyFee}/month`,
        contentId,
        'podcast'
      );
      
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription checkout",
        variant: "destructive"
      });
    }
    setIsOpen(false);
  };

  const handleBuyEpisode = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase episodes",
        variant: "destructive"
      });
      return;
    }

    try {
      const episodePrice = 2.99;
      const { url } = await createCheckout(
        Math.round(episodePrice * 100), // Convert to cents
        `Single Episode Purchase - $${episodePrice}`,
        contentId,
        'podcast_episode'
      );
      
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create episode purchase checkout",
        variant: "destructive"
      });
    }
    setIsOpen(false);
  };

  if (monthlyFee === 0) {
    // Free podcast - simple follow button
    return (
      <Button 
        size="sm" 
        onClick={handleFreeSubscribe}
        className={`${
          isFollowing
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    );
  }

  // Paid podcast - show subscription modal
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className={`${
            isFollowing
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
              : 'bg-pink-500 hover:bg-pink-600 text-white'
          }`}
        >
          {isFollowing ? 'Subscribed' : `Subscribe $${monthlyFee}/mo`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to Premium Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <Badge className="bg-green-100 text-green-700 mb-2">
              Premium Podcast
            </Badge>
            <p className="text-sm text-gray-600">
              This creator offers premium content with a monthly subscription.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handlePaidSubscribe}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Users size={16} className="mr-2" />
              Subscribe for ${monthlyFee}/month
            </Button>
            
            <Button 
              onClick={handleBuyEpisode}
              variant="outline"
              className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              <DollarSign size={16} className="mr-2" />
              Buy Single Episode ($2.99)
            </Button>
            
            <Button 
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="w-full text-gray-500"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionButton;