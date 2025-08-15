
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TechnicalSupport from './TechnicalSupport';
import InterestSelection from './InterestSelection';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import ProfilePrivacySettings from './ProfilePrivacySettings';
import ProfileMenu from './ProfileMenu';
import { useProfileData } from '@/hooks/useProfileData';

const ProfileTab = () => {
  const [showSupport, setShowSupport] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const { profile, setProfile, userVideos, userPodcasts, loading, user } = useProfileData();

  if (showSupport) {
    return <TechnicalSupport onBack={() => setShowSupport(false)} />;
  }

  if (showInterests) {
    return (
      <div className="pb-20 bg-white p-4">
        <InterestSelection onComplete={() => setShowInterests(false)} />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="pb-20 bg-white flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your profile</p>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-white">
      <ProfileHeader 
        profile={profile} 
        userVideos={userVideos} 
        userPodcasts={userPodcasts} 
      />

      <div className="p-4">
        <ProfileContent 
          profile={profile} 
          userVideos={userVideos} 
          userPodcasts={userPodcasts} 
        />

        <ProfilePrivacySettings 
          profile={profile} 
          setProfile={setProfile} 
          user={user} 
        />

        <ProfileMenu 
          onShowInterests={() => setShowInterests(true)}
          onShowSupport={() => setShowSupport(true)}
        />
      </div>
    </div>
  );
};

export default ProfileTab;
