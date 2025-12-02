import { useApp } from '../context/AppContext';
import { ArrowLeft, TrendingUp, Minus, TrendingDown, Mail, CheckCircle, Smile, MessageCircle, Eye, Boxes, Heart, Users } from 'lucide-react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';
import { useState, useEffect } from 'react';
import { generarInforme, generarInformeEmocional, enviarInforme } from "../api/api";


export default function MiInforme() {
  const { caracteristicas, setCurrentScreen, responsable, chats, theme, usuarioActual } = useApp();
  const themeColors = getThemeColors(theme);
  const [emailEnviado, setEmailEnviado] = useState(false);

  // Mapeo de iconos y colores para cada característica
  const caracteristicasConfig: { [key: string]: { icon: any; colorKey: 'primary' | 'secondary' | 'accent1' | 'accent2' | 'accent3' } } = {
    'comunicacion-verbal': { icon: MessageCircle, colorKey: 'primary' },
    'atencion-conjunta': { icon: Eye, colorKey: 'secondary' },
    'organizacion': { icon: Boxes, colorKey: 'accent1' },
    'expresion-emocional': { icon: Heart, colorKey: 'accent2' },
    'comprension-social': { icon: Users, colorKey: 'accent3' }
  };

  const calcularCambio = (caracteristica: any) => {
    const cambio = caracteristica.valorActual - caracteristica.valorInicial;
    if (cambio > 0) return 'mejora';
    if (cambio < 0) return 'retroceso';
    return 'estable';
  };

  const getIconoCambio = (tipo: string) => {
    switch (tipo) {
      case 'mejora':
        return <TrendingUp style={{ color: themeColors.success }} size={24} />;
      case 'retroceso':
        return <TrendingDown style={{ color: themeColors.error }} size={24} />;
      default:
        return <Minus style={{ color: themeColors.secondary }} size={24} />;
    }
  };

  const handleEnviarInforme = async () => {
  if (!usuarioActual) return;

  try {
    setEmailEnviado(true);
    const resp = await enviarInforme(usuarioActual.id_usuario);
    console.log(resp);
  } catch (error) {
    console.error("Error enviando informe:", error);
  } finally {
    setTimeout(() => setEmailEnviado(false), 3000);
  }
};

  const [informeEmocional, setInformeEmocional] = useState<string>("Cargando informe...");

  useEffect(() => {
  if (!usuarioActual) return;

  generarInformeEmocional(usuarioActual.id_usuario)
    .then(txt => setInformeEmocional(txt))
    .catch(() => setInformeEmocional("No se pudo generar el informe."));
}, []);

const [informeGeneral, setInformeGeneral] = useState<string>("");

useEffect(() => {
  if (!usuarioActual) return;

  generarInforme(usuarioActual.id_usuario)
    .then(txt => setInformeGeneral(txt))
    .catch(() => setInformeGeneral("No se pudo generar el informe."));
}, []);



  return (
    <div 
      className={`min-h-screen p-6 relative overflow-hidden bg-gradient-to-br ${themeColors.backgroundGradient}`}
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Burbujas de fondo */}
      {theme === 'diseno1' && <BackgroundBubbles />}
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentScreen('menu-principal')}
            className="p-3 rounded-xl shadow-lg transition-all hover:scale-110 hover:shadow-xl border"
            style={{
              backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
              borderColor: `${themeColors.primary}30`
            }}
          >
            <ArrowLeft style={{ color: themeColors.primary }} size={24} />
          </button>
          <h1 style={{ color: theme === 'diseno2' ? themeColors.textPrimary : 'white' }}>
            Mi Informe de Progreso
          </h1>
        </div>

        {/* Resumen Emocional */}
        <div 
          className="rounded-3xl shadow-lg p-8 mb-6 backdrop-blur-xl border"
          style={{
            backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'white',
            borderColor: `${themeColors.primary}20`
          }}
        >
          <h2 style={{ color: themeColors.textPrimary }} className="mb-4">
            Resumen Emocional
          </h2>
          <div 
            className="rounded-2xl p-6"
            style={{
              background: `linear-gradient(to right, ${themeColors.primary}15, ${themeColors.secondary}15)`
            }}
          >
            <div style={{ whiteSpace: "pre-line", color: themeColors.textPrimary }}>
  {informeEmocional}
