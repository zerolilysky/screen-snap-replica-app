
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  image?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon,
  title,
  description, 
  action,
  image
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {image && (
        <img 
          src={image} 
          alt="Empty state" 
          className="w-32 h-32 mb-4"
        />
      )}
      
      {icon && (
        <div className="text-orange-500 mb-4">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-gray-500 text-center mb-4">{description}</p>
      )}
      
      {action}
    </div>
  );
};

export default EmptyState;
