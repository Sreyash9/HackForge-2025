import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { wasteItems, categories } from '../data/wasteData';
import { WasteItem, SearchFilters } from '../types/waste';
import { CategoryGrid } from './CategoryGrid';
import { ItemCard } from './ItemCard';
import { ItemDetail } from './ItemDetail';

export const SearchView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  const filteredItems = useMemo(() => {
    let items = wasteItems;

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category) {
      items = items.filter(item => item.category.id === filters.category);
    }

    if (filters.recyclable !== undefined) {
      items = items.filter(item => item.recyclable === filters.recyclable);
    }

    if (filters.hazardous !== undefined) {
      items = items.filter(item => item.hazardous === filters.hazardous);
    }

    return items;
  }, [searchQuery, filters]);

  const clearFilters = () => {
    setFilters({});
    setShowFilters(false);
  };

  if (selectedItem) {
    return (
      <ItemDetail 
        item={selectedItem} 
        onBack={() => setSelectedItem(null)} 
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          How should I dispose of this?
        </h2>
        <p className="text-lg text-gray-600">
          Search for any household item to learn the proper disposal method
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for items (e.g., plastic bottle, phone, paint can...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Filter Results</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({...filters, category: e.target.value || undefined})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.recyclable === true}
                  onChange={(e) => setFilters({
                    ...filters, 
                    recyclable: e.target.checked ? true : undefined
                  })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Recyclable only</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hazardous === false}
                  onChange={(e) => setFilters({
                    ...filters, 
                    hazardous: e.target.checked ? false : undefined
                  })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Non-hazardous only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid (shown when no search query) */}
      {!searchQuery && filteredItems.length === wasteItems.length && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h3>
          <CategoryGrid 
            categories={categories} 
            onCategorySelect={(categoryId) => setFilters({...filters, category: categoryId})}
          />
        </div>
      )}

      {/* Search Results */}
      {(searchQuery || Object.keys(filters).length > 0) && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
          </h3>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No items found matching your search</p>
              <p className="text-sm text-gray-500">Try different keywords or browse categories above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};