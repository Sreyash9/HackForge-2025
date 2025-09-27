import React, { useEffect } from 'react';

interface SplashProps {
  onContinue: () => void;
}

export const SplashScreen: React.FC<SplashProps> = ({ onContinue }) => {
  useEffect(() => {
    const timer = setTimeout(onContinue, 1800); // 1.8 seconds
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-200 via-white to-blue-200">
      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-3xl shadow-2xl mb-6 animate-bounce-slow">
          <svg className="w-24 h-24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" fill="#22c55e" stroke="#166534" strokeWidth="2" />
            <path d="M24 10v10m0 0l-6 6m6-6l6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 38v-10m0 0l-6-6m6 6l6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="24" r="4" fill="#fff" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-green-800 tracking-tight drop-shadow mb-2">Smart Sort</h1>
        <p className="text-lg text-gray-600 font-medium">Smart Waste Assistant</p>
      </div>
    </div>
  );
};
