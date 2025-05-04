
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, MessageSquare, Heart, X, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfileData {
  id: string;
  nickname: string;
  avatar: string;
  gender: string;
  birth_date: string | null;
  location: string | null;
  tagline: string | null;
  relationship_status: string | null;
  personality_type: string | null;
}

interface PersonalityData {
  extraversion: number | null;
  sensing: number | null;
  thinking: number | null;
}

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [personalityData, setPersonalityData] = useState<PersonalityData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchUserProfile();
      if (user) {
        checkFollowStatus();
      }
    }
  }, [id, user]);
  
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Record profile view
      if (user && id && user.id !== id) {
        await supabase
          .from('profile_views')
          .upsert({ viewer_id: user.id, viewed_id: id, created_at: new Date().toISOString() })
          .select();
      }
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (profileError) throw profileError;
      
      setProfileData(profileData);
      
      // Fetch personality data
      const { data: personalityData, error: personalityError } = await supabase
        .from('personality_tests')
        .select('*')
        .eq('user_id', id)
        .single();
        
      if (!personalityError) {
        setPersonalityData(personalityData);
      }
    } catch (error) {
      console.error('获取用户资料错误:', error);
      toast({
        title: "获取用户资料失败",
        description: "无法加载用户资料，请稍后再试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const checkFollowStatus = async () => {
    // This would be implemented with a follows/friends table
    // For now using mock data
    setIsFollowing(false);
  };
  
  const handleChat = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (id) {
      try {
        // Create initial message if there's no conversation yet
        const { data: existingMessages, error: checkError } = await supabase
          .from('messages')
          .select('id')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${user.id})`)
          .limit(1);
          
        if (checkError) throw checkError;
        
        if (!existingMessages || existingMessages.length === 0) {
          // Send welcome message
          await supabase
            .from('messages')
            .insert({
              sender_id: user.id,
              receiver_id: id,
              content: "你好，很高兴认识你！",
            });
        }
        
        // Navigate to chat
        navigate(`/chat/${id}`);
      } catch (error) {
        console.error('启动聊天错误:', error);
        toast({
          title: "启动聊天失败",
          description: "无法开始聊天，请稍后再试",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleFollow = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // This would be implemented with a follows/friends table
    // For now just toggling state
    setIsFollowing(!isFollowing);
    
    toast({
      description: isFollowing ? "已取消关注" : "关注成功"
    });
  };
  
  // Calculate age from birth_date
  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  const age = profileData?.birth_date ? calculateAge(profileData.birth_date) : null;

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
              src={profileData?.avatar || "/placeholder.svg"} 
              alt={profileData?.nickname || '未知用户'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center px-4">
        <h1 className="text-2xl font-bold">{profileData?.nickname || '未知用户'}</h1>
        <p className="text-gray-500 mt-1">
          {profileData?.gender || '未设置'} 
          {age ? ` · ${age}岁` : ''} 
          {profileData?.location ? ` · ${profileData.location}` : ''}
        </p>
        
        <div className="flex justify-center space-x-4 mt-6">
          <Button 
            variant="outline" 
            className="flex items-center rounded-full px-6"
            onClick={handleChat}
          >
            <MessageSquare size={16} className="mr-2" />
            聊天
          </Button>
          <Button 
            className={`flex items-center rounded-full px-6 ${
              isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={handleFollow}
          >
            {isFollowing ? (
              <>
                <Check size={16} className="mr-2" />
                已关注
              </>
            ) : (
              <>
                <UserPlus size={16} className="mr-2" />
                关注
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="mt-8 px-4">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">关于我</h2>
          <p className="text-gray-600">{profileData?.tagline || '这个人很神秘，还没有填写个人介绍...'}</p>
          
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
              <p className="font-medium mt-1">{profileData?.relationship_status || '单身'}</p>
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
          
          {personalityData ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">外向</span>
                  <span className="text-sm text-gray-500">内向</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-400 rounded-full" 
                    style={{ width: `${personalityData.extraversion ? personalityData.extraversion : 50}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">理性</span>
                  <span className="text-sm text-gray-500">感性</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full bg-orange-400 rounded-full" 
                    style={{ width: `${personalityData.sensing ? personalityData.sensing : 50}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">理性</span>
                  <span className="text-sm text-gray-500">情感</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full bg-purple-400 rounded-full" 
                    style={{ width: `${personalityData.thinking ? personalityData.thinking : 50}%` }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-4">
              该用户尚未完成人格测试
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
