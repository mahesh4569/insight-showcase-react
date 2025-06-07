
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 min-w-[150px]"
      >
        <Filter className="w-5 h-5" />
        <span className="text-sm">{formatCategoryName(selectedCategory)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-2xl p-2 min-w-[200px] z-[100] shadow-2xl animate-scale-in">
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
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterDropdown;
