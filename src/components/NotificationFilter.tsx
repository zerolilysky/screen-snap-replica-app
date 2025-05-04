
import React from 'react';
import { UserPlus, MessageSquare, AtSign, Heart } from 'lucide-react';

interface FilterItemProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

const FilterItem: React.FC<FilterItemProps> = ({ icon, label, color, onClick }) => {
  return (
    <div className="flex flex-col items-center space-y-1" onClick={onClick}>
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
};

interface NotificationFilterProps {
  onFilterClick: (type: string) => void;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ onFilterClick }) => {
  return (
    <div className="flex justify-between px-4 py-5">
      <FilterItem
        icon={<UserPlus size={24} className="text-indigo-500" />}
        label="新朋友"
        color="bg-indigo-100"
        onClick={() => onFilterClick('friends')}
      />
      <FilterItem
        icon={<MessageSquare size={24} className="text-amber-500" />}
        label="评论"
        color="bg-amber-100"
        onClick={() => onFilterClick('comments')}
      />
      <FilterItem
        icon={<AtSign size={24} className="text-cyan-500" />}
        label="@我的"
        color="bg-cyan-100"
        onClick={() => onFilterClick('mentions')}
      />
      <FilterItem
        icon={<Heart size={24} className="text-red-500" />}
        label="赞"
        color="bg-red-100"
        onClick={() => onFilterClick('likes')}
      />
    </div>
  );
};

export default NotificationFilter;
