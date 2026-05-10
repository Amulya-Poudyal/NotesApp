import React, { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Search, Tag as TagIcon, ArrowRight, Command } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import type { Tag } from '../types';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);


  const [searchParams, setSearchParams] = useSearchParams();

  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  });

  useHotkeys('esc', () => setIsOpen(false), { enabled: isOpen });

  useEffect(() => {
    const openPalette = () => setIsOpen(true);
    window.addEventListener('open-command-palette', openPalette);
    return () => window.removeEventListener('open-command-palette', openPalette);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      api.get('/tags')
        .then((tagsRes) => setTags(tagsRes.data))
        .catch(err => console.error('Palette data fetch failed', err));
    }
  }, [isOpen]);

  const filteredTags = tags.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const totalItems = filteredTags.length;

  useHotkeys('down', () => setActiveIndex(prev => (prev + 1) % totalItems), { enabled: isOpen });
  useHotkeys('up', () => setActiveIndex(prev => (prev - 1 + totalItems) % totalItems), { enabled: isOpen });
  useHotkeys('enter', () => {
    if (totalItems === 0) return;
    handleTagSelect(filteredTags[activeIndex].id);
  }, { enabled: isOpen });

  const handleTagSelect = (id: number) => {
    searchParams.set('tagId', id.toString());
    searchParams.delete('search');
    setSearchParams(searchParams);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-page-bg/90 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-2xl bg-card-bg brutalist-border shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center px-6 py-4 border-b border-border-subtle">
          <Search size={20} className="text-text-secondary mr-4" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search tags..." 
            className="flex-1 bg-transparent border-none outline-none text-lg font-serif"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-page-bg border border-border-subtle text-[10px] font-mono text-text-secondary">
            <Command size={10} />
            K
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {filteredTags.length > 0 && (
            <div className="py-2">
              <h4 className="px-6 py-2 text-[10px] font-mono uppercase tracking-widest text-text-secondary opacity-50">Tags</h4>
              {filteredTags.map((tag, idx) => (
                <button 
                  key={tag.id} 
                  onClick={() => handleTagSelect(tag.id)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors ${activeIndex === idx ? 'bg-page-bg' : 'hover:bg-page-bg/50'}`}
                >
                  <TagIcon size={16} className={activeIndex === idx ? 'text-accent' : 'text-text-secondary'} />
                  <span className={`text-sm font-medium ${activeIndex === idx ? 'text-text-main' : 'text-text-secondary'}`}>
                    Filter by #{tag.name}
                  </span>
                  {activeIndex === idx && <ArrowRight size={14} className="ml-auto text-accent" />}
                </button>
              ))}
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-12 text-center text-text-secondary italic text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-page-bg border-t border-border-subtle flex justify-between items-center text-[10px] font-mono text-text-secondary uppercase tracking-tighter">
          <div className="flex gap-4">
            <span><span className="font-bold text-text-main">↑↓</span> to navigate</span>
            <span><span className="font-bold text-text-main">↵</span> to select</span>
          </div>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
