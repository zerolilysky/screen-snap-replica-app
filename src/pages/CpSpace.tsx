
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Search, Heart, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Couple } from '@/types';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';

const CpSpace: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [couples, setCouples] = useState<Couple[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchCouples();
    }
  }, [user]);
  
  const fetchCouples = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Use explicit column names to fix the "Could not embed" error
      const { data, error } = await supabase
        .from('couples')
        .select(`
          id,
          name,
          created_at,
          user1_id,
          user2_id,
          profiles:user1_id (
            id:id,
            nickname:nickname,
            avatar:avatar
          ),
          profiles_2:user2_id (
            id:id,
            nickname:nickname,
            avatar:avatar
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      
      if (error) throw error;
      
      if (data) {
        const formattedCouples: Couple[] = data.map(couple => ({
          id: couple.id,
          name: couple.name || '',
          created_at: couple.created_at || new Date().toISOString(),
          user1: {
            id: couple.profiles?.id || '',
            nickname: couple.profiles?.nickname || 'Unknown',
            avatar: couple.profiles?.avatar || '/placeholder.svg',
          },
          user2: {
            id: couple.profiles_2?.id || '',
            nickname: couple.profiles_2?.nickname || 'Unknown',
            avatar: couple.profiles_2?.avatar || '/placeholder.svg',
          }
        }));
        setCouples(formattedCouples);
      }
    } catch (error) {
      console.error('Error fetching couples:', error);
      toast({
        title: "获取CP失败",
        description: "无法加载您的CP关系",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCP = () => {
    navigate('/cp/create');
  };

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
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : couples.length > 0 ? (
        <div className="p-4 grid grid-cols-1 gap-4">
          {couples.map(couple => (
            <div key={couple.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{couple.name || 'CP组合'}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(couple.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-pink-100">
                      <img 
                        src={couple.user1.avatar || "/placeholder.svg"} 
                        alt={couple.user1.nickname} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 font-medium">{couple.user1.nickname}</p>
                  </div>
                  
                  <div className="mx-4 bg-pink-500 rounded-full p-2">
                    <Heart size={24} className="text-white" />
                  </div>
                  
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-pink-100">
                      <img 
                        src={couple.user2.avatar || "/placeholder.svg"} 
                        alt={couple.user2.nickname} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 font-medium">{couple.user2.nickname}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" className="rounded-full">
                    查看CP空间
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            onClick={handleCreateCP}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-pink-500 hover:bg-pink-600 shadow-lg flex items-center justify-center"
          >
            <Plus size={24} />
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <EmptyState 
            description="您还没有创建CP关系"
          />
          
          <Button 
            onClick={handleCreateCP}
            className="mt-6 bg-pink-500 hover:bg-pink-600"
          >
            <Heart size={16} className="mr-2" />
            寻找CP
          </Button>
        </div>
      )}
    </div>
  );
};

export default CpSpace;
