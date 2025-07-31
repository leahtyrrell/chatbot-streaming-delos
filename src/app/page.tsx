import ThemeSelector from '@/components/ThemeSelector';
// import Link from 'next/link';


export default function Home() {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="bg-sky-100 p-10 shadow-md">
          <h1 className="text-7xl font-semibold mb-4">
            Daily Needs Chat Assistant
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Choose your AI assistant to make your everyday tasks just a little bit easier. 
          </p>
        </div>
        <ThemeSelector />
      </div>
    </div>
  );
}