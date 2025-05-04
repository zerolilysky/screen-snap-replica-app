
import React from 'react';

const MatchOptions: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 mb-6">
      <div className="bg-quick-match rounded-xl p-4 flex flex-col">
        <h3 className="text-white font-bold text-lg mb-1">快速匹配</h3>
        <p className="text-white text-xs mb-2">在线一键畅聊</p>
        <p className="text-white text-xs">免费1次</p>
        <div className="mt-auto">
          <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center">
            <span className="text-app-pink text-lg font-bold">😄</span>
          </div>
        </div>
      </div>
      
      <div className="bg-nearby-match rounded-xl p-4 flex flex-col">
        <h3 className="text-white font-bold text-lg mb-1">附近匹配</h3>
        <p className="text-white text-xs mb-2">寻找附近缘分</p>
        <p className="text-white text-xs">免费5次</p>
        <div className="mt-auto">
          <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center">
            <span className="text-app-blue text-lg font-bold">🌍</span>
          </div>
        </div>
      </div>
      
      <div className="bg-voice-match rounded-xl p-4 flex flex-col">
        <h3 className="text-white font-bold text-lg mb-1">声音匹配</h3>
        <p className="text-white text-xs mb-2">听见心动的声音</p>
        <p className="text-white text-xs">免费5次</p>
        <div className="mt-auto">
          <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center">
            <span className="text-app-orange text-lg font-bold">😊</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchOptions;
