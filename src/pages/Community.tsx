
import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import CommunityTabs from '../components/CommunityTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import FloatingButton from '../components/FloatingButton';
import { communityPosts } from '../data/mockData';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'following' | 'recommended'>('recommended');

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      <StatusBar time="20:21" />
      
      <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'following' ? (
        <EmptyState 
          image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
          description="您还未关注任何人，看看同城Nicoer吧~"
        />
      ) : (
        <div className="flex-1">
          {communityPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      
      <FloatingButton />
      
      <TabBar />
    </div>
  );
};

export default Community;
