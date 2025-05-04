
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { nearbyUsers } from '../data/mockData';
import UserAvatar from '../components/UserAvatar';

const MatchDetail: React.FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getTitle = () => {
    switch (type) {
      case 'quick':
        return '快速匹配';
      case 'nearby':
        return '附近匹配';
      case 'voice':
        return '声音匹配';
      case 'purchase':
        return '购买匹配卡';
      default:
        return '匹配';
    }
  };
  
  const renderContent = () => {
    if (type === 'purchase') {
      return (
        <div className="p-4 flex-1">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">会员匹配服务</h2>
            <p className="mb-6">解锁更多匹配功能，提高匹配成功率</p>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4 border-b border-white border-opacity-20 pb-4">
                <div className="text-left">
                  <h3 className="font-bold">基础匹配卡</h3>
                  <p className="text-sm opacity-80">每日匹配次数 +5</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">¥28.00</p>
                  <p className="text-xs opacity-80">30天有效期</p>
                </div>
              </div>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                立即购买
              </Button>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4 border-b border-white border-opacity-20 pb-4">
                <div className="text-left">
                  <h3 className="font-bold">高级匹配卡</h3>
                  <p className="text-sm opacity-80">无限制匹配次数</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">¥68.00</p>
                  <p className="text-xs opacity-80">30天有效期</p>
                </div>
              </div>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                立即购买
              </Button>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4 border-b border-white border-opacity-20 pb-4">
                <div className="text-left">
                  <h3 className="font-bold">超级匹配卡</h3>
                  <p className="text-sm opacity-80">优先展示 + 无限制匹配</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">¥128.00</p>
                  <p className="text-xs opacity-80">30天有效期</p>
                </div>
              </div>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                立即购买
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 flex-1">
        <div className="relative h-96 mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-400 to-red-400 rounded-xl flex items-center justify-center">
            <svg className="animate-spin h-20 w-20 text-white opacity-90" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-2">正在匹配中...</h2>
              <p className="opacity-80">正在为您寻找合适的对象</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">推荐用户</h2>
          <div className="grid grid-cols-4 gap-3">
            {nearbyUsers.slice(0, 8).map((user) => (
              <div 
                key={user.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                <UserAvatar src={user.avatar} size="md" online={user.online} />
                <span className="text-xs mt-1 truncate w-full text-center">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mb-6">
          <p>今日匹配次数: 1/3</p>
        </div>
        
        <Button 
          className="w-full bg-red-500 hover:bg-red-600"
          onClick={() => navigate(-1)}
        >
          取消匹配
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">{getTitle()}</h1>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default MatchDetail;
