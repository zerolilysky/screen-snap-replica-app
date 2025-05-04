
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import MatchTabs from '../components/MatchTabs';
import TopicList from '../components/TopicList';
import PromoBanner from '../components/PromoBanner';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import FeedTabs from '../components/FeedTabs';
import { topics, feedPosts, currentUser } from '../data/mockData';
import { Search, GridIcon, AlignRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const Friends: React.FC = () => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<'match' | 'friends'>('friends');
  const [activeFeedTab, setActiveFeedTab] = useState<'activity' | 'nearby' | 'recommend'>('activity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const handleTabChange = (tab: 'match' | 'friends') => {
    if (tab === 'match') {
      navigate('/match');
    } else {
      setActiveMainTab(tab);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <StatusBar />
      
      <div className="flex justify-between items-center px-4 py-2 bg-white">
        <div className="w-8"></div>
        <MatchTabs activeTab={activeMainTab} onTabChange={handleTabChange} />
        <button className="w-8 flex justify-end">
          <Search className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      
      <div className="px-1 py-2 bg-white">
        <TopicList topics={topics} />
      </div>
      
      <div className="bg-white mb-2">
        <div className="flex justify-between items-center pr-4">
          <FeedTabs activeTab={activeFeedTab} onTabChange={setActiveFeedTab} />
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-md", viewMode === 'grid' ? "text-gray-900" : "text-gray-400")}
              onClick={() => setViewMode('grid')}
            >
              <GridIcon className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-md", viewMode === 'list' ? "text-gray-900" : "text-gray-400")}
              onClick={() => setViewMode('list')}
            >
              <AlignRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <PromoBanner 
        text="5·1假日免费领好礼" 
        className="mx-2 rounded-xl bg-green-100 border-none overflow-hidden"
        imageUrl="/lovable-uploads/9684d0c3-e95c-4084-aa14-631acd11670c.png"
      />
      
      <div className="px-4 py-3 flex items-center border-b border-gray-100 bg-white mt-2 rounded-lg mx-2 shadow-sm">
        <UserAvatar src={currentUser.avatar} size="lg" online={true} />
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h3 className="font-medium">{currentUser.name}</h3>
            <span className="ml-2 text-orange-500 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 11a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
              </svg>
              5
            </span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-gray-500 text-sm mr-2">北京市</span>
            <span className="text-green-500 text-sm flex items-center">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
              在线
            </span>
          </div>
        </div>
        <div className="bg-orange-50 text-orange-500 rounded-full px-4 py-1.5 flex items-center shadow-sm">
          <span className="text-sm font-medium">为何上推荐</span>
          <span className="ml-1 bg-orange-100 rounded-full h-5 w-5 flex items-center justify-center">?</span>
        </div>
      </div>
      
      <div className="px-4 py-3 border-b border-gray-100 bg-white mt-2 rounded-lg mx-2 shadow-sm">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 text-gray-600">您的个人资料还未完善，完善资料可提升交友率</span>
        </div>
        <div className="flex mt-2">
          <button className="text-orange-500 text-sm font-medium bg-orange-50 px-4 py-1 rounded-full">
            现在完善
          </button>
          <button className="ml-2 text-blue-500 text-sm font-medium underline">
            去填写
          </button>
        </div>
      </div>
      
      {feedPosts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          className="mt-2 mx-2 rounded-lg shadow-sm border border-gray-100"
        />
      ))}
      
      <div className="fixed bottom-20 right-4">
        <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full p-3 shadow-lg flex items-center">
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-full px-6 py-3 shadow-xl flex items-center space-x-2">
          <img src="/lovable-uploads/9684d0c3-e95c-4084-aa14-631acd11670c.png" 
               alt="Chat" 
               className="w-6 h-6" />
          <span className="font-medium text-pink-500">聊天速配</span>
        </div>
      </div>
      
      <TabBar />
    </div>
  );
};

export default Friends;
