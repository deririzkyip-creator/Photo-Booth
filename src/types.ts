export type AppView = 'landing' | 'frame-select' | 'camera' | 'result' | 'gallery';

export type PhotoFilter = 'normal' | 'neon' | 'bw' | 'vintage' | 'vaporwave' | 'glitch' | 'warm';

export interface FrameOption {
  id: string;
  name: string;
  category?: string;
  badge?: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  headerText: string;
  footerText: string;
  textColor: string;
  accentColor: string;
  sampleImg?: string;
  overlayStyle: string;
  decorations?: string[]; // E.g. cute emojis or symbols for decorative rendering
  defaultTitle?: string; // Default for the editable title input (overrides headerText)
  defaultLocation?: string; // Default for the editable location input
}

export interface PhotoSession {
  id: string;
  timestamp: number;
  dateStr: string;
  frame: FrameOption;
  photos: string[]; // Base64 image data URLs or URLs
  filter: PhotoFilter;
  customTitle: string;
  customLocation: string;
}

export interface StickerOption {
  id: string;
  name: string;
  icon: string;
}
