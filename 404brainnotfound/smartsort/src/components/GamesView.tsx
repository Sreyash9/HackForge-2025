import React from 'react';
import { QuizGame } from './QuizGame';
import { BinSortGame } from './BinSortGame';
import { HelpCircle, Boxes, Sparkles } from 'lucide-react';

export const GamesView: React.FC = () => {
  const [tab, setTab] = React.useState<'quiz' | 'binsort'>('quiz');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl">
      <h1 className="text-5xl font-extrabold text-green-700 mb-8 flex items-center justify-center gap-3 drop-shadow-lg">
        <Sparkles className="w-10 h-10 text-yellow-400" />
        Smart Sort Games
      </h1>
      <div className="flex justify-center gap-8 mb-10">
        <button
          className={`flex flex-col items-center px-8 py-4 rounded-2xl font-semibold border-4 shadow transition-all duration-200 ${tab === 'quiz' ? 'border-green-600 bg-green-100 scale-105' : 'border-transparent bg-white hover:bg-green-50'}`}
          onClick={() => setTab('quiz')}
        >
          <HelpCircle className="w-10 h-10 mb-2 text-green-600" />
          <span className="text-lg">Quiz</span>
        </button>
        <button
          className={`flex flex-col items-center px-8 py-4 rounded-2xl font-semibold border-4 shadow transition-all duration-200 ${tab === 'binsort' ? 'border-blue-600 bg-blue-100 scale-105' : 'border-transparent bg-white hover:bg-blue-50'}`}
          onClick={() => setTab('binsort')}
        >
          <Boxes className="w-10 h-10 mb-2 text-blue-600" />
          <span className="text-lg">Bin Sorting</span>
        </button>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          {tab === 'quiz' && (
            <div className="mb-8">
              <img src="https://cdn-icons-png.flaticon.com/512/2910/2910791.png" alt="Quiz" className="mx-auto mb-4 w-24 h-24" />
              <QuizGame />
            </div>
          )}
          {tab === 'binsort' && (
            <div className="mb-8">
              <img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" alt="Bin Sorting" className="mx-auto mb-4 w-24 h-24" />
              <BinSortGame />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
