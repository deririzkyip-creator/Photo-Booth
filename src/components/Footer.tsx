import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#09090b] py-8 mt-12 border-t border-[#27272a] relative z-10">
      <div className="px-6 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-[#a1a1aa]">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
            ASHA SADHANA OS • BENTO BOOTH SYSTEM
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-inter text-[#a1a1aa]">
          <span>600 DPI Export</span>
          <span>•</span>
          <span>Webcam FX Engine</span>
          <span>•</span>
          <span>Multi-Frame Studio</span>
        </div>

        <div className="text-[#a1a1aa] font-mono text-[11px] uppercase">
          © 2026 ASHA SADHANA. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
