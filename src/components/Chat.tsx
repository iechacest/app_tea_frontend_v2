import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, ArrowLeft, Sparkles } from 'lucide-react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';
import { procesarMensaje } from "../api/api";
import { obtenerMensajesPorChat } from "../api/api";


export default function Chat() {
  const [cargado, setCargado] = useState(false);
  const { chatActual, agregarMensaje, setCurrentScreen, theme, setChatActual } = useApp();
const [historialCargado, setHistorialCargado] = useState(false);

useEffect(() => {
  if (!chatActual) return;
  if (historialCargado) return;

  obtenerMensajesPorChat(chatActual.id_chat)
    .then((mensajesBD) => {
      const mensajesConvertidos = mensajesBD.map((m: any) => ({
        id_mensaje: m.id_mensaje,
        id_chat: m.id_chat,
        contenido: m.contenido,
        fuente: m.fuente,
        creadoEn: m.creadoEn
      }));

      setChatActual({
        ...chatActual,
        mensajes: mensajesConvertidos
      });

      setHistorialCargado(true); // ← evita re-calls infinitos
    })
    .catch(err => console.error("Error cargando mensajes:", err));
}, [chatActual]);



useEffect(() => {
  scrollToBottom();
}, [chatActual?.mensajes]);


  const themeColors = getThemeColors(theme);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // =====================================================
  //   >>>>>>  ENVÍO DE MENSAJE CON BACKEND  <<<<<<
  // =====================================================
  const handleSend = async () => {
  if (!inputText.trim() || !chatActual) return;

  const mensajeUsuario = inputText;
  setInputText('');

  // 1️⃣ Mostrar mensaje del usuario temporalmente
  agregarMensaje({
    id_chat: chatActual.id_chat,
    contenido: mensajeUsuario,
    fuente: "USUARIO",
    creadoEn: new Date().toISOString()
  });

  setIsTyping(true);

  try {
    // 2️⃣ Enviar mensaje real al backend
    const resp = await procesarMensaje({
      id_chat: chatActual.id_chat,
      contenido: mensajeUsuario
    });

    // 3️⃣ Mostrar mensaje del agente
    agregarMensaje({
      id_chat: chatActual.id_chat,
      contenido: resp.respuestaAgente,
      fuente: "AGENTE",
      creadoEn: new Date().toISOString()
    });

  } catch (e) {
    console.error("Error enviando mensaje:", e);
  }

  setIsTyping(false);
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ 
        backgroundColor: theme === 'diseno2' ? '#000000' : themeColors.background,
        backgroundImage: theme === 'diseno2' ? 'none' : `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary}, ${themeColors.accent1})`
      }}
    >
      {/* Header */}
      <div 
        className="backdrop-blur-xl shadow-lg p-4 border-b relative z-20"
        style={{
          backgroundColor: isDarkTheme(theme) ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F0`,
          borderColor: `${themeColors.primary}30`
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen('menu-principal')}
            className="p-2 rounded-xl transition-all hover:scale-110"
            style={{
              backgroundColor: theme === 'diseno2' ? themeColors.cardBgHover : `${themeColors.primary}10`
            }}
          >
            <ArrowLeft style={{ color: themeColors.primary }} size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
              }}
            >
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 style={{ color: themeColors.textPrimary }}>Agente TEA</h2>
              <p style={{ color: themeColors.textSecondary }}>Siempre listo para ayudar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversación */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4 pb-4">

          {chatActual?.mensajes.map((msg) => (
            <div key={msg.id_mensaje} className={`flex ${msg.fuente === "USUARIO" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-3xl p-4 shadow-lg ${
                  msg.fuente === "USUARIO" ? "rounded-br-md" : "rounded-bl-md"
                }`}
                style={{
                  backgroundColor: msg.fuente === "USUARIO"
                    ? themeColors.primary
                    : (theme === 'diseno2' ? themeColors.cardBg : "white"),
                  color: msg.fuente === "USUARIO" ? "white" : themeColors.textPrimary
                }}
              >
                <p className="leading-relaxed">{msg.contenido}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div 
                className="rounded-3xl rounded-bl-md p-4 shadow-lg"
                style={{
                  backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white'
                }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: themeColors.secondary }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: themeColors.secondary, animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: themeColors.secondary, animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div 
        className="backdrop-blur-xl border-t p-4 relative z-10"
        style={{
          backgroundColor: isDarkTheme(theme) ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F0`,
          borderColor: `${themeColors.primary}30`
        }}
      >
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-6 py-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: themeColors.inputBorder,
              backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
              color: themeColors.textPrimary
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-6 py-4 rounded-2xl shadow-lg text-white transition-all disabled:opacity-50"
            style={{
              background: !inputText.trim()
                ? themeColors.inputBorder
                : `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
            }}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
