export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatTheme {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  color: string;
}

export interface StreamResponse {
  content: string;
  finished: boolean;
}

