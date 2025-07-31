'use client';

import { useState, useRef } from 'react';
import { Message, StreamResponse } from '@/types/chat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { getThemeById } from '@/utils/prompts';

interface ChatInterfaceProps {
  themeId: string;
}

const bgColors: Record<string,string> ={ 
  red: 'bg-red-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  orange: 'bg-orange-50',
  yellow: 'bg-yellow-50'
}

const headerColors: Record<string,string> ={ 
  red: 'bg-red-200',
  blue: 'bg-blue-200',
  green: 'bg-green-200',
  orange: 'bg-orange-200',
  yellow: 'bg-yellow-200'
}

export default function ChatInterface({ themeId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const theme = getThemeById(themeId);

  const handleSendMessage = async (content: string) => {
    if (!theme) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsGenerating(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          themeId: themeId,
          conversationHistory: messages.slice(-6), // Keep last 6 messages for context
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed: StreamResponse = JSON.parse(data);
              
              if (parsed.finished) {
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                );
                setIsGenerating(false);
                break;
              }
              
              if (parsed.content) {
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: msg.content + parsed.content }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Error:', error);
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: 'Sorry, there was an error processing your request.',
            role: 'assistant',
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setIsLoading(false);
      
      // Remove streaming indicator from last message
      setMessages(prev => 
        prev.map(msg => ({ ...msg, isStreaming: false }))
      );
    }
  };

  if (!theme) {
    return <div className="p-4">Theme not found</div>;
  }

  return (
    <div className={`flex flex-col h-screen ${bgColors[theme.color]}`}>
      {/* Header */}
      <div className={`p-4 ${headerColors[theme.color]} text-gray-600 shadow-md`}>
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-semibold">{theme.name}</h1>
            <p className="text-sm opacity-90">{theme.description}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        onStopGeneration={handleStopGeneration}
        isGenerating={isGenerating}
      />
    </div>
  );
}