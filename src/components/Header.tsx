import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  savedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, savedCount = 0 }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-[#27272a] transition-all duration-300">
      <div className="h-16 w-full px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-2.5 group text-left transition-transform hover:scale-102"
        >
          <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/40 flex items-center justify-center p-1 overflow-hidden shadow-[0_0_12px_rgba(59,130,246,0.2)] group-hover:border-[#3b82f6] transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] animate-pulse" />
          </div>
          <span className="font-inter font-bold text-lg tracking-tight text-[#ffffff] flex items-center gap-1.5">
            ASHA SADHANA <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#27272a] text-[#a1a1aa] font-mono tracking-normal">BOOTH</span>
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('frame-select')}
            className={`font-inter font-medium text-xs md:text-sm tracking-wide px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
              currentView === 'frame-select' || currentView === 'camera' || currentView === 'result'
                ? 'bg-[#3b82f6] text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3f3f46]'
            }`}
          >
            <span className="material-symbols-outlined text-base">photo_camera</span>
            <span>Sesi Baru</span>
          </button>

          <button
            onClick={() => onNavigate('gallery')}
            className={`font-inter font-medium text-xs md:text-sm tracking-wide flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 border ${
              currentView === 'gallery'
                ? 'bg-[#18181b] border-[#3b82f6] text-[#3b82f6]'
                : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#3f3f46]'
            }`}
          >
            <span>Galeri</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-[#3b82f6]/20 text-[#3b82f6] rounded-md font-mono font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
