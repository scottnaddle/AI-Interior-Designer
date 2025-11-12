
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatbotProps {
  history: ChatMessage[];
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ history, onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[70vh] max-h-[600px]">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Refine Your Design</h3>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-lg'
                  : 'bg-gray-100 text-gray-800 rounded-bl-lg'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && history.length > 0 && history[history.length - 1].role === 'user' && (
             <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                 </div>
                 <div className="bg-gray-100 text-gray-800 rounded-bl-lg max-w-xs md:max-w-sm px-4 py-2 rounded-2xl">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Make the walls light blue"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 flex-shrink-0 bg-indigo-500 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5"/>
          </button>
        </form>
      </div>
    </div>
  );
};
