
import React from 'react';
import { UserPlus, MessageSquare, AtSign, Heart } from 'lucide-react';

interface FilterProps {
  text: string;
  isActive?: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

const Filter: React.FC<FilterProps> = ({ text, icon, isActive = false, onClick }) => {
  return (
    <div 
      className={`flex flex-col items-center ${isActive ? 'text-black' : 'text-gray-400'} cursor-pointer`}
      onClick={onClick}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{text}</span>
    </div>
  );
};

interface NotificationFilterProps {
  onFilterClick: (type: string) => void;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ onFilterClick }) => {
  return (
    <div className="flex justify-around p-4">
      <Filter
        text="新朋友"
        icon={<UserPlus className="w-6 h-6" />}
        onClick={() => onFilterClick('friends')}
      />
      <Filter
        text="评论"
        icon={<MessageSquare className="w-6 h-6" />}
        onClick={() => onFilterClick('comments')}
      />
      <Filter
        text="@我的"
        icon={<AtSign className="w-6 h-6" />}
        onClick={() => onFilterClick('mentions')}
      />
      <Filter
        text="赞"
        icon={<Heart className="w-6 h-6" />}
        onClick={() => onFilterClick('likes')}
      />
    </div>
  );
};

export default NotificationFilter;
