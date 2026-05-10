import React, { useEffect, useRef, useState } from 'react';
import { Pin, MoreHorizontal, Pencil, Bookmark } from 'lucide-react';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  isPinnedVariant?: boolean;
  onTagClick?: (id: number) => void;
  isBinView?: boolean;
  onTogglePin?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (note: Note) => void;
  onOpen?: (note: Note) => void;
  onDragStart?: (id: number) => void;
  onDragEnd?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isPinnedVariant,
  onTagClick,
  isBinView = false,
  onTogglePin,
  onDelete,
  onEdit,
  onOpen,
  onDragStart,
  onDragEnd,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', closeOnOutsideClick);
    return () => window.removeEventListener('click', closeOnOutsideClick);
  }, []);

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  return (
    <article
      draggable={!isBinView}
      onDragStart={() => onDragStart?.(note.id)}
      onDragEnd={() => onDragEnd?.()}
      onClick={() => onOpen?.(note)}
      className={`group relative flex flex-col bg-white border border-border-subtle p-8 transition-colors hover:border-gray-300 ${isPinnedVariant ? 'h-[280px]' : 'h-[240px]'}`}
    >
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] uppercase tracking-widest font-mono text-text-secondary">
          {formattedDate}
        </span>
        <div className="flex items-center gap-2">
          {note.isPinned && (
            <Bookmark size={14} className="text-text-secondary opacity-50" strokeWidth={1.5} />
          )}
        </div>
      </div>

      <h3 className={`font-serif text-text-main mb-3 leading-tight ${isPinnedVariant ? 'text-[28px]' : 'text-[20px]'}`}>
        {note.title}
      </h3>

      <p className="text-text-secondary text-[14px] leading-relaxed line-clamp-3 mb-6">
        {note.content}
      </p>

      <div className="flex flex-wrap gap-3 mt-auto">
        {note.tags.map(tag => (
          <button 
            key={tag.id} 
            onClick={onTagClick ? (e) => { e.stopPropagation(); onTagClick(tag.id); } : undefined}
            className="text-[11px] font-mono tracking-wide text-text-secondary hover:text-text-main transition-colors"
          >
            #{tag.name.toLowerCase()}
          </button>
        ))}
      </div>
      
      <div ref={menuRef} className="absolute top-5 right-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-page-bg"
          aria-label="Open note menu"
        >
          <MoreHorizontal size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white brutalist-border shadow-sm z-20">
            {!isBinView && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit?.(note);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-page-bg transition-colors flex items-center gap-2"
                >
                  <Pencil size={14} />
                  Edit Note
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onTogglePin?.(note.id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-page-bg transition-colors"
                >
                  {note.isPinned ? 'Unpin Note' : 'Pin Note'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete?.(note.id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-page-bg transition-colors"
                >
                  Delete Note
                </button>
              </>
            )}
            {isBinView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete?.(note.id);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Permanently
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
