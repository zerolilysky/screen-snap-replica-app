
import React from 'react';

interface UserAvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  showBadge?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  alt = "User avatar", 
  size = "md",
  online,
  showBadge = false
}) => {
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };
  
  return (
    <div className="relative">
      <div className={`${sizeClass[size]} rounded-full overflow-hidden bg-gray-200`}>
        <img 
          src={src || "/placeholder.svg"} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      
      {typeof online === 'boolean' && (
        <div 
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${online ? 'bg-green-500' : 'bg-gray-400'}`}
        />
      )}
      
      {showBadge && (
        <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full h-5 w-5 flex items-center justify-center">
          <span className="text-white text-xs">5</span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
