
import React from 'react';

interface FilterProps {
  text: string;
  isActive?: boolean;
  icon: React.ReactNode;
}

const Filter: React.FC<FilterProps> = ({ text, icon, isActive = false }) => {
  return (
    <div className={`flex flex-col items-center ${isActive ? 'text-black' : 'text-gray-400'}`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{text}</span>
    </div>
  );
};

const NotificationFilter: React.FC = () => {
  return (
    <div className="flex justify-around p-4">
      <Filter
        text="新朋友"
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
          </svg>
        }
        isActive={true}
      />
      <Filter
        text="评论"
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
          </svg>
        }
      />
      <Filter
        text="@我的"
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" fill="currentColor"/>
          </svg>
        }
      />
      <Filter
        text="赞"
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
          </svg>
        }
      />
    </div>
  );
};

export default NotificationFilter;
