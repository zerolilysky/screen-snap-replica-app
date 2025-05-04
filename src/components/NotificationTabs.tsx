
import React from 'react';

interface NotificationTabsProps {
  activeTab: 'chat' | 'match';
  onTabChange: (tab: 'chat' | 'match') => void;
}

const NotificationTabs: React.FC<NotificationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200 px-4 pb-2">
      <button 
        className={`py-2 px-4 ${activeTab === 'chat' ? 'text-black border-b-2 border-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('chat')}
      >
        聊天
      </button>
      <button 
        className={`py-2 px-4 ${activeTab === 'match' ? 'text-black border-b-2 border-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('match')}
      >
        匹配
      </button>
    </div>
  );
};

export default NotificationTabs;
