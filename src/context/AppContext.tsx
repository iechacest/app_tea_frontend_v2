import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { crearChat } from "../api/api";
import { obtenerCaracteristicas } from "../api/api";
import { useEffect } from "react"; // si no está
import { obtenerMensajesPorChat } from "../api/api";
import { listarChatsPorUsuario } from "../api/api";
import { obtenerConfiguracion } from "../api/api";

export type Theme = 'diseno1' | 'diseno2' | 'diseno3';
export type FontSize = 'pequeña' | 'normal' | 'grande';
export type NivelTEA = 1 | 2;

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellido_pat: string;
  apellido_mat: string;
  fecha_nac: string;
  genero: string;
  email: string;
  pais: string;
  nivel_tea: number;
}

export interface Responsable {
  id_responsable: number;
  nombre: string;
  email: string;
  tipo_res?: string;
  apellido_mat?: string,
  apellido_pat?: string,
  genero?: string
}

export interface Caracteristica {
  id_caracteristica: string | number;  
  nombre: string;
  descripcion: string;
  valor_inicial: number;
  valor_actual: number;
}


export interface Mensaje {
  id_mensaje: number;
  id_chat: number;
  contenido: string;
  fuente: "USUARIO" | "AGENTE";
  creadoEn: string;
}

export interface Chat {
  id_chat: number;
  id_usuario: number;
  contexto: string;
  tipoEntrenamiento: string;
  creado_en: string | null;
  resumenConversacion: string | null;
  mensajes: Mensaje[];
}

export interface AnalisisEmocional {
  fecha: Date;
  emociones: {
    feliz: number;
    triste: number;
    ansioso: number;
    confundido: number;
    neutral: number;
  };
}

type Screen = 
  | 'login'
  | 'registro' 
  | 'configuracion-inicial' 
  | 'anadir-responsable' 
  | 'caracteristicas-iniciales'
  | 'menu-principal'
  | 'seleccion-chat'
  | 'lista-chats'
  | 'chat'
  | 'mi-informe'
  | 'mi-perfil'
  | 'configuracion';

export interface UsuarioCompleto {
  id_usuario: number;
  nombres: string;
  apellido_pat: string;
  apellido_mat: string;
  fecha_nac: string;
  genero: string;
  email: string;
  pais: string;
  nivel_tea: number;
}

export interface Configuracion{
  id_configuracion: number;
  id_usuario: number;
  tema_visual: string;
  tamanio_fuente: string;
  creado_en: string;
  actualizado_en: string;
}


interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  nivelTEA: NivelTEA;
  setNivelTEA: (nivel: NivelTEA) => void;
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario) => void;
  responsable: Responsable | null;
  setResponsable: (responsable: Responsable | null) => void;
  caracteristicas: Caracteristica[];
  setCaracteristicas: (caracteristicas: Caracteristica[]) => void;
  actualizarCaracteristica: (id: number, nuevoValor: number) => void;
  agregarCaracteristica: (caracteristica: Caracteristica) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  chatActual: Chat | null;
  setChatActual: (chat: Chat | null) => void;
  agregarMensaje: (msg: Omit<Mensaje, "id_mensaje">) => void;
  crearNuevoChat: (objetivo: string, contexto: string) => void;
  analisisEmocional: AnalisisEmocional[];
  agregarAnalisisEmocional: (analisis: AnalisisEmocional) => void;
  usuarios: UsuarioCompleto[];
  setUsuarios: (usuarios: UsuarioCompleto[]) => void;
  usuarioActual: UsuarioCompleto | null;
  setUsuarioActual: (usuario: UsuarioCompleto | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {

  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [theme, setTheme] = useState<Theme>('diseno1');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [nivelTEA, setNivelTEA] = useState<NivelTEA>(1);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [responsable, setResponsable] = useState<Responsable | null>(null);
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatActual, setChatActual] = useState<Chat | null>(null);
  const [analisisEmocional, setAnalisisEmocional] = useState<AnalisisEmocional[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioCompleto[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<UsuarioCompleto | null>(null);

  const actualizarCaracteristica = (id: number, nuevoValor: number) => {
    setCaracteristicas(prev => 
      prev.map(c => c.id_caracteristica === id ? { ...c, valor_actual: nuevoValor } : c)
    );
  };

  const agregarCaracteristica = (caracteristica: Caracteristica) => {
    setCaracteristicas(prev => [...prev, caracteristica]);
  };

  useEffect(() => {
  if (!usuarioActual) return;

  obtenerCaracteristicas(usuarioActual.id_usuario)
    .then(data => {
      setCaracteristicas(
  data.map((c: any) => ({
    ...c,
    valor_inicial: Number(c.valor_inicial) || 0,
    valor_actual: Number(c.valor_actual) || 0
  }))
);
 // <--- GUARDA EN EL CONTEXTO
      console.log("Características cargadas:", data);
    })
    .catch(err => {
      console.error("Error cargando características del usuario:", err);
    });

}, [usuarioActual]);
useEffect(() => {
  if (!usuarioActual) return;

  // 🔥 Cargar chats del backend
  listarChatsPorUsuario(usuarioActual.id_usuario)
    .then(chatsBD => {
      const chatsFormateados = chatsBD.map((c: any) => ({
        id_chat: c.id_chat,
        id_usuario: c.id_usuario,
        contexto: c.contexto,
        tipoEntrenamiento: c.tipoEntrenamiento,
        creado_en: c.creado_en,
        resumenConversacion: c.resumenConversacion,
        mensajes: [] // ← se cargarán al abrir el chat
      }));

      setChats(chatsFormateados);
    })
    .catch(err => console.error("Error cargando chats:", err));

}, [usuarioActual]);

useEffect(() => {
  if (!usuarioActual) return;

  obtenerConfiguracion(usuarioActual.id_usuario)
    .then((conf) => {
      if (conf) {
        if (conf.tema) setTheme(conf.tema);
        if (conf.tamano_letra) setFontSize(conf.tamano_letra);
        if (conf.nivel_tea) setNivelTEA(conf.nivel_tea);
      }
    })
    .catch(() => console.warn("El usuario no tiene configuración guardada."));
}, [usuarioActual]);


  // ========
  const agregarMensaje = async (msg: Omit<Mensaje, "id_mensaje">) => {
  if (!chatActual) return;

  // 1️⃣ Insertamos mensaje local temporal SOLO para mostrar en UI
  const msgTemporal: Mensaje = {
    id_mensaje: Date.now(), // temporal
    ...msg
  };

  setChatActual(prev =>
    prev ? { ...prev, mensajes: [...prev.mensajes, msgTemporal] } : prev
  );

  // 2️⃣ LUEGO recargamos mensajes reales desde backend
  try {
    const mensajes = await obtenerMensajesPorChat(chatActual.id_chat);

    const mensajesFormateados = mensajes.map((m: any) => ({
      id_mensaje: m.id_mensaje,
      id_chat: m.id_chat,
      contenido: m.contenido,
      fuente: m.fuente,
      creadoEn: m.creadoEn
    }));

    setChatActual(prev =>
      prev ? { ...prev, mensajes: mensajesFormateados } : prev
    );

  } catch (err) {
    console.error("Error recargando mensajes:", err);
  }
};

  // =====================================================
  //  CREAR CHAT REAL EN BACKEND
  // =====================================================
  const crearNuevoChat = async (objetivo: string, contexto: string) => {
    if (!usuarioActual) return;

    try {
      const resp = await crearChat(
        usuarioActual.id_usuario,
        contexto,
        objetivo
      );

      const nuevoChat: Chat = {
        id_chat: resp.id_chat,
        id_usuario: resp.id_usuario,
        contexto: resp.contexto,
        tipoEntrenamiento: resp.tipoEntrenamiento,
        creado_en: resp.creado_en,
        resumenConversacion: resp.resumenConversacion ?? null,
        mensajes: []
      };

      setChats(prev => [...prev, nuevoChat]);
      setChatActual(nuevoChat);
      setCurrentScreen("chat");

    } catch (e) {
      console.error("Error creando chat:", e);
    }
  };

  const agregarAnalisisEmocional = (analisis: AnalisisEmocional) => {
    setAnalisisEmocional(prev => [...prev, analisis]);
  };

const cargarChat = async (chat: Chat | null) => {
  if (!chat) {
    setChatActual(null);
    return;
  }

  try {
    const mensajes = await obtenerMensajesPorChat(chat.id_chat);

    const mensajesFormateados = mensajes.map((m: any) => ({
      id_mensaje: m.id_mensaje,
      id_chat: m.id_chat,
      contenido: m.contenido,
      fuente: m.fuente,
      creadoEn: m.creadoEn
    }));

    const chatConMensajes: Chat = {
      ...chat,
      mensajes: mensajesFormateados
    };

    setChatActual(chatConMensajes);

  } catch (error) {
    console.error("Error cargando mensajes del chat:", error);
  }
};


  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        theme,
        setTheme,
        fontSize,
        setFontSize,
        nivelTEA,
        setNivelTEA,
        usuario,
        setUsuario,
        responsable,
        setResponsable,
        caracteristicas,
        setCaracteristicas,
        actualizarCaracteristica,
        agregarCaracteristica,
        chats,
        setChats,
        chatActual,
        setChatActual: cargarChat,
        agregarMensaje,
        crearNuevoChat,
        analisisEmocional,
        agregarAnalisisEmocional,
        usuarios,
        setUsuarios,
        usuarioActual,
        setUsuarioActual
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
}
