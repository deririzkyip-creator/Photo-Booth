import { FrameOption, PhotoFilter } from '../types';

const DEFAULT_PHOTO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDyTXmF3knSB3seO2lXXSVmo8wW7_eqmuOGHkeTDIWnsGgjvQdnoVaBOn6qhpyecPCrW-O18DVw2eZowbeO-tCAHRWsbkvD4BWFvgyGXNViqKSTANsEEEwFBG3XkfEWxuIUKcwo7K6V8nbj9AcoGKArlwmqK5qoou16j1QjypLT664oNw2ANsLmrBuEXfDkqzTnRkt9zxDD69Pvag9HmmTc8eKr4Oa1yjTbWL9CkN5t8mWDv9yd8Lw';

// Ensure all web fonts used by the canvas are fully loaded before drawing,
// otherwise canvas text silently falls back to a default font (e.g. Arial),
// which is why downloaded/printed strips show a different font than the preview.
async function ensureFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('900 28px "Montserrat"'),
      document.fonts.load('700 18px "Montserrat"'),
      document.fonts.load('600 13px "Space Grotesk"'),
      document.fonts.load('700 12px "Space Grotesk"'),
      document.fonts.load('900 62px "Playfair Display"'),
      document.fonts.load('900 58px "Playfair Display"'),
      document.fonts.load('700 15px "Playfair Display"'),
      document.fonts.load('700 13px "Playfair Display"'),
      document.fonts.load('700 16px "Playfair Display"'),
      document.fonts.load('600 14px "Playfair Display"'),
      document.fonts.load('600 12px "Playfair Display"'),
      document.fonts.load('700 11px "Playfair Display"'),
      document.fonts.load('700 9px "Playfair Display"'),
    ]);
    await document.fonts.ready;
  } catch (e) {
    console.warn('Font preload failed, falling back to default font:', e);
  }
}

function applyFilterToContext(context: CanvasRenderingContext2D, filter: PhotoFilter) {
  switch (filter) {
    case 'bw':
      context.filter = 'grayscale(100%) contrast(120%)';
      break;
    case 'neon':
      context.filter = 'saturate(200%) contrast(110%) hue-rotate(15deg)';
      break;
    case 'vintage':
      context.filter = 'sepia(60%) contrast(110%) brightness(95%)';
      break;
    case 'vaporwave':
      context.filter = 'hue-rotate(280deg) saturate(180%)';
      break;
    case 'glitch':
      context.filter = 'contrast(140%) saturate(150%) brightness(105%)';
      break;
    case 'warm':
      context.filter = 'sepia(20%) saturate(140%) brightness(102%)';
      break;
    default:
      context.filter = 'none';
      break;
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallback = new Image();
      fallback.onload = () => resolve(fallback);
      fallback.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="%23222"/><text x="50%" y="50%" fill="%23888" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24">Asha Sadhana Photo</text></svg>';
    };
    img.src = url;
  });
}

