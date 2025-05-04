
import React from 'react';

interface PromoBannerProps {
  text: string;
  bg?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ text, bg = "bg-promo" }) => {
  return (
    <div className={`${bg} rounded-xl mx-4 mb-4 relative p-4 overflow-hidden h-16`}>
      <button className="absolute top-2 right-2 text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="font-bold text-2xl flex items-center">
        {text}
      </div>
    </div>
  );
};

export default PromoBanner;
