
import React from 'react';
import { cn } from '@/lib/utils';

interface UserMessageProps {
  avatar: string;
  name: string;
  message: string;
  time: string;
  onClick?: () => void;
  isOnline?: boolean;
  unreadCount?: number;
  className?: string;
}

const UserMessage: React.FC<UserMessageProps> = ({
  avatar,
  name,
  message,
  time,
  onClick,
  isOnline = false,
  unreadCount = 0,
  className
}) => {
  return (
    <div 
      className={cn(
        "flex items-center p-4 cursor-pointer hover:bg-gray-50",
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={avatar || "/placeholder.svg"} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-1">{message}</p>
      </div>
      
      {unreadCount > 0 && (
        <div className="bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default UserMessage;
