import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Theme, FontSize, NivelTEA } from '../context/AppContext';
import { ArrowLeft, Palette, Type, Brain, Save, Check, Eye } from 'lucide-react';
import { getThemeColors, THEMES, isDarkTheme } from '../config/themes';
import { applyFontSize } from '../config/fontSize';
import BackgroundBubbles from './ui/BackgroundBubbles';
import { guardarConfiguracion } from "../api/api";
import { actualizarNivelTEA } from '../api/api';

export default function Configuracion() {
  const { 
  theme, setTheme,
  fontSize, setFontSize,
  nivelTEA, setNivelTEA,
  setCurrentScreen,
  usuarioActual
} = useApp();

  const themeColors = getThemeColors(theme);
 const temaActual = THEMES[theme] ?? THEMES["diseno1"];
  const [temaOriginal, setTemaOriginal] = useState<Theme>(theme);
  const [fontSizeOriginal, setFontSizeOriginal] = useState<FontSize>(fontSize);
  const [nivelOriginal, setNivelOriginal] = useState<NivelTEA>(nivelTEA);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    setTemaOriginal(theme);
    setFontSizeOriginal(fontSize);
    setNivelOriginal(nivelTEA);
  }, []);

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  const handleSeleccionarTema = (nuevoTema: Theme) => {
    setTheme(nuevoTema);
  };

  const handleSeleccionarFontSize = (nuevoSize: FontSize) => {
  setFontSize(nuevoSize);  // Asegúrate de que esto está actualizando correctamente
};


  const handleSeleccionarNivel = (nuevoNivel: NivelTEA) => {
    setNivelTEA(nuevoNivel);
  };

  
