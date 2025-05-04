
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';

const MessagesEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 bg-white">
      <EmptyState
        icon={<MessageSquare size={32} />}
        title="暂无消息"
        description="去匹配页面认识新朋友吧"
        action={
          <Button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
            onClick={() => navigate('/match')}
          >
            去匹配
          </Button>
        }
      />
    </div>
  );
};

export default MessagesEmptyState;
