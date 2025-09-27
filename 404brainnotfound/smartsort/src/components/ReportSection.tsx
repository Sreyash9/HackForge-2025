import React, { useRef, useState } from 'react';

export const ReportSection: React.FC = () => {
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!image) {
      setError('Please upload an image of the garbage area.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the address of the garbage overflow.');
      return;
    }
    // Simulate report submission and coin award
    setSubmitted(true);
    // Award 5 coins
    const coins = parseInt(localStorage.getItem('smart_sort_coins') || '0', 10) + 5;
    localStorage.setItem('smart_sort_coins', coins.toString());
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-8 flex items-center gap-3 justify-center">
          📝 Report Overflowing Garbage
        </h1>
        <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
          <div className="text-2xl font-bold text-green-700 mb-4">Thank you for your report!</div>
          <div className="text-yellow-700 text-lg font-semibold mb-2">You have received 5 coins.</div>
          <div className="text-gray-600">Our team will review the report and take necessary action.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-green-700 mb-8 flex items-center gap-3 justify-center">
        📝 Report Overflowing Garbage
      </h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <label className="mb-4 w-full">
          <span className="block text-lg font-semibold text-gray-700 mb-2">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <label className="mb-4 w-full">
          <span className="block text-lg font-semibold text-gray-700 mb-2">Address of Garbage Overflow</span>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter address"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <button
          type="submit"
          className="bg-yellow-500 text-white px-8 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};
