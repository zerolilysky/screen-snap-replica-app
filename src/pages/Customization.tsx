
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft } from 'lucide-react';

const Customization: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 bg-white border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">我的装扮</h1>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-medium mb-4">个人形象</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">👑</div>
                <div className="text-sm text-gray-500">王冠</div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🎭</div>
                <div className="text-sm text-gray-500">面具</div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🦊</div>
                <div className="text-sm text-gray-500">狐狸耳朵</div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🌟</div>
                <div className="text-sm text-gray-500">星光环绕</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-medium mb-4">聊天气泡</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <div className="bg-pink-100 rounded-lg p-3 w-full">
                <p className="text-sm">这是一条消息</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <div className="bg-blue-100 rounded-lg p-3 w-full">
                <p className="text-sm">这是一条消息</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <div className="bg-purple-100 rounded-lg p-3 w-full">
                <p className="text-sm">这是一条消息</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <div className="bg-green-100 rounded-lg p-3 w-full">
                <p className="text-sm">这是一条消息</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;
