import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MessageSquare, Filter, Home, Users, School, Building2, MessageCircle, Lightbulb } from 'lucide-react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';

type Filtro = 'todos' | 'comunicacion-verbal' | 'frases-no-literales' | 'casa' | 'familia-amigos' | 'escuela' | 'espacio-publico';

export default function ListaChats() {
  const { chats, setChatActual, setCurrentScreen, theme } = useApp();
  const themeColors = getThemeColors(theme);
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const getIconoContexto = (contexto: string) => {
    switch (contexto) {
      case 'casa':
        return <Home size={20} style={{ color: themeColors.primary }} />;
      case 'familia-amigos':
        return <Users size={20} style={{ color: themeColors.primary }} />;
      case 'escuela':
        return <School size={20} style={{ color: themeColors.primary }} />;
      case 'espacio-publico':
        return <Building2 size={20} style={{ color: themeColors.primary }} />;
      default:
        return <MessageSquare size={20} style={{ color: themeColors.primary }} />;
    }
  };

  const getIconoObjetivo = (objetivo: string) => {
    return objetivo === 'comunicacion-verbal' 
      ? <MessageCircle size={16} style={{ color: themeColors.primary }} /> 
      : <Lightbulb size={16} style={{ color: themeColors.primary }} />;
  };

  const getEtiquetaObjetivo = (objetivo: string) => {
    return objetivo === 'comunicacion-verbal' ? 'Comunicación verbal' : 'Frases no literales';
  };

  const getEtiquetaContexto = (contexto: string) => {
    const contextos: { [key: string]: string } = {
      'casa': 'Casa',
      'familia-amigos': 'Familia y amigos',
      'escuela': 'Escuela',
      'espacio-publico': 'Espacio público'
    };
    return contextos[contexto] || contexto;
  };

  const chatsFiltrados = chats.filter(chat => {
    if (filtro === 'todos') return true;
    return chat.tipoEntrenamiento === filtro || chat.contexto === filtro;
  });

  const handleChatClick = (chat: any) => {
    setChatActual(chat);
    setCurrentScreen('chat');
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
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: themeColors.accent1 }}
          ></div>
          <div 
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              backgroundColor: themeColors.accent2,
              animationDuration: '5s'
            }}
          ></div>
        </div>
      )}

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
            Mis Conversaciones
          </h1>
        </div>

        {/* Filtros */}
        <div 
          className="rounded-3xl shadow-lg p-6 mb-6 backdrop-blur-xl border"
          style={{
            backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'white',
            borderColor: `${themeColors.primary}20`
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter style={{ color: themeColors.primary }} size={20} />
            <h2 style={{ color: themeColors.textPrimary }}>Filtrar por:</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105`}
              style={{
                backgroundColor: filtro === 'todos' ? themeColors.primary : theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`,
                color: filtro === 'todos' ? 'white' : themeColors.textPrimary
              }}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro('comunicacion-verbal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105`}
              style={{
                backgroundColor: filtro === 'comunicacion-verbal' ? themeColors.primary : theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`,
                color: filtro === 'comunicacion-verbal' ? 'white' : themeColors.textPrimary
              }}
            >
              <MessageCircle size={16} />
              <span>Comunicación</span>
            </button>
            <button
              onClick={() => setFiltro('frases-no-literales')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105`}
              style={{
                backgroundColor: filtro === 'frases-no-literales' ? themeColors.secondary : theme === 'diseno2' ? themeColors.background : `${themeColors.secondary}10`,
                color: filtro === 'frases-no-literales' ? 'white' : themeColors.textPrimary
              }}
            >
              <Lightbulb size={16} />
              <span>Frases</span>
            </button>
            <button
              onClick={() => setFiltro('casa')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105`}
              style={{
                backgroundColor: filtro === 'casa' ? themeColors.accent1 : theme === 'diseno2' ? themeColors.background : `${themeColors.accent1}10`,
                color: filtro === 'casa' ? 'white' : themeColors.textPrimary
              }}
            >
              <Home size={16} />
              <span>Casa</span>
            </button>
            <button
              onClick={() => setFiltro('familia-amigos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105`}
              style={{
                backgroundColor: filtro === 'familia-amigos' ? themeColors.accent2 : theme === 'diseno2' ? themeColors.background : `${themeColors.accent2}10`,
                color: filtro === 'familia-amigos' ? 'white' : themeColors.textPrimary
              }}
            >
              <Users size={16} />
              <span>Familia</span>
            </button>
            <button
              onClick={() => setFiltro('escuela')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105`}
              style={{
                backgroundColor: filtro === 'escuela' ? themeColors.accent3 : theme === 'diseno2' ? themeColors.background : `${themeColors.accent3}10`,
                color: filtro === 'escuela' ? 'white' : themeColors.textPrimary
              }}
            >
              <School size={16} />
              <span>Escuela</span>
            </button>
            <button
              onClick={() => setFiltro('espacio-publico')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105`}
              style={{
                backgroundColor: filtro === 'espacio-publico' ? themeColors.primary : theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`,
                color: filtro === 'espacio-publico' ? 'white' : themeColors.textPrimary
              }}
            >
              <Building2 size={16} />
              <span>Público</span>
            </button>
          </div>
        </div>

        {/* Lista de chats */}
        {chatsFiltrados.length === 0 ? (
          <div 
            className="rounded-3xl shadow-lg p-12 text-center backdrop-blur-xl border"
            style={{
              backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'white',
              borderColor: `${themeColors.primary}20`
            }}
          >
            <MessageSquare className="mx-auto mb-4" style={{ color: themeColors.secondary }} size={64} />
            <h3 style={{ color: themeColors.textPrimary }} className="mb-2">
              No hay conversaciones
            </h3>
            <p style={{ color: themeColors.textSecondary }} className="mb-6">
              {filtro === 'todos' 
                ? 'Crea tu primera conversación para comenzar' 
                : 'No hay conversaciones con este filtro'}
            </p>
            <button
              onClick={() => setCurrentScreen('seleccion-chat')}
              className="px-6 py-3 rounded-xl transition-all hover:shadow-xl hover:scale-105 text-white"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
              }}
            >
              Crear conversación
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {chatsFiltrados.map((chat) => (
              <button
                key={chat.id_chat}
                onClick={() => handleChatClick(chat)}
                className="w-full rounded-3xl p-6 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl border"
                style={{
                  backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
                  borderColor: `${themeColors.primary}15`
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                    }}
                  >
                    {getIconoContexto(chat.contexto)}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 style={{ color: themeColors.textPrimary }} className="mb-1">
  {getEtiquetaObjetivo(chat.tipoEntrenamiento)} — {getEtiquetaContexto(chat.contexto)}
</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
  <span 
    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg"
    style={{
      backgroundColor: `${themeColors.primary}15`,
      color: themeColors.primary
    }}
  >
    {getIconoObjetivo(chat.tipoEntrenamiento)}
    <span>{getEtiquetaObjetivo(chat.tipoEntrenamiento)}</span>
  </span>

  <span 
    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg"
    style={{
      backgroundColor: `${themeColors.accent1}15`,
      color: themeColors.textPrimary
    }}
  >
    {getEtiquetaContexto(chat.contexto)}
  </span>
</div>
                    
                    <div className="flex items-center justify-between">

  <p style={{ color: themeColors.textSecondary }}>
    {chat.creado_en
      ? new Date(chat.creado_en).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short"
        })
      : "Sin fecha"}
  </p>
</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}