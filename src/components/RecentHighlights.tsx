import React from 'react';
import { RECENT_HIGHLIGHTS } from '../data/mockData';

interface RecentHighlightsProps {
  onStartFun: () => void;
  onViewGallery: () => void;
  onPreviewHighlight?: (highlight: typeof RECENT_HIGHLIGHTS[0]) => void;
}

export const RecentHighlights: React.FC<RecentHighlightsProps> = ({ 
  onStartFun, 
  onViewGallery,
  onPreviewHighlight
}) => {
  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-xs font-medium text-[#3b82f6] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            GALLERY HIGHLIGHTS
          </div>
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-white">
            Hasil Photo Booth Terpopuler
          </h2>
        </div>

        <button 
          onClick={onViewGallery}
          className="hidden md:inline-flex items-center gap-1.5 font-inter font-semibold text-xs text-[#a1a1aa] hover:text-white uppercase tracking-wider transition-colors px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a]"
        >
          <span>SELESAI LIHAT</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {RECENT_HIGHLIGHTS.map((item) => (
          <div 
            key={item.id}
            onClick={() => onPreviewHighlight && onPreviewHighlight(item)}
            className="bento-card relative overflow-hidden aspect-[3/4] bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 cursor-pointer transition-all duration-300 group flex flex-col justify-end p-4"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
              style={{ backgroundImage: `url('${item.imgUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/30 to-transparent opacity-90" />
            
            <div className="relative z-10">
              <span className="font-mono font-bold text-[11px] text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded border border-[#3b82f6]/30 inline-block mb-1">
                {item.sessionCode}
              </span>
              <span className="font-inter font-semibold text-sm text-white block truncate">
                {item.frameName}
              </span>
            </div>
          </div>
        ))}

        {/* YOUR TURN Card */}
        <div 
          onClick={onStartFun}
          className="bento-card relative overflow-hidden aspect-[3/4] bg-[#18181b] border border-dashed border-[#27272a] hover:border-[#3b82f6] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#3b82f6]/5 group"
        >
          <div className="flex flex-col items-center gap-3 text-[#a1a1aa] group-hover:text-white transition-colors p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#27272a] group-hover:bg-[#3b82f6] text-white flex items-center justify-center transition-colors shadow-md">
              <span className="material-symbols-outlined text-2xl">add_a_photo</span>
            </div>
            <div>
              <span className="font-inter font-bold text-sm text-white block">
                GAYA KAMU
              </span>
              <span className="font-inter text-xs text-[#a1a1aa] block mt-0.5">
                Mulai Photo Session
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