// --- Newspaper (DAILY / PHOTO BOOTH NEWS) layout ---
async function renderNewspaperStrip(
  photos: string[],
  frame: FrameOption,
  filter: PhotoFilter,
  customTitle: string,
  customLocation: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  await ensureFontsLoaded();

  const stripWidth = 600;
  const padding = 24;
  const matte = 6;
  const photoHeight = 400;
  const gap = 14;
  const photoH = photoHeight + matte * 2; // photo + matte block

  const mastheadH = 86;
  const sublineH = 26;
  const bannerH = 42;
  const localNewsH = 42;
  const storiesH = 36;
  const funH = 40;
  const lifestyleH = 44;
  const footerH = 62;

  const totalHeight =
    padding +
    mastheadH +
    sublineH +
    bannerH + 12 +
    localNewsH +
    photoH * 3 +
    storiesH +
    gap +
    funH +
    lifestyleH +
    footerH +
    padding;

  canvas.width = stripWidth;
  canvas.height = totalHeight;

  // Brown / aged-paper background
  const paper = ctx.createLinearGradient(0, 0, 0, totalHeight);
  paper.addColorStop(0, '#f0e4c8');
  paper.addColorStop(0.6, '#e2cda6');
  paper.addColorStop(1, '#d2b486');
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, stripWidth, totalHeight);

  const ink = '#3d2b1c';
  const softInk = '#6b5236';
  const cream = '#f5ead0';
  const cx = stripWidth / 2;

  // Outer double border
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, stripWidth - 16, totalHeight - 16);
  ctx.lineWidth = 1;
  ctx.strokeRect(12, 12, stripWidth - 24, totalHeight - 24);

  let y = padding;

  // --- Masthead: DAILY with double rules ---
  ctx.textAlign = 'center';
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(18, y); ctx.lineTo(stripWidth - 18, y); ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(18, y + 5); ctx.lineTo(stripWidth - 18, y + 5); ctx.stroke();

  ctx.fillStyle = ink;
  ctx.font = '900 58px "Playfair Display", serif';
  const mastTop = y;
  const mastBot = y + 80;
  const mastText = (frame.headerText || 'DAILY').toUpperCase();
  const mastMetrics = ctx.measureText(mastText);
  const mastAscent = mastMetrics.actualBoundingBoxAscent || 46;
  const mastDescent = mastMetrics.actualBoundingBoxDescent || 12;
  ctx.fillText(mastText, cx, (mastTop + mastBot) / 2 + (mastAscent - mastDescent) / 2 + 5);

  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(18, y + 80); ctx.lineTo(stripWidth - 18, y + 80); ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(18, y + 85); ctx.lineTo(stripWidth - 18, y + 85); ctx.stroke();

  y += mastheadH;

  // --- Subline: PHOTO BOOTH NEWS ---
  ctx.fillStyle = ink;
  ctx.font = '600 14px "Playfair Display", serif';
  ctx.fillText((frame.footerText || 'PHOTO BOOTH NEWS').toUpperCase(), cx, y + 16);
  y += sublineH;

  // --- Banner (replaces EXTRA! EXTRA! READ ALL ABOUT IT) ---
  ctx.fillStyle = ink;
  ctx.fillRect(padding, y, stripWidth - padding * 2, bannerH);
  ctx.fillStyle = cream;
  ctx.font = '700 15px "Playfair Display", serif';
  ctx.fillText((customTitle || 'ASHA SADHANA - ASHA SADHANA - ASHA SADHANA').toUpperCase(), cx, y + bannerH / 2 + 6);
  y += bannerH + 12;

  // --- LOCAL NEWS headline + corner chips ---
  ctx.font = '700 13px "Playfair Display", serif';
  ctx.fillStyle = ink;
  ctx.fillText('LOCAL NEWS: TRIO CAUGHT IN SPONTANEOUS JOY! -', cx, y + 14);
  ctx.font = '600 12px "Playfair Display", serif';
  ctx.fillStyle = softInk;
  ctx.fillText('Friends gather for memorable snap.', cx, y + 30);

  ctx.font = '700 9px "Playfair Display", serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = softInk;
  ctx.fillText('■ BREAKING NEWS', 20, y + 14);
  ctx.textAlign = 'right';
  ctx.fillText('FRONT PAGE ■', stripWidth - 20, y + 14);
  ctx.textAlign = 'center';

  y += localNewsH;

  // --- 3 Photos with newspaper headline strip between ---
  const photoWidth = stripWidth - padding * 2;

  for (let i = 0; i < 3; i++) {
    const photoUrl = photos[i] || DEFAULT_PHOTO_URL;

    // Cream matte + ink frame around each photo
    ctx.fillStyle = cream;
    ctx.fillRect(padding - matte, y - matte, photoWidth + matte * 2, photoHeight + matte * 2);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(padding - matte, y - matte, photoWidth + matte * 2, photoHeight + matte * 2);

    try {
      const img = await loadImage(photoUrl);

      ctx.save();
      ctx.beginPath();
      ctx.rect(padding, y, photoWidth, photoHeight);
      ctx.clip();

      applyFilterToContext(ctx, filter);

      const imgRatio = img.width / img.height;
      const targetRatio = photoWidth / photoHeight;
      let drawW = photoWidth;
      let drawH = photoHeight;
      let offsetX = padding;
      let offsetY = y;

      if (imgRatio > targetRatio) {
        drawW = photoHeight * imgRatio;
        offsetX = padding - (drawW - photoWidth) / 2;
      } else {
        drawH = photoWidth / imgRatio;
        offsetY = y - (drawH - photoHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.error('Failed to load image for newspaper canvas:', e);
    }

    // SHOT label badge
    ctx.fillStyle = 'rgba(61, 43, 28, 0.85)';
    ctx.fillRect(padding + 10, y + 10, 74, 20);
    ctx.fillStyle = cream;
    ctx.font = '700 11px "Playfair Display", serif';
    ctx.textAlign = 'left';
    ctx.fillText(`SHOT ${String(i + 1).padStart(2, '0')}`, padding + 15, y + 24);
    ctx.textAlign = 'center';

    y += photoH;

    if (i === 0) {
      // HEADLINE STORIES: PROP ALERT! strip between photo 1 and 2
      ctx.fillStyle = ink;
      ctx.font = '700 13px "Playfair Display", serif';
      ctx.fillText('HEADLINE STORIES: PROP ALERT! - Crew Spotted Acting Wild!', cx, y + 16);
      ctx.strokeStyle = softInk;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(30, y + 24); ctx.lineTo(stripWidth - 30, y + 24); ctx.stroke();
      y += storiesH;
    } else if (i === 1) {
      y += gap;
    }
  }

  // --- PHOTO BOOTH FUN banner ---
  ctx.fillStyle = ink;
  ctx.font = '700 16px "Playfair Display", serif';
  ctx.fillText('★ PHOTO BOOTH FUN ★', cx, y + 18);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(30, y + 24); ctx.lineTo(stripWidth - 30, y + 24); ctx.stroke();
  y += funH;

  // --- LIFESTYLE headline ---
  ctx.fillStyle = ink;
  ctx.font = '700 13px "Playfair Display", serif';
  ctx.fillText('LIFESTYLE: THE FINAL POSE -', cx, y + 14);
  ctx.fillStyle = softInk;
  ctx.font = '600 12px "Playfair Display", serif';
  ctx.fillText('Unforgettable memories made!', cx, y + 30);
  y += lifestyleH;

  // --- Footer: double rule + info columns ---
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(18, y + 2); ctx.lineTo(stripWidth - 18, y + 2); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(18, y + 7); ctx.lineTo(stripWidth - 18, y + 7); ctx.stroke();

  const infoY = y + 34;
  const colW = (stripWidth - 40) / 3;
  const cells = [
    'DATE: 09 AGUSTUS 2026',
    `LOCATION: ${(customLocation || 'THE BOOTH').toUpperCase()}`,
    'SHOT: 01/03',
  ];
  ctx.font = '700 12px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = ink;
  cells.forEach((txt, i) => {
    ctx.fillText(txt, 20 + colW * i + colW / 2, infoY);
  });

  ctx.lineWidth = 1;
  for (let i = 1; i <= 2; i++) {
    const vx = 20 + colW * i;
    ctx.beginPath();
    ctx.moveTo(vx, y + 16);
    ctx.lineTo(vx, y + 40);
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

export async function generatePhotoStripCanvas(
  photos: string[],
  frame: FrameOption,
  filter: PhotoFilter = 'normal',
  customTitle: string = 'ASHA SADHANA MEMORIES',
  customLocation: string = 'JAKARTA • 2026'
): Promise<string> {
  // Newspaper uses a dedicated layout
  if (frame.overlayStyle === 'newspaper') {
    return renderNewspaperStrip(photos, frame, filter, customTitle, customLocation);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  await ensureFontsLoaded();

  // Strip Dimensions (High Quality Printable)
  const stripWidth = 600;
  const photoHeight = 450; // 4:3 aspect ratio per photo
  const padding = 30;
  const headerHeight = 90;
  const footerHeight = 100;
  const gapBetweenPhotos = 20;

  const totalHeight = headerHeight + (photoHeight * 3) + (gapBetweenPhotos * 2) + footerHeight + (padding * 2);

  canvas.width = stripWidth;
  canvas.height = totalHeight;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, totalHeight);
  if (frame.overlayStyle === 'neon') {
    bgGrad.addColorStop(0, '#1a1228');
    bgGrad.addColorStop(0.5, '#121320');
    bgGrad.addColorStop(1, '#0d0e17');
  } else if (frame.overlayStyle === 'retro-film') {
    bgGrad.addColorStop(0, '#1c1815');
    bgGrad.addColorStop(1, '#0e0c0a');
  } else if (frame.overlayStyle === 'y2k') {
    bgGrad.addColorStop(0, '#041c22');
    bgGrad.addColorStop(1, '#020d13');
  } else if (frame.overlayStyle === 'bloom' || frame.overlayStyle === 'love') {
    bgGrad.addColorStop(0, '#380a1f');
    bgGrad.addColorStop(0.5, '#200512');
    bgGrad.addColorStop(1, '#100208');
  } else if (frame.overlayStyle === 'cupid') {
    bgGrad.addColorStop(0, '#4a0e27');
    bgGrad.addColorStop(1, '#14020a');
  } else if (frame.overlayStyle === 'kawaii') {
    bgGrad.addColorStop(0, '#30201a');
    bgGrad.addColorStop(1, '#0f0907');
  } else if (frame.overlayStyle === 'bunny') {
    bgGrad.addColorStop(0, '#2b1933');
    bgGrad.addColorStop(1, '#0e0714');
  } else if (frame.overlayStyle === 'cat') {
    bgGrad.addColorStop(0, '#331d17');
    bgGrad.addColorStop(1, '#0f0705');
  } else {
    bgGrad.addColorStop(0, '#18181b');
    bgGrad.addColorStop(1, '#09090b');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, stripWidth, totalHeight);

  // Outer Border / Frame Accent Glow
  ctx.strokeStyle = frame.borderColor || '#00eefc';
  ctx.lineWidth = 6;
  ctx.shadowColor = frame.glowColor || 'rgba(0, 238, 252, 0.5)';
  ctx.shadowBlur = 15;

  // Rounded Card Inner Frame
  const rx = 16;
  ctx.beginPath();
  ctx.roundRect(12, 12, stripWidth - 24, totalHeight - 24, rx);
  ctx.stroke();
  ctx.shadowBlur = 0; // reset shadow

  // Header Text
  ctx.textAlign = 'center';
  ctx.fillStyle = frame.textColor || '#ffffff';
  ctx.font = '900 28px "Montserrat", sans-serif';
  ctx.fillText(frame.headerText.toUpperCase() || 'ASHA SADHANA', stripWidth / 2, padding + 45);

  // Decorative header line
  ctx.strokeStyle = frame.accentColor || frame.borderColor || '#00eefc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(stripWidth / 2 - 80, padding + 58);
  ctx.lineTo(stripWidth / 2 + 80, padding + 58);
  ctx.stroke();

  // Render each photo
  let currentY = padding + headerHeight;
  const photoWidth = stripWidth - (padding * 2);

  for (let i = 0; i < 3; i++) {
    const photoUrl = photos[i] || DEFAULT_PHOTO_URL;

    // Photo background container
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(padding, currentY, photoWidth, photoHeight, 12);
    ctx.fill();

    try {
      const img = await loadImage(photoUrl);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(padding, currentY, photoWidth, photoHeight, 12);
      ctx.clip();

      applyFilterToContext(ctx, filter);

      // Draw image object-cover style
      const imgRatio = img.width / img.height;
      const targetRatio = photoWidth / photoHeight;
      let drawW = photoWidth;
      let drawH = photoHeight;
      let offsetX = padding;
      let offsetY = currentY;

      if (imgRatio > targetRatio) {
        drawW = photoHeight * imgRatio;
        offsetX = padding - (drawW - photoWidth) / 2;
      } else {
        drawH = photoWidth / imgRatio;
        offsetY = currentY - (drawH - photoHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.error('Failed to load image for canvas:', e);
    }

    // Photo frame inner border
    ctx.strokeStyle = frame.borderColor || '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(padding, currentY, photoWidth, photoHeight, 12);
    ctx.stroke();

    // Photo index badge (#1, #2, #3)
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(padding + 12, currentY + 12, 32, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`#${i + 1}`, padding + 28, currentY + 28);

    // Decorative Emoji Icons overlay on photos
    if (frame.decorations && frame.decorations.length > 0) {
      ctx.font = '22px sans-serif';
      const dec1 = frame.decorations[i % frame.decorations.length];
      const dec2 = frame.decorations[(i + 1) % frame.decorations.length];
      ctx.fillText(dec1, padding + photoWidth - 24, currentY + 28);
      ctx.fillText(dec2, padding + photoWidth - 24, currentY + photoHeight - 16);
    }

    currentY += photoHeight + gapBetweenPhotos;
  }

  // Footer branding
  const footerY = totalHeight - padding - 40;

  ctx.fillStyle = frame.textColor || '#ffffff';
  ctx.font = '700 18px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(customTitle || 'ASHA SADHANA PHOTO BOOTH', stripWidth / 2, footerY);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '600 13px "Space Grotesk", sans-serif';
  ctx.fillText(customLocation || 'JAKARTA • CAPTURE THE PULSE', stripWidth / 2, footerY + 24);

  return canvas.toDataURL('image/png');
}

export function downloadImage(dataUrl: string, filename: string = 'AshaSadhana_PhotoStrip.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
