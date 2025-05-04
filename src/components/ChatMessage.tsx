
import React from 'react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    receiver_id: string;
    created_at: string;
    image_url?: string | null;
    read?: boolean;
  };
  isCurrentUser: boolean;
  senderAvatar?: string;
  senderName?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser, 
  senderAvatar = "/placeholder.svg",
  senderName = "用户"
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isCurrentUser && (
        <img 
          src={senderAvatar}
          alt={senderName}
          className="h-8 w-8 rounded-full mr-2 self-end"
        />
      )}
      
      <div 
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isCurrentUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="break-words">{message.content}</p>
        {message.image_url && (
          <img 
            src={message.image_url} 
            alt="消息图片" 
            className="mt-2 rounded-lg max-w-full" 
          />
        )}
        <div 
          className={`text-xs mt-1 text-right ${
            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {formatTime(message.created_at)}
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="w-8"></div> // Spacer for alignment
      )}
    </div>
  );
};

export default ChatMessage;
