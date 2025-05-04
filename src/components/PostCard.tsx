import React from 'react';
import { Post } from '../types';
import UserAvatar from './UserAvatar';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/utils';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  className?: string;
  isInteractive?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, className, isInteractive = false }) => {
  const navigate = useNavigate();
  // Get the user data from either post.user or post.author
  const userData = post.user || post.author;
  
  if (!userData) {
    console.error("Post is missing user/author data:", post);
    return null;
  }

  const handleCommentClick = () => {
    // Navigate to the correct path: /post/:id instead of /post/:id
    navigate(`/post/${post.id}`);
  };
  
  const renderVerificationBadges = () => {
    return (
      <div className="flex items-center space-x-1">
        {userData.verified && (
          <div className="bg-yellow-100 px-1.5 rounded flex items-center">
            <svg className="w-3 h-3 text-yellow-500 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-yellow-700">认证</span>
          </div>
        )}
        
        {userData.vip && (
          <div className="bg-blue-100 px-1.5 rounded flex items-center">
            <svg className="w-3 h-3 text-blue-500 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-blue-700">VIP</span>
          </div>
        )}
        
        {userData.realName && (
          <div className="bg-green-100 px-1.5 rounded flex items-center">
            <svg className="w-3 h-3 text-green-500 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-green-700">实名</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("bg-white p-4 border-b border-gray-100", className)}>
      <div className="flex justify-between">
        <div className="flex items-center">
          <UserAvatar src={userData.avatar} />
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-900">{userData.name}</h3>
              {userData.crown && (
                <svg className="w-4 h-4 ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              {userData.gender && (
                <span className="text-xs bg-red-50 text-red-500 rounded ml-2 px-1">
                  {userData.gender === 'male' ? '♂' : '♀'} {userData.age}
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-gray-500 text-xs mr-2">{userData.location}</span>
              {userData.lastActive && (
                <span className="text-xs text-gray-400">{formatDate(userData.lastActive)}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          {renderVerificationBadges()}
          {post.private !== undefined && (
            <span className="text-gray-400 text-xs mt-1">
              {post.private ? '私密' : '公开'}
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-gray-900">{post.content}</p>
        
        {post.images && post.images.length > 0 ? (
          <div className={`grid gap-1 mt-2 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {post.images.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-md">
                <img src={image} alt="Post image" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : post.image && (
          <div className="mt-2">
            <div className="aspect-square overflow-hidden rounded-md">
              <img src={post.image} alt="Post image" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between">
        <div className="flex items-center text-gray-500">
          <Heart className="h-5 w-5" />
          <span className="ml-1 text-sm">{post.likes}</span>
        </div>
        <div className="flex items-center text-gray-500" onClick={handleCommentClick}>
          <MessageSquare className="h-5 w-5" />
          <span className="ml-1 text-sm">{post.comments}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Share2 className="h-5 w-5" />
          <span className="ml-1 text-sm">{post.shares || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
