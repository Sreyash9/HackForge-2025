import React from 'react';
import { Gamepad2, MapPin, Image as ImageIcon, Search as SearchIcon, Flame, Gift } from 'lucide-react';


interface HomeSimpleProps {
  onNavigate: (
    view: 'games' | 'map' | 'search' | 'image' | 'wastesearch' | 'streak' | 'rewards' | 'report' | 'leaderboard'
  ) => void;
}

export const HomeSimple: React.FC<HomeSimpleProps> = ({ onNavigate }) => {
  const options: { name: string; icon: JSX.Element; view: 'games' | 'map' | 'search' | 'image' | 'wastesearch' | 'streak' | 'rewards' | 'report' | 'leaderboard' }[] = [
    { name: 'Games', icon: <Gamepad2 className="w-8 h-8 mr-2 text-green-600" />, view: 'games' },
    { name: 'Dumpyard Map', icon: <MapPin className="w-8 h-8 mr-2 text-blue-600" />, view: 'map' },
    { name: 'Image Classifier', icon: <ImageIcon className="w-8 h-8 mr-2 text-purple-600" />, view: 'image' },
    { name: 'Waste Search', icon: <SearchIcon className="w-8 h-8 mr-2 text-yellow-500" />, view: 'wastesearch' },
    { name: 'Streak', icon: <Flame className="w-8 h-8 mr-2 text-orange-500" />, view: 'streak' },
    { name: 'Rewards', icon: <Gift className="w-8 h-8 mr-2 text-yellow-600" />, view: 'rewards' },
    { name: 'Report', icon: <span className="w-8 h-8 mr-2 text-red-600 text-3xl">📝</span>, view: 'report' },
  { name: 'Leaderboard', icon: <span className="w-8 h-8 mr-2 text-blue-600 text-3xl">🏆</span>, view: 'leaderboard' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <h1 className="text-5xl font-extrabold text-green-700 mb-10 drop-shadow-lg tracking-tight">Smart Sort</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-2xl">
        {options.map(opt => (
          <button
            key={opt.name}
            onClick={() => onNavigate(opt.view)}
            className="flex flex-col items-center justify-center bg-white/90 rounded-3xl shadow-2xl p-10 text-2xl font-extrabold text-gray-800 hover:bg-gradient-to-br hover:from-green-100 hover:to-blue-100 hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-green-300 focus:outline-none focus:ring-4 focus:ring-green-200"
            style={{ minHeight: 180 }}
          >
            <span className="mb-4">{opt.icon}</span>
            <span>{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
