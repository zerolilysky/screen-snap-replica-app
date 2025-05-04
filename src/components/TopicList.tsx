
import React from 'react';
import { Topic } from '../types';
import UserAvatar from './UserAvatar';

interface TopicListProps {
  topics: Topic[];
}

const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  return (
    <div className="flex overflow-x-auto space-x-4 px-4 pb-4 no-scrollbar">
      {topics.map((topic) => (
        <div key={topic.id} className="flex-shrink-0">
          <div className="flex flex-col items-center w-20">
            <div className="relative">
              <div className="relative bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center">
                {topic.icon ? (
                  <span className="text-2xl">{topic.icon}</span>
                ) : (
                  <UserAvatar src="/placeholder.svg" size="md" />
                )}
                <div className="absolute top-0 right-0 h-4 w-4 bg-green-400 rounded-full border border-white"></div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium truncate w-20">{topic.title}</p>
              {topic.timeRange ? (
                <p className="text-xs text-pink-500">{topic.timeRange}</p>
              ) : (
                <p className="text-xs text-pink-500">♀ {topic.participants}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicList;
