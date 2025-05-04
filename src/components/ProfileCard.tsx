
import React from 'react';
import { User } from '../types';
import UserAvatar from './UserAvatar';

interface ProfileCardProps {
  user: User;
  completionPercentage?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, completionPercentage = 60 }) => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white p-6 rounded-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <UserAvatar src={user.avatar} size="xl" />
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{user.name}</h2>
              {user.verified ? (
                <span className="ml-1 text-yellow-500">✓</span>
              ) : (
                <span className="ml-1 text-gray-400">未认证</span>
              )}
            </div>
            <p className="text-gray-500 text-sm">ID: {user.id}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-8 mt-8 text-center">
        <div className="flex flex-col">
          <span className="text-xl font-semibold">0</span>
          <span className="text-gray-500 text-sm">好友</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold">0</span>
          <span className="text-gray-500 text-sm">访客</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold">0</span>
          <span className="text-gray-500 text-sm">粉丝</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold">0</span>
          <span className="text-gray-500 text-sm">关注</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 mt-8 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            <span className="text-amber-500">👑</span>
            <span className="text-amber-700 font-medium">限时立减</span>
          </div>
          <button className="bg-white text-amber-500 rounded-full px-4 py-1 text-sm">立即开通</button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
            <span className="ml-2">0</span>
          </div>
          <button className="ml-4 border border-red-400 text-red-400 rounded-full px-4 py-1 text-sm">充值</button>
        </div>
        <div className="flex items-center">
          <span className="text-amber-500 text-sm">5</span>
          <span className="ml-1 text-gray-500 text-sm">今日可领取520经验</span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">谁看过我</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">我的动态</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">我的装扮</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">我的钱包</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">排行榜</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">CP空间</span>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="ml-2 text-gray-700 font-medium">我的人格</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
