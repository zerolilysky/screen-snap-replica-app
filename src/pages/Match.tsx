
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import MatchTabs from '../components/MatchTabs';
import UserAvatar from '../components/UserAvatar';
import MatchRadar from '../components/MatchRadar';
import MatchOptions from '../components/MatchOptions';
import { useAuth } from '../contexts/AuthContext';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NearbyUser {
  id: string;
  name: string;
  avatar: string;
  distance?: string;
  online?: boolean;
}

interface CurrentUser {
  id: string;
  avatar: string;
}

const Match: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'match' | 'friends'>('match');
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [pendingMatchCount, setPendingMatchCount] = useState<number>(0);
  
  useEffect(() => {
    if (user) {
      fetchNearbyUsers();
      fetchMatchRequestsCount();
      
      // Set up subscription for match requests
      const channel = supabase
        .channel('match_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'match_requests',
          filter: `user_to=eq.${user.id}`
        }, () => {
          fetchMatchRequestsCount();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  const fetchNearbyUsers = async () => {
    if (!user) return;
    
    try {
      // Get users who are online or recently active
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nickname, avatar, is_online, location')
        .neq('id', user.id)
        .order('is_online', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      // Prepare data for radar display
      const nearby = data.map(u => ({
        id: u.id,
        name: u.nickname || '未知用户',
        avatar: u.avatar || '/placeholder.svg',
        distance: generateRandomDistance(),
        online: u.is_online
      }));
      
      setNearbyUsers(nearby);
      
      // Set current user info
      setCurrentUser({
        id: user.id,
        avatar: profile?.avatar || '/placeholder.svg'
      });
      
      // Count online users
      setOnlineCount(Math.floor(Math.random() * 10000) + 40000); // Mock online count
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    }
  };
  
  const fetchMatchRequestsCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('match_requests')
        .select('id', { count: 'exact', head: true })
        .eq('user_to', user.id)
        .eq('status', 'pending');
        
      if (error) throw error;
      
      setPendingMatchCount(count || 0);
    } catch (error) {
      console.error('Error fetching match requests count:', error);
    }
  };
  
  const generateRandomDistance = () => {
    const distance = Math.floor(Math.random() * 15) + 1;
    return `${distance}km`;
  };
  
  const handleTabChange = (tab: 'match' | 'friends') => {
    if (tab === 'friends') {
      navigate('/friends');
    } else {
      setActiveTab(tab);
    }
  };
  
  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };
  
  const handleMatchOptionClick = (type: string) => {
    navigate(`/match/${type}`);
  };
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col pb-16">
      <StatusBar />
      
      <div className="bg-app-dark px-4 pt-2 pb-4">
        <div className="flex justify-between items-center">
          <button 
            className={`text-gray-400 relative ${pendingMatchCount > 0 ? 'animate-pulse' : ''}`}
            onClick={() => navigate('/match/requests')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {pendingMatchCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {pendingMatchCount}
              </span>
            )}
          </button>
          
          <MatchTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          <button className="flex items-center justify-center w-8 h-8">
            <Search className="h-6 w-6 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="bg-app-dark px-4 pt-2">
        <div className="bg-opacity-20 bg-gray-700 rounded-xl p-4">
          <div className="flex items-center">
            <UserAvatar src={profile?.avatar || '/placeholder.svg'} size="lg" />
            <div className="ml-4">
              <h2 className="text-white text-xl font-medium">{profile?.nickname || '未登录用户'}</h2>
              <div className="flex items-center mt-1">
                <span className="text-gray-400 text-sm">尚未人格测试</span>
                <button className="ml-2 text-red-400 text-sm border border-red-400 rounded px-2 py-0.5" onClick={() => navigate('/personality-test')}>
                  立即前往
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {currentUser && (
        <MatchRadar users={nearbyUsers} center={currentUser} onUserClick={handleUserClick} />
      )}
      
      <div className="text-center text-gray-300 mb-1">
        <p className="font-medium">当前 {onlineCount} 人正在匹配</p>
        <p className="text-xs mt-1 text-gray-400">tips: 礼貌的打招呼，对方才会有好的回应</p>
      </div>
      
      <div className="absolute right-4 top-32">
        <div className="bg-white bg-opacity-10 rounded-full p-2">
          <span className="text-purple-300">精准</span>
        </div>
      </div>
      
      <MatchOptions onOptionClick={handleMatchOptionClick} />
      
      <TabBar />
    </div>
  );
};

export default Match;
