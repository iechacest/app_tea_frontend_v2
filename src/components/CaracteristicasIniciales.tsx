import { useState } from 'react';
import { useApp, Caracteristica, UsuarioCompleto } from '../context/AppContext';
import { Sliders, MessageCircle, Eye, Boxes, Heart, Users } from 'lucide-react';
import { getContrasenaTemp } from './Registro';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';

const caracteristicasDefault = [
  {
    id: 'comunicacion-verbal',
    nombre: 'Comunicación verbal',
    descripcion: 'Capacidad para expresar ideas con claridad',
    icon: MessageCircle,
    colorKey: 'primary' as const
  },
  {
    id: 'atencion-conjunta',
    nombre: 'Atención conjunta',
    descripcion: 'Habilidad para compartir atención con otros',
    icon: Eye,
    colorKey: 'secondary' as const
  },
  {
    id: 'organizacion',
    nombre: 'Organización',
    descripcion: 'Capacidad para planificar y estructurar tareas',
    icon: Boxes,
    colorKey: 'accent1' as const
  },
  {
    id: 'expresion-emocional',
    nombre: 'Expresión emocional',
    descripcion: 'Habilidad para identificar y expresar emociones',
    icon: Heart,
    colorKey: 'accent2' as const
  },
  {
    id: 'comprension-social',
    nombre: 'Comprensión social',
    descripcion: 'Entendimiento de normas y situaciones sociales',
    icon: Users,
    colorKey: 'accent3' as const
  }
];

export default function CaracteristicasIniciales() {
  const { 
    setCaracteristicas, 
    setCurrentScreen, 
    usuario,
    theme,
    fontSize,
    nivelTEA,
    responsable,
    usuarios,
    setUsuarios,
    setUsuarioActual,
    setTheme,
    setFontSize,
    setNivelTEA
  } = useApp();
  
  const themeColors = getThemeColors(theme);
  const [valores, setValores] = useState<{ [key: string]: number }>(
    caracteristicasDefault.reduce((acc, c) => ({ ...acc, [c.id]: 5 }), {})
  );

  const handleChange = (id: string, valor: number) => {
    setValores({
      ...valores,
      [id]: valor
    });
  };

  const handleSubmit = () => {
    const caracteristicasIniciales: Caracteristica[] = caracteristicasDefault.map(c => ({
      id: c.id,
      nombre: c.nombre,
      descripcion: c.descripcion,
      valorInicial: valores[c.id],
      valorActual: valores[c.id]
    }));

    setCaracteristicas(caracteristicasIniciales);

    // Crear usuario completo y guardarlo
    if (usuario) {
      const nuevoUsuario: UsuarioCompleto = {
        ...usuario,
        contrasena: getContrasenaTemp(),
        theme,
        fontSize,
        nivelTEA,
        responsable,
        caracteristicas: caracteristicasIniciales
      };

      setUsuarios([...usuarios, nuevoUsuario]);
      setUsuarioActual(nuevoUsuario);
    }

    setCurrentScreen('menu-principal');
  };

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-6 bg-gradient-to-br ${themeColors.backgroundGradient} relative overflow-hidden`}
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
        className="w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative z-10 backdrop-blur-xl border hover:scale-[1.01] transition-transform duration-300"
        style={{ 
          backgroundColor: isDarkTheme(theme) ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
          borderColor: `${themeColors.primary}50`,
          boxShadow: theme === 'diseno1' 
            ? `0 40px 80px -20px ${themeColors.primary}60, 0 20px 40px -10px ${themeColors.primary}50, 0 10px 20px -5px ${themeColors.primary}40, 0 0 0 2px ${themeColors.primary}30, inset 0 2px 4px rgba(255, 255, 255, 0.3)`
            : `0 25px 50px -12px ${themeColors.primary}20`,
          transform: theme === 'diseno1' ? 'translateZ(50px) translateY(-10px)' : undefined
        }}
      >
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
            }}
          >
            <Sliders className="text-white" size={32} />
          </div>
          <h1 style={{ color: themeColors.textPrimary }} className="mb-2">
            Características iniciales
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            Evalúa tu nivel actual en cada área
          </p>
        </div>

        <div className="space-y-6">
          {caracteristicasDefault.map((caracteristica) => {
            const Icon = caracteristica.icon;
            const cardColor = themeColors[caracteristica.colorKey];
            
            return (
              <div 
                key={caracteristica.id} 
                className="rounded-2xl p-6 border-2 transition-all hover:scale-[1.02] hover:shadow-lg duration-300"
                style={{
                  backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
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
                    <h3 style={{ color: themeColors.textPrimary }} className="mb-1">
                      {caracteristica.nombre}
                    </h3>
                    <p style={{ color: themeColors.textSecondary }}>
                      {caracteristica.descripcion}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span style={{ color: themeColors.textPrimary }}>1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={valores[caracteristica.id]}
                    onChange={(e) => handleChange(caracteristica.id, parseInt(e.target.value))}
                    className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${cardColor} 0%, ${cardColor} ${(valores[caracteristica.id] - 1) * 11.11}%, ${cardColor}30 ${(valores[caracteristica.id] - 1) * 11.11}%, ${cardColor}30 100%)`,
                      accentColor: cardColor
                    }}
                  />
                  <span style={{ color: themeColors.textPrimary }}>10</span>
                  <div className="min-w-[3rem] text-center">
                    <span 
                      className="inline-flex items-center justify-center w-12 h-12 text-white rounded-xl shadow-md"
                      style={{
                        backgroundColor: cardColor
                      }}
                    >
                      {valores[caracteristica.id]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full text-white py-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] mt-8"
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
          }}
        >
          Guardar y continuar
        </button>
      </div>
    </div>
  );
}