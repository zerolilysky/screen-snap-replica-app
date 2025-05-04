
import React from 'react';
import { Couple } from '../types';

interface CouplesProps {
  couples: Couple[];
  title?: string;
}

const Couples: React.FC<CouplesProps> = ({ couples, title = "在Nico撮CP" }) => {
  return (
    <div className="py-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="font-medium">{title}</h2>
        <button className="text-gray-500 text-sm">更多 &gt;</button>
      </div>
      
      <div className="flex space-x-4 px-4 overflow-x-auto">
        {couples.map((couple) => (
          <div key={couple.id} className="flex-shrink-0 items-center">
            <div className="flex items-center">
              <div className="relative rounded-full overflow-hidden w-16 h-16 border-4 border-white">
                <img 
                  src={(couple.user1?.avatar || couple.imageLeft || "/placeholder.svg")} 
                  alt={(couple.user1?.nickname || couple.leftUser || "用户1")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute transform translate-x-12 bg-pink-500 rounded-full p-1">
                <Heart />
              </div>
              <div className="relative rounded-full overflow-hidden w-16 h-16 border-4 border-white -ml-4">
                <img 
                  src={(couple.user2?.avatar || couple.imageRight || "/placeholder.svg")} 
                  alt={(couple.user2?.nickname || couple.rightUser || "用户2")}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex justify-center mt-2 text-sm">
              <span className="mx-1 truncate">{couple.user1?.nickname || couple.leftUser || "用户1"}</span>
              <span className="mx-1 truncate">{couple.user2?.nickname || couple.rightUser || "用户2"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Heart: React.FC = () => {
  return (
    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  );
};

export default Couples;
