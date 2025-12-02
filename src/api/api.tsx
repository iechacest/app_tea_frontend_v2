import axios from "axios";

// 🟢 Base URL del backend
// En dev:  VITE_API_URL=http://localhost:8098
// En prod: VITE_API_URL=https://apptea-production.up.railway.app
const API = import.meta.env.VITE_API_URL || "http://localhost:8098";
const API_BASE = `${API}/api`;

// ========================
// AUTH / USUARIO
// ========================
export const loginUsuario = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE}/usuario/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data);
    }
    throw new Error("Error de conexión con el servidor");
  }
};

export async function editarPerfil(data: any) {
  const res = await fetch(`${API_BASE}/usuario/editar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("No se pudo editar el perfil");

  return await res.json();
}

export const actualizarNivelTEA = async (id_usuario: number, nivel: number) => {
  const response = await fetch(
    `${API_BASE}/usuario/nivel-tea?id_usuario=${id_usuario}&nivel=${nivel}`,
    { method: "PUT" }
  );

  if (!response.ok) throw new Error("Error al actualizar nivel TEA");

  return response.text();
};

// ========================
// CHAT / MENSAJES
// ========================
export async function crearChat(
  id_usuario: number,
  contexto: string,
  tipoEntrenamiento: string
) {
  const response = await fetch(`${API_BASE}/chat/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_usuario,
      contexto,
      tipoEntrenamiento,
      creado_en: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Error al crear chat");
  }

  return await response.json(); // <- Contiene id_chat
}

export const procesarMensaje = async ({
  id_chat,
  contenido,
}: {
  id_chat: number;
  contenido: string;
}) => {
  const resp = await axios.post(`${API_BASE}/agente/procesar`, {
    id_chat,
    contenido,
  });

  return resp.data;
};

export const obtenerMensajesPorChat = async (id_chat: number) => {
  const resp = await axios.get(`${API_BASE}/mensaje/por-chat`, {
    params: { id_chat },
  });

  return resp.data; // lista de mensajes
};

export const listarChatsPorUsuario = async (id_usuario: number) => {
  const resp = await axios.get(`${API_BASE}/chat/listar-por-usuario`, {
    params: { id_usuario },
  });

  return resp.data; // devuelve lista de chats del backend
};

// ========================
// CARACTERÍSTICAS / INFORMES
// ========================
export async function obtenerCaracteristicas(id_usuario: number) {
  const response = await fetch(
    `${API_BASE}/caracteristica/por-usuario?id_usuario=${id_usuario}`
  );

  if (!response.ok) {
    throw new Error("Error obteniendo características");
  }

  return await response.json();
}

export async function generarInforme(id_usuario: number) {
  const resp = await fetch(
    `${API_BASE}/agente/informe?id_usuario=${id_usuario}`
  );
  if (!resp.ok) throw new Error("Error generando informe");
  return await resp.text(); // devuelve texto
}

export async function generarInformeEmocional(id_usuario: number) {
  const resp = await fetch(
    `${API_BASE}/agente/informe-emocional?id_usuario=${id_usuario}`
  );
  if (!resp.ok) throw new Error("Error generando informe emocional");
  return await resp.text();
}

export async function enviarInforme(id_usuario: number) {
  const resp = await fetch(
    `${API_BASE}/agente/enviar-informe?id_usuario=${id_usuario}`,
    {
      method: "POST",
    }
  );

  if (!resp.ok) throw new Error("Error enviando informe");
  return await resp.text();
}

// ========================
// CONFIGURACIÓN
// ========================
const API_CONF = `${API_BASE}/configuracion`;

export async function guardarConfiguracion(req: {
  id_usuario: number;
  tema_visual: string;
  tamanio_fuente: string;
}) {
  const resp = await fetch(`${API_CONF}/guardar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!resp.ok) throw new Error("Error guardando configuración");

  return await resp.json();
}

export async function obtenerConfiguracion(id_usuario: number) {
  const resp = await fetch(`${API_CONF}/por-usuario?id_usuario=${id_usuario}`);

  if (!resp.ok) throw new Error("Error obteniendo configuración");

  return await resp.json();
}

// ========================
// RESPONSABLES / MONITOREO
// ========================
export async function obtenerResponsablePorUsuario(id_usuario: number) {
  const res = await fetch(
    `${API_BASE}/responsable/por-usuario?id_usuario=${id_usuario}`
  );
  if (!res.ok) return null;
  return res.json();
}

export async function solicitarCodigo(
  idUsuario: number,
  idResponsable: number
) {
  try {
    const res = await fetch(`${API_BASE}/autorizacion/generar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: idUsuario,
        id_responsable: idResponsable,
      }),
    });

    if (!res.ok) throw new Error("No se pudo generar el código");

    return await res.json();
  } catch (e) {
    throw new Error("Error solicitando código");
  }
}

export interface ValidarCodigoResponse {
  success: boolean;
  message: string;
}

export async function validarCodigo(
  codigo: string
): Promise<ValidarCodigoResponse> {
  try {
    const res = await fetch(`${API_BASE}/autorizacion/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo }),
    });

    if (!res.ok) return { success: false, message: "Código inválido" };

    // Si tu backend devuelve JSON con { success, message }, puedes hacer:
    // const data = await res.json();
    // return data;
    return { success: true, message: "Código válido" };
  } catch (e) {
    return { success: false, message: "Error de conexión" };
  }
}

export interface Responsable {
  id_responsable: number;
  nombre: string;
  email: string;
  tipo_res?: string;
  apellido_mat?: string;
  apellido_pat?: string;
  genero?: string;
}

export const editarResponsable = async (responsable: Responsable) => {
  const response = await fetch(`${API_BASE}/responsable/editar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responsable),
  });

  if (!response.ok) {
    throw new Error("Error al editar responsable");
  }

  return await response.json();
};

export const crearResponsable = async (responsable: Responsable) => {
  const response = await fetch(`${API_BASE}/responsable/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responsable),
  });

  if (!response.ok) {
    throw new Error("Error al crear responsable");
  }

  return await response.json();
};

export const eliminarResponsable = async (idResponsable: number) => {
  try {
    const response = await fetch(
      `${API_BASE}/responsable/eliminar/${idResponsable}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el responsable");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error al eliminar el responsable.");
  }
};

export const obtenerResponsablesPorUsuario = async (idUsuario: number) => {
  try {
    const response = await fetch(
      `${API_BASE}/responsable/por-usuario?id_usuario=${idUsuario}`
    );
    if (!response.ok) throw new Error("Error al obtener los responsables");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los responsables");
  }
};

export const vincularResponsableConUsuario = async (
  idResponsable: number,
  idUsuario: number
) => {
  try {
    console.log("Enviando solicitud para vincular responsable:", {
      idResponsable,
      idUsuario,
    });

    const response = await fetch(`${API_BASE}/monitorea/vincular`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_responsable: idResponsable,
        id_usuario: idUsuario,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al vincular el responsable.");
    }

    const data = await response.json();
    console.log("Respuesta de vinculación:", data);

    return data;
  } catch (error) {
    console.error("Error en la vinculación:", error);
    return { success: false };
  }
};

export const eliminarResponsableMonitoreo = async (
  idResponsable: number,
  idUsuario: number
) => {
  try {
    const response = await fetch(
      `${API_BASE}/monitorea/eliminar?id_responsable=${idResponsable}&id_usuario=${idUsuario}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo eliminar el monitoreo");
    }

    if (response.status !== 204) {
      return await response.json();
    }

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el monitoreo:", error);
    throw new Error("Error al eliminar el monitoreo");
  }
};
