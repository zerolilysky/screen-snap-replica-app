
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ 
  onClick, 
  icon = <Plus className="h-6 w-6" />
}) => {
  return (
    <button 
      className="fixed bottom-20 right-6 bg-red-500 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default FloatingButton;
