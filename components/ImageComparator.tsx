
import React, { useState, useRef, useEffect } from 'react';

interface ImageComparatorProps {
  originalImage: string;
  generatedImage: string;
  isLoading: boolean;
  loadingMessage: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, generatedImage, isLoading, loadingMessage }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(parseInt(e.target.value, 10));
  };
  
  const handleMove = (clientX: number) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPos(percent);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const stopMoving = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('mouseup', stopMoving);
    window.removeEventListener('touchend', stopMoving);
  };

  const startMoving = (e: React.MouseEvent | React.TouchEvent) => {
     window.addEventListener('mousemove', handleMouseMove);
     window.addEventListener('touchmove', handleTouchMove);
     window.addEventListener('mouseup', stopMoving);
     window.addEventListener('touchend', stopMoving);
  };


  return (
    <div className="w-full relative select-none rounded-xl overflow-hidden shadow-2xl bg-gray-200 aspect-video" ref={containerRef}>
      <img src={originalImage} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={generatedImage} alt="Generated" className="absolute inset-0 w-full h-full object-cover" />
      </div>

       {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 transition-opacity duration-300">
          <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-lg animate-pulse">{loadingMessage}</p>
        </div>
      )}

      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `calc(${sliderPos}% - 2px)` }}
      >
        <div className="w-1 h-full bg-white shadow-md"></div>
        <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center cursor-ew-resize"
            onMouseDown={startMoving}
            onTouchStart={startMoving}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>
       <div className="absolute top-2 left-4 px-3 py-1 bg-black bg-opacity-50 text-white text-sm font-semibold rounded-full">BEFORE</div>
       <div className="absolute top-2 right-4 px-3 py-1 bg-black bg-opacity-50 text-white text-sm font-semibold rounded-full">AFTER</div>
    </div>
  );
};
