
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';

interface MatchRequestCardProps {
  id: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
    location?: string;
    gender?: string;
    age?: number;
  };
  created_at: string;
  onAction: (id: string, action: 'accept' | 'reject') => void;
  isPending: boolean;
}

const MatchRequestCard: React.FC<MatchRequestCardProps> = ({ 
  id, 
  user, 
  created_at, 
  onAction,
  isPending 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${user.id}`);
  };
  
  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction(id, 'accept');
  };
  
  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction(id, 'reject');
  };
  
  const timeAgo = formatDistance(
    new Date(created_at),
    new Date(),
    { addSuffix: true }
  );
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-3">
      <div className="p-4">
        <div className="flex items-center">
          <UserAvatar src={user.avatar} size="md" />
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium">{user.nickname}</h3>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
            <div className="flex items-center mt-1">
              {user.gender && (
                <span className="text-xs bg-red-50 text-red-500 rounded mr-2 px-1">
                  {user.gender === 'male' ? '♂' : '♀'} {user.age}
                </span>
              )}
              {user.location && (
                <span className="text-xs text-gray-500">{user.location}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center text-gray-600 text-sm">
          {isPending ? '对方想与你配对' : '等待对方回应'}
        </div>
        
        <div className="mt-3 flex justify-between">
          <Button 
            variant="outline" 
            className="flex-1 mr-2"
            onClick={handleViewProfile}
          >
            查看资料
          </Button>
          
          {isPending ? (
            <>
              <Button 
                variant="destructive" 
                className="flex-1 mr-2"
                onClick={handleReject}
              >
                <X className="h-4 w-4 mr-1" />
                拒绝
              </Button>
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={handleAccept}
              >
                <Check className="h-4 w-4 mr-1" />
                接受
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MatchRequestCard;
