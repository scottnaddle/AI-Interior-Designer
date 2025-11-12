
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-8 w-8 text-indigo-500" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              AI 인테리어 디자인 변경
            </h1>
          </div>
          {showReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
