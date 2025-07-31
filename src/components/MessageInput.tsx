'use client';

import { useState } from 'react';


interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onStopGeneration?: () => void;
  isGenerating?: boolean;
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  onStopGeneration,
  isGenerating = false 
}: MessageInputProps) {
  const [message, setMessage] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border bg-gray-100">
      <div className="flex items-end">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-3 py-2 border border-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={1}
            disabled={disabled}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>
        {isGenerating ? (
          <button
            type="button"
            onClick={onStopGeneration}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        )}
      </div>
    </form>
  );
}