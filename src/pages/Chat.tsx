
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Send, Image, Smile } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/ChatMessage';
import ChatDateSeparator from '@/components/ChatDateSeparator';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  media_url?: string | null;
  is_typing?: boolean;
}

interface Profile {
  id: string;
  nickname: string;
  avatar: string;
}

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [inputActive, setInputActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!id) {
      navigate(-1);
      return;
    }
    
    fetchProfile();
    fetchMessages();
    
    // Subscribe to new messages
    const messageChannel = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new.sender_id === id) {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
          markMessageAsRead(newMsg.id);
        }
      })
      .subscribe();
      
    // Subscribe to typing status updates
    const typingChannel = supabase
      .channel('typing_status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${id} AND receiver_id=eq.${user.id} AND is_typing=eq.true`
      }, () => {
        setIsTyping(true);
        // Auto-reset typing status after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(typingChannel);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user, id]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchProfile = async () => {
    try {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nickname, avatar')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('获取用户资料错误:', error);
      toast({
        title: "获取用户资料失败",
        description: "无法加载聊天对象的信息",
        variant: "destructive"
      });
    }
  };
  
  const fetchMessages = async () => {
    if (!user || !id) return;
    
    try {
      // Fetch messages between current user and the other user
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data);
      
      // Mark messages from the other user as read
      const unreadMessages = data
        .filter(msg => msg.receiver_id === user.id && !msg.read)
        .map(msg => msg.id);
        
      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages);
      }
    } catch (error) {
      console.error('获取消息错误:', error);
      toast({
        title: "获取消息失败", 
        description: "无法加载聊天记录",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);
        
      if (error) throw error;
    } catch (error) {
      console.error('标记消息已读错误:', error);
    }
  };
  
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
        
      if (error) throw error;
    } catch (error) {
      console.error('标记消息已读错误:', error);
    }
  };
  
  const updateTypingStatus = async () => {
    if (!user || !id) return;
    
    try {
      // Try to update an existing typing indicator
      const { data: existingTyping, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('sender_id', user.id)
        .eq('receiver_id', id)
        .eq('is_typing', true)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      if (existingTyping) {
        // Update existing typing indicator
        const { error } = await supabase
          .from('messages')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', existingTyping.id);
          
        if (error) throw error;
      } else {
        // Create a new typing indicator message
        const { error } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: id,
            content: null,
            is_typing: true
          });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('更新输入状态错误:', error);
    }
  };
  
  const sendMessage = async () => {
    if ((!newMessage.trim() && !isUploading) || !user || !id) return;
    
    try {
      const message = {
        sender_id: user.id,
        receiver_id: id,
        content: newMessage.trim(),
        is_typing: false
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();
        
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      console.error('发送消息错误:', error);
      toast({
        title: "发送失败",
        description: "消息发送失败，请稍后再试",
        variant: "destructive"
      });
    }
  };
  
  const sendImageMessage = async (file: File) => {
    if (!user || !id) return;
    
    setIsUploading(true);
    
    try {
      // Generate a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `chat/${user.id}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase
        .storage
        .from('media')
        .getPublicUrl(filePath);
        
      // Send message with image URL
      const message = {
        sender_id: user.id,
        receiver_id: id,
        content: '📷 图片消息',
        media_url: data.publicUrl,
        is_typing: false
      };
      
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();
        
      if (messageError) throw messageError;
      
      setMessages(prev => [...prev, messageData]);
    } catch (error) {
      console.error('发送图片消息错误:', error);
      toast({
        title: "发送图片失败",
        description: "图片发送失败，请稍后再试",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "不支持的文件类型",
          description: "请上传图片文件",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "文件过大",
          description: "请上传小于5MB的图片",
          variant: "destructive"
        });
        return;
      }
      
      sendImageMessage(file);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const shouldShowDateSeparator = (index: number) => {
    if (index === 0) return true;
    
    const currentDate = new Date(messages[index].created_at).toDateString();
    const prevDate = new Date(messages[index - 1].created_at).toDateString();
    return currentDate !== prevDate;
  };
  
  if (!user) {
    return null; // Redirecting to auth
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StatusBar />
      
      <div className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <img 
            src={profile?.avatar || "/placeholder.svg"} 
            alt={profile?.nickname || "用户"} 
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <span className="font-medium">{profile?.nickname || "用户"}</span>
            {isTyping && (
              <div className="text-xs text-gray-500">正在输入...</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-6 p-4">
                开始和{profile?.nickname || "对方"}的对话吧
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <React.Fragment key={message.id}>
                    {shouldShowDateSeparator(index) && (
                      <ChatDateSeparator date={message.created_at} />
                    )}
                    
                    <ChatMessage
                      message={message}
                      isCurrentUser={message.sender_id === user.id}
                      senderAvatar={profile?.avatar}
                      senderName={profile?.nickname}
                    />
                  </React.Fragment>
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className={`bg-white p-4 border-t border-gray-100 ${inputActive ? 'pb-6' : ''} sticky bottom-0`}>
        <div className="flex items-center">
          <button 
            className="p-2 mr-2 text-gray-500" 
            onClick={handleImageUpload}
            disabled={isUploading}
          >
            <Image size={20} />
          </button>
          <input
            type="text"
            className="flex-1 bg-gray-100 border-0 rounded-full py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            placeholder="输入消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onFocus={() => setInputActive(true)}
            onBlur={() => setInputActive(false)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            onInput={updateTypingStatus}
            disabled={isUploading}
          />
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button className="p-2 ml-2 text-gray-500">
            <Smile size={20} />
          </button>
          <Button 
            onClick={sendMessage}
            className="ml-2 rounded-full h-10 w-10 p-0 flex items-center justify-center"
            disabled={(!newMessage.trim() && !isUploading) || isUploading}
          >
            <Send size={18} />
          </Button>
        </div>
        {isUploading && (
          <div className="mt-2 text-sm text-center text-gray-500">
            正在上传图片...
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
