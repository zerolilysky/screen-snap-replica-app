
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EmptyState from '../components/EmptyState';
import FloatingButton from '../components/FloatingButton';

const UserPosts: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreatePost = () => {
    if (user) {
      navigate('/community/post');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">我的动态</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <EmptyState 
          image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
          description="您还没有发布动态，点击下方按钮发布"
        />
      </div>
      
      <FloatingButton onClick={handleCreatePost} />
    </div>
  );
};

export default UserPosts;
