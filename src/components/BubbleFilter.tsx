
import React from 'react';
import { X } from 'lucide-react';

interface BubbleFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
}

const BubbleFilter: React.FC<BubbleFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll
}) => {
  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'All';
    return category;
  };

  const isSelected = (category: string) => {
    return selectedCategories.includes(category);
  };

  return (
    <div className="animate-fadeInUp" style={{animationDelay: '0.4s'}}>
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {/* All button */}
        <button
          onClick={onClearAll}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
            selectedCategories.length === 0
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
          }`}
        >
          All
        </button>

        {/* Category bubbles */}
        {categories.filter(cat => cat !== 'all').map((category) => (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2 ${
              isSelected(category)
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
            }`}
          >
            <span>{formatCategoryName(category)}</span>
            {isSelected(category) && (
              <X 
                className="w-3 h-3 ml-1" 
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryToggle(category);
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Selected filters display */}
      {selectedCategories.length > 0 && (
        <div className="text-center mb-4">
          <p className="text-slate-300 text-sm">
            Filtering by: {selectedCategories.map(cat => formatCategoryName(cat)).join(', ')}
            <button
              onClick={onClearAll}
              className="ml-2 text-blue-300 hover:text-blue-200 underline text-xs"
            >
              Clear all
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default BubbleFilter;
