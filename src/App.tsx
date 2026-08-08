import React, { useState, useEffect } from 'react';
import { AppView, FrameOption, PhotoFilter, PhotoSession } from './types';
import { FRAME_OPTIONS } from './data/frames';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { RecentHighlights } from './components/RecentHighlights';
import { Step1FrameSelection } from './components/Step1FrameSelection';
import { Step2CameraSession } from './components/Step2CameraSession';
import { Step3ResultStrip } from './components/Step3ResultStrip';
import { GalleryModal } from './components/GalleryModal';
import { ShareModal } from './components/ShareModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(FRAME_OPTIONS[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [filter, setFilter] = useState<PhotoFilter>('normal');
  const [savedSessions, setSavedSessions] = useState<PhotoSession[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [shareSession, setShareSession] = useState<PhotoSession | null>(null);

  // Load saved sessions from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('asha_sadhana_photo_sessions');
      if (!stored) {
        // Fallback check for previous key if needed
        const legacy = localStorage.getItem('snapjoy_photo_sessions');
        if (legacy) setSavedSessions(JSON.parse(legacy));
      } else {
        setSavedSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load localStorage sessions:', e);
    }
  }, []);

  // Save session to gallery and localStorage
  const handleSaveToGallery = (session: PhotoSession) => {
    setSavedSessions((prev) => {
      // Avoid duplicate saves
      if (prev.some((s) => s.id === session.id)) return prev;
      const updated = [session, ...prev];
      try {
        localStorage.setItem('asha_sadhana_photo_sessions', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save session to localStorage:', e);
      }
      return updated;
    });
  };

  // Delete session from gallery
  const handleDeleteSession = (id: string) => {
    setSavedSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('asha_sadhana_photo_sessions', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete session from localStorage:', e);
      }
      return updated;
    });
  };

  // Reset current camera session
  const handleResetSession = () => {
    setPhotos([]);
    setFilter('normal');
    setCurrentView('frame-select');
  };

  // Navigation controller
  const handleNavigate = (view: AppView) => {
    if (view === 'gallery') {
      setShowGalleryModal(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] flex flex-col justify-between selection:bg-[#ecb2ff] selection:text-[#520071] relative overflow-x-hidden">
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        savedCount={savedSessions.length}
      />

      {/* Main Container View Switcher */}
      <main className="pt-20 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col w-full"
            >
              <LandingHero
                onStartFun={() => setCurrentView('frame-select')}
                onViewGallery={() => setShowGalleryModal(true)}
              />
              <RecentHighlights
                onStartFun={() => setCurrentView('frame-select')}
                onViewGallery={() => setShowGalleryModal(true)}
              />
            </motion.div>
          )}

          {currentView === 'frame-select' && (
            <motion.div
              key="frame-select"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Step1FrameSelection
                selectedFrame={selectedFrame}
                onSelectFrame={(f) => setSelectedFrame(f)}
                onProceedToCamera={() => {
                  setPhotos([]);
                  setCurrentView('camera');
                }}
                onBackToHome={() => setCurrentView('landing')}
              />
            </motion.div>
          )}

          {currentView === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Step2CameraSession
                frame={selectedFrame}
                photos={photos}
                onTakePhotos={(newPhotos) => setPhotos(newPhotos)}
                onProceedToResult={() => setCurrentView('result')}
                onBackToFrameSelect={() => setCurrentView('frame-select')}
                filter={filter}
                onChangeFilter={(f) => setFilter(f)}
              />
            </motion.div>
          )}

          {currentView === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Step3ResultStrip
                frame={selectedFrame}
                photos={photos}
                filter={filter}
                onChangeFilter={(f) => setFilter(f)}
                onReset={handleResetSession}
                onSaveToGallery={handleSaveToGallery}
                onOpenShare={(session) => setShareSession(session)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <GalleryModal
          sessions={savedSessions}
          onClose={() => setShowGalleryModal(false)}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {/* Share Modal */}
      {shareSession && (
        <ShareModal
          session={shareSession}
          onClose={() => setShareSession(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
