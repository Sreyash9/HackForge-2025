
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { wasteItems } from '../data/wasteData';

export const WasteSearch: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<any | null>(null);

  const handleSearch = () => {
    const key = search.trim().toLowerCase();
    // Try to find by name or id
    const found = wasteItems.find(item =>
      item.name.toLowerCase().includes(key) ||
      (item.id && item.id.replace(/[-_]/g, ' ').toLowerCase().includes(key))
    );
    if (found) {
      setSearchResult(found);
    } else {
      // Generate plausible info based on keywords
      let category = 'General Waste';
      let disposalMethod = 'Check local guidelines';
      let instructions = ['Dispose of responsibly.'];
      let tips = ['Reduce, reuse, recycle when possible.'];
      let environmentalImpact = 'Proper disposal helps keep the environment clean.';
      const s = key;
      if (s.includes('plastic')) {
        category = 'Plastic';
        disposalMethod = 'Recycling Bin';
        instructions = ['Empty and clean before recycling.', 'Place in recycling bin.'];
        tips = ['Check for recycling symbols.', 'Avoid mixing with food waste.'];
        environmentalImpact = 'Recycling plastic reduces landfill waste and pollution.';
      } else if (s.includes('banana') || s.includes('peel') || s.includes('food')) {
        category = 'Organic';
        disposalMethod = 'Compost Bin';
        instructions = ['Place in compost bin or green waste collection.'];
        tips = ['Composting enriches soil and reduces methane emissions.'];
        environmentalImpact = 'Composting organic waste is eco-friendly.';
      } else if (s.includes('glass')) {
        category = 'Glass';
        disposalMethod = 'Recycling Bin';
        instructions = ['Rinse and place in glass recycling bin.'];
        tips = ['Do not mix broken glass with regular recyclables.'];
        environmentalImpact = 'Glass can be recycled indefinitely.';
      } else if (s.includes('paper') || s.includes('newspaper') || s.includes('cardboard')) {
        category = 'Paper';
        disposalMethod = 'Recycling Bin';
        instructions = ['Keep dry and clean.', 'Place in recycling bin.'];
        tips = ['Remove staples and tape.'];
        environmentalImpact = 'Paper recycling saves trees and energy.';
      } else if (s.includes('can') || s.includes('metal') || s.includes('aluminum')) {
        category = 'Metal';
        disposalMethod = 'Recycling Bin';
        instructions = ['Rinse and place in recycling bin.'];
        tips = ['Crush cans to save space.'];
        environmentalImpact = 'Metal recycling conserves resources and energy.';
      }
      setSearchResult({
        name: search,
        category: { name: category },
        disposalMethod,
        instructions,
        tips,
        environmentalImpact,
        recyclable: category !== 'General Waste',
        hazardous: false
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-8 flex items-center gap-3"><SearchIcon className="w-10 h-10 text-yellow-500" />Search Waste Info</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter waste name (e.g., plastic bottle)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 text-white px-6 py-2 rounded-r-lg font-semibold hover:bg-yellow-600 transition"
          >
            Search
          </button>
        </div>
        {searchResult && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="text-gray-800 mb-2"><b>Name:</b> {searchResult.name || search}</div>
            <div className="text-gray-800 mb-2"><b>Type:</b> {searchResult.category?.name || 'Unknown'}</div>
            <div className="text-gray-800 mb-2"><b>Disposal Method:</b> {searchResult.disposalMethod || 'Unknown'}</div>
            {searchResult.instructions && searchResult.instructions.length > 0 && (
              <div className="mb-2">
                <b>Instructions:</b>
                <ul className="list-disc ml-6 text-gray-700">
                  {searchResult.instructions.map((ins: string, i: number) => <li key={i}>{ins}</li>)}
                </ul>
              </div>
            )}
            {searchResult.tips && searchResult.tips.length > 0 && (
              <div className="mb-2">
                <b>Tips:</b>
                <ul className="list-disc ml-6 text-gray-700">
                  {searchResult.tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
            <div className="text-gray-700"><b>Info:</b> {searchResult.environmentalImpact || searchResult.info}</div>
          </div>
        )}
      </div>
    </div>
  );
};
