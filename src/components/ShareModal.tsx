import React, { useState } from 'react';
import { PhotoSession } from '../types';

interface ShareModalProps {
  session: PhotoSession;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ session, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bento-card bg-[#18181b] border border-[#27272a] rounded-2xl max-w-md w-full p-6 text-center relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-2xl">share</span>
        </div>

        <h3 className="font-inter font-bold text-lg text-white mb-1">
          Bagikan Photo Strip Asha Sadhana
        </h3>
        <p className="font-mono text-xs text-[#a1a1aa] mb-5">
          SESI ID: <span className="text-[#3b82f6]">{session.id}</span>
        </p>

        {/* QR Code Placeholder Graphic */}
        <div className="w-40 h-40 bg-white p-3 rounded-xl mx-auto mb-5 flex flex-col items-center justify-center shadow-inner">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`}
            alt="QR Code Asha Sadhana"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 bg-[#09090b] p-2 rounded-xl border border-[#27272a] mb-3">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent font-mono text-xs text-[#a1a1aa] flex-1 px-2 focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg font-inter font-semibold text-xs hover:bg-[#2563eb] transition-colors"
          >
            {copied ? 'Tersalin!' : 'Salin'}
          </button>
        </div>

        <p className="text-[11px] text-[#a1a1aa] font-inter">
          Pindai kode QR atau bagikan tautan ini dengan teman-temanmu!
        </p>
      </div>
    </div>
  );
};
