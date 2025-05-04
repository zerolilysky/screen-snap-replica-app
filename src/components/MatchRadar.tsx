
import React from 'react';
import { User } from '../types';
import UserAvatar from './UserAvatar';

interface MatchRadarProps {
  users: User[];
  center: User;
  onUserClick?: (userId: string) => void;
}

const MatchRadar: React.FC<MatchRadarProps> = ({ users, center, onUserClick }) => {
  // Generate positions for users around the radar
  const positionUsers = () => {
    return users.map((user, index) => {
      const angle = (index / users.length) * 2 * Math.PI;
      const radius = 120; // Distance from center
      const x = radius * Math.cos(angle) + 150; // 150 is center X
      const y = radius * Math.sin(angle) + 150; // 150 is center Y
      
      return {
        ...user,
        x,
        y
      };
    });
  };

  const positionedUsers = positionUsers();

  return (
    <div className="w-full aspect-square max-w-md mx-auto relative my-4">
      {/* Radar circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full border border-gray-700 opacity-20"></div>
        <div className="absolute w-3/4 h-3/4 rounded-full border border-gray-700 opacity-20"></div>
        <div className="absolute w-1/2 h-1/2 rounded-full border border-gray-700 opacity-20"></div>
      </div>
      
      {/* Center user */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <UserAvatar src={center.avatar} size="lg" />
      </div>
      
      {/* Positioned users */}
      {positionedUsers.map((user) => (
        <div 
          key={user.id} 
          className="absolute flex flex-col items-center cursor-pointer"
          style={{ 
            left: `${user.x}px`, 
            top: `${user.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => onUserClick && onUserClick(user.id)}
        >
          <UserAvatar src={user.avatar} online={user.online} />
          <div className="mt-1 text-center">
            <p className="text-xs text-white font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.distance}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchRadar;
