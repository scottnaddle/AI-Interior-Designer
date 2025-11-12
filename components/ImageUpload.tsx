
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl text-center flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Transform Your Space</h2>
      <p className="text-lg text-gray-500 mb-8">Upload a photo of your room to get started.</p>
      
      <div
        className={`w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="mx-auto h-16 w-16 text-gray-400">
                <UploadIcon />
            </div>
            <p className="text-gray-600">
                <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, or WEBP</p>
        </div>
      </div>
    </div>
  );
};
