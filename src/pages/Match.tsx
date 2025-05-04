
import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import MatchTabs from '../components/MatchTabs';
import UserAvatar from '../components/UserAvatar';
import MatchRadar from '../components/MatchRadar';
import MatchOptions from '../components/MatchOptions';
import { currentUser, nearbyUsers } from '../data/mockData';

const Match: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'match' | 'friends'>('match');
  const onlineCount = 47914;

  return (
    <div className="min-h-screen bg-app-dark flex flex-col pb-16">
      <StatusBar />
      
      <div className="bg-app-dark px-4 pt-2 pb-4">
        <div className="flex justify-between items-center">
          <button className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <MatchTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <button className="border border-gray-600 text-white text-xs px-3 py-1.5 rounded-full">
            设置匹配倾向
          </button>
        </div>
      </div>
      
      <div className="bg-app-dark px-4 pt-2">
        <div className="bg-opacity-20 bg-gray-700 rounded-xl p-4">
          <div className="flex items-center">
            <UserAvatar src={currentUser.avatar} size="lg" />
            <div className="ml-4">
              <h2 className="text-white text-xl font-medium">{currentUser.name}</h2>
              <div className="flex items-center mt-1">
                <span className="text-gray-400 text-sm">尚未人格测试</span>
                <button className="ml-2 text-red-400 text-sm border border-red-400 rounded px-2 py-0.5">
                  立即前往
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {activeTab === 'match' && (
        <>
          <MatchRadar users={nearbyUsers} center={currentUser} />
          
          <div className="text-center text-gray-300 mb-1">
            <p className="font-medium">当前 {onlineCount} 人正在匹配</p>
            <p className="text-xs mt-1 text-gray-400">tips: 礼貌的打招呼，对方才会有好的回应</p>
          </div>
          
          <div className="px-4 py-3 bg-opacity-20 bg-gray-700 mx-4 rounded-xl flex items-center">
            <div className="flex-shrink-0">
              <img src="/lovable-uploads/710f54bf-505f-4047-86f9-23670f5034fb.png" alt="Card" className="h-12 w-12" />
            </div>
            <div className="ml-3 flex-1">
              <span className="text-white">购买匹配卡</span>
            </div>
            <div>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="absolute right-4 top-32">
            <div className="bg-white bg-opacity-10 rounded-full p-2">
              <span className="text-purple-300">精准</span>
            </div>
          </div>
          
          <MatchOptions />
        </>
      )}
      
      <TabBar />
    </div>
  );
};

export default Match;
