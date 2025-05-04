
import React from 'react';

interface StatusBarProps {
  time?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ time = "20:20" }) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 text-white">
      <div className="font-bold text-xl">{time}</div>
      <div className="flex items-center space-x-2">
        <div className="grid grid-cols-4 gap-px">
          {Array(4).fill(0).map((_, i) => (
            <div 
              key={i} 
              className={`h-2.5 w-1 rounded-sm ${i < 2 ? 'bg-gray-400' : 'bg-white'}`} 
            />
          ))}
        </div>
        <div className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.143 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
        <div className="bg-yellow-500 text-black px-2 rounded-md font-semibold">
          14%
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
