import { useApp } from '../context/AppContext';
import { MessageSquarePlus, MessageSquare, FileText, User, Settings, LogOut, HelpCircle, Info, ChevronDown, Type, Check } from 'lucide-react';
import { getThemeColors, THEMES, isDarkTheme } from '../config/themes';
import { useState } from 'react';
import BackgroundBubbles from './ui/BackgroundBubbles';
import LightGlows from './ui/LightGlows';
import { solicitarCodigo, validarCodigo } from '../api/api';


export default function MenuPrincipal() {
  const { 
  usuario, 
  usuarioActual, 
  responsable,        // <- añadimos esto
  setCurrentScreen, 
  chats, 
  theme, 
  nivelTEA, 
  fontSize, 
  setFontSize, 
  setUsuarioActual 
} = useApp();

  const themeColors = getThemeColors(theme);
  const [mostrarModalCodigo, setMostrarModalCodigo] = useState(false);
const [codigoAcceso, setCodigoAcceso] = useState("");
const [validandoCodigo, setValidandoCodigo] = useState(false);

  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarFontSize, setMostrarFontSize] = useState(false);

  const nombreUsuario = usuarioActual?.nombres || usuario?.nombres || 'Usuario';
  const temaActual = THEMES[theme];

  const handleCerrarSesion = () => {
    setUsuarioActual(null);
    setCurrentScreen('login');
  };

  const handleSolicitarCodigo = async () => {
  if (!usuarioActual) {
    alert("No hay sesión activa.");
    return;
  }

  if (!responsable) {
    alert("No tienes un responsable vinculado.");
    return;
  }

  try {
    setValidandoCodigo(true);

    // 🔥 Aquí generas el código y se envía al correo del responsable
    const resp = await solicitarCodigo(
      usuarioActual.id_usuario,
      responsable.id_responsable
    );

    console.log("Código generado:", resp);

    // Abrimos el modal para escribir el código
    setMostrarModalCodigo(true);

  } catch (error) {
    console.error(error);
    alert("Error generando el código de autorización");
  } finally {
    setValidandoCodigo(false);
  }
};
  const seccionConversacion = [
    {
      icon: MessageSquarePlus,
      titulo: 'Nuevo Chat',
      descripcion: 'Comenzar una nueva conversación',
      color: themeColors.primary,
      onClick: () => setCurrentScreen('seleccion-chat')
    },
    {
      icon: MessageSquare,
      titulo: 'Continuar Chat',
      descripcion: 'Retomar una conversación anterior',
      color: themeColors.secondary,
      onClick: () => setCurrentScreen('lista-chats')
    }
  ];

  const seccionUsuario = [
  {
    icon: FileText,
    titulo: 'Mi Informe',
    descripcion: 'Ver mi progreso y emociones',
    color: themeColors.accent1,
    onClick: handleSolicitarCodigo
  },
  {
    icon: User,
    titulo: 'Mi Perfil',
    descripcion: 'Ver y editar mi información personal',
    color: themeColors.accent2,
    onClick: () => setCurrentScreen('mi-perfil')
  },
  {
    icon: Settings,
    titulo: 'Configuración',
    descripcion: 'Ajustar preferencias de la aplicación',
    color: themeColors.accent3,
    onClick: () => setCurrentScreen('configuracion')
  }
];


  const fontSizeOptions = [
    { size: 'pequeña' as const, label: 'Pequeño' },
    { size: 'normal' as const, label: 'Normal' },
    { size: 'grande' as const, label: 'Grande' }
  ];

  const fontSizeActual = fontSizeOptions.find(opt => opt.size === fontSize)?.label || 'Normal';


