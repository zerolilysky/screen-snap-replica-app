
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import ArticleCard from '../components/ArticleCard';
import ConceptCard from '../components/ConceptCard';
import TopicGroup from '../components/TopicGroup';
import Couples from '../components/Couples';
import { articles, concepts, couples, trends } from '../data/mockData';

const Discover: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      <StatusBar time="20:21" />
      
      <h1 className="text-xl font-medium text-center py-2">发现</h1>
      
      <section className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="font-medium">我的人格</h2>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mr-2">
              <span className="text-white text-xs">😊</span>
            </div>
            <button 
              className="text-gray-500 text-sm"
              onClick={() => navigate('/personality-test')}
            >
              心理测试 &gt;
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg mx-4 p-4">
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">外向</span>
              <span className="text-sm text-gray-500">内向</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-full bg-blue-400 rounded-full w-3/4"></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">理性</span>
              <span className="text-sm text-gray-500">感性</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-full bg-orange-400 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-2 bg-gray-50"></div>
      
      <section className="py-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="font-medium">正在讨论</h2>
          <button className="text-gray-500 text-sm">更多 &gt;</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 px-4">
          {trends.map(trend => (
            <div key={trend.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-lg mr-1">{trend.icon}</span>
                <span className="text-sm font-medium">#{trend.title}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{trend.participants}参与</div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="py-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="font-medium">磕CP</h2>
          <button 
            className="text-gray-500 text-sm"
            onClick={() => navigate('/profile/cp-space')}
          >
            更多 &gt;
          </button>
        </div>
        
        <Couples couples={couples} />
      </section>
      
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
