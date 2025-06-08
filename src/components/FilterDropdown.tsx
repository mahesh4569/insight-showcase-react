
import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'All Projects';
    return category;
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 min-w-[160px] shadow-lg"
      >
        <Filter className="w-5 h-5" />
        <span className="text-sm truncate flex-1 text-left">{formatCategoryName(selectedCategory)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full mt-2 right-0 bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-2xl p-2 min-w-[200px] max-w-[300px] z-50 shadow-2xl animate-scale-in max-h-96 overflow-y-auto">
            <h4 className="text-white font-semibold mb-2 px-2">Filter by Skills</h4>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-600/70 text-white shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;
