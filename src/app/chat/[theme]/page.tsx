import ChatInterface from '@/components/ChatInterface';
import { getThemeById } from '@/utils/prompts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ChatPageProps {
  params: {
    theme: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const theme = getThemeById(params.theme);

  if (!theme) {
    notFound();
  }

  return (
    <div >
      <div className="p-2 bg-white border-b">
        <Link
          href="/"
          className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <p>&lt; Back to Themes</p>
        </Link>
      </div>
      
      <ChatInterface themeId={params.theme} />
    </div>
  );
}