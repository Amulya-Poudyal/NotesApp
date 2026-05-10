import React from 'react';

export const DraftsPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 mt-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-main mb-4 tracking-tight">Drafts</h2>
        <p className="text-text-secondary text-[15px] max-w-2xl leading-relaxed">
          Unfinished thoughts, quick captures, and notes in progress.
        </p>
      </header>

      <div className="py-32 text-center border border-border-subtle bg-card-bg/30">
        <h4 className="text-xl font-serif mb-2">No drafts yet</h4>
        <p className="text-text-secondary text-sm">Your works-in-progress will appear here.</p>
      </div>
    </div>
  );
};
