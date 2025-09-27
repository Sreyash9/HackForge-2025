import React from 'react';
import { WasteItem } from '../types/waste';
import { ChevronRight, AlertTriangle, Recycle } from 'lucide-react';

interface ItemCardProps {
  item: WasteItem;
  onClick: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
            <div className="flex items-center space-x-2">
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: item.category.color }}
              >
                {item.category.name}
              </span>
              {item.hazardous && (
                <AlertTriangle className="w-4 h-4 text-red-500" title="Hazardous" />
              )}
              {item.recyclable && (
                <Recycle className="w-4 h-4 text-green-500" title="Recyclable" />
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Disposal: </span>
            <span className="text-sm text-gray-600">{item.disposalMethod}</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.instructions[0]}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 line-clamp-2">
            💡 {item.environmentalImpact}
          </p>
        </div>
      </div>
    </div>
  );
};