
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import NotificationTabs from '../components/NotificationTabs';
import NotificationFilter from '../components/NotificationFilter';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import UserMessage from '../components/UserMessage';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'match'>('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get distinct users who have sent messages to the current user
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          profiles:sender_id(nickname, avatar)
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Group messages by sender
      const uniqueSenders = data.reduce((acc: any[], message: any) => {
        const existingSender = acc.find(m => m.sender_id === message.sender_id);
        if (!existingSender) {
          acc.push({
            id: message.id,
            sender_id: message.sender_id,
            content: message.content,
            created_at: message.created_at,
            profile: message.profiles
          });
        }
        return acc;
      }, []);
      
      setMessages(uniqueSenders);
    } catch (error: any) {
      console.error('Error fetching messages:', error.message);
      toast({
        title: "获取消息失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (type: string) => {
    navigate(`/messages/${type}`);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      <StatusBar />
      
      <div className="flex justify-center items-center py-2">
        <h1 className="text-xl font-medium">消息</h1>
        <button className="absolute right-4">
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
      
      <NotificationFilter onFilterClick={handleFilterClick} />
      
      <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1">
        {activeTab === 'chat' && (
          <>
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : messages.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {messages.map(message => (
                  <UserMessage
                    key={message.id}
                    avatar={message.profile.avatar}
                    name={message.profile.nickname}
                    message={message.content}
                    time={new Date(message.created_at).toLocaleDateString()}
                    onClick={() => handleUserClick(message.sender_id)}
                  />
                ))}
                <UserMessage 
                  avatar="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
                  name="Mimi"
                  message="很高兴认识你！"
                  time="12:30"
                  onClick={() => handleUserClick('mimi123')}
                  isOnline={true}
                />
                <UserMessage 
                  avatar="/lovable-uploads/710f54bf-505f-4047-86f9-23670f5034fb.png"
                  name="冰冰"
                  message="你好，想一起去看电影吗？"
                  time="昨天"
                  onClick={() => handleUserClick('bingbing456')}
                />
                <UserMessage 
                  avatar="/placeholder.svg"
                  name="小李"
                  message="有空聊聊吗？"
                  time="周一"
                  onClick={() => handleUserClick('xiaoli789')}
                  unreadCount={2}
                />
              </div>
            ) : (
              <EmptyState 
                image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
                description="还没有一起聊天的朋友，快去匹配交朋友吧"
              />
            )}
          </>
        )}
        
        {activeTab === 'match' && (
          <EmptyState 
            image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
            description="暂无匹配消息"
          />
        )}
      </div>
      
      <TabBar />
    </div>
  );
};

export default Messages;
