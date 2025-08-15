
import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Search, Podcast, User, Plus, Crown } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full bg-white min-h-screen relative">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full h-full">
          <div className="flex-1 overflow-hidden h-screen">
            {children}
          </div>

          <TabsList className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-gray-200 rounded-none h-16 z-50 shadow-lg grid grid-cols-6">
            <TabsTrigger 
              value="explore" 
              className="flex-1 flex flex-col items-center gap-1 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600 text-gray-500"
            >
              <Video size={20} />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="flex-1 flex flex-col items-center gap-1 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600 text-gray-500"
            >
              <Search size={20} />
              <span className="text-xs">Search</span>
            </TabsTrigger>
            <TabsTrigger 
              value="create-video" 
              className="flex-1 flex flex-col items-center gap-1 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600 text-gray-500"
            >
              <Plus size={20} />
              <span className="text-xs">Create</span>
            </TabsTrigger>
            <TabsTrigger 
              value="podcast" 
              className="flex-1 flex flex-col items-center gap-1 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600 text-gray-500"
            >
              <Podcast size={20} />
              <span className="text-xs">Podcast</span>
            </TabsTrigger>
            <TabsTrigger 
              value="monetization" 
              className="flex-1 flex flex-col items-center gap-1 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600 text-gray-500"
            >
              <Crown size={20} />
              <span className="text-xs">Premium</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex-1 flex flex-col items-center gap-1 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600 text-gray-500"
            >
              <User size={20} />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* SheTalks branding - only shown on non-explore tabs */}
        {activeTab !== 'explore' && (
          <header className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-white/90 to-transparent p-4">
            <h1 className="text-2xl font-bold text-center pink-gradient-text">
              SheTalks
            </h1>
          </header>
        )}
      </div>
    </div>
  );
};

export default Layout;
