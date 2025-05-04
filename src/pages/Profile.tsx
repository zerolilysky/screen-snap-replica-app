
import React from 'react';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import ProfileCard from '../components/ProfileCard';
import TopicGroup from '../components/TopicGroup';
import PromoBanner from '../components/PromoBanner';
import { currentUser, trends } from '../data/mockData';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <StatusBar time="20:21" />
      
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1zM9 11H7v2h2v-2zm4 0h-2v2h2v-2z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 text-orange-500">完善资料, 曝光次数将提升60%</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button className="text-gray-600">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <ProfileCard user={currentUser} />
      </div>
      
      <PromoBanner text="5·1假日免费领好礼" />
      
      <div className="bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">我的人格</h2>
          <div className="flex">
            <p className="text-gray-500 text-sm mr-8">你的人格类型</p>
            <button className="text-gray-500 text-sm">更多 &gt;</button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">外向</span>
              <span className="text-sm text-gray-500">内向</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-full bg-blue-400 rounded-full w-3/4"></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">理性</span>
              <span className="text-sm text-gray-500">感性</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-full bg-orange-400 rounded-full w-1/2"></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">理性</span>
              <span className="text-sm text-gray-500">情感</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-full bg-purple-400 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">心理测试</h2>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mr-2">
              <span className="text-white text-xs">😊</span>
            </div>
            <span className="text-gray-600">探索内心世界</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">正在讨论</h2>
          <button className="text-gray-500 text-sm">更多 &gt;</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {trends.map(trend => (
            <div key={trend.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-lg mr-1">{trend.icon}</span>
                <span className="text-sm font-medium">#{trend.title}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{trend.participants}参与</div>
            </div>
          ))}
        </div>
      </div>
      
      <TabBar />
    </div>
  );
};

export default Profile;
