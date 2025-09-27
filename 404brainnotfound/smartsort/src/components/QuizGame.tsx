import React, { useState } from 'react';

const quizQuestions = [
  {
    question: 'Plastic bottles should be disposed of in which bin?',
    options: ['Recyclable', 'Organic', 'Landfill'],
    answer: 'Recyclable',
    info: 'Plastic bottles are recyclable and should go in the recycling bin.'
  },
  {
    question: 'Banana peels belong in which bin?',
    options: ['Recyclable', 'Organic', 'Landfill'],
    answer: 'Organic',
    info: 'Banana peels are organic waste and should go in the compost/organic bin.'
  },
  {
    question: 'Broken glass should be disposed of in which bin?',
    options: ['Recyclable', 'Organic', 'Landfill'],
    answer: 'Landfill',
    info: 'Broken glass is not recyclable in most places and should go in the landfill bin.'
  }
];

export const QuizGame: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [score, setScore] = useState(0);

  const q = quizQuestions[current];

  const handleOption = (opt: string) => {
    setSelected(opt);
    setShowInfo(true);
    if (opt === q.answer) setScore(score + 1);
  };

  const next = () => {
    setSelected(null);
    setShowInfo(false);
    setCurrent(current + 1);
  };

  if (current >= quizQuestions.length) {
    // Mark quiz perfect for today
    if (score === quizQuestions.length) {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('quiz_perfect_today', today);
    }
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="mb-2">Your score: {score} / {quizQuestions.length}</p>
        {score === quizQuestions.length && <div className="text-green-700 font-semibold mb-2">🎉 Perfect! Now complete Bin Sorting perfectly to earn 5 coins for today.</div>}
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={() => { setCurrent(0); setScore(0); }}>Restart</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Quiz</h2>
      <p className="mb-4 font-semibold">{q.question}</p>
      <div className="flex flex-col gap-3 mb-4">
        {q.options.map(opt => (
          <button
            key={opt}
            className={`px-4 py-2 rounded border ${selected === opt ? (opt === q.answer ? 'bg-green-200 border-green-600' : 'bg-red-200 border-red-600') : 'bg-gray-50 border-gray-300 hover:bg-green-50'}`}
            disabled={!!selected}
            onClick={() => handleOption(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {showInfo && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-gray-800">{q.info}</p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={next}>Next</button>
        </div>
      )}
    </div>
  );
};
