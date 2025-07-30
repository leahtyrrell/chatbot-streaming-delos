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
    <div className="h-screen flex flex-col">
      {/* Back button */}
      <div className="p-2 bg-white border-b">
        <Link
          href="/"
          className="no-underline inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Back to themes
        </Link>
      </div>
      
      <ChatInterface themeId={params.theme} />
    </div>
  );
}