</div>

            {chats.length > 0 && (
              <div 
                className="mt-4 pt-4 border-t"
                style={{ borderColor: `${themeColors.secondary}30` }}
              >
                <p style={{ color: themeColors.textSecondary }}>
                  Total de conversaciones: {chats.length}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 p-4 rounded-lg border"
     style={{ color: themeColors.textPrimary, whiteSpace: "pre-line" }}>
  {informeGeneral}
</div>


        {/* Progreso en Características */}
        <div 
          className="rounded-3xl shadow-lg p-8 mb-6 backdrop-blur-xl border"
          style={{
            backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'white',
            borderColor: `${themeColors.primary}20`
          }}
        >
          <h2 style={{ color: themeColors.textPrimary }} className="mb-6">
            Progreso en Características
          </h2>
          <div className="space-y-6">
            {caracteristicas.map((caracteristica) => {
              const tipoCambio = calcularCambio(caracteristica);
              const cambioValor = caracteristica.valor_actual - caracteristica.valor_inicial;
              const config = caracteristicasConfig[caracteristica.id_caracteristica] || { icon: MessageCircle, colorKey: 'primary' };
              const Icon = config.icon;
              const cardColor = themeColors[config.colorKey];

              return (
                <div 
                  key={caracteristica.id_caracteristica} 
                  className="rounded-2xl p-6 border-2 transition-all hover:scale-[1.02] hover:shadow-lg duration-300"
                  style={{
                    backgroundColor: isDarkTheme(theme) ? `${cardColor}15` : `${cardColor}12`,
                    borderColor: `${cardColor}40`,
                    boxShadow: `0 4px 12px ${cardColor}20`
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                      style={{ 
                        backgroundColor: cardColor,
                      }}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 style={{ color: themeColors.textPrimary }} className="mb-1">
                            {caracteristica.nombre}
                          </h3>
                          <p style={{ color: themeColors.textSecondary }}>
                            {caracteristica.descripcion}
                          </p>
                        </div>
                        <div className="ml-4">
                          {getIconoCambio(tipoCambio)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span style={{ color: themeColors.textSecondary }}>
                          Inicial: {caracteristica.valor_inicial}
                        </span>
                        <span style={{ color: themeColors.textSecondary }}>
                          Actual: {caracteristica.valor_actual}
                        </span>
                      </div>
                      <div 
                        className="h-3 rounded-full overflow-hidden"
                        style={{ backgroundColor: `${cardColor}30` }}
                      >
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${caracteristica.valor_actual * 10}%`,
                            backgroundColor: cardColor
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center min-w-[4rem]">
                      <div 
                        className="inline-flex items-center justify-center w-12 h-12 text-white rounded-xl shadow-md"
                        style={{
                          backgroundColor: tipoCambio === 'mejora' ? themeColors.success :
                                         tipoCambio === 'retroceso' ? themeColors.error :
                                         themeColors.secondary
                        }}
                      >
                        {cambioValor > 0 ? '+' : ''}{cambioValor}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-4">
          {responsable && (
            <button
              onClick={handleEnviarInforme}
              disabled={emailEnviado}
              className="text-white py-4 px-6 rounded-2xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: emailEnviado 
                  ? `linear-gradient(135deg, ${themeColors.success}, ${themeColors.accent2})`
                  : `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
              }}
            >
              {emailEnviado ? (
                <>
                  <CheckCircle size={24} />
                  <span>Informe enviado a {responsable.nombre}</span>
                </>
              ) : (
                <>
                  <Mail size={24} />
                  <span>Enviar informe a {responsable.nombre}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setCurrentScreen('menu-principal')}
            className="py-4 px-6 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] border"
            style={{
              backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
              color: themeColors.primary,
              borderColor: themeColors.inputBorder
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = themeColors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = themeColors.inputBorder;
            }}
          >
            Volver al menú
          </button>
        </div>
      </div>
      {isDarkTheme(theme) && <BackgroundBubbles />}
    </div>
  );
}