import React from 'react';
import { motion } from 'motion/react';

interface LandingHeroProps {
  onStartFun: () => void;
  onViewGallery: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartFun, onViewGallery }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-12">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {/* Main Hero Card (Span 2 cols, 2 rows on desktop) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 md:row-span-2 bento-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1e1b4b]/80 via-[#18181b] to-[#18181b] border border-[#27272a]"
        >
          {/* Subtle Ambient Background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-[#a1a1aa] text-xs font-medium tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-ping" />
              <span>OVERVIEW PERFORMANCE • ASHA SADHANA OS</span>
            </div>

            <h1 className="font-inter font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
              Capture The <span className="text-[#3b82f6]">Pulse</span> Of The Moment
            </h1>

            <p className="font-inter text-sm md:text-base text-[#a1a1aa] max-w-md leading-relaxed mb-6">
              Studio-grade photo booth with live camera capture, custom frame presets, retro-neon overlays, and printable photo strips.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button 
              onClick={onStartFun}
              className="px-6 py-3 bg-white text-black rounded-full font-inter font-semibold text-xs md:text-sm tracking-wide shadow-lg hover:bg-zinc-200 transition-all flex items-center gap-2 hover:scale-102"
            >
              <span>MULAI FOTO SEKARANG</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <button 
              onClick={onViewGallery}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white rounded-full font-inter font-medium text-xs md:text-sm tracking-wide border border-white/10 transition-all"
            >
              LIHAT GALERI
            </button>
          </div>
        </motion.div>

        {/* Bento Stat Card 1: Active Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card p-6 flex flex-col justify-between bg-[#18181b] border border-[#27272a]"
        >
          <div className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#10b981]">sensors</span>
            BOOTH STATUS
          </div>
          <div className="mt-4">
            <div className="font-inter font-bold text-3xl text-white mb-1">100% LIVE</div>
            <div className="text-xs text-[#10b981] flex items-center gap-1 font-medium">
              <span>↑ Camera & FX Ready</span>
            </div>
          </div>
          {/* Mini chart bar visualizer */}
          <div className="mt-4 h-10 flex items-end gap-1.5 opacity-80">
            <div className="flex-1 bg-[#3b82f6]/30 h-[40%] rounded-t" />
            <div className="flex-1 bg-[#3b82f6]/50 h-[70%] rounded-t" />
            <div className="flex-1 bg-[#3b82f6] h-[100%] rounded-t" />
            <div className="flex-1 bg-[#3b82f6]/60 h-[60%] rounded-t" />
            <div className="flex-1 bg-[#3b82f6]/80 h-[85%] rounded-t" />
          </div>
        </motion.div>

        {/* Bento Stat Card 2: Print Quality */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bento-card p-6 flex flex-col justify-between bg-[#18181b] border border-[#27272a]"
        >
          <div className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#3b82f6]">print</span>
            EXPORT RESOLUTION
          </div>
          <div className="mt-4">
            <div className="font-inter font-bold text-3xl text-white">600 <span className="text-base font-normal text-[#a1a1aa]">DPI</span></div>
            <div className="text-xs text-[#a1a1aa] mt-1">High-Definition Photo Strip PNG</div>
          </div>
          <div className="mt-4 w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#3b82f6] h-full w-[92%] rounded-full" />
          </div>
        </motion.div>

        {/* Bento Quick Action / Feature Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card p-6 flex flex-col justify-between bg-[#3b82f6] text-white border-none cursor-pointer hover:bg-[#2563eb] transition-colors"
          onClick={onStartFun}
        >
          <div className="text-white/80 text-xs font-medium uppercase tracking-wider flex items-center justify-between">
            <span>QUICK LAUNCH</span>
            <span className="material-symbols-outlined text-base">east</span>
          </div>
          <div className="mt-6">
            <div className="font-inter font-extrabold text-2xl leading-snug">3-Shot Frame Studio</div>
            <div className="text-xs text-white/80 mt-1">Pilih frame, ambil 3 foto, & unduh hasil.</div>
          </div>
        </motion.div>

        {/* Bento Card: Presets Available */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bento-card p-6 flex flex-col justify-between bg-[#18181b] border border-[#27272a]"
        >
          <div className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#ecb2ff]">palette</span>
            FRAME PRESETS
          </div>
          <div className="mt-4">
            <div className="font-inter font-bold text-3xl text-white">10+ Styles</div>
            <div className="text-xs text-[#a1a1aa] mt-1">Neon, Y2K, Retro Film, Spring Bloom</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
