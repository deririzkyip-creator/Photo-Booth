import { FrameOption, PhotoFilter } from '../types';

export async function generatePhotoStripCanvas(
  photos: string[],
  frame: FrameOption,
  filter: PhotoFilter = 'normal',
  customTitle: string = 'ASHA SADHANA MEMORIES',
  customLocation: string = 'JAKARTA • 2026'
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

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

  // Helper to apply filters to canvas images
  const applyFilterToContext = (context: CanvasRenderingContext2D) => {
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
  };

  // Helper to load image asynchronously
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback placeholder image if cors fails
        const fallback = new Image();
        fallback.onload = () => resolve(fallback);
        fallback.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="%23222"/><text x="50%" y="50%" fill="%23888" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24">Asha Sadhana Photo</text></svg>';
      };
      img.src = url;
    });
  };

  // Render each photo
  let currentY = padding + headerHeight;
  const photoWidth = stripWidth - (padding * 2);

  for (let i = 0; i < 3; i++) {
    const photoUrl = photos[i] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDyTXmF3knSB3seO2lXXSVmo8wW7_eqmuOGHkeTDIWnsGgjvQdnoVaBOn6qhpyecPCrW-O18DVw2eZowbeO-tCAHRWsbkvD4BWFvgyGXNViqKSTANsEEEwFBG3XkfEWxuIUKcwo7K6V8nbj9AcoGKArlwmqK5qoou16j1QjypLT664oNw2ANsLmrBuEXfDkqzTnRkt9zxDD69Pvag9HmmTc8eKr4Oa1yjTbWL9CkN5t8mWDv9yd8Lw';
    
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

      applyFilterToContext(ctx);

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
