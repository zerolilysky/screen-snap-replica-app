
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MatchRequestCard from './MatchRequestCard';
import EmptyState from './EmptyState';

interface MatchRequest {
  id: string;
  user_from: string;
  user_to: string;
  status: 'pending' | 'matched' | 'rejected';
  created_at: string;
  profiles: {
    id: string;
    nickname: string;
    avatar: string;
    location?: string;
    gender?: string;
    birth_date?: string;
  }
}

const MatchRequests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchMatchRequests();
    
    // Subscribe to match request changes
    const channel = supabase
      .channel('match_requests')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'match_requests',
        filter: `user_to=eq.${user.id}` 
      }, () => {
        fetchMatchRequests();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeTab]);
  
  const fetchMatchRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      let query;
      
      if (activeTab === 'received') {
        // Fetch received requests with sender profiles
        query = supabase
          .from('match_requests')
          .select(`
            id,
            user_from,
            user_to,
            status,
            created_at,
            profiles:user_from(id, nickname, avatar, location, gender, birth_date)
          `)
          .eq('user_to', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
      } else {
        // Fetch sent requests with receiver profiles
        query = supabase
          .from('match_requests')
          .select(`
            id,
            user_from,
            user_to,
            status,
            created_at,
            profiles:user_to(id, nickname, avatar, location, gender, birth_date)
          `)
          .eq('user_from', user.id)
          .in('status', ['pending', 'matched'])
          .order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process age from birth_date
      const processedRequests = data.map(request => {
        const profile = request.profiles;
        let age = null;
        
        if (profile.birth_date) {
          const birthDate = new Date(profile.birth_date);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          
          // Adjust age if birthday hasn't occurred yet this year
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }
        
        return {
          ...request,
          profiles: {
            ...profile,
            age
          }
        };
      });
      
      setRequests(processedRequests);
    } catch (error: any) {
      console.error('获取配对请求错误:', error);
      toast({
        title: "获取配对请求失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    if (!user) return;
    
    try {
      const status = action === 'accept' ? 'matched' : 'rejected';
      
      const { error } = await supabase
        .from('match_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId);
      
      if (error) throw error;
      
      if (action === 'accept') {
        // Get the match request details to find the other user
        const { data: matchData, error: matchError } = await supabase
          .from('match_requests')
          .select('user_from')
          .eq('id', requestId)
          .single();
        
        if (matchError) throw matchError;
        
        // Navigate to chat with the matched user
        navigate(`/chat/${matchData.user_from}`);
        
        toast({
          title: "配对成功",
          description: "你们已成功匹配，现在可以开始聊天了"
        });
      } else {
        // Just remove the request from the list
        setRequests(prev => prev.filter(r => r.id !== requestId));
        
        toast({
          title: "已拒绝配对请求",
          description: "你已拒绝了该配对请求"
        });
      }
    } catch (error: any) {
      console.error('处理配对请求错误:', error);
      toast({
        title: "操作失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex mb-4 border-b border-gray-200">
        <button 
          className={`pb-2 px-4 ${activeTab === 'received' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('received')}
        >
          收到的请求
        </button>
        <button 
          className={`pb-2 px-4 ${activeTab === 'sent' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('sent')}
        >
          发出的请求
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : requests.length > 0 ? (
        <div>
          {requests.map(request => (
            <MatchRequestCard
              key={request.id}
              id={request.id}
              user={request.profiles}
              created_at={request.created_at}
              onAction={handleAction}
              isPending={activeTab === 'received'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
          description={activeTab === 'received' ? '暂无收到的配对请求' : '暂无发出的配对请求'}
        />
      )}
    </div>
  );
};

export default MatchRequests;
