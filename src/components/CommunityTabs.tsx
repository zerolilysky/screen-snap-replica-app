
import React from 'react';

interface CommunityTabsProps {
  activeTab: 'following' | 'recommended';
  onTabChange: (tab: 'following' | 'recommended') => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center items-center space-x-8 pt-2 pb-4">
      <button 
        className={`font-medium text-lg ${activeTab === 'following' ? 'text-gray-800' : 'text-gray-400'}`}
        onClick={() => onTabChange('following')}
      >
        关注
      </button>
      <button 
        className={`font-medium text-lg relative ${activeTab === 'recommended' ? 'text-gray-800' : 'text-gray-400'}`}
        onClick={() => onTabChange('recommended')}
      >
        推荐
        {activeTab === 'recommended' && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-orange-500 rounded-full"></div>
        )}
      </button>
    </div>
  );
};

export default CommunityTabs;
