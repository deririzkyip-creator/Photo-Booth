import React from 'react';
import { PhotoSession } from '../types';
import { downloadImage, generatePhotoStripCanvas } from '../utils/canvasRenderer';

interface GalleryModalProps {
  sessions: PhotoSession[];
  onClose: () => void;
  onDeleteSession: (id: string) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  sessions,
  onClose,
  onDeleteSession,
}) => {
  const handleRedownload = async (s: PhotoSession) => {
    try {
      const dataUrl = await generatePhotoStripCanvas(
        s.photos,
        s.frame,
        s.filter,
        s.customTitle,
        s.customLocation
      );
      downloadImage(dataUrl, `AshaSadhana_${s.id}_Strip.png`);
    } catch (e) {
      console.error('Error re-downloading strip:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bento-card bg-[#18181b] border border-[#27272a] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Gallery Header */}
        <div className="p-5 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
              <span className="material-symbols-outlined text-lg">collections</span>
            </div>
            <div>
              <h2 className="font-inter font-bold text-lg text-white">Galeri Foto Asha Sadhana</h2>
              <p className="font-inter text-xs text-[#a1a1aa]">Tersimpan di perangkat Anda ({sessions.length} sesi)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Gallery Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {sessions.length === 0 ? (
            <div className="py-16 text-center text-[#a1a1aa]">
              <span className="material-symbols-outlined text-5xl mb-2 opacity-30">photo_library</span>
              <p className="font-inter font-bold text-base text-white">Belum Ada Sesi Foto</p>
              <p className="font-inter text-xs mt-1">Mulai sesi baru untuk mengambil foto booth!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="bento-card bg-[#09090b] border border-[#27272a] rounded-xl p-4 flex flex-col justify-between hover:border-[#3b82f6]/50 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono font-bold text-xs text-[#3b82f6]">{s.id}</span>
                    <span className="text-[11px] text-[#a1a1aa] font-inter">{s.dateStr}</span>
                  </div>

                  {/* Strip Preview Images */}
                  <div className="bg-[#18181b] p-2 rounded-lg border border-[#27272a] flex flex-col gap-1.5 mb-3">
                    {s.photos.map((p, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded overflow-hidden bg-black/50">
                        <img src={p} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-3">
                    <span className="font-inter font-bold text-xs text-white block truncate">
                      {s.customTitle || s.frame.name}
                    </span>
                    <span className="text-[10px] text-[#a1a1aa] font-mono block mt-0.5">
                      Frame: {s.frame.name}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#27272a]">
                    <button
                      onClick={() => handleRedownload(s)}
                      className="flex-1 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-inter font-medium text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Unduh
                    </button>
                    <button
                      onClick={() => onDeleteSession(s.id)}
                      className="p-2 bg-[#27272a] hover:bg-red-500/20 text-[#a1a1aa] hover:text-red-400 rounded-lg transition-colors"
                      title="Hapus Sesi"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
