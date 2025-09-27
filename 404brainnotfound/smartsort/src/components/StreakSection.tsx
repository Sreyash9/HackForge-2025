import React, { useEffect, useState } from 'react';

// For demo, use localStorage to persist streak
const getToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
};

export const StreakSection: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('waste_streak') || '0', 10);
    const savedDate = localStorage.getItem('waste_streak_date');
    setStreak(savedStreak);
    setLastDate(savedDate);
    if (savedDate && savedDate !== getToday()) {
      const diff = (new Date(getToday()).getTime() - new Date(savedDate).getTime()) / (1000*60*60*24);
      if (diff > 1) setBroken(true);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        handleUpload();
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    if (fileInput.current) {
      fileInput.current.value = '';
      fileInput.current.click();
    }
  };

  const handleUpload = () => {
    const today = getToday();
    if (lastDate === today) {
      setMessage('You already uploaded today!');
      return;
    }
    let newStreak = streak;
    if (lastDate && (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000*60*60*24) === 1) {
      newStreak = streak + 1;
    } else {
      newStreak = 1;
    }
    setStreak(newStreak);
    setLastDate(today);
    setBroken(false);
    setMessage('Streak updated!');
    localStorage.setItem('waste_streak', newStreak.toString());
    localStorage.setItem('waste_streak_date', today);
  };

  const handleReset = () => {
    setStreak(0);
    setLastDate(null);
    setBroken(false);
    setMessage('Streak reset. Start again!');
    setPreview(null);
    localStorage.removeItem('waste_streak');
    localStorage.removeItem('waste_streak_date');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-orange-600 mb-6">Streak Tracker</h1>
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <div className="text-2xl font-semibold mb-2">🔥 {streak} Day Streak</div>
        {broken && <div className="text-red-500 mb-2">Your streak was broken! Start again.</div>}
        <div className="mb-4 text-gray-600">Upload a photo as proof of waste segregation every day to maintain your streak. Missing a day will break your streak!</div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold mb-2 flex items-center gap-2"
          onClick={openCamera}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" /><circle cx="12" cy="13" r="4" /></svg>
          Open Camera & Upload
        </button>
        {preview && (
          <img src={preview} alt="Proof" className="w-40 h-40 object-contain rounded-lg border mb-4 mt-2" />
        )}
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded mt-2 text-sm"
          onClick={handleReset}
        >
          Reset Streak
        </button>
        {message && <div className="mt-3 text-green-600">{message}</div>}
        <div className="mt-6 text-gray-400 text-xs">Last upload: {lastDate || 'Never'}</div>
      </div>
    </div>
  );
};
