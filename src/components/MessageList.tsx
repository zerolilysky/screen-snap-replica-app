
import React from 'react';
import { formatDistance } from 'date-fns';
import UserAvatar from './UserAvatar';
import { MessageItem } from '../hooks/useMessages';

interface MessageListProps {
  messages: MessageItem[];
  loading: boolean;
  onChatClick: (userId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading, onChatClick }) => {
  const formatMessageTime = (timestamp: string) => {
    return formatDistance(
      new Date(timestamp),
      new Date(),
      { addSuffix: false }
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 divide-y divide-gray-100">
      {messages.map((message) => (
        <div 
          key={message.user_id} 
          className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => onChatClick(message.user_id)}
        >
          <div className="relative">
            <UserAvatar src={message.avatar} />
            {message.unread && (
              <div className="absolute -top-1 -right-1 bg-red-500 h-3 w-3 rounded-full" />
            )}
          </div>
          <div className="flex-1 ml-3">
            <div className="flex justify-between">
              <h3 className="font-medium">{message.nickname}</h3>
              <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp)}</span>
            </div>
            <div className={`flex items-center ${message.unread ? 'font-medium' : 'text-gray-500'}`}>
              {message.media_url && (
                <span className="text-blue-500 mr-1">📷</span>
              )}
              <p className="text-sm truncate">
                {message.lastMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
