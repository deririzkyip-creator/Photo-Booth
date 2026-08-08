import React, { useState, useEffect } from 'react';
import { FrameOption, PhotoFilter, PhotoSession } from '../types';
import { generatePhotoStripCanvas, downloadImage } from '../utils/canvasRenderer';
import { motion } from 'motion/react';

interface Step3ResultStripProps {
  frame: FrameOption;
  photos: string[];
  filter: PhotoFilter;
  onChangeFilter: (filter: PhotoFilter) => void;
  onReset: () => void;
  onSaveToGallery: (session: PhotoSession) => void;
  onOpenShare: (session: PhotoSession) => void;
}

export const Step3ResultStrip: React.FC<Step3ResultStripProps> = ({
  frame,
  photos,
  filter,
  onChangeFilter,
  onReset,
  onSaveToGallery,
  onOpenShare,
}) => {
  const [customTitle, setCustomTitle] = useState<string>(frame.headerText || 'ASHA SADHANA MEMORIES');
  const [customLocation, setCustomLocation] = useState<string>('JAKARTA • AUG 2026');
  const [renderedCanvasUrl, setRenderedCanvasUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Generate PNG canvas preview whenever photos, filter, title change
  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);

    async function buildCanvas() {
      try {
        const dataUrl = await generatePhotoStripCanvas(
          photos,
          frame,
          filter,
          customTitle,
          customLocation
        );
        if (isMounted) {
          setRenderedCanvasUrl(dataUrl);
          setIsGenerating(false);

          // Save session automatically to local gallery state
          const newSession: PhotoSession = {
            id: 'SJ-' + Math.floor(1000 + Math.random() * 9000),
            timestamp: Date.now(),
            dateStr: new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            frame,
            photos,
            filter,
            customTitle,
            customLocation,
          };
          if (!isSaved) {
            onSaveToGallery(newSession);
            setIsSaved(true);
          }
        }
      } catch (err) {
        console.error('Canvas generation failed:', err);
        if (isMounted) setIsGenerating(false);
      }
    }

    buildCanvas();

    return () => {
      isMounted = false;
    };
  }, [photos, frame, filter, customTitle, customLocation]);

  // Handle Download PNG
  const handleDownload = () => {
    if (renderedCanvasUrl) {
      downloadImage(renderedCanvasUrl, `AshaSadhana_${frame.name.replace(/\s+/g, '')}_Strip.png`);
    }
  };

  // Handle Print Now
  const handlePrint = () => {
    if (!renderedCanvasUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Photo Strip Asha Sadhana</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #ffffff;
              }
              img {
                max-width: 100%;
                max-height: 98vh;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              @media print {
                body { background: none; }
                img { max-height: 100%; }
              }
            </style>
          </head>
          <body>
            <img src="${renderedCanvasUrl}" onload="window.print();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Helper filter CSS for interactive HTML preview
  const getFilterCss = (f: PhotoFilter) => {
    switch (f) {
      case 'bw': return 'grayscale(100%) contrast(120%)';
      case 'neon': return 'saturate(200%) contrast(110%) hue-rotate(15deg)';
      case 'vintage': return 'sepia(60%) contrast(110%) brightness(95%)';
      case 'vaporwave': return 'hue-rotate(280deg) saturate(180%)';
      case 'glitch': return 'contrast(140%) saturate(150%) brightness(105%)';
      case 'warm': return 'sepia(20%) saturate(140%) brightness(102%)';
      default: return 'none';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 min-h-[90vh] flex flex-col justify-between">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 z-10 w-full mb-6">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-xl font-inter text-xs font-medium transition-all"
        >
          <span className="material-symbols-outlined text-base">replay</span>
          <span>ULANG SESI FOTO</span>
        </button>

        <div className="text-center">
          <span className="font-mono text-[10px] text-[#3b82f6] uppercase tracking-wider font-bold">STEP 3 OF 3 • FINALIZE STRIP</span>
          <h1 className="font-inter font-bold text-lg md:text-xl text-white">Selesai! Photo Strip Siap Diunduh</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#a1a1aa] bg-[#18181b] px-3 py-1.5 rounded-lg border border-[#27272a]">
            STRIP PRESET: {frame.name}
          </span>
        </div>
      </header>

      {/* Main Result Content Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center my-4">
        {/* Left: Interactive Live Photo Strip Canvas Bento Box */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="bento-card p-6 bg-[#18181b] border border-[#27272a] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden max-w-sm w-full">
            {/* The Actual Strip Render Box */}
            <div 
              className={`w-64 p-4 rounded-xl flex flex-col items-center gap-3 shadow-2xl transition-all duration-300 bg-gradient-to-b ${frame.bgGradient} border border-white/10`}
            >
              {/* Strip Header */}
              <div className="text-center w-full pt-1">
                <span 
                  className="font-inter font-bold text-xs uppercase tracking-widest block truncate"
                  style={{ color: frame.textColor }}
                >
                  {customTitle}
                </span>
              </div>

              {/* 3 Photos in vertical strip */}
              <div className="w-full flex flex-col gap-2.5">
                {photos.slice(0, 3).map((photoUrl, idx) => (
                  <div 
                    key={idx}
                    className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/60 border border-white/10 shadow-md relative group"
                  >
                    <img 
                      src={photoUrl} 
                      alt={`Photo ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterCss(filter) }}
                    />

                    {/* Cute / Love Decorative Overlay Icons */}
                    {frame.decorations && frame.decorations.length > 0 && (
                      <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-xs drop-shadow-md">
                          <span>{frame.decorations[idx % frame.decorations.length]}</span>
                          <span>{frame.decorations[(idx + 1) % frame.decorations.length]}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs drop-shadow-md">
                          <span>{frame.decorations[(idx + 2) % frame.decorations.length]}</span>
                          <span>{frame.decorations[(idx + 3) % frame.decorations.length]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Strip Footer */}
              <div className="text-center w-full pt-1 pb-1">
                <span 
                  className="font-mono font-medium text-[10px] uppercase tracking-wider block opacity-80 truncate mb-1"
                  style={{ color: frame.textColor }}
                >
                  {customLocation}
                </span>

                <div className="w-full flex items-center justify-between opacity-70 px-1 pt-1 border-t border-white/10">
                  <span className="text-[8px] font-mono uppercase" style={{ color: frame.textColor }}>
                    ASHA SADHANA BOOTH
                  </span>
                  <div className="w-5 h-5 bg-white/20 p-0.5 rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs text-white">qr_code_2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization & Export Controls Bento Cards */}
        <div className="w-full lg:w-96 flex flex-col gap-5">
          {/* Custom Text Card */}
          <div className="bento-card p-5 bg-[#18181b] border border-[#27272a] flex flex-col gap-3">
            <h3 className="font-inter font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#3b82f6]">edit_note</span>
              Kustomisasi Judul & Lokasi
            </h3>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Judul Strip"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white font-inter focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
              <input 
                type="text" 
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Lokasi / Tanggal"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white font-inter focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
          </div>

          {/* Filter Selection Bento Card */}
          <div className="bento-card p-5 bg-[#18181b] border border-[#27272a] flex flex-col gap-3">
            <h3 className="font-inter font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#3b82f6]">tune</span>
              Ganti Filter Foto
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'normal', name: 'Normal' },
                { id: 'bw', name: 'B&W Film' },
                { id: 'neon', name: 'Neon' },
                { id: 'vintage', name: 'Vintage' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onChangeFilter(f.id as PhotoFilter)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-inter font-medium text-center border transition-all ${
                    filter === f.id
                      ? 'bg-[#3b82f6] border-[#3b82f6] text-white font-semibold'
                      : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons Bento Card */}
          <div className="bento-card p-5 bg-[#18181b] border border-[#27272a] flex flex-col gap-3 shadow-xl">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-inter font-semibold text-xs md:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{isGenerating ? 'MEMPROSES...' : 'UNDUH PHOTO STRIP (PNG)'}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="w-full py-3 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl font-inter font-medium text-xs md:text-sm transition-all flex items-center justify-center gap-2 border border-[#3f3f46]"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>CETAK SEKARANG</span>
            </button>

            <button
              onClick={() => {
                const currentSession: PhotoSession = {
                  id: 'SJ-' + Math.floor(1000 + Math.random() * 9000),
                  timestamp: Date.now(),
                  dateStr: new Date().toLocaleDateString('id-ID'),
                  frame,
                  photos,
                  filter,
                  customTitle,
                  customLocation,
                };
                onOpenShare(currentSession);
              }}
              className="w-full py-2.5 bg-[#09090b] hover:bg-black text-[#a1a1aa] hover:text-white rounded-xl font-inter text-xs font-medium transition-all flex items-center justify-center gap-2 border border-[#27272a]"
            >
              <span className="material-symbols-outlined text-base text-[#3b82f6]">share</span>
              <span>BAGIKAN DENGAN QR / LINK</span>
            </button>

            <button
              onClick={onReset}
              className="w-full py-2 text-[#a1a1aa] hover:text-white font-inter text-xs font-medium transition-colors text-center mt-1"
            >
              Kembali ke Beranda Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
