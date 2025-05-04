
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import ArticleCard from '../components/ArticleCard';
import ConceptCard from '../components/ConceptCard';
import TopicGroup from '../components/TopicGroup';
import Couples from '../components/Couples';
import { Button } from '@/components/ui/button';
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
          <button 
            className="text-gray-500 text-sm"
            onClick={() => navigate('/discover/discussions')}
          >
            更多 &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 px-4">
          {trends.map(trend => (
            <div 
              key={trend.id} 
              className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => navigate(`/discover/discussion/${trend.id}`)}
            >
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
        
        <div className="px-4">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-pink-700">热门CP配对</h3>
              <span className="text-xs text-purple-600">查看全部</span>
            </div>
            
            <div className="flex overflow-x-auto space-x-3 pb-2">
              <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm flex-shrink-0">
                <img src="/placeholder.svg" alt="用户1" className="h-8 w-8 rounded-full" />
                <span className="mx-2 text-pink-500">❤</span>
                <img src="/placeholder.svg" alt="用户2" className="h-8 w-8 rounded-full" />
                <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">94%匹配</span>
              </div>
              
              <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm flex-shrink-0">
                <img src="/placeholder.svg" alt="用户3" className="h-8 w-8 rounded-full" />
                <span className="mx-2 text-pink-500">❤</span>
                <img src="/placeholder.svg" alt="用户4" className="h-8 w-8 rounded-full" />
                <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">87%匹配</span>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/profile/cp-space')} 
              className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              查看我的CP潜力
            </Button>
          </div>
        </div>
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
          <button 
            className="text-gray-500 text-sm"
            onClick={() => navigate('/discover/concepts')}
          >
            更多 &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 px-4">
          {concepts.map(concept => (
            <div 
              key={concept.id}
              onClick={() => navigate(`/discover/concept/${concept.id}`)}
              className="cursor-pointer"
            >
              <ConceptCard concept={concept} />
            </div>
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
