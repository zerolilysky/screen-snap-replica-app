
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
            <p className="text-gray-500 text-sm">ID: {user.id?.substring(0, 8)}</p>
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
    </div>
  );
};

export default ProfileCard;
