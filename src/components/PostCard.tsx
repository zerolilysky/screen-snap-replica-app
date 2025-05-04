
import React, { useState } from 'react';
import { Post } from '../types';
import UserAvatar from './UserAvatar';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PostCardProps {
  post: Post;
  isInteractive?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isInteractive = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  
  const handleLike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!liked) {
      try {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, post_id: post.id });
          
        if (error) throw error;
        
        setLiked(true);
        setLikeCount(prevCount => prevCount + 1);
        toast({ description: "点赞成功" });
      } catch (error) {
        console.error("点赞错误:", error);
        toast({ 
          title: "操作失败", 
          description: "无法点赞，请稍后再试", 
          variant: "destructive" 
        });
      }
    } else {
      try {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);
          
        if (error) throw error;
        
        setLiked(false);
        setLikeCount(prevCount => Math.max(0, prevCount - 1));
      } catch (error) {
        console.error("取消点赞错误:", error);
      }
    }
  };
  
  const handleComment = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toast({ description: "评论功能开发中" });
  };
  
  const handleShare = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toast({ description: "分享功能开发中" });
  };

  const handleUserClick = () => {
    if (isInteractive) {
      navigate(`/user/${post.author.id}`);
    }
  };

  return (
    <div className="border-b border-gray-100 p-4">
      <div className="flex items-start">
        <div onClick={handleUserClick} className={isInteractive ? "cursor-pointer" : ""}>
          <UserAvatar src={post.author.avatar} />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h3 
              className={`font-medium ${isInteractive ? "cursor-pointer" : ""}`}
              onClick={handleUserClick}
            >
              {post.author.name}
            </h3>
            {post.author.verified && (
              <span className="ml-1 text-blue-500 text-sm">✓</span>
            )}
          </div>
          <div className="text-gray-500 text-xs flex items-center">
            <span>{post.time}</span>
            {post.author.location && (
              <>
                <span className="mx-1">·</span>
                <span>{post.author.location}</span>
              </>
            )}
          </div>
          <p className="mt-2">{post.content}</p>
          {post.image && (
            <div className="mt-2 rounded-lg overflow-hidden">
              <img src={post.image} alt="Post" className="w-full h-auto" />
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-blue-500 text-sm mr-2">#{tag}</span>
              ))}
            </div>
          )}
          
          {isInteractive && (
            <div className="mt-3 flex justify-around">
              <button 
                className="flex items-center text-gray-500" 
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 mr-1 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
                <span>{likeCount}</span>
              </button>
              <button 
                className="flex items-center text-gray-500" 
                onClick={handleComment}
              >
                <MessageSquare className="h-5 w-5 mr-1" />
                <span>{post.comments}</span>
              </button>
              <button 
                className="flex items-center text-gray-500" 
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 mr-1" />
                <span>分享</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
