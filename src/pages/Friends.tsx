
import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import MatchTabs from '../components/MatchTabs';
import TopicList from '../components/TopicList';
import PromoBanner from '../components/PromoBanner';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import FeedTabs from '../components/FeedTabs';
import { topics, feedPosts, currentUser } from '../data/mockData';
import { Search } from 'lucide-react';

const Friends: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'match' | 'friends'>('friends');
  const [activeFeedTab, setActiveFeedTab] = useState<'activity' | 'nearby' | 'recommend'>('activity');
  
  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      <StatusBar />
      
      <div className="flex justify-between items-center px-4 pt-2 pb-4">
        <div className="w-24"></div>
        <MatchTabs activeTab={activeMainTab} onTabChange={setActiveMainTab} />
        <button className="w-24 flex justify-end">
          <Search className="h-6 w-6" />
        </button>
      </div>
      
      <TopicList topics={topics} />
      
      <FeedTabs activeTab={activeFeedTab} onTabChange={setActiveFeedTab} />
      
      <PromoBanner text="5·1假日免费领好礼" />
      
      <div className="px-4 py-3 flex items-center border-b border-gray-100">
        <UserAvatar src={currentUser.avatar} />
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h3 className="font-medium">{currentUser.name}</h3>
            <span className="ml-2 text-orange-500 text-sm">5</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-gray-500 text-sm mr-2">北京市</span>
            <span className="text-green-500 text-sm">• 在线</span>
          </div>
        </div>
        <div className="bg-orange-100 text-orange-500 rounded-full px-4 py-1.5 flex items-center">
          <span className="text-sm">为何上推荐</span>
          <span className="ml-1">?</span>
        </div>
      </div>
      
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 text-gray-500">您的个人资料还未完善，完善资料可提升交友率</span>
        </div>
        <button className="mt-2 text-orange-500 text-sm">
          现在完善? 去填写
        </button>
      </div>
      
      {feedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      
      <div className="fixed bottom-20 right-4">
        <button className="bg-pink-500 text-white rounded-full p-3 shadow-lg flex items-center">
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <TabBar />
    </div>
  );
};

export default Friends;
