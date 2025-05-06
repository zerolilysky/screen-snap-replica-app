
import React from 'react';
import { format } from 'date-fns';
import UserAvatar from './UserAvatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string | null;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  read?: boolean;
  media_url?: string | null;
  is_typing?: boolean;
}

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  senderAvatar?: string;
  senderName?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  senderAvatar,
  senderName
}) => {
  const formattedTime = format(new Date(message.created_at), 'HH:mm');
  
  // Skip rendering typing indicators for current user
  if (message.is_typing && isCurrentUser) {
    return null;
  }

  // Don't render pure typing indicators (they're handled in the Chat component)
  if (message.is_typing && !message.content && !message.media_url) {
    return null;
  }
  
  return (
    <div className={cn(
      "flex mb-3",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <div className="mr-2 flex-shrink-0">
          <UserAvatar src={senderAvatar} />
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%]", 
        isCurrentUser ? "items-end" : "items-start"
      )}>
        {!isCurrentUser && senderName && (
          <div className="text-xs text-gray-600 mb-1 ml-1">{senderName}</div>
        )}
        
        <div className="flex items-end gap-1">
          {isCurrentUser && (
            <div className="text-xs text-gray-500 self-end mb-1">
              {message.read ? '已读' : ''}
            </div>
          )}
          
          <div className={cn(
            "rounded-xl p-3 break-words",
            isCurrentUser 
              ? "bg-blue-500 text-white rounded-tr-none" 
              : "bg-white border border-gray-200 rounded-tl-none"
          )}>
            {message.media_url ? (
              <div className="flex flex-col space-y-2">
                <img 
                  src={message.media_url} 
                  alt="图片消息" 
                  className="max-w-full rounded-md cursor-pointer"
                  onClick={() => window.open(message.media_url!, '_blank')}
                />
                {message.content && <div>{message.content}</div>}
              </div>
            ) : (
              <div>{message.content}</div>
            )}
            <div className={cn(
              "text-xs mt-1",
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            )}>
              {formattedTime}
            </div>
          </div>
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="ml-2 flex-shrink-0">
          <UserAvatar src={senderAvatar} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
