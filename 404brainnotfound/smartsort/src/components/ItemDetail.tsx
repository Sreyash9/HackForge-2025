import React from 'react';
import { WasteItem } from '../types/waste';
import { ArrowLeft, AlertTriangle, Recycle, Lightbulb, CheckCircle } from 'lucide-react';

interface ItemDetailProps {
  item: WasteItem;
  onBack: () => void;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({ item, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to search</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {item.category.name}
                </span>
                {item.recyclable && (
                  <div className="flex items-center space-x-1">
                    <Recycle className="w-4 h-4" />
                    <span className="text-sm">Recyclable</span>
                  </div>
                )}
                {item.hazardous && (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Hazardous</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Disposal Method */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How to Dispose</h2>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Disposal Method:</span>
              </div>
              <p className="text-green-700 font-medium text-lg">{item.disposalMethod}</p>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Step-by-Step Instructions</h2>
            <div className="space-y-3">
              {item.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          {item.tips.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pro Tips</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="space-y-2">
                  {item.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-yellow-800 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Environmental Impact */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-900 mb-3">Environmental Impact</h2>
            <p className="text-green-800">{item.environmentalImpact}</p>
          </div>
        </div>
      </div>
    </div>
  );
};