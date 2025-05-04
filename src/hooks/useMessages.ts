
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MessageItem {
  user_id: string;
  nickname: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const mockMessages = [
  {
    user_id: 'mock-user-1',
    nickname: '小王',
    avatar: '/placeholder.svg',
    lastMessage: '今天天气真不错，一起去公园走走吗？',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    unread: true
  },
  {
    user_id: 'mock-user-2',
    nickname: '李华',
    avatar: '/placeholder.svg',
    lastMessage: '我刚刚看了一部超好看的电影，强烈推荐！',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    unread: false
  },
  {
    user_id: 'mock-user-3',
    nickname: '张三',
    avatar: '/placeholder.svg',
    lastMessage: '明天下午有空吗？我们约个咖啡聊聊吧',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    unread: true
  },
  {
    user_id: 'mock-user-4',
    nickname: '小美',
    avatar: '/placeholder.svg',
    lastMessage: '谢谢你昨天帮我解决了那个问题，我很感激！',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    unread: false
  },
  {
    user_id: 'mock-user-5',
    nickname: '老王',
    avatar: '/placeholder.svg',
    lastMessage: '周末一起去爬山吗？听说风景很美',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    unread: false
  }
];

export function useMessages(userId: string | undefined) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchMessages();
      
      // Subscribe to new messages
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` }, 
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
      // Include mock messages for testing when not logged in
      setMessages(mockMessages);
      setUnreadMessageCount(mockMessages.filter(m => m.unread).length);
      setLoading(false);
    }
  }, [userId]);
  
  const fetchMessages = async () => {
    if (!userId) {
      setMessages(mockMessages);
      setUnreadMessageCount(mockMessages.filter(m => m.unread).length);
      setLoading(false);
      return;
    }
    
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
          profiles!messages_sender_id_fkey(id, nickname, avatar)
        `)
        .eq('receiver_id', userId)
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
          profiles!messages_receiver_id_fkey(id, nickname, avatar)
        `)
        .eq('sender_id', userId)
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
      
      // Combine all messages
      let allMessages = [...receivedMessages, ...sentMessages];
      
      // If database has no messages yet, add mock messages for testing
      if (allMessages.length === 0) {
        allMessages = mockMessages.map(msg => ({
          id: `mock-${msg.user_id}`,
          user_id: msg.user_id,
          content: msg.lastMessage,
          created_at: msg.timestamp,
          read: !msg.unread,
          nickname: msg.nickname,
          avatar: msg.avatar,
          isOutgoing: false
        }));
        
        // Save mock messages to Supabase for first-time setup
        for (const msg of mockMessages) {
          await supabase.from('messages').insert({
            sender_id: msg.user_id,
            receiver_id: userId,
            content: msg.lastMessage,
            read: !msg.unread,
            created_at: msg.timestamp
          });
        }
      }
      
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
      
      // Fallback to mock messages in case of error
      setMessages(mockMessages);
      setUnreadMessageCount(mockMessages.filter(m => m.unread).length);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, unreadMessageCount, fetchMessages };
}
