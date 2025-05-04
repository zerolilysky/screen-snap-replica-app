
import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import NotificationTabs from '../components/NotificationTabs';
import NotificationFilter from '../components/NotificationFilter';
import EmptyState from '../components/EmptyState';

const Messages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'match'>('chat');

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      <StatusBar />
      
      <div className="flex justify-center items-center py-2">
        <h1 className="text-xl font-medium">消息</h1>
        <button className="absolute right-4">
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
      
      <div className="bg-red-400 text-white py-2 px-4 flex justify-between items-center">
        <span>聊天服务已断开</span>
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <NotificationFilter />
      
      <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
          description="还没有一起聊天的朋友，快去匹配交朋友吧"
        />
      </div>
      
      <TabBar />
    </div>
  );
};

export default Messages;
