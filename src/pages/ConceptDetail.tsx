
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Share2, Heart, Bookmark } from 'lucide-react';
import { concepts } from '../data/mockData';

const ConceptDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const concept = concepts.find(c => c.id === id) || {
    id: '1',
    title: '未找到相关科普',
    description: '内容不存在或已被删除'
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">科普详情</h1>
        <div className="w-6"></div>
      </div>
      
      <div className="flex-1 px-4 py-6">
        <h1 className="text-2xl font-bold">{concept.title}</h1>
        
        <div className="flex items-center mt-4 mb-6 text-sm text-gray-500">
          <span>作者: Nico官方</span>
          <span className="mx-2">•</span>
          <span>发布于 2023-05-01</span>
        </div>
        
        <div className="prose max-w-none">
          <p className="mb-4 leading-relaxed">{concept.description}</p>
          
          <p className="mb-4 leading-relaxed">
            在人际交往中，理解自己和他人的心理状态是非常重要的。通过了解心理学基础知识，我们可以更好地把握社交互动中的各种微妙情况，建立更健康的人际关系。
          </p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">关键要点</h2>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>每个人都有独特的心理特质，这些特质影响着我们如何看待世界和与他人互动。</li>
            <li>情绪管理是维持健康关系的重要部分，学会识别和表达情绪可以减少误解。</li>
            <li>共情能力让我们能够从他人的角度思考问题，这对于建立深层次的连接至关重要。</li>
            <li>有效的沟通包括积极倾听和清晰表达，这些技能可以通过实践来提升。</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-6 mb-3">实际应用</h2>
          
          <p className="mb-4 leading-relaxed">
            在日常生活中，我们可以通过以下方式应用这些心理学概念：
          </p>
          
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li>在与新朋友交流时，留意他们的非语言线索，如眼神接触和身体姿势。</li>
            <li>在争论中，尝试理解对方的观点而不急于反驳，这表明你尊重他们的想法。</li>
            <li>意识到自己的情绪反应，并在表达前给自己一些时间思考。</li>
            <li>练习积极倾听，不仅仅是为了回应，而是为了真正理解对方。</li>
          </ol>
          
          <p className="mt-6 text-gray-600 italic">
            记住，心理学知识只是工具，最重要的是如何在实际生活中应用这些知识来改善我们的人际关系和个人成长。
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-4 flex justify-around">
        <button className="flex flex-col items-center">
          <Heart className="h-6 w-6 text-gray-500" />
          <span className="text-xs text-gray-500 mt-1">喜欢</span>
        </button>
        <button className="flex flex-col items-center">
          <Share2 className="h-6 w-6 text-gray-500" />
          <span className="text-xs text-gray-500 mt-1">分享</span>
        </button>
        <button className="flex flex-col items-center">
          <Bookmark className="h-6 w-6 text-gray-500" />
          <span className="text-xs text-gray-500 mt-1">收藏</span>
        </button>
      </div>
    </div>
  );
};

export default ConceptDetail;
