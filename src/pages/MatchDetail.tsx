
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UserAvatar from '../components/UserAvatar';
import MatchRequests from '../components/MatchRequests';

interface User {
  id: string;
  nickname: string;
  avatar: string;
  gender?: string;
  location?: string;
  birth_date?: string;
  age?: number;
  online?: boolean;
}

const MatchDetail: React.FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (type !== 'requests') {
      fetchRecommendedUsers();
    }
  }, [user, type]);
  
  const fetchRecommendedUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Get the current user's profile to determine their preferences
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('preferred_gender, gender')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Build the query based on gender preferences
      let query = supabase
        .from('profiles')
        .select('id, nickname, avatar, gender, location, birth_date, is_online')
        .neq('id', user.id)
        .order('created_at', { ascending: false })
        .limit(8);
        
      // Apply gender filter if present
      if (profile.preferred_gender && profile.preferred_gender !== '不限') {
        query = query.eq('gender', profile.preferred_gender);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the users to calculate age
      const processedUsers = data.map(user => {
        let age = null;
        
        if (user.birth_date) {
          const birthDate = new Date(user.birth_date);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          
          if (today.getMonth() < birthDate.getMonth() || 
              (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }
        
        return {
          ...user,
          age,
          online: user.is_online
        };
      });
      
      setRecommendedUsers(processedUsers);
    } catch (error: any) {
      console.error('获取推荐用户错误:', error);
      toast({
        title: "获取推荐用户失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const startMatching = async () => {
    if (!user) return;
    
    setMatchingInProgress(true);
    
    // Simulate matching process
    setTimeout(() => {
      setMatchingInProgress(false);
      
      const randomUser = recommendedUsers[Math.floor(Math.random() * recommendedUsers.length)];
      
      if (randomUser) {
        navigate(`/user/${randomUser.id}`);
      } else {
        toast({
          title: "匹配失败",
          description: "未找到合适的匹配对象，请稍后再试",
          variant: "destructive"
        });
      }
    }, 3000);
  };
  
  const sendMatchRequest = async (userId: string) => {
    if (!user) return;
    
    try {
      // Check if a request already exists
      const { data: existingRequest, error: checkError } = await supabase
        .from('match_requests')
        .select('id, status')
        .or(`and(user_from.eq.${user.id},user_to.eq.${userId}),and(user_from.eq.${userId},user_to.eq.${user.id})`)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast({
            title: "已发送请求",
            description: "你已经向该用户发送过配对请求，请等待回应"
          });
        } else if (existingRequest.status === 'matched') {
          // If already matched, go to chat
          navigate(`/chat/${userId}`);
        } else {
          toast({
            title: "无法配对",
            description: "该用户已拒绝你的配对请求"
          });
        }
        return;
      }
      
      // Create a new match request
      const { error } = await supabase
        .from('match_requests')
        .insert({
          user_from: user.id,
          user_to: userId,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "配对请求已发送",
        description: "请等待对方接受你的配对请求"
      });
      
      // Refresh the recommended users
      fetchRecommendedUsers();
    } catch (error: any) {
      console.error('发送配对请求错误:', error);
      toast({
        title: "发送配对请求失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
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
      case 'requests':
        return '配对请求';
      default:
        return '匹配';
    }
  };
  
  const renderContent = () => {
    if (type === 'requests') {
      return <MatchRequests />;
    }
    
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
    
    if (matchingInProgress) {
      return (
        <div className="p-4 flex-1">
          <div className="relative h-96 mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-400 to-red-400 rounded-xl flex items-center justify-center">
              <div className="animate-spin h-20 w-20 text-white opacity-90">
                <Loader2 size={80} />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-2xl font-bold mb-2">正在匹配中...</h2>
                <p className="opacity-80">正在为您寻找合适的对象</p>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-red-500 hover:bg-red-600"
            onClick={() => setMatchingInProgress(false)}
          >
            取消匹配
          </Button>
        </div>
      );
    }
    
    return (
      <div className="p-4 flex-1">
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-lg font-medium mb-3">推荐用户</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {recommendedUsers.slice(0, 8).map((user) => (
                <div 
                  key={user.id} 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  <UserAvatar src={user.avatar} size="md" online={user.online} />
                  <span className="text-xs mt-1 truncate w-full text-center">{user.nickname}</span>
                </div>
              ))}
              
              {recommendedUsers.length === 0 && (
                <div className="col-span-4 py-8 text-center text-gray-500">
                  暂无推荐用户
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="flex-1 mr-2"
              onClick={fetchRecommendedUsers}
              disabled={loading}
            >
              刷新
            </Button>
            
            <Button
              className="flex-1"
              onClick={startMatching}
              disabled={loading || recommendedUsers.length === 0}
            >
              开始匹配
            </Button>
          </div>
        </div>
        
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-lg font-medium mb-3">已经认识的人</h2>
          
          <div className="text-sm text-gray-500 mb-3">
            如果你已经认识某人，可以直接向他们发送配对请求
          </div>
          
          <div className="flex items-center border rounded-lg overflow-hidden">
            <input
              type="text"
              className="flex-1 p-2 border-0 focus:ring-0"
              placeholder="输入用户名或ID"
            />
            <Button variant="ghost" className="rounded-none border-l h-full">
              搜索
            </Button>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mb-6">
          <p>今日匹配次数: 1/3</p>
          <p className="mt-1 text-xs">
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/match/purchase')}>
              升级会员
            </span>
            解锁无限匹配
          </p>
        </div>
        
        <Button 
          className="w-full"
          variant="outline"
          onClick={() => navigate('/match/requests')}
        >
          查看配对请求
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
