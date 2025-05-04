
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react';
import { concepts } from '../data/mockData';

const Concepts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConcepts, setFilteredConcepts] = useState(concepts);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConcepts(concepts);
    } else {
      const filtered = concepts.filter(concept => 
        concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConcepts(filtered);
    }
  }, [searchTerm]);

  const conceptCategories = [
    { name: '心理学', icon: '🧠', color: 'bg-blue-100 text-blue-800' },
    { name: '恋爱关系', icon: '❤️', color: 'bg-pink-100 text-pink-800' },
    { name: '社交技巧', icon: '👥', color: 'bg-green-100 text-green-800' },
    { name: '沟通表达', icon: '💬', color: 'bg-purple-100 text-purple-800' },
    { name: '情绪管理', icon: '😊', color: 'bg-yellow-100 text-yellow-800' },
    { name: '个人成长', icon: '🌱', color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">明白科普</h1>
      </div>
      
      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={20} className="text-gray-500 mr-2" />
          <input 
            type="text" 
            className="bg-transparent flex-1 outline-none" 
            placeholder="搜索科普知识..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 px-4 mb-6">
        {conceptCategories.map((category, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-3 text-center ${category.color} cursor-pointer`}
          >
            <div className="text-2xl mb-1">{category.icon}</div>
            <div className="text-sm font-medium">{category.name}</div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-2">
        <h2 className="font-medium text-lg">热门科普</h2>
      </div>
      
      <div className="flex-1">
        {filteredConcepts.map((concept) => (
          <div 
            key={concept.id}
            className="px-4 py-3 border-b border-gray-100 flex items-center cursor-pointer"
            onClick={() => navigate(`/discover/concept/${concept.id}`)}
          >
            <div className="flex-1">
              <h3 className="font-medium">{concept.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1 mt-1">{concept.description}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 ml-2" />
          </div>
        ))}
        
        {filteredConcepts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500">没有找到相关科普内容</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Concepts;
