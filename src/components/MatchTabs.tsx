
import React from 'react';

interface MatchTabsProps {
  activeTab: 'match' | 'friends';
  onTabChange: (tab: 'match' | 'friends') => void;
}

const MatchTabs: React.FC<MatchTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center pt-2 pb-3">
      <div className="flex items-center space-x-6 font-semibold text-lg">
        <div 
          className={`relative cursor-pointer ${activeTab === 'match' ? 'text-black' : 'text-gray-500'}`}
          onClick={() => onTabChange('match')}
        >
          匹配
          {activeTab === 'match' && (
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-500 rounded-full" />
          )}
        </div>
        <div 
          className={`relative cursor-pointer ${activeTab === 'friends' ? 'text-black' : 'text-gray-500'}`}
          onClick={() => onTabChange('friends')}
        >
          交友
          {activeTab === 'friends' && (
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-500 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchTabs;
