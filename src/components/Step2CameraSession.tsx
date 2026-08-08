import React, { useState, useEffect, useRef } from 'react';
import { FrameOption, PhotoFilter } from '../types';
import { MOCK_CAMERA_FALLBACKS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface Step2CameraSessionProps {
  frame: FrameOption;
  photos: string[];
  onTakePhotos: (newPhotos: string[]) => void;
  onProceedToResult: () => void;
  onBackToFrameSelect: () => void;
  filter: PhotoFilter;
  onChangeFilter: (filter: PhotoFilter) => void;
}

export const Step2CameraSession: React.FC<Step2CameraSessionProps> = ({
  frame,
  photos,
  onTakePhotos,
  onProceedToResult,
  onBackToFrameSelect,
  filter,
  onChangeFilter,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const [hasWebcam, setHasWebcam] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number>(3);
  const [flashEffect, setFlashEffect] = useState<boolean>(false);
  const [useSimulated, setUseSimulated] = useState<boolean>(false);

  // Filter CSS styles
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

  // Start or Retry Webcam
  const startCamera = async () => {
    setUseSimulated(false);
    setCameraError(null);

    // Stop existing tracks if any
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    try {
      let stream: MediaStream | null = null;
      try {
        // First try with user facing camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
      } catch {
        // Fallback to basic video constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      mediaStreamRef.current = stream;
      setHasWebcam(true);
      setCameraError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }
    } catch (err: any) {
      console.warn('Webcam access error:', err);
      setHasWebcam(false);
      
      let msg = 'Kamera tidak dapat diakses.';
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        msg = 'Izin kamera diblokir oleh browser / iframe. Coba buka di Tab Baru atau klik tombol "Aktifkan Kamera".';
      } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
        msg = 'Kamera sedang digunakan oleh aplikasi lain (Zoom/Meet/OBS). Tutup aplikasi tersebut dan coba lagi.';
      } else {
        msg = 'Kamera tidak ditemukan atau izin belum diberikan. Klik "Aktifkan Kamera" atau gunakan "Upload Foto".';
      }

      setCameraError(msg);
      setUseSimulated(true);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  // Ensure stream attached if video element mounts
  useEffect(() => {
    if (mediaStreamRef.current && videoRef.current && !useSimulated) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch((e) => console.warn('Video play error:', e));
    }
  }, [hasWebcam, useSimulated]);

  // Capture single snapshot
  const captureSnapshot = (): string => {
    if (hasWebcam && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 960;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror webcam
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
      }
    }

    // Fallback simulated photo
    const randomIndex = photos.length % MOCK_CAMERA_FALLBACKS.length;
    return MOCK_CAMERA_FALLBACKS[randomIndex];
  };

  // Trigger snapshot process with countdown
  const handleStartCapture = () => {
    if (isCountingDown || photos.length >= 3) return;

    setIsCountingDown(true);
    setCountdownValue(3);

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
      } else {
        clearInterval(timer);
        // Flash screen
        setFlashEffect(true);
        setTimeout(() => setFlashEffect(false), 200);

        // Take picture
        const newSnap = captureSnapshot();
        const updated = [...photos, newSnap];
        onTakePhotos(updated);

        setIsCountingDown(false);
      }
    }, 1000);
  };

  // Retake photo at index
  const handleRetakeSlot = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onTakePhotos(updated);
  };

  // File Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && photos.length < 3) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onTakePhotos([...photos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentStepNum = Math.min(photos.length + 1, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 min-h-[90vh] flex flex-col justify-between">
      {/* Invisible Canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 z-10 w-full mb-6">
        <div className="flex items-center gap-3 bento-card px-5 py-2.5 bg-[#18181b] border border-[#27272a]">
          <button 
            onClick={onBackToFrameSelect}
            className="w-8 h-8 rounded-lg border border-[#3b82f6]/40 flex items-center justify-center bg-[#27272a] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white transition-colors"
            title="Kembali Pilih Frame"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </button>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#3b82f6] font-bold">SESI FOTO • STEP 2 OF 3</p>
            <p className="font-inter font-bold text-sm text-white">Foto {currentStepNum} dari 3</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bento-card px-4 py-2 bg-[#18181b] border border-[#27272a]">
          <span className="material-symbols-outlined text-[#3b82f6] text-sm">info</span>
          <p className="font-inter text-xs text-[#a1a1aa]">Wajib ambil 3 foto untuk melengkapi frame</p>
        </div>
      </header>

      {/* Main Viewport & Sidebar Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-stretch justify-center">
        {/* Left: Camera Viewfinder Bento Card */}
        <div className="flex-1 w-full relative flex flex-col items-center justify-center">
          <div className="w-full max-w-[480px] aspect-[3/4] relative bento-card bg-[#18181b] overflow-hidden border border-[#27272a] shadow-2xl">
            {/* Video element always mounted so videoRef is never null */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
              className={`w-full h-full object-cover scale-x-[-1] ${
                hasWebcam && !useSimulated ? 'block' : 'hidden'
              }`}
              style={{ filter: getFilterCss(filter) }}
            />

            {(!hasWebcam || useSimulated) && (
              <div 
                className="w-full h-full bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: `url('${MOCK_CAMERA_FALLBACKS[photos.length % MOCK_CAMERA_FALLBACKS.length]}')`,
                  filter: getFilterCss(filter),
                }}
              />
            )}

            {/* Flash Screen Overlay */}
            <AnimatePresence>
              {flashEffect && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-white z-50 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Top Bar HUD */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none z-20">
              <div className="bg-[#09090b]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-[#27272a] flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasWebcam && !useSimulated ? 'bg-[#10b981] animate-ping' : 'bg-amber-400'}`} />
                <p className="font-mono font-bold text-[11px] text-white uppercase tracking-wider">
                  {hasWebcam && !useSimulated ? 'REC LIVE' : 'MODE SAMPEL'}
                </p>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={startCamera}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-2.5 py-1 rounded-lg border border-[#3b82f6]/50 text-xs font-inter font-semibold flex items-center gap-1 shadow-md transition-all active:scale-95"
                  title="Coba Aktifkan Kamera Laptop/HP"
                >
                  <span className="material-symbols-outlined text-xs">videocam</span>
                  <span>{hasWebcam && !useSimulated ? 'Kamera Aktif' : 'Aktifkan Kamera'}</span>
                </button>
              </div>
            </div>

            {/* Viewfinder Reticle / Crosshair Overlays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
              <svg className="w-[80%] h-[80%]" fill="none" stroke="currentColor" viewBox="0 0 100 100">
                <rect x="5" y="5" width="15" height="15" strokeWidth="1.5" className="text-[#3b82f6]" />
                <rect x="80" y="5" width="15" height="15" strokeWidth="1.5" className="text-[#3b82f6]" />
                <rect x="5" y="80" width="15" height="15" strokeWidth="1.5" className="text-[#3b82f6]" />
                <rect x="80" y="80" width="15" height="15" strokeWidth="1.5" className="text-[#3b82f6]" />
                <line x1="50" y1="35" x2="50" y2="65" strokeWidth="0.5" className="text-white" />
                <line x1="35" y1="50" x2="65" y2="50" strokeWidth="0.5" className="text-white" />
              </svg>
            </div>

            {/* Countdown Overlay */}
            <AnimatePresence>
              {isCountingDown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30 pointer-events-none"
                >
                  <span className="font-inter font-extrabold text-8xl text-[#3b82f6] drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-pulse">
                    {countdownValue}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera Switch / Upload Helper Badge */}
            {(!hasWebcam || useSimulated) && (
              <div className="absolute bottom-3 inset-x-3 bg-[#09090b]/95 backdrop-blur-md p-3 rounded-xl text-xs text-[#a1a1aa] border border-[#27272a] z-20 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[11px] text-[#e4e4e7] leading-tight">
                    {cameraError || 'Kamera belum terhubung. Klik "Aktifkan Kamera" atau upload foto.'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#27272a]">
                  <button
                    onClick={startCamera}
                    className="bg-[#3b82f6] text-white px-2.5 py-1.5 rounded-lg font-inter font-semibold text-[11px] hover:bg-[#2563eb] transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">videocam</span>
                    <span>Aktifkan Kamera</span>
                  </button>
                  <label className="bg-[#27272a] text-white px-2.5 py-1.5 rounded-lg font-inter font-semibold text-[11px] hover:bg-[#3f3f46] transition-colors cursor-pointer flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">upload</span>
                    <span>Upload Foto</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Filter Chips Bar */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto max-w-[480px] w-full pb-2">
            {[
              { id: 'normal', name: 'Normal' },
              { id: 'neon', name: 'Neon Glow' },
              { id: 'bw', name: 'B&W Film' },
              { id: 'vintage', name: 'Vintage' },
              { id: 'vaporwave', name: 'Vaporwave' },
              { id: 'glitch', name: 'Cyber Glitch' },
              { id: 'warm', name: 'Warm Party' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => onChangeFilter(f.id as PhotoFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-inter font-medium whitespace-nowrap transition-all border ${
                  filter === f.id
                    ? 'bg-[#3b82f6] text-white border-[#3b82f6] font-semibold'
                    : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:border-[#3f3f46] hover:text-white'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Shutter Button */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <button
              onClick={handleStartCapture}
              disabled={isCountingDown || photos.length >= 3}
              className={`relative group cursor-pointer ${
                photos.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="relative w-24 h-24 lg:w-28 lg:h-28 bg-[#3b82f6] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-transform duration-200 hover:scale-105 active:scale-95 z-10 border-4 border-[#09090b]">
                <div className="absolute inset-1.5 bg-[#09090b] rounded-full border border-[#3b82f6]/50 group-hover:bg-[#3b82f6]/20 transition-colors duration-300" />
                <span className="font-inter font-bold text-sm text-white z-10 relative">
                  AMBIL
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Capture Progress Grid Sidebar */}
        <div className="w-full lg:w-80 flex flex-col justify-center gap-6">
          <div className="bento-card p-5 bg-[#18181b] border border-[#27272a] flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-inter font-bold text-base text-white">Captured Photos</h3>
              <span className="text-xs font-mono font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2.5 py-0.5 rounded-md border border-[#3b82f6]/30">
                {photos.length}/3
              </span>
            </div>

            {/* 3 Photo Slots */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 w-full">
              {[0, 1, 2].map((slotIndex) => {
                const photo = photos[slotIndex];

                return (
                  <div
                    key={slotIndex}
                    className="relative min-w-[110px] aspect-[3/4] bg-[#09090b] rounded-xl overflow-hidden border border-[#27272a] group shrink-0"
                  >
                    {photo ? (
                      <>
                        <img
                          src={photo}
                          alt={`Foto #${slotIndex + 1}`}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                          style={{ filter: getFilterCss(filter) }}
                        />
                        <div className="absolute top-2 left-2 bg-[#09090b]/80 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white border border-[#27272a]">
                          #{slotIndex + 1}
                        </div>
                        {/* Retake Button */}
                        <button
                          onClick={() => handleRetakeSlot(slotIndex)}
                          title="Hapus & Ulang Foto"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <span className="material-symbols-outlined text-sm">replay</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full border border-dashed border-[#27272a] flex flex-col items-center justify-center gap-1.5 opacity-40">
                        <span className="material-symbols-outlined text-[#a1a1aa] text-2xl">photo_camera</span>
                        <span className="font-mono text-[10px] text-[#a1a1aa] uppercase">
                          Slot {slotIndex + 1}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-1 h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3b82f6] transition-all duration-500"
                style={{ width: `${(photos.length / 3) * 100}%` }}
              />
            </div>

            {/* Proceed to Result button when 3 photos are ready */}
            {photos.length === 3 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onProceedToResult}
                className="mt-2 w-full py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-inter font-semibold text-xs md:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
              >
                <span>LIHAT HASIL FRAME</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
