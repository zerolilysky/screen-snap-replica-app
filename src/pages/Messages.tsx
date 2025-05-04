
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Search } from 'lucide-react';
import NotificationFilter from '../components/NotificationFilter';
import NotificationTabs from '../components/NotificationTabs';
import MessageList from '../components/MessageList';
import MessagesEmptyState from '../components/MessagesEmptyState';
import { useMessages } from '../hooks/useMessages';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'match'>('chat');
  
  // Using our new custom hook
  const { messages, loading, unreadMessageCount } = useMessages(user?.id);
  
  const handleChatClick = (userId: string) => {
    navigate(`/chat/${userId}`);
  };
  
  const handleFilterClick = (type: string) => {
    navigate(`/messages/${type}`);
  };
  
  const handleSearchClick = () => {
    navigate('/messages/search');
  };
  
  const handleTabChange = (tab: 'chat' | 'match') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <StatusBar />
      
      <div className="p-4 bg-white flex justify-between items-center">
        <h1 className="text-lg font-medium text-center flex-1">消息</h1>
        <button onClick={handleSearchClick} className="p-1">
          <Search className="h-5 w-5" />
        </button>
        <div className="relative p-1">
          <Bell className="h-5 w-5" />
          {unreadMessageCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
            </span>
          )}
        </div>
      </div>
      
      {/* Notification filter circles */}
      <div className="bg-white mb-2">
        <NotificationFilter onFilterClick={handleFilterClick} />
      </div>
      
      {/* Chat/Matching tabs */}
      <NotificationTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {messages.length > 0 ? (
        <MessageList 
          messages={messages} 
          loading={loading} 
          onChatClick={handleChatClick} 
        />
      ) : (
        !loading && <MessagesEmptyState />
      )}
      
      <TabBar />
    </div>
  );
};

export default Messages;
