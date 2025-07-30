
'use client';

import { chatThemes } from '@/utils/prompts';
import Link from 'next/link';
import '@/app/globals.css'

export default function ThemeSelector() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {chatThemes.map((theme) => (
        <Link
          key={theme.id}
          href={`/chat/${theme.id}`}
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${theme.color} text-white text-2xl mb-4`}></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {theme.name}
          </h3>
          <p className="text-gray-600 theme-description">
            {theme.description}
          </p>
        </Link>
      ))}
    </div>
  );
}