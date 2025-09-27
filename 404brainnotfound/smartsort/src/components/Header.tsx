import React from 'react';


type ViewType = 'home' | 'search' | 'learn' | 'games' | 'map' | 'image' | 'wastesearch' | 'streak' | 'report' | 'leaderboard' | 'rewards';
interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white/90 shadow-lg sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-2xl shadow-md">
              {/* Smart Sort Logo SVG */}
              <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" fill="#22c55e" stroke="#166534" strokeWidth="2" />
                <path d="M24 10v10m0 0l-6 6m6-6l6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 38v-10m0 0l-6-6m6 6l6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="24" cy="24" r="4" fill="#fff" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-green-800 tracking-tight drop-shadow">Smart Sort</h1>
              <p className="text-xs text-gray-500 font-medium">Smart Waste Assistant</p>
            </div>
          </div>
          <nav className="flex space-x-2 md:space-x-6">
            <button
              onClick={() => onViewChange('home')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={() => onViewChange('learn')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'learn'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">Learn</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};