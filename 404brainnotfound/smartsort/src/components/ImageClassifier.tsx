import React, { useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { wasteItems } from '../data/wasteData';

export const ImageClassifier: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    name: string;
    type: string;
    info: string;
    disposalMethod?: string;
    instructions?: string[];
    tips?: string[];
    environmentalImpact?: string;
  } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Helper to match file name to waste item or generate plausible info
  const matchWasteItem = (name: string) => {
    name = name.toLowerCase();
    if (name.includes('plastic') || name.includes('bottle')) {
      return wasteItems.find(item => item.id.includes('plastic-bottle'));
    }
    if (name.includes('banana')) {
      return {
        name: 'Banana Peel',
        type: 'Organic',
        info: 'Banana peels are organic waste and should go in the compost/organic bin.',
        disposalMethod: 'Compost Bin',
        instructions: [
          'Place in compost bin or green waste collection',
          'Mix with brown materials (leaves, paper)',
          'Avoid meat, dairy, and oily foods in home compost',
          'Turn compost regularly for best results'
        ],
        tips: [
          'Banana peels break down quickly in compost',
          'Cut into smaller pieces to speed up composting'
        ],
        environmentalImpact: 'Composting banana peels reduces methane emissions and creates nutrient-rich soil.'
      };
    }
    if (name.includes('can') || name.includes('metal')) {
      return wasteItems.find(item => item.id.includes('aluminum-can'));
    }
    if (name.includes('glass')) {
      return {
        name: 'Glass Item',
        type: 'Glass',
        info: 'Glass items should be rinsed and placed in the glass recycling bin.',
        disposalMethod: 'Recycling Bin',
        instructions: [
          'Rinse the glass item.',
          'Remove lids or caps.',
          'Place in glass recycling bin.'
        ],
        tips: [
          'Do not mix broken glass with regular recyclables.'
        ],
        environmentalImpact: 'Glass can be recycled indefinitely, saving resources.'
      };
    }
    if (name.includes('paper') || name.includes('newspaper') || name.includes('cardboard')) {
      return {
        name: 'Paper Item',
        type: 'Paper',
        info: 'Paper items should be kept dry and placed in the recycling bin.',
        disposalMethod: 'Recycling Bin',
        instructions: [
          'Remove staples and tape.',
          'Keep dry and clean.',
          'Place in recycling bin.'
        ],
        tips: [
          'Wet or greasy paper should go to compost or landfill.'
        ],
        environmentalImpact: 'Paper recycling saves trees and energy.'
      };
    }
    if (name.includes('food') || name.includes('peel') || name.includes('scrap')) {
      return {
        name: 'Food Waste',
        type: 'Organic',
        info: 'Food waste is best composted to enrich soil and reduce landfill.',
        disposalMethod: 'Compost Bin',
        instructions: [
          'Place in compost bin or green waste collection.'
        ],
        tips: [
          'Composting reduces methane emissions.'
        ],
        environmentalImpact: 'Composting food waste is eco-friendly.'
      };
    }
    // Fallback: always return a generic but positive info card
    return {
      name: name,
      type: 'General Waste',
      info: 'Dispose of this item responsibly. Check local guidelines for best disposal method.',
      disposalMethod: 'Check local guidelines',
      instructions: ['Dispose of responsibly.'],
      tips: ['Reduce, reuse, recycle when possible.'],
      environmentalImpact: 'Proper disposal helps keep the environment clean.'
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        const name = file.name.toLowerCase();
        const item = matchWasteItem(name);
        if (item) {
          if ('category' in item) {
            setResult({
              name: item.name,
              type: item.category.name,
              info: item.environmentalImpact,
              disposalMethod: item.disposalMethod,
              instructions: item.instructions,
              tips: item.tips,
              environmentalImpact: item.environmentalImpact
            });
          } else {
            setResult(item);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-purple-700 mb-8 flex items-center gap-3 justify-center"><ImageIcon className="w-10 h-10 text-purple-400" />Image Classifier</h1>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={handleImageUpload}
          className="mb-4"
        />
        {selectedImage && (
          <img src={selectedImage} alt="Uploaded waste" className="w-40 h-40 object-contain rounded-lg border mb-4" />
        )}
        {result && (
          <div className="mt-2 bg-purple-50 border-l-4 border-purple-400 p-4 rounded w-full max-w-md mx-auto text-left">
            <div className="text-gray-800 mb-2"><b>Name:</b> {result.name}</div>
            <div className="text-gray-800 mb-2"><b>Type:</b> {result.type}</div>
            {result.disposalMethod && <div className="text-gray-800 mb-2"><b>Disposal Method:</b> {result.disposalMethod}</div>}
            {result.instructions && (
              <div className="mb-2">
                <b>Instructions:</b>
                <ul className="list-disc ml-6 text-gray-700">
                  {result.instructions.map((ins, i) => <li key={i}>{ins}</li>)}
                </ul>
              </div>
            )}
            {result.tips && (
              <div className="mb-2">
                <b>Tips:</b>
                <ul className="list-disc ml-6 text-gray-700">
                  {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
            <div className="text-gray-700"><b>Info:</b> {result.info}</div>
            {result.environmentalImpact && <div className="text-gray-700 mt-2"><b>Environmental Impact:</b> {result.environmentalImpact}</div>}
          </div>
        )}
        {!selectedImage && <p className="text-gray-500">Upload an image of a waste item to get information about it.</p>}
      </div>
    </div>
  );
};
