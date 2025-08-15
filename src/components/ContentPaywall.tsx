
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Play, Podcast } from 'lucide-react';
import SubscriptionButton from './SubscriptionButton';
import { useSubscription } from '@/hooks/useSubscription';

interface ContentPaywallProps {
  contentId: string;
  contentType: 'podcast';
  title: string;
  description?: string;
  price: number;
  creatorName: string;
  thumbnailUrl?: string;
  onAccessGranted?: () => void;
}

const ContentPaywall = ({
  contentId,
  contentType,
  title,
  description,
  price,
  creatorName,
  thumbnailUrl,
  onAccessGranted
}: ContentPaywallProps) => {
  const { subscribed, activeSubscriptions } = useSubscription();

  // Check if user has access to this specific content
  const hasAccess = subscribed && activeSubscriptions.some(sub => 
    sub.metadata?.contentId === contentId || sub.metadata?.contentType === contentType
  );

  if (hasAccess && onAccessGranted) {
    onAccessGranted();
    return null;
  }

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="relative overflow-hidden rounded-lg">
        {thumbnailUrl && (
          <div className="relative">
            <img 
              src={thumbnailUrl} 
              alt={title}
              className={`w-full h-48 object-cover ${!hasAccess ? 'blur-sm' : ''}`}
            />
            {!hasAccess && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Lock size={40} className="text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Paywall overlay for podcasts */}
      {!hasAccess && (
        <Card className="mt-4 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="text-yellow-500" size={24} />
              Premium Podcast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-600 mb-2">by {creatorName}</p>
              {description && (
                <p className="text-sm text-gray-500 mb-4">{description}</p>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Monthly Access</span>
                <span className="text-2xl font-bold text-pink-600">
                  ${price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Get unlimited access to all premium podcast content from {creatorName}
              </p>
              
              <SubscriptionButton
                contentId={contentId}
                contentType="podcast"
                defaultPrice={price}
                defaultTitle={`${creatorName} Premium Podcast Access`}
                variant="premium"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Podcast size={14} />
              <span>Instant access to premium podcasts after subscription</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentPaywall;
