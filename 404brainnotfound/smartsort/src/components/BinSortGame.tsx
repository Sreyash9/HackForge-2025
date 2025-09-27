import React, { useState } from 'react';

const wasteItems = [
  {
    name: 'Plastic Bottle',
    bin: 'Recyclable',
    img: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png', // plastic bottle
  },
  {
    name: 'Banana Peel',
    bin: 'Organic',
    img: 'https://cdn-icons-png.flaticon.com/512/766/766114.png', // banana peel
  },
  {
    name: 'Broken Glass',
    bin: 'Landfill',
    img: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', // broken glass
  },
  {
    name: 'Newspaper',
    bin: 'Recyclable',
    img: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png', // newspaper
  },
  {
    name: 'Eggshells',
    bin: 'Organic',
    img: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', // eggshells
  },
];
const bins = [
  {
    name: 'Recyclable',
    color: 'bg-blue-100 border-blue-400 text-blue-700',
    icon: '♻️',
  },
  {
    name: 'Organic',
    color: 'bg-green-100 border-green-400 text-green-700',
    icon: '🌱',
  },
  {
    name: 'Landfill',
    color: 'bg-gray-200 border-gray-400 text-gray-700',
    icon: '🗑️',
  },
];

export const BinSortGame: React.FC = () => {
  const [selectedBins, setSelectedBins] = useState<(string | null)[]>(Array(wasteItems.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number, bin: string) => {
    const copy = [...selectedBins];
    copy[idx] = bin;
    setSelectedBins(copy);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const correct = selectedBins.filter((bin, i) => bin === wasteItems[i].bin).length;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-2xl font-extrabold mb-4 text-green-700 flex items-center gap-2">Bin Sorting Game <span>🗑️</span></h2>
      <p className="mb-4 text-gray-700">Select the correct bin for each waste item:</p>
      <div className="space-y-6 mb-6">
        {wasteItems.map((item, idx) => (
          <div key={item.name} className="flex items-center gap-6 bg-gray-50 rounded-lg p-4 shadow-sm">
            <span className="font-semibold text-lg w-40">{item.name}</span>
            <div className="flex gap-3">
              {bins.map(bin => (
                <button
                  key={bin.name}
                  className={`flex flex-col items-center px-4 py-2 rounded-xl border-2 font-semibold text-base transition-all duration-150 shadow-sm ${selectedBins[idx] === bin.name ? `${bin.color} scale-105 ring-2 ring-green-400` : 'bg-white border-gray-300 hover:bg-green-50'}`}
                  onClick={() => handleSelect(idx, bin.name)}
                  disabled={showResult}
                  style={{ minWidth: 80 }}
                >
                  <span className="text-2xl mb-1">{bin.icon}</span>
                  {bin.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!showResult && (
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={selectedBins.includes(null)}>
          Submit
        </button>
      )}
      {showResult && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-gray-800 mb-2">You got {correct} out of {wasteItems.length} correct!</p>
          {correct === wasteItems.length && (() => {
            const today = new Date().toISOString().slice(0, 10);
            const quizPerfect = localStorage.getItem('quiz_perfect_today');
            const lastReward = localStorage.getItem('games_both_perfect_reward_date');
            if (quizPerfect === today && lastReward !== today) {
              return <div className="text-green-700 font-semibold mb-2">🎉 Both games perfect! You earned 5 coins for today.</div>;
            } else if (quizPerfect !== today) {
              return <div className="text-yellow-700 font-semibold mb-2">Complete the Quiz perfectly today to earn 5 coins!</div>;
            }
            return null;
          })()}
          <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded" onClick={() => { setSelectedBins(Array(wasteItems.length).fill(null)); setShowResult(false); }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
