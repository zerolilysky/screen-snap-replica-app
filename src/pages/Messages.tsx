import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Bell, Search } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import NotificationFilter from '../components/NotificationFilter';
import { Avatar } from '@/components/ui/avatar';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'matching'>('chat');
  
  useEffect(() => {
    if (user) {
      fetchMessages();
      
      // Subscribe to new messages
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, 
          (payload) => {
            console.log('New message received:', payload);
            fetchMessages();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [user]);
  
  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use explicit column reference format for reliable TypeScript types
      const { data: receivedData, error: receivedError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          content,
          created_at,
          read,
          profiles:profiles!messages_sender_id_fkey(id, nickname, avatar)
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });
      
      if (receivedError) throw receivedError;
      
      // Messages I've sent (where I'm the sender)
      const { data: sentData, error: sentError } = await supabase
        .from('messages')
        .select(`
          id,
          receiver_id,
          content,
          created_at,
          read,
          profiles:profiles!messages_receiver_id_fkey(id, nickname, avatar)
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
      
      if (sentError) throw sentError;
      
      // Process received messages with updated field access
      const receivedMessages = receivedData.map(msg => ({
        id: msg.id,
        user_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
        read: msg.read,
        nickname: msg.profiles?.nickname || '未知用户',
        avatar: msg.profiles?.avatar || '/placeholder.svg',
        isOutgoing: false
      }));
      
      // Process sent messages with updated field access
      const sentMessages = sentData.map(msg => ({
        id: msg.id,
        user_id: msg.receiver_id,
        content: msg.content,
        created_at: msg.created_at,
        read: msg.read,
        nickname: msg.profiles?.nickname || '未知用户',
        avatar: msg.profiles?.avatar || '/placeholder.svg',
        isOutgoing: true
      }));
      
      // Combine and sort all messages by user_id to group conversations
      const allMessages = [...receivedMessages, ...sentMessages];
      
      // Group messages by user
      const userConversations: {[key: string]: any} = {};
      
      allMessages.forEach(msg => {
        if (!userConversations[msg.user_id]) {
          userConversations[msg.user_id] = {
            user_id: msg.user_id,
            nickname: msg.nickname,
            avatar: msg.avatar,
            messages: []
          };
        }
        userConversations[msg.user_id].messages.push(msg);
      });
      
      // Sort messages within each conversation by date (newest first)
      Object.values(userConversations).forEach((conv: any) => {
        conv.messages.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      
      // Convert to array and keep only the most recent message for each user
      const latestMessages = Object.values(userConversations).map((conv: any) => ({
        user_id: conv.user_id,
        nickname: conv.nickname,
        avatar: conv.avatar,
        lastMessage: conv.messages[0].content,
        timestamp: conv.messages[0].created_at,
        unread: conv.messages.some((m: any) => !m.read && !m.isOutgoing)
      }));
      
      // Sort by timestamp (newest first)
      latestMessages.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setMessages(latestMessages);
      
      // Update message count badge
      const unreadCount = latestMessages.filter(m => m.unread).length;
      setUnreadMessageCount(unreadCount);
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
  
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      // If the message is from today, show only time
      const isSameDay = date.getDate() === now.getDate() && 
                        date.getMonth() === now.getMonth() && 
                        date.getFullYear() === now.getFullYear();
      
      if (isSameDay) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      }
      
      // If the message is from this year, show month and day
      const isSameYear = date.getFullYear() === now.getFullYear();
      if (isSameYear) {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
      
      // Otherwise show the full date
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (e) {
      return '未知时间';
    }
  };
  
  const handleChatClick = (userId: string) => {
    navigate(`/chat/${userId}`);
  };
  
  const handleFilterClick = (type: string) => {
    navigate(`/messages/${type}`);
  };
  
  const handleSearchClick = () => {
    navigate('/messages/search');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <StatusBar />
      
      <div className="p-4 bg-white flex justify-between items-center">
        <h1 className="text-lg font-medium text-center flex-1">消息</h1>
        <button onClick={handleSearchClick} className="p-1">
          <Search className="h-5 w-5" />
        </button>
        <div className="relative p-1">
          <Bell className="h-5 w-5" />
          {unreadMessageCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
            </span>
          )}
        </div>
      </div>
      
      {/* Notification filter circles */}
      <div className="bg-white mb-2">
        <NotificationFilter onFilterClick={handleFilterClick} />
      </div>
      
      {/* Chat/Matching tabs */}
      <div className="flex border-b border-gray-200 bg-white mb-2">
        <button 
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'chat' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setActiveTab('chat')}
        >
          聊天
        </button>
        <button 
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'matching' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setActiveTab('matching')}
        >
          匹配
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {messages.length > 0 ? (
            <div className="flex-1 bg-white">
              {messages.map((message) => (
                <div 
                  key={message.user_id} 
                  className="flex p-4 border-b border-gray-100 cursor-pointer"
                  onClick={() => handleChatClick(message.user_id)}
                >
                  <Avatar className="h-12 w-12">
                    <img 
                      src={message.avatar} 
                      alt={message.nickname}
                      className="w-full h-full object-cover rounded-full"
                    />
                    {message.unread && (
                      <span className="absolute top-0 right-0 bg-red-500 h-3 w-3 rounded-full border-2 border-white"></span>
                    )}
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{message.nickname}</h3>
                      <span className="text-xs text-gray-400">{formatDate(message.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{message.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-500">暂无消息</p>
              <p className="text-sm text-gray-400 mt-1">去匹配页面认识新朋友吧</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
                onClick={() => navigate('/match')}
              >
                去匹配
              </button>
            </div>
          )}
        </>
      )}
      
      <TabBar />
    </div>
  );
};

export default Messages;
