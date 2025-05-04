
import React from 'react';
import { Post } from '../types';
import UserAvatar from './UserAvatar';
import { MessageCircle, Heart } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="border-b border-gray-100 px-4 py-4">
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <UserAvatar src={post.author.avatar} online={post.author.online} />
        
        {/* Post Content */}
        <div className="flex-1">
          {/* User Info */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="font-semibold text-sm">{post.author.name}</span>
              {post.author.verified && (
                <span className="ml-1 text-orange-500 text-xs">♕</span>
              )}
              {post.tags && post.tags.includes('VIP') && (
                <span className="ml-1 text-yellow-500 text-xs">👑</span>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              {post.author.location && (
                <span className="mr-2">{post.author.location}</span>
              )}
              {post.author.online ? (
                <span className="text-green-500">• 在线</span>
              ) : (
                <span className="text-gray-400">• 离线</span>
              )}
            </div>
          </div>
          
          {/* Post Text */}
          <p className="text-sm mb-2">{post.content}</p>
          
          {/* Post Image */}
          {post.image && (
            <div className="mb-2 rounded-lg overflow-hidden">
              <img src={post.image} alt="Post" className="w-full h-auto" />
            </div>
          )}
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-red-500 px-3 py-1 rounded-full">
                  # {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-pink-500">♀ {post.likes}</div>
            
            <div className="flex space-x-6">
              <button className="flex items-center text-gray-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="flex items-center text-gray-400">
                <Heart className="h-5 w-5" />
                {post.likes > 0 && <span className="ml-1 text-xs">{post.likes}</span>}
              </button>
              <button className="flex items-center text-gray-400">
                <MessageCircle className="h-5 w-5" />
                {post.comments > 0 && <span className="ml-1 text-xs">{post.comments}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
