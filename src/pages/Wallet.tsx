
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Plus, CreditCard, Gift } from 'lucide-react';

const Wallet: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 bg-white border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">我的钱包</h1>
      </div>
      
      <div className="bg-gradient-to-r from-red-500 to-pink-500 m-4 p-6 rounded-xl text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm opacity-80">钱包余额</p>
            <h2 className="text-3xl font-bold mt-1">¥ 0.00</h2>
          </div>
          <button className="bg-white bg-opacity-20 rounded-full p-2">
            <CreditCard className="text-white" size={20} />
          </button>
        </div>
        
        <button className="mt-4 bg-white text-pink-500 py-2 w-full rounded-full font-medium flex items-center justify-center">
          <Plus size={16} className="mr-2" />
          充值
        </button>
      </div>
      
      <div className="bg-white m-4 rounded-xl p-4">
        <h3 className="font-medium mb-4">会员套餐</h3>
        
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-amber-100 p-2 rounded-full text-amber-500">
                <Gift size={20} />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">月度会员</h4>
                <p className="text-sm text-gray-500">¥ 28.00 / 月</p>
              </div>
            </div>
            <button className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm">
              购买
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-full text-purple-500">
                <Gift size={20} />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">季度会员</h4>
                <p className="text-sm text-gray-500">¥ 68.00 / 季</p>
              </div>
            </div>
            <button className="bg-purple-500 text-white px-4 py-1.5 rounded-full text-sm">
              购买
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full text-blue-500">
                <Gift size={20} />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">年度会员</h4>
                <p className="text-sm text-gray-500">¥ 198.00 / 年</p>
              </div>
            </div>
            <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm">
              购买
            </button>
          </div>
          <div className="mt-2 bg-blue-50 p-2 rounded text-blue-600 text-sm">
            超值推荐，相当于 ¥16.5/月
          </div>
        </div>
      </div>
      
      <div className="bg-white m-4 rounded-xl p-4">
        <h3 className="font-medium mb-4">消费记录</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-400">暂无消费记录</p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
