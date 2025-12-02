import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MessageSquare, Home, Users, School, Building2, MessageCircle, Lightbulb, Check } from 'lucide-react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';

type Objetivo = 'comunicacion-verbal' | 'frases-no-literales';
type Contexto = 'casa' | 'familia-amigos' | 'escuela' | 'espacio-publico';

export default function SeleccionChat() {
  const { setCurrentScreen, crearNuevoChat, theme } = useApp();
  const themeColors = getThemeColors(theme);
  const [paso, setPaso] = useState<'objetivo' | 'contexto'>('objetivo');
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [contexto, setContexto] = useState<Contexto | null>(null);

  const objetivos = [
    {
      id: 'comunicacion-verbal' as Objetivo,
      titulo: 'Mejorar comunicación verbal',
      descripcion: 'Practicar expresión y claridad al hablar',
      Icon: MessageCircle
    },
    {
      id: 'frases-no-literales' as Objetivo,
      titulo: 'Entender frases no literales',
      descripcion: 'Comprender expresiones figuradas',
      Icon: Lightbulb
    }
  ];

  const contextos = [
    {
      id: 'casa' as Contexto,
      titulo: 'Casa',
      descripcion: 'Conversaciones en el hogar',
      icon: Home
    },
    {
      id: 'familia-amigos' as Contexto,
      titulo: 'Familia y amigos',
      descripcion: 'Situaciones sociales cercanas',
      icon: Users
    },
    {
      id: 'escuela' as Contexto,
      titulo: 'Escuela',
      descripcion: 'Entorno educativo',
      icon: School
    },
    {
      id: 'espacio-publico' as Contexto,
      titulo: 'Espacio público',
      descripcion: 'Lugares y situaciones públicas',
      icon: Building2
    }
  ];

  const handleObjetivoSelect = (obj: Objetivo) => {
    setObjetivo(obj);
    setPaso('contexto');
  };

  const handleContextoSelect = (ctx: Contexto) => {
    setContexto(ctx);
  };

  const handleCrearChat = () => {
    if (objetivo && contexto) {
      crearNuevoChat(objetivo, contexto); // Crea el chat y pasa los datos
      setCurrentScreen('chat'); // Redirige a la pantalla del chat
    }
  };

  return (
    <div 
      className={`min-h-screen p-6 relative overflow-hidden bg-gradient-to-br ${themeColors.backgroundGradient}`}
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Glassmorphism background */}
      {theme === 'diseno1' ? (
        <BackgroundBubbles />
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              backgroundColor: themeColors.primary,
              animationDuration: '5s'
            }}
          ></div>
          <div 
            className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              backgroundColor: themeColors.secondary,
              animationDelay: '2s',
              animationDuration: '6s'
            }}
          ></div>
        </div>
      )}

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              if (paso === 'contexto') {
                setPaso('objetivo');
                setContexto(null);
              } else {
                setCurrentScreen('menu-principal');
              }
            }}
            className="p-3 rounded-xl shadow-lg transition-all hover:scale-110 hover:shadow-xl border"
            style={{
              backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
              borderColor: `${themeColors.primary}30`
            }}
          >
            <ArrowLeft style={{ color: themeColors.primary }} size={24} />
          </button>
          <div>
            <h1 style={{ color: theme === 'diseno2' ? themeColors.textPrimary : 'white' }}>
              Nuevo Chat
            </h1>
            <p style={{ color: theme === 'diseno2' ? themeColors.textSecondary : 'rgba(255,255,255,0.8)' }}>
              {paso === 'objetivo' ? 'Paso 1 de 2' : 'Paso 2 de 2'}
            </p>
          </div>
        </div>

        {/* Selección de objetivo */}
        {paso === 'objetivo' && (
          <div className="space-y-4">
            <div 
              className="backdrop-blur-xl rounded-2xl p-6 mb-6 border shadow-xl"
              style={{
                backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'rgba(255,255,255,0.9)',
                borderColor: `${themeColors.primary}30`
              }}
            >
              <h2 style={{ color: themeColors.textPrimary }} className="mb-2">
                ¿Qué necesitas?
              </h2>
              <p style={{ color: themeColors.textSecondary }}>
                Selecciona tu objetivo principal
              </p>
            </div>

            {objetivos.map((obj) => {
              const IconObjetivo = obj.Icon;
              return (
                <button
                  key={obj.id}
                  onClick={() => handleObjetivoSelect(obj.id)}
                  className={`w-full rounded-3xl p-8 shadow-lg transition-all hover:scale-[1.03] hover:shadow-2xl border-2 relative ${
                    objetivo === obj.id ? 'ring-2' : ''
                  }`}
                  style={{
                  backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
                  borderColor: objetivo === obj.id ? themeColors.primary : themeColors.inputBorder,
                  boxShadow: objetivo === obj.id
                    ? `0 0 0 4px ${themeColors.primary}20`
                    : "none"
                  }}
                >
                  {objetivo === obj.id && (
                    <div 
                      className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-fadeIn"
                      style={{ backgroundColor: themeColors.success }}
                    >
                      <Check className="text-white" size={14} />
                    </div>
                  )}
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                      }}
                    >
                      <IconObjetivo className="text-white" size={32} />
                    </div>
                    <div className="text-left flex-1">
                      <h3 style={{ color: themeColors.textPrimary }} className="mb-2">
                        {obj.titulo}
                      </h3>
                      <p style={{ color: themeColors.textSecondary }}>
                        {obj.descripcion}
                      </p>
                    </div>
                    <MessageSquare style={{ color: themeColors.primary }} size={32} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selección de contexto */}
        {paso === 'contexto' && (
          <div className="space-y-4">
            <div 
              className="backdrop-blur-xl rounded-2xl p-6 mb-6 border shadow-xl"
              style={{
                backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'rgba(255,255,255,0.9)',
                borderColor: `${themeColors.primary}30`
              }}
            >
              <h2 style={{ color: themeColors.textPrimary }} className="mb-2">
                ¿En qué contexto?
              </h2>
              <p style={{ color: themeColors.textSecondary }}>
                Selecciona dónde lo vas a usar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contextos.map((ctx) => {
                const Icon = ctx.icon;
                return (
                  <button
                    key={ctx.id}
                    onClick={() => handleContextoSelect(ctx.id)}
                    className={`rounded-3xl p-6 shadow-lg transition-all hover:scale-[1.03] hover:shadow-2xl border-2 relative ${
                      contexto === ctx.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
                      borderColor: contexto === ctx.id ? themeColors.primary : themeColors.inputBorder,
                      boxShadow: contexto === ctx.id 
                        ? `0 0 0 4px ${themeColors.primary}40` 
                        : "none"
                      }}
                  >
                    {contexto === ctx.id && (
                      <div 
                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-fadeIn"
                        style={{ backgroundColor: themeColors.success }}
                      >
                        <Check className="text-white" size={12} />
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.accent1}, ${themeColors.accent2})`
                        }}
                      >
                        <Icon className="text-white" size={32} />
                      </div>
                      <div>
                        <h3 style={{ color: themeColors.textPrimary }} className="mb-1">
                          {ctx.titulo}
                        </h3>
                        <p style={{ color: themeColors.textSecondary }}>
                          {ctx.descripcion}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {contexto && (
              <button
                onClick={handleCrearChat}
                className="w-full text-white py-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] mt-6 relative overflow-hidden group"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                <span className="relative z-10">Comenzar conversación</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
