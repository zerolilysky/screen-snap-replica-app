
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import Couples from '../components/Couples';
import { Heart, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Couple } from '@/types';
import EmptyState from '@/components/EmptyState';

const CpSpace: React.FC = () => {
  const navigate = useNavigate();
  const [couples, setCouples] = useState<Couple[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');

  useEffect(() => {
    fetchCouples();
  }, []);

  const fetchCouples = async () => {
    setLoading(true);
    try {
      // Fix the query by specifically naming columns in the join
      const { data, error } = await supabase
        .from('couples')
        .select(`
          id,
          name,
          created_at,
          user1:user1_id(
            id,
            nickname,
            avatar
          ),
          user2:user2_id(
            id,
            nickname,
            avatar
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Safely format the couples data
      const formattedCouples: Couple[] = data.map(couple => ({
        id: couple.id,
        name: couple.name || '未命名CP',
        created_at: couple.created_at,
        user1: {
          id: couple.user1?.id || '',
          nickname: couple.user1?.nickname || '用户1',
          avatar: couple.user1?.avatar || '/placeholder.svg'
        },
        user2: {
          id: couple.user2?.id || '',
          nickname: couple.user2?.nickname || '用户2',
          avatar: couple.user2?.avatar || '/placeholder.svg'
        }
      }));
      
      setCouples(formattedCouples);
    } catch (error: any) {
      console.error('获取CP数据错误:', error.message);
      toast({
        title: "获取数据失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCP = () => {
    navigate('/profile/cp-space/create');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <StatusBar />
      
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-medium">CP空间</h1>
        <button>
          <Search className="h-6 w-6" />
        </button>
      </div>
      
      <div className="bg-white p-4">
        <div className="flex space-x-4 text-sm">
          <button 
            className={`px-4 py-2 rounded-full ${activeTab === 'all' ? 'bg-red-100 text-red-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            所有CP
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${activeTab === 'mine' ? 'bg-red-100 text-red-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('mine')}
          >
            我的CP
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : couples.length > 0 ? (
        <div className="flex-1 bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Heart className="text-red-500 h-5 w-5 mr-2" />
              <h2 className="font-medium">热门CP</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500">
              查看更多
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {couples.slice(0, 4).map((couple) => (
              <div key={couple.id} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex justify-center">
                  <div className="relative inline-block">
                    <img 
                      src={couple.user1.avatar} 
                      alt={couple.user1.nickname} 
                      className="h-12 w-12 rounded-full border-2 border-white"
                    />
                  </div>
                  <div className="relative inline-block -ml-3">
                    <img 
                      src={couple.user2.avatar} 
                      alt={couple.user2.nickname} 
                      className="h-12 w-12 rounded-full border-2 border-white"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium">{couple.name}</p>
                <p className="text-xs text-gray-500 mt-1">创建于 {new Date(couple.created_at || '').toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          
          <Button onClick={handleCreateCP} className="w-full mb-4">
            创建新的CP
            <Plus className="ml-2 h-4 w-4" />
          </Button>
          
          <Couples couples={couples} title="在Nico撮CP" />
        </div>
      ) : (
        <EmptyState 
          description="没有找到CP，创建一个吧"
        />
      )}
      
      {activeTab === 'mine' && couples.length === 0 && (
        <div className="p-8 text-center">
          <Button onClick={handleCreateCP} className="mb-4 bg-red-500 hover:bg-red-600">
            创建第一个CP
            <Heart className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline">
            查看CP教程
          </Button>
        </div>
      )}
      
      <TabBar />
    </div>
  );
};

export default CpSpace;
