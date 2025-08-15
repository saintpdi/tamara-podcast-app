
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Gift, Heart, Coffee, DollarSign } from 'lucide-react';

interface TipJarProps {
  creatorId: string;
  creatorName?: string;
  contentId?: string;
  contentType?: 'podcast' | 'video';
  variant?: 'button' | 'card';
}

const TipJar = ({ 
  creatorId, 
  creatorName = 'Creator', 
  contentId, 
  contentType,
  variant = 'button'
}: TipJarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const predefinedAmounts = [5, 10, 25, 50];

  const handleTip = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send tips",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-tip', {
        body: {
          tipAmount,
          creatorId,
          message,
          contentId,
          contentType
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      window.open(data.url, '_blank');
      setIsOpen(false);
      toast({
        title: "Redirecting to Payment",
        description: "Opening tip payment in a new tab..."
      });
    } catch (error) {
      console.error('Tip error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process tip",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="text-pink-500" size={24} />
            Tip Jar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Show your appreciation with a one-time tip to support {creatorName}'s content.
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                <Gift size={16} className="mr-2" />
                Send a Tip
              </Button>
            </DialogTrigger>
            <TipDialog 
              creatorName={creatorName}
              tipAmount={tipAmount}
              setTipAmount={setTipAmount}
              message={message}
              setMessage={setMessage}
              predefinedAmounts={predefinedAmounts}
              loading={loading}
              onTip={handleTip}
            />
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-pink-600 border-pink-300 hover:bg-pink-50">
          <Gift size={16} className="mr-1" />
          Tip
        </Button>
      </DialogTrigger>
      <TipDialog 
        creatorName={creatorName}
        tipAmount={tipAmount}
        setTipAmount={setTipAmount}
        message={message}
        setMessage={setMessage}
        predefinedAmounts={predefinedAmounts}
        loading={loading}
        onTip={handleTip}
      />
    </Dialog>
  );
};

interface TipDialogProps {
  creatorName: string;
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  message: string;
  setMessage: (message: string) => void;
  predefinedAmounts: number[];
  loading: boolean;
  onTip: () => void;
}

const TipDialog = ({
  creatorName,
  tipAmount,
  setTipAmount,
  message,
  setMessage,
  predefinedAmounts,
  loading,
  onTip
}: TipDialogProps) => (
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Gift className="text-pink-500" />
        Send a Tip to {creatorName}
      </DialogTitle>
    </DialogHeader>
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <Label>Tip Amount ($)</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount}
                variant={tipAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => setTipAmount(amount)}
                className={tipAmount === amount ? "bg-pink-500" : ""}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <Input
            type="number"
            step="0.01"
            min="1"
            value={tipAmount}
            onChange={(e) => setTipAmount(parseFloat(e.target.value) || 1)}
            placeholder="Custom amount"
            className="mt-2"
          />
        </div>
        
        <div>
          <Label htmlFor="tip-message">Message (Optional)</Label>
          <Textarea
            id="tip-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Thank you for your amazing content!"
            className="mt-1"
            rows={3}
          />
        </div>

        <Button 
          onClick={onTip} 
          disabled={loading || tipAmount < 1}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
        >
          {loading ? 'Processing...' : (
            <>
              <Heart size={16} className="mr-2" />
              Send ${tipAmount.toFixed(2)} Tip
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 text-center">
          You'll be redirected to Stripe to complete the payment
        </p>
      </CardContent>
    </Card>
  </DialogContent>
);

export default TipJar;
