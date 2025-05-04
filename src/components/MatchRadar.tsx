
import React from 'react';
import { User } from '../types';
import UserAvatar from './UserAvatar';

interface MatchRadarProps {
  users: User[];
  center?: User;
}

const MatchRadar: React.FC<MatchRadarProps> = ({ users, center }) => {
  // Define positions for the radar animation
  const positions = [
    { top: '40%', left: '15%' },
    { top: '25%', left: '35%' },
    { top: '25%', right: '15%' },
    { top: '50%', right: '25%' },
    { top: '65%', left: '25%' }
  ];

  return (
    <div className="relative h-80 w-full my-8">
      {/* Radar circles */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full border-2 border-gray-600 opacity-30" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 rounded-full border-2 border-gray-600 opacity-30" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 rounded-full border-2 border-gray-600 opacity-30" />
      
      {/* Center user avatar (current user) */}
      {center && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <UserAvatar src={center.avatar} size="lg" online={true} />
        </div>
      )}
      
      {/* Nearby users */}
      {users.map((user, index) => {
        const position = positions[index % positions.length];
        return (
          <div 
            key={user.id} 
            className="absolute"
            style={position}
          >
            <div className="flex flex-col items-center">
              <UserAvatar src={user.avatar} size="md" online={user.online} />
              <span className="text-xs mt-1 text-gray-300">{user.distance}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchRadar;
