
import React from 'react';
import { formatDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageItem {
  user_id: string;
  nickname: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface MessageListProps {
  messages: MessageItem[];
  loading: boolean;
  onChatClick: (userId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading, onChatClick }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="flex-1 bg-white">
      {messages.map((message) => (
        <div 
          key={message.user_id} 
          className="flex p-4 border-b border-gray-100 cursor-pointer"
          onClick={() => onChatClick(message.user_id)}
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
              <span className="text-xs text-gray-400">
                {formatDate(message.timestamp)}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{message.lastMessage}</p>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

export default MessageList;
