import React, { useEffect, useMemo, useState } from 'react';
import { X, User, Image, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CommandPalette } from './CommandPalette';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

interface LayoutProps {
  children: React.ReactNode;
}

interface HeaderProps {
  onCreateNote: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateNote, onOpenSettings }) => {
  const profilePhoto = localStorage.getItem('settings.photoUrl');
  const initials = (localStorage.getItem('username') || 'U').slice(0, 1).toUpperCase();

  return (
    <header className="border-b border-border-subtle bg-page-bg sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-[22px] font-bold tracking-tight font-serif">Kritim Notes</h1>
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-text-secondary">
            <a href="#" className="hover:text-text-main transition-colors">Drafts</a>
            <a href="#" className="text-text-main border-b border-text-main pb-0.5">Index</a>
            <a href="#" className="hover:text-text-main transition-colors">Templates</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="text-text-secondary hover:text-text-main transition-colors" aria-label="Search">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onOpenSettings} className="px-4 py-[6px] text-[13px] font-medium border border-border-subtle bg-white hover:bg-gray-50 transition-colors">
              Settings
            </button>
            <button
              type="button"
              onClick={onCreateNote}
              className="px-4 py-[6px] text-[13px] font-medium bg-[#2A2A2A] text-white hover:bg-black transition-colors"
            >
              New Note
            </button>
          </div>
          <div className="h-8 w-8 rounded-full border border-border-subtle overflow-hidden bg-white flex items-center justify-center text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity" title="Profile (Logout in settings)">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-subtle mt-20 py-8 bg-page-bg">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[10px] uppercase tracking-widest font-mono text-text-secondary">
          SYSTEM STATUS: OPERATIONAL — KRITIM NOTES V2.4
        </div>
        <div className="flex items-center gap-8 text-[11px] font-medium text-text-main">
          <a href="#" className="hover:opacity-70 transition-opacity">Privacy</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Terms</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Support</a>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { username, logout } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    setDisplayName(localStorage.getItem('settings.displayName') || localStorage.getItem('username') || '');
    setPhotoUrl(localStorage.getItem('settings.photoUrl') || '');
  }, [username]);

  const canSubmit = useMemo(() => title.trim().length >= 3 && content.trim().length > 0, [title, content]);

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string }) => {
      return api.post('/notes', noteData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsComposerOpen(false);
      setTitle('');
      setContent('');
      setError('');
    },
    onError: () => {
      setError('Could not create note right now. Please try again.');
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <CommandPalette />
      <Header onCreateNote={() => setIsComposerOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="flex-1 max-w-[1400px] mx-auto px-6 lg:px-12 py-12 w-full">
        {children}
      </main>
      <Footer />
      {isComposerOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-page-bg/80 backdrop-blur-sm" onClick={() => setIsComposerOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white brutalist-border p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold">New Note</h2>
                <p className="text-xs uppercase tracking-widest font-mono text-text-secondary mt-1">Quick Compose</p>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-2 hover:bg-page-bg transition-colors"
                aria-label="Close composer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="w-full px-4 py-3 bg-page-bg brutalist-border outline-none focus:border-border-heavy transition-colors"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                rows={7}
                className="w-full px-4 py-3 bg-page-bg brutalist-border outline-none focus:border-border-heavy transition-colors resize-none"
              />
              {error && <p className="text-xs text-red-600 uppercase tracking-wider">{error}</p>}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 brutalist-border hover:bg-page-bg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => createNoteMutation.mutate({ title: title.trim(), content: content.trim() })}
                  disabled={!canSubmit || createNoteMutation.isPending}
                  className="px-5 py-2 bg-accent text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createNoteMutation.isPending ? 'Saving...' : 'Create Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[121] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-page-bg/80 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white brutalist-border p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-page-bg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs uppercase font-mono tracking-widest flex items-center gap-2 mb-2"><User size={13} /> Display Name</span>
                <input value={displayName || username} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-3 bg-page-bg brutalist-border outline-none" />
              </label>
              <label className="block">
                <span className="text-xs uppercase font-mono tracking-widest flex items-center gap-2 mb-2"><Image size={13} /> Profile Photo URL</span>
                <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full px-4 py-3 bg-page-bg brutalist-border outline-none" />
              </label>
              <div className="flex justify-between items-center pt-6 border-t border-border-subtle mt-6">
                <button 
                  onClick={() => { logout(); setIsSettingsOpen(false); }}
                  className="text-xs uppercase font-mono text-red-600 hover:underline tracking-widest font-bold"
                >
                  Terminate Session (Log Out)
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 text-[13px] border border-border-subtle hover:bg-page-bg transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('settings.displayName', displayName || username);
                      localStorage.setItem('settings.photoUrl', photoUrl);
                      setIsSettingsOpen(false);
                      window.location.reload();
                    }}
                    className="px-6 py-2 bg-[#2A2A2A] text-white text-[13px] font-medium hover:bg-black transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
