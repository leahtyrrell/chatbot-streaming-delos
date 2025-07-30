import ThemeSelector from '@/components/ThemeSelector';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Daily Needs Chat Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your AI assistant to make your everyday tasks just a little bit easier. 
          </p>
        </div>
        
        <ThemeSelector />
        
        {/* <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by OpenAI GPT-3.5 Turbo with real-time streaming responses
          </p>
        </div> */}
      </div>
    </div>
  );
}