
'use client';

import { chatThemes } from '@/utils/prompts';
import Link from 'next/link';

const borderColors: Record<string, string> = {
  red: 'border-red-500',
  blue: 'border-blue-500',
  green: 'border-green-500',
  orange: 'border-orange-500',
  yellow: 'border-yellow-500'
}

const bgColors: Record<string,string> ={ 
  red: 'bg-red-100',
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  orange: 'bg-orange-100',
  yellow: 'bg-yellow-100'
}

const bgHoverColors: Record<string,string> ={ 
  red: 'hover:bg-red-200',
  blue: 'hover:bg-blue-200',
  green: 'hover:bg-green-200',
  orange: 'hover:bg-orange-200',
  yellow: 'hover:bg-yellow-200'
}

const textColors: Record<string,string> = {
  red: 'text-red-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  yellow: 'text-yellow-600'
}


export default function ThemeSelector() {
  return (
  <div className="flex justify-center p-3">
    <div className="grid grid-cols-1 gap-4 p-3 w-1/2">
        {chatThemes.map((theme) => (
          <Link
            key={theme.id}
            href={`/chat/${theme.id}`}
            className={`p-1 text-center block border rounded ${borderColors[theme.color]} ${bgColors[theme.color]} ${bgHoverColors[theme.color]} shadow-sm hover:shadow-xl`}
          >
                <h3 className="text-4xl font-bold text-gray-700 m-2">
                  {theme.name}
                </h3>
                <p className="text-gray-600">
                  {theme.description}
                </p>
          </Link>
        ))}
      </div>
    </div> 
  );
}