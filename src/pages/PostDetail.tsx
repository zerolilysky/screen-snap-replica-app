
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Fix to ensure we don't try to access image_url property when it doesn't exist
const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);
  
  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            id, 
            nickname, 
            avatar,
            location
          )
        `)
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      
      // Also fetch post images if needed
      const { data: imageData, error: imageError } = await supabase
        .from('post_images')
        .select('image_url')
        .eq('post_id', postId);
        
      if (imageError) throw imageError;
      
      // Add images to the post object
      setPost({
        ...data,
        images: imageData || [] 
      });
      
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
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!post) {
    return <div>Post not found</div>;
  }
  
  return (
    <div>
      <h1>Post Detail</h1>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      
      {/* Only render images if they exist */}
      {post.images && post.images.length > 0 && (
        <div>
          {post.images.map((img: any, index: number) => (
            <img 
              key={index} 
              src={img.image_url} 
              alt={`Post image ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      <div>
        <p>By: {post.profiles?.nickname || 'Unknown User'}</p>
        <p>Location: {post.location || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default PostDetail;
