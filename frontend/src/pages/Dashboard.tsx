import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pin, Search, Trash2, X, Menu, Filter, ArrowUpDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { NoteCard } from '../components/NoteCard';
import { SearchBar } from '../components/SearchBar';
import type { Note, NotesResponse } from '../types';

const fetchNotes = async (params: { search?: string, page?: number, tagId?: number }) => {
  const { data } = await api.get<NotesResponse>('/notes', { params });
  return data;
};

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [openedNote, setOpenedNote] = useState<Note | null>(null);

  const search = searchParams.get('search') || '';
  const tagId = searchParams.get('tagId') ? Number(searchParams.get('tagId')) : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { search, tagId }],
    queryFn: () => fetchNotes({ search, tagId }),
  });

  const togglePinMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/notes/${id}/pin`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/notes/${id}/permanent`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
  const editNoteMutation = useMutation({
    mutationFn: async () =>
      api.patch(`/notes/${editingNote?.id}`, {
        title: editTitle.trim(),
        content: editContent.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setEditingNote(null);
      setOpenedNote(null);
    },
  });
  const setSearch = (query: string) => {
    if (query) {
      searchParams.set('search', query);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleTagClick = (id: number) => {
    searchParams.set('tagId', id.toString());
    searchParams.delete('search'); // Clear search when filtering by tag
    setSearchParams(searchParams);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };
  const moveDraggedToBin = () => {
    if (!draggingNoteId) return;
    deleteNoteMutation.mutate(draggingNoteId);
    setDraggingNoteId(null);
  };
  const canSaveEdit = useMemo(() => editTitle.trim().length >= 3 && editContent.trim().length > 0, [editTitle, editContent]);

  const pinnedNotes = data?.notes.filter(n => n.isPinned) || [];
  const otherNotes = data?.notes.filter(n => !n.isPinned) || [];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 mt-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-main mb-4 tracking-tight">Digital Paper Dashboard</h2>
        <p className="text-text-secondary text-[15px] max-w-2xl leading-relaxed">
          Your curated index of thoughts, drafts, and ongoing explorations. Grounded in simplicity.
        </p>
      </header>

      <div className="mb-12 max-w-2xl">
        <SearchBar onSearch={setSearch} isLoading={isLoading} />
      </div>

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-serif mb-4">Connection Lost</h2>
          <p className="text-text-secondary mb-6">We couldn't reach the server. Please check your connection.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-accent text-white">Retry</button>
        </div>
      )}

      {pinnedNotes.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <Pin size={18} className="text-text-main" />
              <h3 className="text-xl font-serif font-bold">Pinned</h3>
            </div>
            <button className="text-[11px] uppercase tracking-widest font-mono text-text-secondary hover:text-text-main transition-colors">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isPinnedVariant={true}
                onTagClick={handleTagClick}
                onEdit={openEditModal}
                onOpen={setOpenedNote}
                onTogglePin={(id) => togglePinMutation.mutate(id)}
                onDelete={(id) => deleteNoteMutation.mutate(id)}
                onDragStart={(id) => setDraggingNoteId(id)}
                onDragEnd={() => setDraggingNoteId(null)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <Menu size={18} className="text-text-main" />
            <h3 className="text-xl font-serif font-bold">Index</h3>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono text-text-secondary hover:text-text-main transition-colors">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono text-text-secondary hover:text-text-main transition-colors">
              <ArrowUpDown size={14} /> Sort
            </button>
          </div>
        </div>

        {tagId && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-text-main font-bold text-[10px] uppercase tracking-widest border border-border-subtle mb-6 inline-flex">
            <span>Tag_{tagId}</span>
            <button onClick={() => { searchParams.delete('tagId'); setSearchParams(searchParams); }}>×</button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 border border-border-subtle bg-card-bg/50 animate-pulse" />)}
          </div>
        ) : otherNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onTagClick={handleTagClick}
                onEdit={openEditModal}
                onOpen={setOpenedNote}
                onTogglePin={(id) => togglePinMutation.mutate(id)}
                onDelete={(id) => deleteNoteMutation.mutate(id)}
                onDragStart={(id) => setDraggingNoteId(id)}
                onDragEnd={() => setDraggingNoteId(null)}
              />
            ))}
          </div>
        ) : !pinnedNotes.length ? (
          <div className="py-20 text-center border border-border-subtle bg-card-bg/30">
            <Search size={32} className="mx-auto mb-4 opacity-20" />
            <h4 className="text-xl font-serif mb-2">No matches found</h4>
            <p className="text-text-secondary text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : null}
      </section>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          moveDraggedToBin();
        }}
        className={`fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full border flex items-center justify-center transition-all ${
          draggingNoteId ? 'bg-red-100 border-red-500 text-red-600 scale-110' : 'bg-card-bg border-border-subtle text-text-secondary'
        }`}
        title="Drag note here to delete it"
      >
        <Trash2 size={20} />
      </div>
      {openedNote && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-page-bg/80 backdrop-blur-sm" onClick={() => setOpenedNote(null)} />
          <div className="relative w-full max-w-3xl bg-card-bg brutalist-border p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-serif font-bold">{openedNote.title}</h3>
              <button onClick={() => setOpenedNote(null)}><X size={18} /></button>
            </div>
            <p className="text-sm text-text-secondary mb-6">{new Date(openedNote.createdAt).toLocaleString()}</p>
            <div className="whitespace-pre-wrap leading-relaxed text-text-main mb-8">{openedNote.content}</div>
            <div className="flex justify-end gap-3">
              <button onClick={() => openEditModal(openedNote)} className="px-4 py-2 brutalist-border">Edit</button>
              <button onClick={() => { deleteNoteMutation.mutate(openedNote.id); setOpenedNote(null); }} className="px-4 py-2 border border-red-300 text-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
      {editingNote && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-page-bg/80 backdrop-blur-sm" onClick={() => setEditingNote(null)} />
          <div className="relative w-full max-w-2xl bg-card-bg brutalist-border p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif font-bold">Edit Note</h3>
              <button onClick={() => setEditingNote(null)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-4 py-3 bg-page-bg brutalist-border outline-none" />
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={7} className="w-full px-4 py-3 bg-page-bg brutalist-border outline-none resize-none" />
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setEditingNote(null)} className="px-4 py-2 brutalist-border">Cancel</button>
                <button
                  onClick={() => editNoteMutation.mutate()}
                  disabled={!canSaveEdit || editNoteMutation.isPending}
                  className="px-5 py-2 bg-accent text-white disabled:opacity-50"
                >
                  {editNoteMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
