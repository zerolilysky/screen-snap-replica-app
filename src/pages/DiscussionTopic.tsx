
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import PostCard from '../components/PostCard';

interface Discussion {
  id: string;
  title: string;
  icon: string;
  participants: number;
}

const DiscussionTopic: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDiscussion();
    fetchDiscussionPosts();
  }, [id]);
  
  const fetchDiscussion = async () => {
    try {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setDiscussion(data);
    } catch (error) {
      console.error('获取讨论主题错误:', error);
    }
  };
  
  const fetchDiscussionPosts = async () => {
    setLoading(true);
    try {
      // In a real implementation, posts would have a discussion_id field
      // For now, we'll mock this behavior with tag matching
      
      // Mock data
      const mockPosts = [
        {
          id: '1',
          content: '这个话题真的很有意思，我很喜欢！',
          author: {
            id: 'user1',
            name: '小明',
            avatar: '/placeholder.svg',
            location: '北京'
          },
          likes: 12,
          comments: 3,
          time: '3小时前',
          tags: ['我笑起来真好看']
        },
        {
          id: '2',
          content: '有人一起讨论这个话题的发展方向吗？',
          author: {
            id: 'user2',
            name: '花花',
            avatar: '/placeholder.svg',
            location: '上海'
          },
          likes: 5,
          comments: 1,
          time: '昨天',
          tags: ['我笑起来真好看']
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('获取讨论帖子错误:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitPost = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!newPost.trim()) {
      return;
    }
    
    // Add the post to the discussion
    setNewPost('');
    toast({ description: "发布成功" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          {discussion?.icon && <span className="text-xl mr-2">{discussion.icon}</span>}
          <h1 className="text-lg font-medium">#{discussion?.title || '讨论主题'}</h1>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">{discussion?.participants || 0} 人参与</span>
        </div>
        <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-auto">
          邀请好友
        </Button>
      </div>
      
      {loading ? (
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex-1">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} isInteractive={true} />
            ))
          ) : (
            <div className="flex items-center justify-center p-10 text-gray-500">
              暂无讨论内容，快来发表第一条吧
            </div>
          )}
        </div>
      )}
      
      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="参与讨论..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Button 
            onClick={handleSubmitPost}
            className="ml-2 rounded-full h-10 w-10 p-0 flex items-center justify-center"
            disabled={!newPost.trim() || !user}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionTopic;
