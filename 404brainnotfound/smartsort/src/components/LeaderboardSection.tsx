import React, { useEffect, useState } from 'react';

// Simulate leaderboard data (in a real app, this would come from a backend)
const mockLeaderboard = [
  { name: 'You', coins: 0 },
  { name: 'Aarav', coins: 180 },
  { name: 'Priya', coins: 150 },
  { name: 'Rohan', coins: 120 },
  { name: 'Simran', coins: 100 },
];

export const LeaderboardSection: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);

  useEffect(() => {
    // Get user's coins from localStorage
    const coins = parseInt(localStorage.getItem('smart_sort_coins') || '0', 10);
    // Update leaderboard with user's coins
    const updated = [
      { name: 'You', coins },
      ...mockLeaderboard.filter(u => u.name !== 'You'),
    ].sort((a, b) => b.coins - a.coins);
    setLeaderboard(updated);
  }, []);

  const topUser = leaderboard[0];
  const isTopUser = topUser.name === 'You';

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-8 flex items-center gap-3 justify-center">
        🏆 Leaderboard
      </h1>
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <table className="w-full mb-6">
          <thead>
            <tr className="text-lg text-gray-700 border-b">
              <th className="py-2">Rank</th>
              <th className="py-2">User</th>
              <th className="py-2">Coins</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={user.name} className={user.name === 'You' ? 'bg-yellow-100 font-bold' : ''}>
                <td className="py-2">{idx + 1}</td>
                <td className="py-2">{user.name} {idx === 0 && '👑'}</td>
                <td className="py-2">{user.coins}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isTopUser ? (
          <div className="text-green-700 font-bold text-xl mt-4">
            🎉 Congratulations! You are the top user and win a <span className="underline">free eco-friendly tote bag</span>!
          </div>
        ) : (
          <div className="text-gray-700 mt-4">
            Earn more coins to reach the top and win a prize!
          </div>
        )}
      </div>
    </div>
  );
};
