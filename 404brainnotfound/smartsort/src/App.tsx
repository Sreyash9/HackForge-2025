import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchView } from './components/SearchView';
import { LearnView } from './components/LearnView';
import { GamesView } from './components/GamesView';
import { SignUp } from './components/SignUp';
import { SignIn } from './components/SignIn';
import { HomeSimple } from './components/HomeSimple';
import { WasteSearch } from './components/WasteSearch';
import { ImageClassifier } from './components/ImageClassifier';
import { DumpyardMap } from './components/DumpyardMap';
import { StreakSection } from './components/StreakSection';
import { SplashScreen } from './components/SplashScreen';
import { ReportSection } from './components/ReportSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { RewardsSection } from './components/RewardsSection';

type MainView = 'home' | 'search' | 'learn' | 'games' | 'map' | 'image' | 'wastesearch' | 'streak' | 'report' | 'leaderboard' | 'rewards';
function App() {
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');
  const [authenticated, setAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {showSplash ? (
        <SplashScreen onContinue={() => setShowSplash(false)} />
      ) : !authenticated ? (
        <main>
          {authView === 'signUp' && (
            <SignUp 
              onSignInClick={() => setAuthView('signIn')}
              onAuthSuccess={() => setAuthenticated(true)}
            />
          )}
          {authView === 'signIn' && (
            <SignIn 
              onSignUpClick={() => setAuthView('signUp')}
              onAuthSuccess={() => setAuthenticated(true)}
            />
          )}
        </main>
      ) : (
        <>
          <Header currentView={currentView} onViewChange={setCurrentView} />
          {/* Back button for all non-home views */}
          {currentView !== 'home' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
              <button
                className="flex items-center text-green-700 font-semibold hover:underline mb-4"
                onClick={() => setCurrentView('home')}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
            </div>
          )}
          <main>
            {currentView === 'home' && (
              <HomeSimple
                onNavigate={setCurrentView}
              />
            )}
            {currentView === 'streak' && <StreakSection />}
            {currentView === 'wastesearch' && <WasteSearch />}
            {currentView === 'search' && <SearchView />}
            {currentView === 'learn' && <LearnView />}
            {currentView === 'games' && <GamesView />}
            {currentView === 'map' && <DumpyardMap />}
            {currentView === 'image' && <ImageClassifier />}
            {currentView === 'report' && <ReportSection />}
            {currentView === 'leaderboard' && <LeaderboardSection />}
            {currentView === 'rewards' && <RewardsSection />}
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-200 via-white to-blue-200 border-t border-gray-200 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-green-500 p-3 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-green-800 tracking-tight drop-shadow">Smart Sort</span>
            </div>
            <p className="text-gray-700 mb-4 text-lg font-medium">Making waste management simple and accessible for everyone</p>
            <div className="flex justify-center space-x-8 text-base text-gray-600 font-semibold">
              <span>🌍 Protecting our planet</span>
              <span>♻️ One item at a time</span>
              <span>💚 For a sustainable future</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;