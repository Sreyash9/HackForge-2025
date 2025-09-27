import React, { useEffect, useState } from 'react';

export const RewardsSection: React.FC = () => {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    // Try to get coins from localStorage, fallback to 0
    const stored = localStorage.getItem('smart_sort_coins');
    setCoins(stored ? parseInt(stored, 10) : 0);
    // Listen for coin changes (simulate live update)
    const interval = setInterval(() => {
      const updated = localStorage.getItem('smart_sort_coins');
      setCoins(updated ? parseInt(updated, 10) : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-yellow-600 mb-8 flex items-center gap-3 justify-center">
        <span role="img" aria-label="coin">🪙</span> Rewards
      </h1>
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <div className="text-3xl font-extrabold text-yellow-700 mb-2 flex items-center gap-2">
          <span role="img" aria-label="coin">🪙</span> {coins} Coins
        </div>
        <div className="mb-4 text-gray-600">Earn coins by playing games, maintaining streaks, and more!</div>
        {coins >= 200 ? (
          <div className="text-green-700 font-bold text-xl mt-4">
            🎉 Congratulations! You have collected 200 coins and unlocked a <span className="underline">discount coupon</span>!<br/>
            <span className="text-base font-normal text-gray-700">This coupon can be used to reduce the fees you pay to the municipality for waste collection from your home.</span>
          </div>
        ) : (
          <>
            <div className="text-gray-700 mt-4">
              Collect 200 coins to unlock a discount coupon for municipality waste collection fees.<br/>
            </div>
            <div className="mt-2 text-lg font-semibold text-yellow-700">
              Coins left to reach 200: {200 - coins}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
