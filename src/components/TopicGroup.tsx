
import React from 'react';

interface TopicGroupProps {
  title: string;
  icon?: string;
  participants: number;
}

const TopicGroup: React.FC<TopicGroupProps> = ({ title, icon, participants }) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 mb-2">
      <div className="flex items-center">
        {icon && <span className="text-xl mr-2">{icon}</span>}
        <span className="font-medium"># {title}</span>
      </div>
      <div className="text-sm text-gray-500">{participants}参与</div>
    </div>
  );
};

export default TopicGroup;