const handleGuardar = async () => {
  if (!usuarioActual) return;

  // Verificar valores antes de enviar
  console.log("Guardando configuración:", {
    id_usuario: usuarioActual.id_usuario,
    tema_visual: theme,
    tamanio_fuente: fontSize,
    nivel_tea: nivelTEA,
  });

  try {
    await guardarConfiguracion({
  id_usuario: usuarioActual.id_usuario,
  tema_visual: theme,
  tamanio_fuente: fontSize
});

await actualizarNivelTEA(usuarioActual.id_usuario, nivelTEA);
    setTemaOriginal(theme);
    setFontSizeOriginal(fontSize);
    setNivelOriginal(nivelTEA);

    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  } catch (err) {
    console.error("Error guardando configuración:", err);
    alert("No se pudo guardar la configuración");
  }
};


  const handleCancelar = () => {
    setTheme(temaOriginal);
    setFontSize(fontSizeOriginal);
    setNivelTEA(nivelOriginal);
    applyFontSize(fontSizeOriginal);
    setCurrentScreen('menu-principal');
  };

  const hayaCambios = theme !== temaOriginal || fontSize !== fontSizeOriginal || nivelTEA !== nivelOriginal;

  const fontSizeOptions: { size: FontSize; label: string; px: string }[] = [
    { size: 'pequeña', label: 'Pequeño', px: '14px' },
    { size: 'normal', label: 'Normal', px: '16px' },
    { size: 'grande', label: 'Grande', px: '18px' }
  ];

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${themeColors.backgroundGradient} p-6 relative overflow-hidden transition-all duration-500`}
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Glassmorphism background */}
      <BackgroundBubbles />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={handleCancelar}
            className="flex items-center gap-2 text-white hover:scale-105 transition-all group px-4 py-2 rounded-xl backdrop-blur-sm"
            style={{ backgroundColor: `${themeColors.cardBg}40` }}
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span>Volver</span>
          </button>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                <Palette className="text-white" size={20} />
              </div>
              <h1 className="text-white">Configuración</h1>
            </div>
            <div 
              className="px-4 py-1.5 rounded-lg backdrop-blur-sm border"
              style={{ 
                backgroundColor: `${themeColors.cardBg}60`,
                borderColor: `${themeColors.primary}40`,
                color: 'white'
              }}
            >
              <span className="text-sm">Tema actual: {temaActual?.nombre ?? "Tema inválido"}</span>

            </div>
          </div>

          <div className="w-20"></div>
        </div>

        <div className="space-y-6">
          {/* Preview Badge */}
          <div 
            className="rounded-2xl p-4 backdrop-blur-xl border flex items-center gap-3 justify-center"
            style={{ 
              backgroundColor: theme === 'diseno3' ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}90`,
              borderColor: `${themeColors.primary}30`,
            }}
          >
            <Eye style={{ color: themeColors.primary }} size={20} />
            <p style={{ color: themeColors.textPrimary }}>
              Vista previa en tiempo real - Los cambios se aplican instantáneamente
            </p>
          </div>

          {/* Selector de Tema */}
          <div 
            className="rounded-2xl p-8 shadow-2xl border backdrop-blur-xl transition-all duration-500"
            style={{ 
              backgroundColor: theme === 'diseno3' ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
              borderColor: `${themeColors.primary}30`,
              boxShadow: `0 20px 60px -15px ${themeColors.primary}30`
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110 duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                <Palette className="text-white" size={24} />
              </div>
              <div>
                <h2 style={{ color: themeColors.textPrimary }}>Tema Visual</h2>
                <p style={{ color: themeColors.textSecondary }}>Elige el estilo que más te guste</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSeleccionarTema(t.id)}
                  className={`rounded-xl p-6 border transition-all hover:scale-[1.03] hover:shadow-xl group relative overflow-hidden ${
                    theme === t.id ? 'ring-2' : ''
                  }`}
                  style={{
  backgroundColor: t.id === 'diseno2' 
    ? `${t.cardBg}E6` 
    : `${t.cardBg}F5`, // solo si son HEX válidos 
  borderColor: theme === t.id ? t.primary : t.inputBorder,
  boxShadow: theme === t.id 
    ? `0 0 0 4px ${t.primary}20` 
    : "none"
}}

                >
                  {theme === t.id && (
                    <div 
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: t.success }}
                    >
                      <Check className="text-white" size={14} />
                    </div>
                  )}

                  <div className="text-center">
                    <h3 style={{ color: t.textPrimary }} className="mb-4">
                      {t.nombre}
                    </h3>
                    
                    <div className="flex gap-2 justify-center mb-4">
                      {[t.primary, t.secondary, t.accent1, t.accent2, t.accent3].map((color, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-lg shadow-md transition-all group-hover:scale-110"
                          style={{ 
                            backgroundColor: color,
                            animationDelay: `${idx * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>

                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${t.backgroundGradient}`}
                    ></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Tamaño de Fuente */}
          <div 
            className="rounded-2xl p-8 shadow-2xl border backdrop-blur-xl transition-all duration-500"
            style={{ 
              backgroundColor: theme === 'diseno3' ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
              borderColor: `${themeColors.secondary}30`,
              boxShadow: `0 20px 60px -15px ${themeColors.secondary}30`
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110 duration-300"
                style={{ backgroundColor: themeColors.secondary }}
              >
                <Type className="text-white" size={24} />
              </div>
              <div>
                <h2 style={{ color: themeColors.textPrimary }}>Tamaño de Texto</h2>
                <p style={{ color: themeColors.textSecondary }}>Ajusta la legibilidad según tu preferencia</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.size}
                  onClick={() => handleSeleccionarFontSize(option.size)}
                  className={`rounded-xl p-6 border transition-all hover:scale-[1.03] hover:shadow-xl 
  ${fontSize === option.size ? 'ring-2 ring-offset-2 ring-' + themeColors.secondary : ''}`}
style={{
  backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
  borderColor: fontSize === option.size ? themeColors.secondary : themeColors.inputBorder,
  boxShadow: fontSize === option.size 
    ? `0 0 0 4px ${themeColors.secondary}20`
    : undefined
}}

                >
                  <div className="text-center">
                    {fontSize === option.size && (
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: themeColors.success }}
                      >
                        <Check className="text-white" size={14} />
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
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Nivel TEA */}
          <div 
            className="rounded-2xl p-8 shadow-2xl border backdrop-blur-xl transition-all duration-500"
            style={{ 
              backgroundColor: theme === 'diseno3' ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
              borderColor: `${themeColors.accent1}30`,
              boxShadow: `0 20px 60px -15px ${themeColors.accent1}30`
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110 duration-300"
                style={{ backgroundColor: themeColors.accent1 }}
              >
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h2 style={{ color: themeColors.textPrimary }}>Nivel TEA</h2>
                <p style={{ color: themeColors.textSecondary }}>Personaliza la experiencia según tus necesidades</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[1, 2].map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => handleSeleccionarNivel(nivel as NivelTEA)}
                  className={`rounded-xl p-6 border transition-all hover:scale-[1.03] hover:shadow-xl ${
  nivelTEA === nivel ? '' : ''
}`}
style={{
  backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
  borderColor: nivelTEA === nivel ? themeColors.accent1 : themeColors.inputBorder,
  boxShadow: nivelTEA === nivel
    ? `0 0 0 3px ${themeColors.accent1}55`
    : undefined
}}

                >
                  <div className="text-center">
                    {nivelTEA === nivel && (
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: themeColors.success }}
                      >
                        <Check className="text-white" size={14} />
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
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          {hayaCambios && (
            <div className="flex gap-4 animate-fadeIn">
              <button
                onClick={handleCancelar}
                className="flex-1 py-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
                  color: themeColors.textPrimary,
                  borderColor: themeColors.inputBorder
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="flex-1 text-white py-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Save size={20} />
                  Guardar cambios
                </span>
                <div 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                ></div>
              </button>
            </div>
          )}

          {guardado && (
            <div 
              className="rounded-xl p-4 text-center animate-fadeIn border"
              style={{ 
                backgroundColor: `${themeColors.success}15`,
                borderColor: `${themeColors.success}60`,
                color: themeColors.success
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Check size={20} />
                Cambios guardados exitosamente
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}