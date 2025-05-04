
import React from 'react';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import ArticleCard from '../components/ArticleCard';
import ConceptCard from '../components/ConceptCard';
import TopicGroup from '../components/TopicGroup';
import Couples from '../components/Couples';
import { articles, concepts, couples, trends } from '../data/mockData';

const Discover: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      <StatusBar time="20:21" />
      
      <h1 className="text-xl font-medium text-center py-2">发现</h1>
      
      <section className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="font-medium">文章精选</h2>
          <button className="text-gray-500 text-sm">更多 &gt;</button>
        </div>
        
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </section>
      
      <div className="h-2 bg-gray-50"></div>
      
      <section className="py-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="font-medium">明白科普</h2>
          <button className="text-gray-500 text-sm">更多 &gt;</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 px-4">
          {concepts.map(concept => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>
      
      <section className="py-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="font-medium flex items-center">
            <span className="text-red-500 mr-1">●</span>
            当代青年文化
          </h2>
        </div>
        
        <div className="px-4">
          <p className="text-gray-700 mb-2">Emm, 老实说我觉得这还挺"奇特"的, 可以扮演狗狗的动物园?</p>
          <div className="bg-gray-100 h-40 w-full rounded-lg"></div>
        </div>
      </section>
      
      <TabBar />
    </div>
  );
};

export default Discover;
