import { useState, useEffect } from 'react';
import { useApp, Theme, FontSize, NivelTEA } from '../context/AppContext';
import { Palette, Type, Brain, Check } from 'lucide-react';
import { getThemeColors, THEMES, isDarkTheme } from '../config/themes';
import { applyFontSize } from '../config/fontSize';
import BackgroundBubbles from './ui/BackgroundBubbles';

export default function ConfiguracionInicial() {
  const { theme, setTheme, fontSize, setFontSize, nivelTEA, setNivelTEA, setCurrentScreen } = useApp();
  const themeColors = getThemeColors(theme);

  // Aplicar cambios en tiempo real
  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  const handleContinue = () => {
    setCurrentScreen('anadir-responsable');
  };

  const handleSeleccionarFontSize = (size: FontSize) => {
    setFontSize(size);
  };

  const fontSizeOptions: { size: FontSize; label: string; px: string }[] = [
    { size: 'pequeña', label: 'Pequeño', px: '14px' },
    { size: 'normal', label: 'Normal', px: '16px' },
    { size: 'grande', label: 'Grande', px: '18px' }
  ];

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-6 bg-gradient-to-br ${themeColors.backgroundGradient} relative overflow-hidden transition-all duration-500`}
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Glassmorphism background */}
      {theme === 'diseno1' ? (
        <BackgroundBubbles />
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              backgroundColor: themeColors.primary,
              animationDuration: '5s'
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              backgroundColor: themeColors.secondary,
              animationDelay: '2s',
              animationDuration: '6s'
            }}
          ></div>
        </div>
      )}

      <div 
        className="w-full max-w-2xl rounded-3xl shadow-2xl p-10 relative z-10 border backdrop-blur-xl hover:scale-[1.01] transition-transform duration-300"
        style={{ 
          backgroundColor: isDarkTheme(theme) ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
          borderColor: `${themeColors.primary}50`,
          boxShadow: theme === 'diseno1' 
            ? `0 40px 80px -20px ${themeColors.primary}60, 0 20px 40px -10px ${themeColors.primary}50, 0 10px 20px -5px ${themeColors.primary}40, 0 0 0 2px ${themeColors.primary}30, inset 0 2px 4px rgba(255, 255, 255, 0.3)`
            : `0 25px 50px -12px ${themeColors.primary}20`,
          transform: theme === 'diseno1' ? 'translateZ(50px) translateY(-10px)' : undefined
        }}
      >
        <div className="text-center mb-10">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
            }}
          >
            <Palette className="text-white" size={28} />
          </div>
          <h1 style={{ color: themeColors.textPrimary }} className="mb-3">
            Personaliza tu experiencia
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            Los cambios se aplican en tiempo real
          </p>
        </div>

        <div className="space-y-8">
          {/* Selección de tema */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: themeColors.primary }}
              >
                <Palette className="text-white" size={20} />
              </div>
              <h2 style={{ color: themeColors.textPrimary }}>Tema visual</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-[1.03] hover:shadow-xl relative ${
                    theme === t.id ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: t.id === 'diseno2' ? t.cardBg : t.id === 'diseno3' ? `${t.cardBg}E6` : `${t.cardBg}F5`,
                    borderColor: theme === t.id ? t.primary : t.inputBorder,
                    ringColor: t.primary,
                    boxShadow: theme === t.id ? `0 0 0 4px ${t.primary}20` : undefined
                  }}
                >
                  {theme === t.id && (
                    <div 
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-fadeIn"
                      style={{ backgroundColor: t.success }}
                    >
                      <Check className="text-white" size={14} />
                    </div>
                  )}

                  <p 
                    style={{ color: t.textPrimary }} 
                    className="mb-4"
                  >
                    {t.nombre}
                  </p>
                  <div className="flex gap-2 justify-center mb-4">
                    {[t.primary, t.secondary, t.accent1, t.accent2, t.accent3].map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-lg shadow-md transition-all hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${t.backgroundGradient}`}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Tamaño de fuente */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: themeColors.secondary }}
              >
                <Type className="text-white" size={20} />
              </div>
              <h2 style={{ color: themeColors.textPrimary }}>Tamaño de letra</h2>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.size}
                  onClick={() => handleSeleccionarFontSize(option.size)}
                  className={`rounded-xl p-6 border transition-all hover:scale-[1.03] hover:shadow-xl ${
                    fontSize === option.size ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
                    borderColor: fontSize === option.size ? themeColors.secondary : themeColors.inputBorder,
                    ringColor: themeColors.secondary,
                    boxShadow: fontSize === option.size ? `0 0 0 4px ${themeColors.secondary}20` : undefined
                  }}
                >
                  {fontSize === option.size && (
                    <div 
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center animate-fadeIn"
                      style={{ backgroundColor: themeColors.success }}
                    >
                      <Check className="text-white" size={12} />
                    </div>
                  )}
                  <p 
                    style={{ 
                      color: themeColors.textPrimary,
                      fontSize: option.px
                    }}
                    className="mb-2"
                  >
                    {option.label}
                  </p>
                  <div 
                    style={{ 
                      color: themeColors.textSecondary,
                      fontSize: option.px
                    }}
                    className="font-mono"
                  >
                    Aa Bb Cc
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Nivel TEA */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: themeColors.accent1 }}
              >
                <Brain className="text-white" size={20} />
              </div>
              <h2 style={{ color: themeColors.textPrimary }}>Nivel TEA</h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[1, 2].map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => setNivelTEA(nivel as NivelTEA)}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-[1.03] hover:shadow-xl relative ${
                    nivelTEA === nivel ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
                    borderColor: nivelTEA === nivel ? themeColors.accent1 : themeColors.inputBorder,
                    ringColor: themeColors.accent1,
                    boxShadow: nivelTEA === nivel ? `0 0 0 4px ${themeColors.accent1}20` : undefined
                  }}
                >
                  {nivelTEA === nivel && (
                    <div 
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center animate-fadeIn"
                      style={{ backgroundColor: themeColors.success }}
                    >
                      <Check className="text-white" size={12} />
                    </div>
                  )}
                  <h3 style={{ color: themeColors.textPrimary }} className="mb-2">
                    Nivel {nivel}
                  </h3>
                  <p style={{ color: themeColors.textSecondary }}>
                    {nivel === 1 
                      ? 'Apoyo más detallado y guiado' 
                      : 'Mayor autonomía e independencia'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full text-white py-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] mt-10 group relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
          }}
        >
          <span className="relative z-10">Continuar</span>
          <div 
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          ></div>
        </button>
      </div>
    </div>
  );
}