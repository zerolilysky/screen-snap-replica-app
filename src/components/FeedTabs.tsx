
import React from 'react';

interface FeedTabsProps {
  activeTab: 'activity' | 'nearby' | 'recommend';
  onTabChange: (tab: 'activity' | 'nearby' | 'recommend') => void;
}

const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-6 px-4 mb-0 overflow-x-auto">
      <button 
        className={`py-2.5 px-1.5 relative ${activeTab === 'activity' ? 'text-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('activity')}
      >
        动态
        {activeTab === 'activity' && (
          <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-black rounded-full" />
        )}
      </button>
      <button 
        className={`py-2.5 px-1.5 relative ${activeTab === 'nearby' ? 'text-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('nearby')}
      >
        附近
        {activeTab === 'nearby' && (
          <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-black rounded-full" />
        )}
      </button>
      <button 
        className={`py-2.5 px-1.5 relative ${activeTab === 'recommend' ? 'text-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('recommend')}
      >
        推荐
        {activeTab === 'recommend' && (
          <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-black rounded-full" />
        )}
      </button>
    </div>
  );
};

export default FeedTabs;
