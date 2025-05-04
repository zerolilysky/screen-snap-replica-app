
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const MessageDetail: React.FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const getTitle = () => {
    switch (type) {
      case 'friends':
        return '新朋友';
      case 'comments':
        return '评论';
      case 'mentions':
        return '@我的';
      case 'likes':
        return '赞';
      default:
        return '消息';
    }
  };
  
  const getEmptyMessage = () => {
    switch (type) {
      case 'friends':
        return '暂无新朋友请求';
      case 'comments':
        return '暂无评论消息';
      case 'mentions':
        return '暂无@我的消息';
      case 'likes':
        return '暂无点赞消息';
      default:
        return '暂无消息';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">{getTitle()}</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
          description={getEmptyMessage()}
        />
      </div>
    </div>
  );
};

export default MessageDetail;
