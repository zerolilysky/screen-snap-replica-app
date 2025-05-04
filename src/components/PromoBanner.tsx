
import React from 'react';
import { cn } from '../lib/utils';

interface PromoBannerProps {
  text: string;
  className?: string;
  imageUrl?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ text, className, imageUrl }) => {
  return (
    <div className={cn("py-3 px-4 my-2 relative overflow-hidden", className)}>
      <div className="flex justify-center items-center relative z-10">
        <span className="text-xl font-bold">{text}</span>
      </div>
      
      {/* Decorative elements */}
      {!imageUrl && (
        <>
          <div className="absolute top-2 left-2 w-6 h-6 bg-pink-200 rounded-full opacity-80"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-yellow-200 rounded-full opacity-80"></div>
          <div className="absolute top-1/2 right-8 w-5 h-5 bg-blue-200 rounded-full opacity-80"></div>
        </>
      )}
      
      {/* Background image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Promo background" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}
      
      {/* Close button */}
      <button className="absolute top-1 right-1 bg-white bg-opacity-50 rounded-full p-1">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Decorative elements like butterflies and flowers */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-8 h-8 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 21l-5.2-5.2c-1.4-1.4-1.4-3.6 0-5l.7-.7 9.5 9.5-.7.7c-1.4 1.4-3.6 1.4-5 0zm3-3l-9.5-9.5.7-.7c1.4-1.4 3.6-1.4 5 0l5.2 5.2c1.4 1.4 1.4 3.6 0 5l-.7.7z" />
        </svg>
      </div>
      
      <div className="absolute right-10 bottom-0">
        <svg className="w-6 h-6 text-green-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c4-5 10-5.4 10-13 0-3.9-3.1-7-7-7s-7 3.1-7 7c0 7.6 6 8 4 13z" />
        </svg>
      </div>
    </div>
  );
};

export default PromoBanner;
