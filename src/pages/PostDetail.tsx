
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Heart, MessageSquare, Share2, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserAvatar from '../components/UserAvatar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Post } from '@/types';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchPostWithComments();
      
      // Setup realtime subscription for new comments
      const channel = supabase
        .channel('public:comments')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${id}` }, 
          handleNewComment
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);
  
  const handleNewComment = async (payload: any) => {
    console.log('New comment received:', payload);
    try {
      // Fetch the complete comment with user information
      const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (nickname, avatar)
        `)
        .eq('id', payload.new.id)
        .single();
      
      if (commentError) throw commentError;
      
      setComments(prev => [...prev, commentData]);
    } catch (error) {
      console.error('处理新评论错误:', error);
    }
  };

  const fetchPostWithComments = async () => {
    setLoading(true);
    try {
      // Get post data
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (id, nickname, avatar, location)
        `)
        .eq('id', id)
        .single();
      
      if (postError) throw postError;
      
      // Get like count
      const { count: likeCount, error: likeError } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('post_id', id);
        
      if (likeError) throw likeError;
      
      // Check if user has liked this post
      if (user) {
        const { data: userLike, error: userLikeError } = await supabase
          .from('likes')
          .select('*')
          .eq('post_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (!userLikeError) {
          setLiked(!!userLike);
        }
      }
      
      // Get post images
      const { data: imageData, error: imageError } = await supabase
        .from('post_images')
        .select('*')
        .eq('post_id', id);
        
      if (imageError) throw imageError;
      
      // Get post tags
      const { data: tagData, error: tagError } = await supabase
        .from('post_tags')
        .select('*')
        .eq('post_id', id);
        
      if (tagError) throw tagError;
      
      // Format post
      const formattedPost: Post = {
        id: postData.id,
        content: postData.content,
        author: {
          id: postData.profiles.id,
          name: postData.profiles.nickname,
          avatar: postData.profiles.avatar,
          location: postData.profiles.location,
          gender: 'unknown'
        },
        likes: likeCount || 0,
        comments: 0,
        time: new Date(postData.created_at).toLocaleString('zh-CN', {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        image: imageData?.[0]?.image_url,
        tags: tagData?.map(tag => tag.tag) || [],
      };
      
      setPost(formattedPost);
      setLikeCount(likeCount || 0);
      
      // Get comments
      await fetchComments();
    } catch (error: any) {
      console.error('获取帖子详情错误:', error.message);
      toast({
        title: "获取帖子详情失败",
        description: error.message,
        variant: "destructive"
      });
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (nickname, avatar)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setComments(data || []);
    } catch (error: any) {
      console.error('获取评论错误:', error.message);
      toast({
        title: "获取评论失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleLike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!liked) {
      try {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, post_id: id });
          
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
          .eq('post_id', id);
          
        if (error) throw error;
        
        setLiked(false);
        setLikeCount(prevCount => Math.max(0, prevCount - 1));
      } catch (error) {
        console.error("取消点赞错误:", error);
      }
    }
  };
  
  const handleShare = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toast({ description: "分享功能开发中" });
  };
  
  const submitComment = async () => {
    if (!commentText.trim() || !user) {
      if (!user) navigate('/auth');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content: commentText.trim()
        });
        
      if (error) throw error;
      
      // Clear input
      setCommentText('');
      toast({ description: "评论成功" });
    } catch (error: any) {
      console.error('提交评论错误:', error.message);
      toast({
        title: "评论失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUserClick = () => {
    if (post) {
      navigate(`/user/${post.author.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">帖子不存在</div>
        <Button onClick={() => navigate('/community')}>返回社区</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar />
      
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">帖子详情</h1>
        <div className="w-6"></div>
      </div>
      
      <div className="bg-white mb-2">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-start">
            <div onClick={handleUserClick} className="cursor-pointer">
              <UserAvatar src={post.author.avatar} />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <h3 className="font-medium cursor-pointer" onClick={handleUserClick}>
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
                >
                  <MessageSquare className="h-5 w-5 mr-1" />
                  <span>{comments.length}</span>
                </button>
                <button 
                  className="flex items-center text-gray-500" 
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5 mr-1" />
                  <span>分享</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white">
        <h4 className="px-4 py-2 font-medium text-lg border-b border-gray-100">评论 ({comments.length})</h4>
        
        {comments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex">
                  <img 
                    src={comment.profiles?.avatar || "/placeholder.svg"} 
                    alt={comment.profiles?.nickname} 
                    className="h-8 w-8 rounded-full mr-3" 
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm">{comment.profiles?.nickname || "用户"}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString('zh-CN', { 
                          month: 'numeric', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            暂无评论，快来发表第一条评论吧
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center">
        <input
          ref={commentInputRef}
          type="text"
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="写评论..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              submitComment();
            }
          }}
        />
        <Button 
          onClick={submitComment} 
          className="ml-2 rounded-full p-2 h-auto" 
          disabled={!commentText.trim() || isSubmitting}
          size="sm"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default PostDetail;
