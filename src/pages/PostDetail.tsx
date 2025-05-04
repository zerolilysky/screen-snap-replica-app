import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PostCard from '../components/PostCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    nickname: string;
    avatar: string;
  };
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      // This is a mockup - adapt based on your actual data structure
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (id, nickname, avatar, location)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Format post data to match the structure expected by PostCard
        const formattedPost = {
          id: data.id,
          content: data.content,
          image: data.image_url,
          likes: 0, // You would need to count actual likes
          comments: 0, // Will be updated with actual comments count
          time: new Date(data.created_at).toLocaleDateString(),
          author: {
            id: data.profiles.id,
            name: data.profiles.nickname,
            avatar: data.profiles.avatar || '/placeholder.svg',
            location: data.profiles.location
          },
          tags: [] // Add logic to fetch tags if needed
        };
        setPost(formattedPost);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "获取帖子失败",
        description: "无法加载帖子详情",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
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
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "获取评论失败",
        description: "无法加载评论",
        variant: "destructive"
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment.trim()
        })
        .select(`
          *,
          profiles:user_id (nickname, avatar)
        `)
        .single();
        
      if (error) throw error;
      
      // Update comments list
      setComments(prev => [...prev, data]);
      
      // Clear input
      setNewComment('');
      
      toast({ description: "评论成功" });
    } catch (error: any) {
      console.error('提交评论错误:', error.message);
      toast({
        title: "评论失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StatusBar />
      
      <div className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-medium">帖子详情</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : post ? (
        <>
          <div className="bg-white mb-2">
            <PostCard post={post} isInteractive={false} />
          </div>
          
          <div className="bg-white p-4 border-t border-b border-gray-100">
            <div className="flex items-center">
              <MessageSquare size={18} className="text-gray-500" />
              <span className="ml-2 font-medium">评论 ({comments.length})</span>
            </div>
          </div>
          
          <ScrollArea className="flex-1 bg-white">
            {loadingComments ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img 
                      src={comment.profiles.avatar || "/placeholder.svg"} 
                      alt={comment.profiles.nickname} 
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <h3 className="font-medium text-sm">{comment.profiles.nickname}</h3>
                        <span className="ml-2 text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">
                暂无评论，快来发表第一条吧
              </div>
            )}
          </ScrollArea>
          
          <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 bg-gray-100 border-0 rounded-full py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="添加评论..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    submitComment();
                  }
                }}
              />
              <Button 
                onClick={submitComment}
                className="ml-2 rounded-full h-10 w-10 p-0 flex items-center justify-center"
                disabled={!newComment.trim() || !user}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>帖子不存在或已被删除</p>
            <Button 
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/community')}
            >
              返回社区
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
