
import React from 'react';
import { Article } from '../types';
import { MessageCircle, Heart } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="flex space-x-3 px-4 py-3 border-b border-gray-100">
      <div className="flex-1">
        <h3 className="text-base font-medium mb-2">{article.title}</h3>
        <div className="flex items-center text-gray-500 text-xs">
          <span>{article.date}</span>
          <div className="flex items-center ml-4">
            <Heart className="h-3 w-3 mr-1" />
            <span>{article.likes}喜欢</span>
          </div>
          <div className="flex items-center ml-4">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>{article.comments}评论</span>
          </div>
        </div>
      </div>
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ArticleCard;
