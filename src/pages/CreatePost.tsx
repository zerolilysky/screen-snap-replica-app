
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Image, MapPin, Tag, X, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Check for authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "需要登录",
        description: "请先登录后再发布动态",
        variant: "destructive"
      });
      navigate('/auth', { state: { from: { pathname: '/community/post' } } });
    }
  }, [isAuthenticated, navigate, toast]);
  
  // If not authenticated, don't render the component
  if (!isAuthenticated) {
    return null;
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    if (images.length + selectedFiles.length > 9) {
      toast({
        title: "超出限制",
        description: "最多只能上传9张图片",
        variant: "destructive"
      });
      return;
    }
    
    setImages([...images, ...selectedFiles]);
    
    // Create preview URLs
    selectedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, url]);
    });
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };
  
  const addTag = () => {
    if (!tag) return;
    if (tags.includes(tag)) {
      toast({
        description: "标签已存在",
      });
      return;
    }
    setTags([...tags, tag]);
    setTag('');
    setShowTagInput(false);
  };
  
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    if (!content) {
      toast({
        title: "内容不能为空",
        description: "请输入要发布的内容",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Insert post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user!.id, // User is guaranteed to exist here
          content: content,
          location: location || null,
        })
        .select()
        .single();
      
      if (postError) throw postError;
      
      // Step 2: Upload images if any
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${post.id}-${Date.now()}.${fileExt}`;
          const filePath = `posts/${fileName}`;
          
          const { error: uploadError } = await supabase
            .storage
            .from('user_uploads')
            .upload(filePath, image);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrl } = supabase
            .storage
            .from('user_uploads')
            .getPublicUrl(filePath);
          
          // Add image to post_images table
          const { error: imageError } = await supabase
            .from('post_images')
            .insert({
              post_id: post.id,
              image_url: publicUrl.publicUrl
            });
          
          if (imageError) throw imageError;
        }
      }
      
      // Step 3: Add tags if any
      if (tags.length > 0) {
        const tagObjects = tags.map(tag => ({
          post_id: post.id,
          tag: tag
        }));
        
        const { error: tagError } = await supabase
          .from('post_tags')
          .insert(tagObjects);
        
        if (tagError) throw tagError;
      }
      
      toast({
        description: "发布成功！",
      });
      
      navigate('/community');
    } catch (error: any) {
      console.error('发布错误:', error.message);
      toast({
        title: "发布失败",
        description: error.message || "操作失败，请稍后再试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">发布动态</h1>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !content} 
          className="bg-red-500 hover:bg-red-600"
        >
          {loading ? '发布中...' : '发布'}
        </Button>
      </div>
      
      <div className="p-4 flex-1">
        <div className="flex space-x-3">
          <div>
            <img 
              src={profile?.avatar || '/placeholder.svg'} 
              alt={profile?.nickname || '用户'} 
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="flex-1">
            <textarea
              className="w-full min-h-[120px] border-none outline-none resize-none placeholder-gray-400 text-lg"
              placeholder="分享你的想法..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img 
                      src={url} 
                      alt={`上传图片 ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1"
                      onClick={() => removeImage(index)}
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    #{tag}
                    <button 
                      className="ml-1 text-blue-400" 
                      onClick={() => removeTag(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {location && (
              <div className="flex items-center mt-4 text-gray-500 text-sm">
                <MapPin size={14} className="mr-1" />
                <span>{location}</span>
              </div>
            )}
            
            {showTagInput && (
              <div className="mt-4 flex">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 outline-none"
                  placeholder="输入标签"
                />
                <button 
                  className="bg-blue-500 text-white px-4 rounded-r-lg"
                  onClick={addTag}
                >
                  添加
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-4">
        <div className="flex justify-between">
          <div className="flex space-x-6">
            <label className="cursor-pointer text-gray-500">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <Image size={24} />
            </label>
            <button
              className="text-gray-500"
              onClick={() => setLocation('北京市朝阳区')}
            >
              <MapPin size={24} />
            </button>
            <button
              className="text-gray-500"
              onClick={() => setShowTagInput(!showTagInput)}
            >
              <Tag size={24} />
            </button>
            <button className="text-gray-500">
              <Smile size={24} />
            </button>
          </div>
          <div className="text-gray-400 text-sm">
            {content.length}/1000
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
