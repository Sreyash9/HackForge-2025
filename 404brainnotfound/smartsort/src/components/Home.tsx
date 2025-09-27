
import { Gamepad2, MapPin, Search, Image as ImageIcon, Info } from 'lucide-react';
import React, { useRef, useState } from 'react';

export const Home: React.FC<{
  onGames: () => void;
  onMap: () => void;
  onSearch: (query: string) => void;
  onImageClassify: (file: File) => void;
  infoResult?: string;
  imageResult?: string;
}> = ({ onGames, onMap, onSearch, onImageClassify, infoResult, imageResult }) => {
  const [search, setSearch] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageClassify(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-green-700 drop-shadow-lg tracking-tight">Welcome to EcoSort</h1>

      {/* Games & Map Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform">
          <Gamepad2 className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Games</h2>
          <p className="text-gray-600 mb-4 text-center">Test your waste sorting knowledge with fun and interactive games!</p>
          <button onClick={onGames} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">Play Now</button>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform">
          <MapPin className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Dumpyard Locations</h2>
          <p className="text-gray-600 mb-4 text-center">Find the nearest dumpyard or recycling center on the map.</p>
          <button onClick={onMap} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">View Map</button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-8 h-8 text-green-500" />
          <h2 className="text-2xl font-bold">Search Waste Information</h2>
        </div>
        <div className="flex w-full max-w-xl mb-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for waste types or info (e.g., plastic, battery, glass)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 text-lg"
          />
          <button
            onClick={() => onSearch(search)}
            className="bg-green-600 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-green-700 transition text-lg"
          >
            Search
          </button>
        </div>
        {infoResult && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded w-full max-w-xl">
            <div className="text-gray-800 flex items-center"><Info className="w-5 h-5 mr-2 text-green-500" />{infoResult}</div>
          </div>
        )}
      </div>

      {/* Image Classification Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          <ImageIcon className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Identify Waste by Image</h2>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={handleImageUpload}
          className="mb-4"
        />
        {imageResult && (
          <div className="mt-2 bg-blue-50 border-l-4 border-blue-400 p-4 rounded w-full max-w-xl">
            <div className="text-gray-800 flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-blue-500" />{imageResult}</div>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow p-8 mt-8 text-center">
        <h3 className="text-2xl font-bold mb-2 text-green-700">About EcoSort</h3>
        <p className="text-gray-600 text-lg">EcoSort helps you sort waste, find recycling locations, and learn about sustainable disposal. Play games, search for info, or use AI to identify waste by image!</p>
      </div>
    </div>
  );
};
