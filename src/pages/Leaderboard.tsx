
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Trophy, Star, Heart } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';

const LeaderboardItem: React.FC<{
  rank: number;
  name: string;
  avatar: string;
  score: number;
  isTop3?: boolean;
}> = ({ rank, name, avatar, score, isTop3 = false }) => {
  return (
    <div className="flex items-center py-3 border-b border-gray-100">
      <div className={`w-8 text-center ${
        rank === 1 ? 'text-yellow-500' : 
        rank === 2 ? 'text-gray-400' : 
        rank === 3 ? 'text-amber-600' : 'text-gray-500'
      } font-medium`}>
        {isTop3 ? (
          <Trophy size={16} className="mx-auto" />
        ) : rank}
      </div>
      <UserAvatar src={avatar} size="sm" />
      <div className="ml-3 flex-1">
        <p className="font-medium">{name}</p>
      </div>
      <div className="flex items-center text-gray-500">
        <p className="mr-1">{score}</p>
        <Star size={14} className="text-yellow-500" />
      </div>
    </div>
  );
};

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'charm' | 'wealth' | 'activity'>('charm');

  const leaderboardData = [
    { id: 1, rank: 1, name: "小雨", avatar: "/placeholder.svg", score: 9876 },
    { id: 2, rank: 2, name: "阳光", avatar: "/placeholder.svg", score: 8765 },
    { id: 3, rank: 3, name: "微风", avatar: "/placeholder.svg", score: 7654 },
    { id: 4, rank: 4, name: "清雨", avatar: "/placeholder.svg", score: 6543 },
    { id: 5, rank: 5, name: "月光", avatar: "/placeholder.svg", score: 5432 },
    { id: 6, rank: 6, name: "星辰", avatar: "/placeholder.svg", score: 4321 },
    { id: 7, rank: 7, name: "流云", avatar: "/placeholder.svg", score: 3210 },
    { id: 8, rank: 8, name: "落叶", avatar: "/placeholder.svg", score: 2109 },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">排行榜</h1>
      </div>
      
      <div className="flex border-b border-gray-100">
        <button 
          className={`flex-1 py-3 text-center relative ${activeTab === 'charm' ? 'text-pink-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('charm')}
        >
          魅力榜
          {activeTab === 'charm' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />}
        </button>
        <button 
          className={`flex-1 py-3 text-center relative ${activeTab === 'wealth' ? 'text-pink-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('wealth')}
        >
          财富榜
          {activeTab === 'wealth' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />}
        </button>
        <button 
          className={`flex-1 py-3 text-center relative ${activeTab === 'activity' ? 'text-pink-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('activity')}
        >
          活跃榜
          {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />}
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4">
        <div className="text-center mb-2">
          <p className="text-gray-500">我的排名</p>
          <p className="text-3xl font-bold text-gray-800">999+</p>
        </div>
        
        <div className="flex justify-center">
          <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-6 py-2 flex items-center">
            <Heart size={16} className="mr-2" />
            提升排名
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="font-medium mb-2">本周排行</h2>
        
        <div className="bg-white rounded-lg">
          {leaderboardData.map((user) => (
            <LeaderboardItem 
              key={user.id}
              rank={user.rank}
              name={user.name}
              avatar={user.avatar}
              score={user.score}
              isTop3={user.rank <= 3}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
