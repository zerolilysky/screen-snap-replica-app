
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Heart, Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { Button } from '@/components/ui/button';

const CpSpace: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">CP空间</h1>
        </div>
        <button>
          <Search size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <EmptyState 
          image="/lovable-uploads/e33615e0-c808-4a56-9285-ec441f7223b9.png"
          description="您还没有创建CP关系"
        />
        
        <Button className="mt-6 bg-pink-500 hover:bg-pink-600">
          <Heart size={16} className="mr-2" />
          寻找CP
        </Button>
      </div>
    </div>
  );
};

export default CpSpace;
