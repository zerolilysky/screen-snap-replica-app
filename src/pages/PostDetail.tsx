
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, MoreHorizontal, Heart, Share2, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import StatusBar from '../components/StatusBar';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchPost(id);
      fetchComments(id);
      checkIfLiked(id);
      
      // Subscribe to real-time updates for comments
      const commentsChannel = supabase
        .channel('public:comments')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${id}` }, 
          (payload) => {
            handleNewComment(payload.new);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(commentsChannel);
      };
    }
  }, [id, user]);

  const handleNewComment = async (newComment: any) => {
    try {
      // Fetch the complete comment with author information
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_user_id_fkey (
            id, 
            nickname, 
            avatar
          )
        `)
        .eq('id', newComment.id)
        .single();
      
      if (error) throw error;
      
      // Add the new comment to the beginning of the list
      setComments(prevComments => [data, ...prevComments]);
      setCommentCount(prev => prev + 1);
    } catch (error) {
      console.error('Error handling new comment:', error);
    }
  };

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('posts').select(`
          *,
          profiles!posts_user_id_fkey (
            id, 
            nickname, 
            avatar,
            location
          )
        `).eq('id', postId).single();
      if (error) throw error;

      // Also fetch post images
      const { data: imageData, error: imageError } = await supabase.from('post_images').select('image_url').eq('post_id', postId);
      if (imageError) throw imageError;

      // Also fetch post tags
      const { data: tagData, error: tagError } = await supabase.from('post_tags').select('tag').eq('post_id', postId);
      if (tagError) throw tagError;

      // Count likes
      const { count: likeCountData, error: likeCountError } = await supabase.from('likes').select('id', {
        count: 'exact',
        head: true
      }).eq('post_id', postId);
      if (likeCountError) throw likeCountError;

      // Count comments
      const { count: commentCountData, error: commentCountError } = await supabase.from('comments').select('id', {
        count: 'exact',
        head: true
      }).eq('post_id', postId);
      if (commentCountError) throw commentCountError;

      // Add images and tags to the post object
      setPost({
        ...data,
        images: imageData || [],
        tags: tagData?.map(t => t.tag) || []
      });
      setLikeCount(likeCountData || 0);
      setCommentCount(commentCountData || 0);
    } catch (error: any) {
      console.error('Error fetching post:', error.message);
      toast({
        title: "获取帖子失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      setCommentLoading(true);
      const { data, error } = await supabase.from('comments').select(`
          *,
          profiles!comments_user_id_fkey (
            id, 
            nickname, 
            avatar
          )
        `).eq('post_id', postId).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error.message);
      toast({
        title: "获取评论失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const checkIfLiked = async (postId: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('likes').select('id').eq('post_id', postId).eq('user_id', user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      setLiked(!!data);
    } catch (error: any) {
      console.error('Error checking if post is liked:', error.message);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      if (!liked) {
        // Add like
        const { error } = await supabase.from('likes').insert({
          user_id: user.id,
          post_id: id
        });
        if (error) throw error;
        setLiked(true);
        setLikeCount(prev => prev + 1);
        toast({
          description: "点赞成功"
        });
      } else {
        // Remove like
        const { error } = await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', id);
        if (error) throw error;
        setLiked(false);
        setLikeCount(prev => prev - 1);
      }
    } catch (error: any) {
      console.error('Error liking post:', error.message);
      toast({
        title: "操作失败",
        description: "点赞失败，请稍后再试",
        variant: "destructive"
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!newComment.trim()) return;
    try {
      const { data, error } = await supabase.from('comments').insert({
        user_id: user.id,
        post_id: id,
        content: newComment.trim()
      }).select(`
          *,
          profiles!comments_user_id_fkey (
            id, 
            nickname, 
            avatar
          )
        `).single();
      if (error) throw error;
      
      // Since we have a real-time subscription, the comment will be added automatically
      setNewComment('');

      // Send notification to post owner if it's not the current user
      if (post.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          actor_id: user.id,
          post_id: id,
          comment_id: data.id,
          type: 'comment'
        });
      }
      
      toast({
        description: "评论成功"
      });
    } catch (error: any) {
      console.error('Error submitting comment:', error.message);
      toast({
        title: "评论失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    toast({
      description: "分享功能开发中"
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}天前`;
    } else if (hours > 0) {
      return `${hours}小时前`;
    } else if (minutes > 0) {
      return `${minutes}分钟前`;
    } else {
      return '刚刚';
    }
  };

  const handleFocusComment = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    commentInputRef.current?.focus();
  };

  if (loading) {
    return <div className="flex flex-col min-h-screen">
        <StatusBar />
        <div className="flex items-center p-4 border-b">
          <ArrowLeft className="h-6 w-6 mr-4" onClick={() => navigate(-1)} />
          <h1 className="text-xl font-medium">动态</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>加载中...</p>
        </div>
      </div>;
  }

  if (!post) {
    return <div className="flex flex-col min-h-screen">
        <StatusBar />
        <div className="flex items-center p-4 border-b">
          <ArrowLeft className="h-6 w-6 mr-4" onClick={() => navigate(-1)} />
          <h1 className="text-xl font-medium">动态</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>帖子不存在</p>
        </div>
      </div>;
  }

  return <div className="flex flex-col min-h-screen bg-gray-50">
      <StatusBar />
      
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b">
        <ArrowLeft className="h-6 w-6 mr-4" onClick={() => navigate(-1)} />
        <h1 className="text-xl font-medium flex-1 text-center">动态</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Post Content */}
      <div className="bg-white mb-2">
        <div className="p-4">
          {/* Author info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={post.profiles?.avatar || '/placeholder.svg'} />
                <AvatarFallback>{post.profiles?.nickname?.[0] || '用户'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{post.profiles?.nickname || '未知用户'}</h3>
                  <span className="ml-2 px-1 bg-gray-200 text-gray-600 text-xs rounded">粉丝</span>
                </div>
                <div className="text-gray-500 text-xs flex items-center">
                  <span>{post.profiles?.location || '未知'}</span>
                  <span className="mx-1">·</span>
                  <span>{post.created_at ? formatTime(post.created_at) : '未知时间'}</span>
                </div>
              </div>
            </div>
            <MoreHorizontal className="h-6 w-6 text-gray-500" />
          </div>
          
          {/* Post content */}
          <div className="mt-3">
            <p className="text-base">{post.content}</p>
            
            {/* Post images */}
            {post.images && post.images.length > 0 && <div className="mt-3 grid grid-cols-2 gap-2">
                {post.images.map((img: any, index: number) => <div key={index} className="aspect-square overflow-hidden rounded-md">
                    <img src={img.image_url} alt={`Post image ${index + 1}`} className="w-full h-full object-cover" />
                  </div>)}
              </div>}
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && <div className="mt-3 flex flex-wrap">
                {post.tags.map((tag: string, index: number) => <span key={index} className="mr-2 mt-1 px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                    # {tag}
                  </span>)}
              </div>}
          </div>
          
          {/* Post actions */}
          <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <div className="bg-red-50 px-2 py-1 rounded text-xs font-bold text-red-500">HOT</div>
            </div>
            <div className="flex space-x-6">
              <button className="flex items-center text-gray-500">
                <Share2 className="h-5 w-5 mr-1" onClick={handleShare} />
                <span>转发</span>
              </button>
              <button className="flex items-center text-gray-500" onClick={handleLike}>
                <Heart className={`h-5 w-5 mr-1 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
                <span>{likeCount}</span>
              </button>
              <button className="flex items-center text-gray-500" onClick={handleFocusComment}>
                <MessageCircle className="h-5 w-5 mr-1" />
                <span>{commentCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Matching section */}
      <Card className="mx-4 mb-2 p-4 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">当前有 <span className="font-bold">47911</span> 人正在匹配中</p>
          </div>
        </div>
        <Button variant="outline" className="border-red-300 text-red-500 rounded-full">
          立即匹配
        </Button>
      </Card>
      
      {/* Gift prompt */}
      <div className="bg-white mb-2 p-4 flex items-center justify-between">
        <p className="text-gray-700">快来送礼物吧～</p>
        <div className="h-8 w-8">
          <img alt="礼物" className="h-full w-full object-contain" src="/lovable-uploads/2c562bd4-b51f-4212-bd91-23b974d36d91.png" />
        </div>
      </div>
      
      {/* Comment section header */}
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium">评论 {commentCount}</span>
          <span className="mx-2">·</span>
          <span>点赞 {likeCount}</span>
        </div>
        <button className="text-blue-500 text-sm flex items-center">
          <span>按热度</span>
          <span className="ml-1">↓</span>
        </button>
      </div>
      
      {/* Comments */}
      <div className="flex-1 bg-white">
        {commentLoading ? <div className="p-4 text-center text-gray-500">加载评论中...</div> : comments.length > 0 ? <div>
            {comments.map(comment => <div key={comment.id} className="p-4 border-b">
                <div className="flex">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={comment.profiles?.avatar || '/placeholder.svg'} />
                    <AvatarFallback>{comment.profiles?.nickname?.[0] || '用户'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{comment.profiles?.nickname || '未知用户'}</h4>
                        <p className="text-gray-500 text-xs">{formatTime(comment.created_at)}</p>
                      </div>
                      <Heart className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>)}
          </div> : <div className="p-4 text-center text-gray-500">暂无评论，快来发表评论吧</div>}
      </div>
      
      {/* Comment input */}
      <div className="sticky bottom-0 bg-white border-t p-2 flex items-center">
        <input ref={commentInputRef} type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder={user ? "说点什么吧..." : "请先登录后评论"} className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500" disabled={!user} />
        <Send className={`h-6 w-6 ml-2 ${newComment.trim() && user ? 'text-blue-500' : 'text-gray-400'}`} onClick={handleSubmitComment} />
      </div>
    </div>;
};

export default PostDetail;
