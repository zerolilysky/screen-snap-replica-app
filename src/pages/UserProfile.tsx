
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, MessageCircle, Heart, Flag, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface Profile {
  id: string;
  nickname: string;
  avatar: string;
  gender: string;
  birth_date: string | null;
  tagline: string | null;
  location: string | null;
  height: number | null;
  weight: number | null;
  personality_type: string | null;
  relationship_status: string | null;
  is_online: boolean;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchStatus, setMatchStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'matched' | 'rejected'>('none');
  
  useEffect(() => {
    if (!id) return;
    
    fetchProfile();
    if (user) {
      checkMatchStatus();
    }
  }, [id, user]);
  
  const fetchProfile = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
      
      // Record profile view
      if (user && user.id !== id) {
        await supabase.from('profile_views').insert({
          viewer_id: user.id,
          viewed_id: id
        });
      }
    } catch (error) {
      console.error('获取用户资料错误:', error);
      toast({
        title: "获取用户资料失败",
        description: "无法加载用户资料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const checkMatchStatus = async () => {
    if (!user || !id) return;
    
    try {
      // Check if there's any match between current user and profile user
      const { data: sentRequest, error: sentError } = await supabase
        .from('match_requests')
        .select('status')
        .eq('user_from', user.id)
        .eq('user_to', id)
        .maybeSingle();
        
      if (sentError) throw sentError;
      
      if (sentRequest) {
        setMatchStatus(sentRequest.status === 'pending' ? 'pending_sent' : sentRequest.status as any);
        return;
      }
      
      // Check if user has sent a request to current user
      const { data: receivedRequest, error: receivedError } = await supabase
        .from('match_requests')
        .select('status')
        .eq('user_from', id)
        .eq('user_to', user.id)
        .maybeSingle();
        
      if (receivedError) throw receivedError;
      
      if (receivedRequest) {
        setMatchStatus(receivedRequest.status === 'pending' ? 'pending_received' : receivedRequest.status as any);
        return;
      }
      
      setMatchStatus('none');
    } catch (error) {
      console.error('检查匹配状态错误:', error);
    }
  };
  
  const handleAction = async (action: 'match' | 'message' | 'report') => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!id || !profile) return;
    
    if (action === 'match') {
      try {
        if (matchStatus === 'pending_received') {
          // Accept the match request
          const { error } = await supabase
            .from('match_requests')
            .update({ status: 'matched', updated_at: new Date().toISOString() })
            .eq('user_from', id)
            .eq('user_to', user.id);
            
          if (error) throw error;
          
          setMatchStatus('matched');
          toast({
            title: "配对成功",
            description: `你已与 ${profile.nickname} 配对成功`
          });
        } else if (matchStatus === 'none') {
          // Send a match request
          const { error } = await supabase
            .from('match_requests')
            .insert({
              user_from: user.id,
              user_to: id,
              status: 'pending'
            });
            
          if (error) throw error;
          
          setMatchStatus('pending_sent');
          toast({
            title: "配对请求已发送",
            description: `已向 ${profile.nickname} 发送配对请求`
          });
        } else if (matchStatus === 'matched') {
          // Already matched, go to chat
          navigate(`/chat/${id}`);
        }
      } catch (error: any) {
        console.error('匹配操作错误:', error);
        toast({
          title: "操作失败",
          description: error.message,
          variant: "destructive"
        });
      }
    } else if (action === 'message') {
      if (matchStatus === 'matched') {
        navigate(`/chat/${id}`);
      } else {
        toast({
          title: "无法发送消息",
          description: "需要先完成配对才能发送消息",
          variant: "destructive"
        });
      }
    } else if (action === 'report') {
      toast({
        title: "举报已提交",
        description: "我们将尽快处理您的举报"
      });
    }
  };
  
  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (today.getMonth() < birth.getMonth() || 
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const getMatchStatusText = () => {
    switch (matchStatus) {
      case 'pending_sent':
        return '配对请求已发送';
      case 'pending_received':
        return '对方想与你配对';
      case 'matched':
        return '已配对';
      case 'rejected':
        return '对方拒绝了配对';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="h-64 bg-gradient-to-b from-blue-500 to-purple-500">
          {/* Background cover */}
        </div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-10 left-4 bg-white/30 p-2 rounded-full"
        >
          <ArrowLeft className="text-white" size={24} />
        </button>
        
        <div className="absolute top-10 right-4 flex space-x-2">
          <button 
            onClick={() => handleAction('report')} 
            className="bg-white/30 p-2 rounded-full"
          >
            <Flag className="text-white" size={20} />
          </button>
          <button className="bg-white/30 p-2 rounded-full">
            <Share2 className="text-white" size={20} />
          </button>
        </div>
      </div>
      
      <div className="relative -mt-20 pb-6">
        <div className="bg-white rounded-t-3xl shadow-sm">
          <div className="flex justify-between p-6">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="relative">
                  {loading ? (
                    <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    <img 
                      src={profile?.avatar || "/placeholder.svg"}
                      alt={profile?.nickname || "User"} 
                      className="h-24 w-24 rounded-full border-4 border-white object-cover" 
                    />
                  )}
                  
                  {profile?.is_online && (
                    <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="ml-4">
                  {loading ? (
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  ) : (
                    <h1 className="text-xl font-bold">{profile?.nickname}</h1>
                  )}
                  
                  <div className="flex items-center mt-1">
                    {loading ? (
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <>
                        {profile?.gender && (
                          <span className="text-xs bg-red-50 text-red-500 rounded px-2 py-0.5 mr-2">
                            {profile.gender === 'male' ? '♂' : '♀'} {calculateAge(profile.birth_date)}
                          </span>
                        )}
                        {profile?.location && (
                          <span className="text-xs text-gray-600">{profile.location}</span>
                        )}
                      </>
                    )}
                  </div>
                  
                  {matchStatus !== 'none' && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {getMatchStatusText()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                {loading ? (
                  <>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </>
                ) : (
                  <p className="text-gray-600">{profile?.tagline || "这个用户还没有设置个性签名"}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex px-6 pb-4 space-x-2">
            <Button 
              className="flex-1"
              variant={matchStatus === 'matched' ? 'outline' : 'default'}
              onClick={() => handleAction('match')}
              disabled={matchStatus === 'rejected'}
            >
              <Heart className={`mr-2 h-4 w-4 ${matchStatus === 'matched' ? 'fill-red-500 text-red-500' : ''}`} />
              {matchStatus === 'matched' ? '已配对' : 
               matchStatus === 'pending_sent' ? '已发送' :
               matchStatus === 'pending_received' ? '接受配对' :
               matchStatus === 'rejected' ? '已拒绝' : '配对'}
            </Button>
            
            <Button 
              className="flex-1" 
              variant="outline" 
              onClick={() => handleAction('message')}
              disabled={matchStatus !== 'matched'}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              发送消息
            </Button>
          </div>
          
          <div className="border-t border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">个人资料</h2>
              
              {loading ? (
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-3">
                  {profile?.personality_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">人格类型</span>
                      <span>{profile.personality_type}</span>
                    </div>
                  )}
                  
                  {profile?.relationship_status && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">情感状态</span>
                      <span>{profile.relationship_status}</span>
                    </div>
                  )}
                  
                  {profile?.height && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">身高</span>
                      <span>{profile.height} cm</span>
                    </div>
                  )}
                  
                  {profile?.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">体重</span>
                      <span>{profile.weight} kg</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
