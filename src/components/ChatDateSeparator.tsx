
import React from 'react';

interface ChatDateSeparatorProps {
  date: string;
}

const ChatDateSeparator: React.FC<ChatDateSeparatorProps> = ({ date }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };
  
  return (
    <div className="text-center text-xs text-gray-500 my-3">
      <div className="inline-block px-3 py-1 bg-gray-100 rounded-full">
        {formatDate(date)}
      </div>
    </div>
  );
};

export default ChatDateSeparator;
