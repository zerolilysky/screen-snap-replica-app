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
      setMessages([]);
      setLoading(false);
    }
  }, [userId]);
  
  const fetchMessages = async () => {
    if (!userId) return;
    
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

  return { messages, loading, unreadMessageCount, fetchMessages };
}
