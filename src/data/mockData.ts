import { StickerOption } from '../types';

export const RECENT_HIGHLIGHTS = [
  {
    id: '402',
    sessionCode: 'Session #402',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsPiScBnwdT-rF_eaY0a9rWPaQxjeCkosx-G94P6mSzZ8uvWkMk5-GyNHYB2gXrDXmgouz9uMIKUERJfnZB92fJW1BuGw1KXehDaH5LqHMKd2cxWO_IzY5jO6Hef6uNRROuzMY3m8w5t9V0ghfYrMJIJVY_E9cKgDFpSjHorP5vNUflW49TbNL4_0sNMtpbgUXZCIUVCxHqjsq-UQYaspQ_gxwl9j0qsq24K1nrwOzzrJaoLFqM8do',
    alt: 'Dua sahabat tertawa dengan kacamata pesta dan boas bulu',
    frameName: 'Neon Nights',
  },
  {
    id: '401',
    sessionCode: 'Session #401',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMud3-zPuzO9bnDO_fghKnMifOG2heLeY860CH1MdvbATL9k3C3TvxoeAzDcFlx2LOJyNYvCjWsFyJBkVbqWRgt4seaj3P1-AfFxIJ00rtyBv8jTlNFqS03cagWioTlR7MpMfD0y50-VzTtgPIju4w4MA5e3C0oFRTIhKDVGLqvygrx2v-ZofdbswEw19JQ0XQCfCqFG8_daS5jCSqeRFQUZFKDLiZcBF0FpUJuwsmiTe4jHUyorHl',
    alt: 'Pose modis dengan neon fill light pink',
    frameName: 'Party Time',
  },
  {
    id: '400',
    sessionCode: 'Session #400',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTWWyxLpAkK-kMLIkJBXFYgPeVvB3JR-G9VqpMv0IYNn16YH-42KCydRYmGm3-NQuJtn8a8hE3PUyaeCnBaAgvGCf1pzaohjRN8MVAAgyG4IIpLzx9iy2fYea7mb7SdSsY1b2ptLoZaadB0Y6ga9gP3PnI__mHFEP_aunl92N8ghuqg7hTcBRBqIZUB9RAFzJjLw-lPPQ0HufNnDvm8ym_SBJLT1zP3IZ9ExxrEgcRUgNWYj5akgIY',
    alt: 'Grup 5 orang bersenang-senang di depan neon Asha Sadhana',
    frameName: 'Y2K Cyber',
  },
];

export const MOCK_CAMERA_FALLBACKS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDDyTXmF3knSB3seO2lXXSVmo8wW7_eqmuOGHkeTDIWnsGgjvQdnoVaBOn6qhpyecPCrW-O18DVw2eZowbeO-tCAHRWsbkvD4BWFvgyGXNViqKSTANsEEEwFBG3XkfEWxuIUKcwo7K6V8nbj9AcoGKArlwmqK5qoou16j1QjypLT664oNw2ANsLmrBuEXfDkqzTnRkt9zxDD69Pvag9HmmTc8eKr4Oa1yjTbWL9CkN5t8mWDv9yd8Lw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAsPiScBnwdT-rF_eaY0a9rWPaQxjeCkosx-G94P6mSzZ8uvWkMk5-GyNHYB2gXrDXmgouz9uMIKUERJfnZB92fJW1BuGw1KXehDaH5LqHMKd2cxWO_IzY5jO6Hef6uNRROuzMY3m8w5t9V0ghfYrMJIJVY_E9cKgDFpSjHorP5vNUflW49TbNL4_0sNMtpbgUXZCIUVCxHqjsq-UQYaspQ_gxwl9j0qsq24K1nrwOzzrJaoLFqM8do',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAMud3-zPuzO9bnDO_fghKnMifOG2heLeY860CH1MdvbATL9k3C3TvxoeAzDcFlx2LOJyNYvCjWsFyJBkVbqWRgt4seaj3P1-AfFxIJ00rtyBv8jTlNFqS03cagWioTlR7MpMfD0y50-VzTtgPIju4w4MA5e3C0oFRTIhKDVGLqvygrx2v-ZofdbswEw19JQ0XQCfCqFG8_daS5jCSqeRFQUZFKDLiZcBF0FpUJuwsmiTe4jHUyorHl',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBTWWyxLpAkK-kMLIkJBXFYgPeVvB3JR-G9VqpMv0IYNn16YH-42KCydRYmGm3-NQuJtn8a8hE3PUyaeCnBaAgvGCf1pzaohjRN8MVAAgyG4IIpLzx9iy2fYea7mb7SdSsY1b2ptLoZaadB0Y6ga9gP3PnI__mHFEP_aunl92N8ghuqg7hTcBRBqIZUB9RAFzJjLw-lPPQ0HufNnDvm8ym_SBJLT1zP3IZ9ExxrEgcRUgNWYj5akgIY',
];

export const STICKER_OPTIONS: StickerOption[] = [
  { id: 'star', name: 'Star Glasses', icon: '⭐' },
  { id: 'party', name: 'Party Hat', icon: '🥳' },
  { id: 'crown', name: 'Crown', icon: '👑' },
  { id: 'heart', name: 'Neon Hearts', icon: '💖' },
  { id: 'fire', name: 'Fire Vibes', icon: '🔥' },
  { id: 'sparkles', name: 'Sparkles', icon: '✨' },
  { id: 'camera', name: 'Asha Sadhana', icon: '📸' },
  { id: 'peace', name: 'Peace Sign', icon: '✌️' },
];
