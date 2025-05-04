
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import ProfileCard from '../components/ProfileCard';
import TopicGroup from '../components/TopicGroup';
import PromoBanner from '../components/PromoBanner';
import { trends } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Loader } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const handleAuthAction = () => {
    if (user) {
      setShowAuthOptions(!showAuthOptions);
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowAuthOptions(false);
  };

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
      
      <div className="px-4 pb-4 relative">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="animate-spin text-gray-500" />
          </div>
        ) : user ? (
          <ProfileCard user={profile || { id: user.id, name: profile?.nickname || 'Nico用户', avatar: '/placeholder.svg' }} />
        ) : (
          <div className="bg-gradient-to-b from-purple-50 to-white p-6 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">您尚未登录</h2>
                <p className="text-gray-500 text-sm mt-1">登录后畅享更多功能</p>
              </div>
              <Button 
                className="bg-red-500 hover:bg-red-600" 
                onClick={handleAuthAction}
              >
                <User className="mr-2 h-4 w-4" />
                登录 / 注册
              </Button>
            </div>
          </div>
        )}
        
        {showAuthOptions && (
          <div className="absolute right-8 top-20 bg-white shadow-lg rounded-lg p-2 z-10">
            <button 
              className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 rounded-md w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </button>
          </div>
        )}
      </div>
      
      <PromoBanner text="5·1假日免费领好礼" />
      
      <div className="bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">我的人格</h2>
          <div className="flex">
            <p className="text-gray-500 text-sm mr-8">你的人格类型</p>
            <Link to="/personality-test" className="text-gray-500 text-sm">更多 &gt;</Link>
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
      
      <div className="mt-6 grid grid-cols-3 gap-8 px-4">
        <Link to="/profile/views" className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">谁看过我</span>
        </Link>
        <Link to="/profile/posts" className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">我的动态</span>
        </Link>
        <Link to="/profile/customization" className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">我的装扮</span>
        </Link>
        <Link to="/profile/wallet" className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">我的钱包</span>
        </Link>
        <Link to="/profile/leaderboard" className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">排行榜</span>
        </Link>
        <Link to="/profile/cp-space" className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-600">CP空间</span>
        </Link>
      </div>
      
      <div className="mt-6 px-4">
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
      
      <TabBar />
    </div>
  );
};

export default Profile;
