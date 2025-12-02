import { FontSize } from '../context/AppContext';

export const FONT_SIZES: Record<FontSize, string> = {
  pequeña: '14px',
  normal: '16px',
  grande: '18px'
};

export const getFontSize = (size: FontSize): string => {
  return FONT_SIZES[size] || FONT_SIZES.normal;
};

export const applyFontSize = (size: FontSize) => {
  document.documentElement.style.setProperty('--font-size', getFontSize(size));
};
