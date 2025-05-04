
import React from 'react';

interface FeedTabsProps {
  activeTab: 'activity' | 'nearby' | 'recommend';
  onTabChange: (tab: 'activity' | 'nearby' | 'recommend') => void;
}

const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200 px-4 mb-4">
      <button 
        className={`pb-2 px-1 ${activeTab === 'activity' ? 'text-black border-b-2 border-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('activity')}
      >
        动态
      </button>
      <button 
        className={`pb-2 px-1 ${activeTab === 'nearby' ? 'text-black border-b-2 border-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('nearby')}
      >
        附近
      </button>
      <button 
        className={`pb-2 px-1 ${activeTab === 'recommend' ? 'text-black border-b-2 border-black font-medium' : 'text-gray-500'}`}
        onClick={() => onTabChange('recommend')}
      >
        推荐
      </button>
    </div>
  );
};

export default FeedTabs;
