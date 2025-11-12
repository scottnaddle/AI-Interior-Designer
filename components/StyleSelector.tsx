import React from 'react';
import type { DesignStyle } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface StyleSelectorProps {
  styles: DesignStyle[];
  onStyleSelect: (style: DesignStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, onStyleSelect }) => {
  const handleSurpriseMe = () => {
    if (styles.length === 0) return;
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    onStyleSelect(randomStyle);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {styles.map((style) => (
          <button
            key={style.name}
            onClick={() => onStyleSelect(style)}
            className="group relative overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
          >
            <img src={style.imageUrl} alt={style.name} className="w-full h-32 md:h-40 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
              <h3 className="text-white text-lg font-semibold tracking-wide">{style.name}</h3>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center w-full">
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-2 text-sm text-gray-500">Or</span>
          </div>
        </div>
        <button
          onClick={handleSurpriseMe}
          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
        >
          <SparklesIcon className="w-5 h-5" />
          Surprise Me!
        </button>
      </div>
    </div>
  );
};
