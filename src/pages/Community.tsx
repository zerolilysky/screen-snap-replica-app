
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import CommunityTabs from '../components/CommunityTabs';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import FloatingButton from '../components/FloatingButton';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Post } from '@/types';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'following' | 'recommended'>('recommended');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    // Subscribe to realtime updates for new posts
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' }, 
        (payload) => {
          handleNewPost(payload.new);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };
  
  const handleNewPost = async (newPost: any) => {
    try {
      // Fetch the complete post with author information
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (id, nickname, avatar, location)
        `)
        .eq('id', newPost.id)
        .single();
      
      if (postError) throw postError;
      
      // Fetch post images
      const { data: imageData, error: imageError } = await supabase
        .from('post_images')
        .select('*')
        .eq('post_id', newPost.id);
      
      if (imageError) throw imageError;
      
      // Fetch post tags
      const { data: tagData, error: tagError } = await supabase
        .from('post_tags')
        .select('*')
        .eq('post_id', newPost.id);
      
      if (tagError) throw tagError;
      
      // Format post for display
      const formattedPost: Post = {
        id: postData.id,
        content: postData.content,
        author: {
          id: postData.profiles.id,
          name: postData.profiles.nickname,
          avatar: postData.profiles.avatar,
          location: postData.profiles.location,
          gender: 'unknown', // Default value
        },
        likes: 0,
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
      
      // Add the new post to the beginning of the list
      setPosts(prevPosts => [formattedPost, ...prevPosts]);
      
    } catch (error) {
      console.error('处理新帖子错误:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (id, nickname, avatar, location)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Get post counts, images, and tags
      const postsWithDetails = await Promise.all(data.map(async (post) => {
        // Get like count
        const { count: likeCount, error: likeError } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('post_id', post.id);
          
        if (likeError) throw likeError;
        
        // Get comment count
        const { count: commentCount, error: commentError } = await supabase
          .from('comments')
          .select('*', { count: 'exact' })
          .eq('post_id', post.id);
          
        if (commentError) throw commentError;
        
        // Get post images
        const { data: imageData, error: imageError } = await supabase
          .from('post_images')
          .select('*')
          .eq('post_id', post.id);
          
        if (imageError) throw imageError;
        
        // Get post tags
        const { data: tagData, error: tagError } = await supabase
          .from('post_tags')
          .select('*')
          .eq('post_id', post.id);
          
        if (tagError) throw tagError;
        
        return {
          id: post.id,
          content: post.content,
          author: {
            id: post.profiles.id,
            name: post.profiles.nickname,
            avatar: post.profiles.avatar,
            location: post.profiles.location,
            gender: 'unknown' as 'unknown', // Type assertion
          },
          likes: likeCount || 0,
          comments: commentCount || 0,
          time: new Date(post.created_at).toLocaleString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          image: imageData?.[0]?.image_url,
          tags: tagData?.map(tag => tag.tag) || [],
        };
      }));
      
      setPosts(postsWithDetails as Post[]);
    } catch (error: any) {
      console.error('获取帖子错误:', error.message);
      toast({
        title: "获取帖子失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (isAuthenticated) {
      navigate('/community/post');
    } else {
      toast({
        title: "需要登录",
        description: "请先登录后再发布动态",
        variant: "destructive"
      });
      navigate('/auth', { state: { from: { pathname: '/community/post' } } });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      <StatusBar time="20:21" />
      
      <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {activeTab === 'following' ? (
            <EmptyState 
              image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
              description="您还未关注任何人，看看同城Nicoer吧~"
            />
          ) : (
            <div className="flex-1">
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post.id} onClick={() => handlePostClick(post.id)}>
                    <PostCard post={post} isInteractive={true} />
                  </div>
                ))
              ) : (
                <EmptyState 
                  image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
                  description="暂无帖子，快来发布第一条动态吧"
                />
              )}
            </div>
          )}
        </>
      )}
      
      <FloatingButton onClick={handleCreatePost} />
      
      <TabBar />
    </div>
  );
};

export default Community;
