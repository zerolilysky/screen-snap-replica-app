
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, MessageSquare, Heart, X, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { nearbyUsers } from '../data/mockData';

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Find user from mock data (in real app, you'd fetch from Supabase)
  const profileUser = nearbyUsers.find(u => u.id === id) || {
    id: id || '0',
    name: '未知用户',
    avatar: '/placeholder.svg',
    gender: 'unknown',
    age: 0,
    distance: '未知',
    location: '未知',
    online: false
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">用户资料</h1>
        <div className="w-6"></div>
      </div>
      
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <div className="absolute bottom-0 transform translate-y-1/2 left-0 right-0 flex justify-center">
          <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden">
            <img 
              src={profileUser.avatar} 
              alt={profileUser.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center px-4">
        <h1 className="text-2xl font-bold">{profileUser.name}</h1>
        <p className="text-gray-500 mt-1">
          {profileUser.gender === 'male' ? '男' : profileUser.gender === 'female' ? '女' : '未设置'} 
          {profileUser.age ? ` · ${profileUser.age}岁` : ''} 
          {profileUser.location ? ` · ${profileUser.location}` : ''}
        </p>
        
        <div className="flex justify-center space-x-4 mt-6">
          <Button variant="outline" className="flex items-center rounded-full px-6">
            <MessageSquare size={16} className="mr-2" />
            聊天
          </Button>
          <Button className="flex items-center rounded-full px-6 bg-red-500 hover:bg-red-600">
            <UserPlus size={16} className="mr-2" />
            关注
          </Button>
        </div>
      </div>
      
      <div className="mt-8 px-4">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">关于我</h2>
          <p className="text-gray-600">这个人很神秘，还没有填写个人介绍...</p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm text-gray-500">爱好</h3>
              <p className="font-medium mt-1">运动，电影，美食</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm text-gray-500">职业</h3>
              <p className="font-medium mt-1">未设置</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm text-gray-500">感情状态</h3>
              <p className="font-medium mt-1">单身</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm text-gray-500">教育程度</h3>
              <p className="font-medium mt-1">未设置</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 px-4 mb-6">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">人格分析</h2>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">外向</span>
              <span className="text-sm text-gray-500">内向</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-full bg-blue-400 rounded-full w-2/3"></div>
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
          
          <div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">理性</span>
              <span className="text-sm text-gray-500">情感</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-full bg-purple-400 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
