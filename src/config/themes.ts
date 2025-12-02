import { Theme } from '../context/AppContext';

export interface ThemeColors {
  id: Theme;
  nombre: string;
  // Colores principales
  primary: string;
  secondary: string;
  accent1: string;
  accent2: string;
  accent3: string;
  // Colores de fondo
  background: string;
  backgroundGradient: string;
  // Colores de texto
  textPrimary: string;
  textSecondary: string;
  // Colores de UI
  cardBg: string;
  cardBgHover: string;
  inputBorder: string;
  inputFocus: string;
  buttonHover: string;
  error: string;
  success: string;
}

export const THEMES: Record<Theme, ThemeColors> = {
  // Pastel Calmado - RECOMENDADA
  diseno1: {
    id: 'diseno1',
    nombre: 'Pastel Calmado',
    primary: '#68A9FF',
    secondary: '#D3A1FF',
    accent1: '#A8C6FF',
    accent2: '#68A9FF',
    accent3: '#D3A1FF',
    background: '#78A9FF',
    backgroundGradient: 'from-[#78A9FF] via-[#A0BFFF] to-[#78A9FF]',
    textPrimary: '#1E3A5F',
    textSecondary: '#2C4A6E',
    cardBg: '#A0BFFF',
    cardBgHover: '#ABC9FF',
    inputBorder: '#A8C6FF',
    inputFocus: '#68A9FF',
    buttonHover: '#5898EF',
    error: '#E8A5A5',
    success: '#A6D1C1'
  },

  // Dark Mode
  diseno2: {
    id: 'diseno2',
    nombre: 'Dark',
    primary: '#4DBBFF',
    secondary: '#FF7EB6',
    accent1: '#F7D774',
    accent2: '#72E6C9',
    accent3: '#4DBBFF',
    background: '#0A0C14',
    backgroundGradient: 'from-[#141622] via-[#1F2332] to-[#141622]',
    textPrimary: '#F5F7FA',
    textSecondary: '#9CA3AF',
    cardBg: '#1F2332',
    cardBgHover: '#252938',
    inputBorder: '#2A2F3E',
    inputFocus: '#4DBBFF',
    buttonHover: '#3AABEF',
    error: '#FF6B6B',
    success: '#72E6C9'
  },

  // Vibrante Controlado - Nueva paleta alegre y tranquila
  diseno3: {
    id: 'diseno3',
    nombre: 'Vibrante Controlado',
    primary: '#5D8BDE',        // Azul claro con toque cálido
    secondary: '#A0E2D5',      // Verde menta suave
    accent1: '#5DC9D6',        // Turquesa calmado
    accent2: '#FF9F99',        // Coral suave
    accent3: '#D8A7FF',        // Violeta suave
    background: '#5D8BDE',     // Azul suave de fondo
    backgroundGradient: 'from-[#5A92F6] via-[#A0E2D5] to-[#D8A7FF]',
    textPrimary: '#2C3E5F',    // Azul grisáceo profundo
    textSecondary: '#5A7296',
    cardBg: '#E8F3FA',         // Fondo claro azul muy suave
    cardBgHover: '#D5EEFF',
    inputBorder: '#5DC9D6',
    inputFocus: '#5A92F6',
    buttonHover: '#4D7BCD',
    error: '#FF9F99',
    success: '#A0E2D5'
  }
};

export const getThemeColors = (theme: Theme): ThemeColors => {
  return THEMES[theme] || THEMES.diseno1;
};

export const isDarkTheme = (theme: Theme): boolean => {
  return theme === 'diseno2';
};