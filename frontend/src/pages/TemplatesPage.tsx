import React from 'react';

export const TemplatesPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16 mt-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-main mb-4 tracking-tight">Templates</h2>
        <p className="text-text-secondary text-[15px] max-w-2xl leading-relaxed">
          Reusable structures for common notes, meetings, and ideas.
        </p>
      </header>

      <div className="py-32 text-center border border-border-subtle bg-card-bg/30">
        <h4 className="text-xl font-serif mb-2">No templates available</h4>
        <p className="text-text-secondary text-sm">Start creating templates to save time.</p>
      </div>
    </div>
  );
};
