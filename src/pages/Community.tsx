
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import CommunityTabs from '../components/CommunityTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import FloatingButton from '../components/FloatingButton';
import { communityPosts } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'following' | 'recommended'>('recommended');

  const handleCreatePost = () => {
    if (user) {
      navigate('/community/post');
    } else {
      navigate('/auth');
    }
  };

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
            <PostCard key={post.id} post={post} isInteractive={true} />
          ))}
        </div>
      )}
      
      <FloatingButton onClick={handleCreatePost} />
      
      <TabBar />
    </div>
  );
};

export default Community;