const manejarValidarCodigo = async () => {

  if (!codigoAcceso.trim()) {
    alert("Ingrese el código.");
    return;
  }

  setValidandoCodigo(true);

  const response = await validarCodigo(codigoAcceso.trim());

  setValidandoCodigo(false);

  if (!response.success) {
    alert(response.message || "Código inválido.");
    return;
  }

  // Si todo bien
  setMostrarModalCodigo(false);
  setCodigoAcceso("");
  setCurrentScreen("mi-informe");
};

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-all duration-500"
      style={{ 
        backgroundColor: theme === 'diseno2' ? '#000000' : themeColors.background,
        backgroundImage: theme === 'diseno2' ? 'none' : `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary}, ${themeColors.accent1})`
      }}
    >
      {/* Glassmorphism background con destellos */}
      {theme === 'diseno1' ? (
        <BackgroundBubbles />
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Destello 1 - Primary */}
          <div 
            className="absolute top-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              backgroundColor: themeColors.primary,
              animationDuration: '6s'
            }}
          ></div>
          {/* Destello 2 - Secondary */}
          <div 
            className="absolute bottom-20 right-20 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              backgroundColor: themeColors.secondary,
              animationDelay: '2s',
              animationDuration: '7s'
            }}
          ></div>
          {/* Destello 3 - Accent1 (nuevo para más vida) */}
          <div 
            className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 animate-pulse"
            style={{ 
              backgroundColor: themeColors.accent1,
              animationDelay: '4s',
              animationDuration: '8s'
            }}
          ></div>
          {/* Destello 4 - Accent2 (nuevo) */}
          <div 
            className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] rounded-full blur-3xl opacity-15 animate-pulse"
            style={{ 
              backgroundColor: themeColors.accent2,
              animationDelay: '1s',
              animationDuration: '9s'
            }}
          ></div>
          {/* Particulas flotantes para más dinamismo */}
          {theme === 'diseno2' && (
            <>
              <div 
                className="absolute top-40 right-40 w-2 h-2 rounded-full animate-ping"
                style={{ 
                  backgroundColor: themeColors.primary,
                  animationDuration: '3s'
                }}
              ></div>
              <div 
                className="absolute top-60 left-60 w-1 h-1 rounded-full animate-ping"
                style={{ 
                  backgroundColor: themeColors.secondary,
                  animationDuration: '4s',
                  animationDelay: '1s'
                }}
              ></div>
              <div 
                className="absolute bottom-40 right-1/3 w-1.5 h-1.5 rounded-full animate-ping"
                style={{ 
                  backgroundColor: themeColors.accent1,
                  animationDuration: '5s',
                  animationDelay: '2s'
                }}
              ></div>
            </>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        {/* Header con info del usuario */}
        <div 
          className="rounded-2xl p-5 mb-6 backdrop-blur-xl border shadow-xl"
          style={{ 
            backgroundColor: isDarkTheme(theme) ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F0`,
            borderColor: `${themeColors.primary}30`,
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Info del usuario */}
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                <User className="text-white" size={24} />
              </div>
              <div>
                <h2 style={{ color: themeColors.textPrimary }} className="mb-1">
                  {nombreUsuario}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span 
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: `${themeColors.accent1}20`,
                      color: themeColors.accent1
                    }}
                  >
                    Nivel TEA {nivelTEA}
                  </span>
                  <span 
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: `${themeColors.primary}20`,
                      color: themeColors.primary
                    }}
                  >
                  </span>
                </div>
              </div>
            </div>

            {/* Controles rápidos */}
            <div className="flex items-center gap-3">
              {/* Control de tamaño de fuente */}
              <div className="relative">
                <button
                  onClick={() => setMostrarFontSize(!mostrarFontSize)}
                  className="px-4 py-2.5 rounded-xl border transition-all hover:scale-105 flex items-center gap-2"
                  style={{
                    backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
                    borderColor: themeColors.inputBorder,
                    color: themeColors.textPrimary
                  }}
                >
                  <Type size={18} />
                  <span>{fontSizeActual}</span>
                  <ChevronDown size={16} />
                </button>

                {mostrarFontSize && (
                  <div 
                    className="absolute right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden min-w-[150px] z-20"
                    style={{
                      backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
                      borderColor: themeColors.inputBorder
                    }}
                  >
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.size}
                        onClick={() => {
                          setFontSize(option.size);
                          setMostrarFontSize(false);
                        }}
                        className="w-full px-4 py-3 flex items-center justify-between hover:opacity-80 transition-all"
                        style={{
                          backgroundColor: fontSize === option.size ? `${themeColors.primary}15` : 'transparent',
                          color: themeColors.textPrimary
                        }}
                      >
                        <span>{option.label}</span>
                        {fontSize === option.size && (
                          <Check size={16} style={{ color: themeColors.primary }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Menú de opciones */}
              <div className="relative">
                <button
                  onClick={() => setMostrarMenu(!mostrarMenu)}
                  className="px-4 py-2.5 rounded-xl border transition-all hover:scale-105"
                  style={{
                    backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
                    borderColor: themeColors.inputBorder,
                    color: themeColors.textPrimary
                  }}
                >
                  <Settings size={20} />
                </button>

                {mostrarMenu && (
                  <div 
                    className="absolute right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden min-w-[200px] z-20"
                    style={{
                      backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : 'white',
                      borderColor: themeColors.inputBorder
                    }}
                  >
                    <button
                      onClick={() => {
                        setMostrarMenu(false);
                        alert('Sección de ayuda - Próximamente');
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:opacity-80 transition-all border-b"
                      style={{
                        color: themeColors.textPrimary,
                        borderColor: themeColors.inputBorder
                      }}
                    >
                      <HelpCircle size={18} />
                      <span>Ayuda</span>
                    </button>
                    <button
                      onClick={() => {
                        setMostrarMenu(false);
                        alert('Agente Conversacional TEA v1.0.0\n\nAplicación diseñada para adolescentes con TEA nivel 1 y 2');
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:opacity-80 transition-all border-b"
                      style={{
                        color: themeColors.textPrimary,
                        borderColor: themeColors.inputBorder
                      }}
                    >
                      <Info size={18} />
                      <span>Sobre la app</span>
                    </button>
                    <button
                      onClick={() => {
                        setMostrarMenu(false);
                        handleCerrarSesion();
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:opacity-80 transition-all"
                      style={{
                        color: themeColors.error
                      }}
                    >
                      <LogOut size={18} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Título principal */}
        <div className="text-center mb-10">
          <div className="inline-block">
            <h1 className="text-white mb-2">
              ¿Qué quieres trabajar hoy?
            </h1>
            <div 
              className="h-1 rounded-full mx-auto"
              style={{ 
                width: '60%',
                background: `linear-gradient(to right, ${themeColors.accent2}, ${themeColors.accent3})`
              }}
            ></div>
          </div>
        </div>

        {/* Sección Conversación */}
        <div className="mb-8">
          <h3 
            className="mb-4 px-2"
            style={{ color: 'white' }}
          >
            Conversación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {seccionConversacion.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="rounded-2xl p-7 shadow-2xl transition-all transform hover:scale-[1.03] active:scale-[0.98] group relative overflow-hidden border-2"
                style={{ 
                  backgroundColor: theme === 'diseno3' ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
                  borderColor: `${item.color}50`,
                  boxShadow: `0 10px 40px -10px ${item.color}30`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 60px -15px ${item.color}50, 0 0 0 3px ${item.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 40px -10px ${item.color}30`;
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color}, transparent)`
                  }}
                ></div>

                <div className="flex items-center gap-5 relative z-10">
                  <div 
                    className="rounded-xl p-4 flex-shrink-0 transition-all group-hover:scale-110 duration-500 relative shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${item.color}, ${themeColors.secondary})`,
                    }}
                  >
                    <item.icon 
                      className="text-white transition-transform group-hover:rotate-6 duration-500" 
                      size={32} 
                    />
                  </div>

                  <div className="text-left flex-1">
                    <h2 
                      style={{ color: themeColors.textPrimary }} 
                      className="mb-2 group-hover:translate-x-1 transition-transform duration-300"
                    >
                      {item.titulo}
                    </h2>
                    <p 
                      style={{ 
                        color: themeColors.textSecondary,
                        fontSize: '15px',
                        fontWeight: '500'
                      }}
                      className="group-hover:translate-x-1 transition-transform duration-300 leading-relaxed"
                    >
                      {item.descripcion}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sección Usuario */}
        <div className="mb-8">
          <h3 
            className="mb-4 px-2"
            style={{ color: 'white' }}
          >
            Mi cuenta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {seccionUsuario.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="rounded-2xl p-7 shadow-2xl transition-all transform hover:scale-[1.03] active:scale-[0.98] group relative overflow-hidden border-2"
                style={{ 
                  backgroundColor: theme === 'diseno3' ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
                  borderColor: `${item.color}50`,
                  boxShadow: `0 10px 40px -10px ${item.color}30`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 60px -15px ${item.color}50, 0 0 0 3px ${item.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 40px -10px ${item.color}30`;
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color}, transparent)`
                  }}
                ></div>

                <div className="text-center relative z-10">
                  <div 
                    className="rounded-xl p-4 flex-shrink-0 transition-all group-hover:scale-110 duration-500 relative shadow-lg mx-auto w-fit mb-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${item.color}, ${themeColors.secondary})`,
                    }}
                  >
                    <item.icon 
                      className="text-white transition-transform group-hover:rotate-6 duration-500" 
                      size={28} 
                    />
                  </div>

                  <h3 
                    style={{ color: themeColors.textPrimary }} 
                    className="mb-2 group-hover:scale-105 transition-transform duration-300"
                  >
                    {item.titulo}
                  </h3>
                  <p 
                    style={{ 
                      color: themeColors.textSecondary,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  >
                    {item.descripcion}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info de conversaciones */}
        {chats.length > 0 && (
          <div 
            className="rounded-2xl p-6 backdrop-blur-xl shadow-xl border animate-fadeIn"
            style={{ 
              backgroundColor: theme === 'diseno3' ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}90`,
              borderColor: `${themeColors.primary}30`,
              boxShadow: `0 10px 40px -10px ${themeColors.primary}30`
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: themeColors.accent1 }}
              >
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 style={{ color: themeColors.textPrimary }} className="mb-1">
                  Conversaciones recientes
                </h3>
                <p style={{ color: themeColors.textSecondary, fontSize: '15px' }}>
                  Tienes {chats.length} {chats.length === 1 ? 'conversación activa' : 'conversaciones activas'}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                style={{ 
                  backgroundColor: `${themeColors.success}20`,
                  color: themeColors.success,
                  fontSize: '18px'
                }}
              >
                {chats.length}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <div 
            className="inline-block px-6 py-3 rounded-xl backdrop-blur-sm"
            style={{ 
              backgroundColor: `${themeColors.cardBg}40`,
              color: 'white'
            }}
          >
            <p className="text-sm opacity-90">
              Agente Conversacional TEA - Versión 1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar menús */}
      {(mostrarMenu || mostrarFontSize) && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => {
            setMostrarMenu(false);
            setMostrarFontSize(false);
          }}
        ></div>
      )}

      {mostrarModalCodigo && (
  <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60" style={{
      zIndex: 999999 // El modal tiene z-index bajo mientras se valida
    }}>
    <div 
      className="w-full max-w-md rounded-2xl p-6 shadow-2xl border"
      style={{ 
        backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : '#FFFFFF',
        borderColor: themeColors.inputBorder
      }}
    >
      <h3 
        className="mb-2 text-lg font-semibold"
        style={{ color: themeColors.textPrimary }}
      >
        Verificar acceso a tu informe
      </h3>
      <p 
        className="mb-4 text-sm"
        style={{ color: themeColors.textSecondary }}
      >
        Ingresa el código que tu responsable recibió por correo para poder ver tu informe.
      </p>

      <label className="block mb-2 text-sm" style={{ color: themeColors.textPrimary }}>
        Código de autorización
      </label>
      <input
        type="text"
        value={codigoAcceso}
        onChange={(e) => setCodigoAcceso(e.target.value)}
        maxLength={6}
        className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
        style={{
          backgroundColor: isDarkTheme(theme) ? themeColors.cardBg : '#FFFFFF',
          borderColor: themeColors.inputBorder,
          color: themeColors.textPrimary
        }}
        placeholder="Ej: 123456"
      />

      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={() => {
            setMostrarModalCodigo(false);
            setCodigoAcceso("");
          }}
          className="px-4 py-2 rounded-xl text-sm"
          style={{
            backgroundColor: isDarkTheme(theme) ? '#27272a' : '#e5e7eb',
            color: themeColors.textSecondary
          }}
        >
          Cancelar
        </button>
        <button
          onClick={manejarValidarCodigo}
          disabled={validandoCodigo}
          className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: themeColors.primary,
            color: '#FFFFFF',
            opacity: validandoCodigo ? 0.7 : 1
          }}
        >
          {validandoCodigo ? "Verificando..." : "Confirmar"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}