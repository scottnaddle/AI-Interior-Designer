
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { StyleSelector } from './components/StyleSelector';
import { ImageComparator } from './components/ImageComparator';
import { Chatbot } from './components/Chatbot';
import { generateInitialDesign, refineDesign, getChatResponse } from './services/geminiService';
import type { ChatMessage, DesignStyle } from './types';
import { DESIGN_STYLES } from './constants';
import { fileToBase64 } from './utils/fileUtils';

type AppStep = 'UPLOAD' | 'STYLE' | 'RESULT';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('UPLOAD');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<any>(null); // To hold the gemini chat instance

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    try {
      const base64Image = await fileToBase64(file);
      setOriginalImage(base64Image);
      setStep('STYLE');
    } catch (err) {
      setError('Failed to process image. Please try another file.');
      console.error(err);
    }
  }, []);

  const handleStyleSelect = useCallback(async (style: DesignStyle) => {
    if (!originalImage) return;
    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Generating your ${style.name} design... This can take a moment.`);
    try {
      const newImage = await generateInitialDesign(originalImage, style.name);
      setGeneratedImage(newImage);
      
      const initialChatMessage: ChatMessage = { role: 'model', text: `Here is your room in the ${style.name} style! What would you like to change? You can say things like "make the sofa green" or "add a plant on the table".` };
      setChatHistory([initialChatMessage]);
      
      const newChat = await getChatResponse([], ''); // Initialize chat
      setChat(newChat);
      setStep('RESULT');
    } catch (err) {
      setError('Failed to generate design. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [originalImage]);

  const handleChatSubmit = useCallback(async (message: string) => {
    if (!generatedImage || !chat) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage('Refining your design...');

    const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(updatedHistory);

    try {
      // Fork the process: one for image generation, one for chat response
      const imagePromise = refineDesign(generatedImage, message);
      
      const textPromise = chat.sendMessage({ message });

      const [newImage, chatResponse] = await Promise.all([imagePromise, textPromise]);

      setGeneratedImage(newImage);
      const modelResponse: ChatMessage = { role: 'model', text: chatResponse.text };
      setChatHistory(prev => [...prev, modelResponse]);

    } catch (err) {
      setError('Failed to refine design. Please try again.');
      console.error(err);
      const errorResponse: ChatMessage = { role: 'model', text: "I'm sorry, I couldn't make that change. Please try describing it differently." };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [generatedImage, chatHistory, chat]);

  const handleReset = useCallback(() => {
    setStep('UPLOAD');
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setChatHistory([]);
    setChat(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onReset={handleReset} showReset={step !== 'UPLOAD'} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {error && (
          <div className="w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {step === 'UPLOAD' && <ImageUpload onImageUpload={handleImageUpload} />}
        
        {step === 'STYLE' && (
          <div className="w-full flex flex-col items-center">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2 text-center">Your Room</h2>
             <p className="text-gray-500 mb-6 text-center">Now, select a style to transform it.</p>
            <img src={originalImage!} alt="Uploaded room" className="max-w-xl w-full rounded-lg shadow-lg mb-8" />
            <StyleSelector styles={DESIGN_STYLES} onStyleSelect={handleStyleSelect} />
          </div>
        )}

        {step === 'RESULT' && originalImage && generatedImage && (
          <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
            <div className="flex-grow lg:w-2/3">
              <ImageComparator
                originalImage={originalImage}
                generatedImage={generatedImage}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
              />
            </div>
            <div className="lg:w-1/3 flex flex-col">
              <Chatbot
                history={chatHistory}
                onSubmit={handleChatSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
