
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
    const channel = supabase
      .channel('chat')
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
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchProfile = async () => {
    try {
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
  
  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !id) return;
    
    try {
      const message = {
        sender_id: user.id,
        receiver_id: id,
        content: newMessage.trim(),
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
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (!user) {
    return null; // Redirecting to auth
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StatusBar />
      
      <div className="bg-white p-4 flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <img 
            src={profile?.avatar || "/placeholder.svg"} 
            alt={profile?.nickname || "用户"} 
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="ml-3 font-medium">{profile?.nickname || "用户"}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-6">
                开始和{profile?.nickname || "对方"}的对话吧
              </div>
            ) : (
              messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender_id !== user.id && (
                    <img 
                      src={profile?.avatar || "/placeholder.svg"}
                      alt={profile?.nickname || "用户"}
                      className="h-8 w-8 rounded-full mr-2 self-end"
                    />
                  )}
                  
                  <div 
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.sender_id === user.id 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div 
                      className={`text-xs mt-1 ${
                        message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  {message.sender_id === user.id && (
                    <div className="w-8"></div> // Spacer for alignment
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="bg-white p-4 border-t border-gray-100">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 bg-gray-100 border-0 rounded-full py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            placeholder="输入消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage}
            className="ml-2 rounded-full h-10 w-10 p-0 flex items-center justify-center"
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
