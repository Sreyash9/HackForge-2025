import React from 'react';
import { WasteCategory } from '../types/waste';
import * as LucideIcons from 'lucide-react';

interface CategoryGridProps {
  categories: WasteCategory[];
  onCategorySelect: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onCategorySelect }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 text-center group"
        >
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white group-hover:scale-110 transition-transform"
            style={{ backgroundColor: category.color }}
          >
            {getIcon(category.icon)}
          </div>
          <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
          <p className="text-xs text-gray-600">{category.description}</p>
        </button>
      ))}
    </div>
  );
};