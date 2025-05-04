
import React from 'react';
import { formatDate } from '@/lib/utils';
import UserMessage from '@/components/UserMessage';
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
        <UserMessage
          key={message.user_id}
          avatar={message.avatar}
          name={message.nickname}
          message={message.lastMessage}
          time={formatDate(message.timestamp)}
          onClick={() => onChatClick(message.user_id)}
          isOnline={false} // We don't have online status in the messages data
          unreadCount={message.unread ? 1 : 0}
          className="border-b border-gray-100"
        />
      ))}
    </ScrollArea>
  );
};

export default MessageList;
