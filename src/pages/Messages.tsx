
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
      
      // Subscribe to new messages
      const channel = supabase
        .channel('messages-updates')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, 
          () => {
            fetchMessages();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use explicit column names to fix the "Could not embed" error
      const { data: senders, error: sendersError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          content,
          created_at,
          read,
          sender:sender_id (
            id:id,
            nickname:nickname,
            avatar:avatar
          )
        `)
        .eq('receiver_id', user.id)
        .order('sender_id', { ascending: true })
        .order('created_at', { ascending: false });

      if (sendersError) throw sendersError;
      
      // Get messages sent by the current user (as latest message in each conversation)
      const { data: receivers, error: receiversError } = await supabase
        .from('messages')
        .select(`
          id,
          receiver_id,
          content,
          created_at,
          read,
          receiver:receiver_id (
            id:id,
            nickname:nickname,
            avatar:avatar
          )
        `)
        .eq('sender_id', user.id)
        .order('receiver_id', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (receiversError) throw receiversError;
      
      // Combine and format all messages
      const formattedSenders = senders ? senders.map(message => ({
        id: message.id,
        partner_id: message.sender_id,
        content: message.content,
        created_at: message.created_at,
        name: message.sender?.nickname || 'Unknown',
        avatar: message.sender?.avatar || '/placeholder.svg',
        read: message.read || false,
        is_sender: false
      })) : [];
      
      const formattedReceivers = receivers ? receivers.map(message => ({
        id: message.id,
        partner_id: message.receiver_id,
        content: message.content,
        created_at: message.created_at,
        name: message.receiver?.nickname || 'Unknown',
        avatar: message.receiver?.avatar || '/placeholder.svg',
        read: true, // Messages sent by the user are always read
        is_sender: true
      })) : [];
      
      // Merge conversations and sort by latest message
      const allConversations = [...formattedSenders, ...formattedReceivers];
      const uniqueConversations = allConversations.reduce((acc, current) => {
        const isDuplicate = acc.find(item => item.partner_id === current.partner_id);
        if (!isDuplicate) {
          return [...acc, current];
        } else {
          // If duplicate exists, keep the one with the newest message
          const duplicateIndex = acc.findIndex(item => item.partner_id === current.partner_id);
          const existing = acc[duplicateIndex];
          const newerMessage = new Date(current.created_at) > new Date(existing.created_at) ? current : existing;
          acc[duplicateIndex] = newerMessage;
          return acc;
        }
      }, []);
      
      // Sort all conversations by most recent message
      const sortedConversations = uniqueConversations.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setMessages(sortedConversations);
    } catch (error: any) {
      console.error('获取消息错误:', error.message);
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[date.getDay()];
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    }
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
                    avatar={message.avatar || "/placeholder.svg"}
                    name={message.name}
                    message={message.is_sender ? `你: ${message.content}` : message.content}
                    time={formatTime(message.created_at)}
                    onClick={() => handleUserClick(message.partner_id)}
                    isOnline={Math.random() > 0.5} // Random online status for demo
                    unreadCount={!message.read && !message.is_sender ? 1 : 0}
                  />
                ))}
                <UserMessage 
                  avatar="/placeholder.svg"
                  name="Mimi"
                  message="很高兴认识你！"
                  time="12:30"
                  onClick={() => handleUserClick('mimi123')}
                  isOnline={true}
                />
                <UserMessage 
                  avatar="/placeholder.svg"
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
                description="还没有一起聊天的朋友，快去匹配交朋友吧"
              />
            )}
          </>
        )}
        
        {activeTab === 'match' && (
          <EmptyState 
            description="暂无匹配消息"
          />
        )}
      </div>
      
      <TabBar />
    </div>
  );
};

export default Messages;
