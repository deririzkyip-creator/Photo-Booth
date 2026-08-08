import React, { useState } from 'react';
import { FRAME_OPTIONS } from '../data/frames';
import { FrameOption } from '../types';
import { motion } from 'motion/react';

interface Step1FrameSelectionProps {
  selectedFrame: FrameOption;
  onSelectFrame: (frame: FrameOption) => void;
  onProceedToCamera: () => void;
  onBackToHome: () => void;
}

export const Step1FrameSelection: React.FC<Step1FrameSelectionProps> = ({
  selectedFrame,
  onSelectFrame,
  onProceedToCamera,
  onBackToHome,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Cinta', 'Lucu', 'Vibrant', 'Vintage', 'Futuristic', 'Festive', 'Cosmic'];

  const filteredFrames = activeCategory === 'All' 
    ? FRAME_OPTIONS 
    : FRAME_OPTIONS.filter(f => f.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 min-h-[85vh] flex flex-col justify-between">
      {/* Header Info */}
      <div className="text-center mb-8 pt-2">
        <motion.button 
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs font-mono font-medium text-[#a1a1aa] uppercase tracking-wider mb-4 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all"
        >
          <span className="material-symbols-outlined text-sm">photo_frame</span>
          STEP 1 OF 3 • FRAME SELECT
        </motion.button>

        <h1 className="font-inter font-extrabold text-3xl md:text-5xl text-white mb-2 tracking-tight">
          Pilih <span className="text-[#3b82f6]">Frame Preset</span> Booth
        </h1>
        <p className="font-inter text-sm md:text-base text-[#a1a1aa] max-w-xl mx-auto leading-relaxed">
          Pilih desain bingkai yang paling sesuai dengan tema acaramu. Tiga foto akan dipasang otomatis pada strip.
        </p>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-inter font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#3b82f6] text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:border-[#3f3f46] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Selection Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 mb-24">
        {filteredFrames.map((frame) => {
          const isSelected = selectedFrame.id === frame.id;

          return (
            <motion.div
              key={frame.id}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectFrame(frame)}
              className={`bento-card relative overflow-hidden cursor-pointer transition-all duration-300 p-2.5 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#3b82f6] bg-[#18181b] shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-2 ring-[#3b82f6]/50'
                  : 'border-[#27272a] bg-[#18181b] hover:border-[#3f3f46]'
              }`}
            >
              {/* Badge */}
              {frame.badge && (
                <div className="absolute top-3.5 left-3.5 z-20 px-2 py-0.5 rounded-md bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#3b82f6] text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                  {frame.badge}
                </div>
              )}

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-3.5 right-3.5 z-20 w-6 h-6 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-xs font-bold">check</span>
                </div>
              )}

              {/* Frame Card Preview Frame */}
              <div className={`aspect-[3/4] rounded-xl overflow-hidden relative flex flex-col justify-between p-3 bg-gradient-to-b ${frame.bgGradient} border border-white/10 shadow-inner`}>
                {/* Frame Header */}
                <div className="text-center pt-1">
                  <span 
                    className="font-inter font-bold text-[10px] uppercase tracking-widest block truncate"
                    style={{ color: frame.textColor }}
                  >
                    {frame.headerText}
                  </span>
                </div>

                {/* Photo Viewfinder Placeholder inside frame */}
                <div className="flex-1 my-2 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center relative overflow-hidden">
                  {frame.sampleImg ? (
                    <img 
                      src={frame.sampleImg} 
                      alt={frame.name}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-white/40">
                      <span className="material-symbols-outlined text-xl">photo_camera</span>
                      <span className="text-[9px] font-mono uppercase">3 Photos</span>
                    </div>
                  )}

                  {/* Cute / Love Frame Overlay Decorations */}
                  {frame.decorations && frame.decorations.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none p-1 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span>{frame.decorations[0]}</span>
                        <span>{frame.decorations[1] || frame.decorations[0]}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>{frame.decorations[2] || frame.decorations[0]}</span>
                        <span>{frame.decorations[3] || frame.decorations[1] || frame.decorations[0]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Frame Footer */}
                <div className="text-center pb-1">
                  <span 
                    className="font-mono font-medium text-[9px] uppercase tracking-wider block opacity-80 truncate"
                    style={{ color: frame.textColor }}
                  >
                    {frame.footerText}
                  </span>
                </div>
              </div>

              {/* Frame Label Below */}
              <div className="mt-2.5 text-center pb-1">
                <span className="font-inter font-semibold text-xs text-white block truncate">
                  {frame.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#09090b]/90 backdrop-blur-xl border-t border-[#27272a] flex items-center justify-center">
        <div className="max-w-xl w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#3b82f6] font-mono font-bold text-xs">
              1/3
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs text-[#a1a1aa] block font-inter">Terpilih:</span>
              <span className="font-inter font-bold text-sm text-white">{selectedFrame.name}</span>
            </div>
          </div>

          <button
            onClick={onProceedToCamera}
            className="flex-1 sm:flex-none px-7 py-3 bg-[#3b82f6] text-white rounded-xl font-inter font-semibold text-xs md:text-sm tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2"
          >
            <span>LANJUT KE KAMERA</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
