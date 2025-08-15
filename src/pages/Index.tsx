
import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import ExploreTab from '@/components/ExploreTab';
import SearchTab from '@/components/SearchTab';
import PodcastTab from '@/components/PodcastTab';
import ProfileTab from '@/components/ProfileTab';
import VideoCreationTab from '@/components/VideoCreationTab';
import MonetizationTab from '@/components/MonetizationTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('explore');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="explore" className="m-0 h-full">
          <ExploreTab />
        </TabsContent>
        
        <TabsContent value="search" className="m-0 h-full">
          <SearchTab />
        </TabsContent>
        
        <TabsContent value="create-video" className="m-0 h-full">
          <VideoCreationTab />
        </TabsContent>
        
        <TabsContent value="podcast" className="m-0 h-full">
          <PodcastTab />
        </TabsContent>
        
        <TabsContent value="monetization" className="m-0 h-full">
          <MonetizationTab />
        </TabsContent>
        
        <TabsContent value="profile" className="m-0 h-full">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
