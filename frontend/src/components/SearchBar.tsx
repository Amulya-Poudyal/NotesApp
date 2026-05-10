import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [value, onSearch]);

  return (
    <div className="relative group mb-8">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
        <SearchIcon size={18} className={`transition-colors ${isLoading ? 'text-accent animate-pulse' : 'text-text-secondary'}`} />
      </div>
      
      <input 
        type="text" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search notes, tags, or content..." 
        className="w-full pl-12 pr-12 py-3 bg-card-bg/90 brutalist-border focus:border-border-heavy outline-none transition-all text-sm"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value && (
          <button 
            onClick={() => setValue('')}
            className="p-1 hover:bg-page-bg transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
