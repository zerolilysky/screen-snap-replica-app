
import React from 'react';
import { Heart, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const TabBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-4 py-2">
      <Link to="/friends" className="flex flex-col items-center">
        <Heart className={`w-6 h-6 ${path === '/friends' ? 'text-black' : 'text-gray-400'}`} />
        <span className={`text-xs ${path === '/friends' ? 'text-black' : 'text-gray-400'}`}>交友</span>
      </Link>
      
      <Link to="/messages" className="flex flex-col items-center">
        <MessageCircle className={`w-6 h-6 ${path === '/messages' ? 'text-black' : 'text-gray-400'}`} />
        <span className={`text-xs ${path === '/messages' ? 'text-black' : 'text-gray-400'}`}>消息</span>
      </Link>
      
      <Link to="/community" className="flex flex-col items-center">
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${path === '/community' ? 'text-black' : 'text-gray-400'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill={path === '/community' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill={path === '/community' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"/>
        </svg>
        <span className={`text-xs ${path === '/community' ? 'text-black' : 'text-gray-400'}`}>社区</span>
      </Link>
      
      <Link to="/discover" className="flex flex-col items-center">
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${path === '/discover' ? 'text-black' : 'text-gray-400'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className={`text-xs ${path === '/discover' ? 'text-black' : 'text-gray-400'}`}>发现</span>
      </Link>
      
      <Link to="/profile" className="flex flex-col items-center relative">
        <User className={`w-6 h-6 ${path === '/profile' ? 'text-black' : 'text-gray-400'}`} />
        <span className={`text-xs ${path === '/profile' ? 'text-black' : 'text-gray-400'}`}>我</span>
        {path !== '/profile' && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </Link>
    </div>
  );
};

export default TabBar;
