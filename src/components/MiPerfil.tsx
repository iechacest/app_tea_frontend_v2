import { useApp } from '../context/AppContext';
import { User, Mail, Calendar, Shield, ArrowLeft, Edit2, Save, X, MessageCircle, Target, Send, Brain, Plus, UserCheck, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';
import type { Caracteristica } from '../context/AppContext';
import { obtenerResponsablePorUsuario } from "../api/api"; // ya existe en tu api.ts
import { solicitarCodigo, validarCodigo } from "../api/api";
import { editarResponsable } from "../api/api";
import { crearResponsable } from "../api/api"; // Asegúrate de importar la función
import { eliminarResponsable } from "../api/api"; // Asegúrate de importar la función
import { vincularResponsableConUsuario } from '../api/api';
import {eliminarResponsableMonitoreo} from '../api/api';
import { editarPerfil } from "../api/api";

export default function MiPerfil() {

  const { 
    usuario, 
    usuarioActual,
    responsable, 
    setCurrentScreen, 
    caracteristicas, 
    chats,
    nivelTEA,
    agregarCaracteristica,
    setResponsable,
    theme
  } = useApp();

  interface Responsable {
  id_responsable: number;
  nombre: string;
  email: string;
  tipo_res?: string;
  apellido_mat?: string;
  apellido_pat?: string;
  genero?: string;
}
const [responsables, setResponsables] = useState<Responsable[]>([]);
const obtenerResponsablesPorUsuario = async (idUsuario: number): Promise<Responsable[]> => {
  try {
    const response = await fetch(`https://apptea-production.up.railway.app/api/responsable/por-usuario?id_usuario=${idUsuario}`);
    if (!response.ok) throw new Error('Error al obtener los responsables');
    return await response.json(); // Asegúrate de que el tipo de retorno sea un array de responsables
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener los responsables');
  }
};

useEffect(() => {
  if (usuarioActual) {
    setPerfilEditable({
      nombres: usuarioActual.nombres || "",
      apellido_pat: usuarioActual.apellido_pat || "", 
      apellido_mat: usuarioActual.apellido_mat || "", 
      email: usuarioActual.email || "",
      fecha_nac: usuarioActual.fecha_nac || "",
      genero: usuarioActual.genero || "",
      pass_actual: "",
      pass_nueva: "",
      pass_repetir: ""
    });
  }
}, [usuarioActual]);

useEffect(() => {
  if (!usuarioActual) return;

  obtenerResponsablesPorUsuario(usuarioActual.id_usuario)
    .then((resp) => {
      console.log("Responsables obtenidos:", resp);  // Verifica los datos obtenidos

      // Actualiza el estado solo si los responsables no son los mismos
      if (resp && resp.length > 0 && !arraysEqual(resp, responsables)) {
        setResponsables(resp);
      }
    })
    .catch(() => {
      setResponsables([]);  // Limpia los datos si ocurre un error
    });
}, [usuarioActual, responsables]);  // Asegúrate de incluir 'responsables' como dependencia

// Función para comparar si los responsables actuales son diferentes
const arraysEqual = (a: Responsable[], b: Responsable[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id_responsable !== b[i].id_responsable) return false;
  }
  return true;
};


  const themeColors = getThemeColors(theme);
  
  const [mostrarFormCaracteristica, setMostrarFormCaracteristica] = useState(false);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState({
    nombre: '',
    descripcion: '',
    valor_inicial: 5
  });

  
  const [mostrarFormResponsable, setMostrarFormResponsable] = useState(false);
  const [nuevoResponsable, setNuevoResponsable] = useState({
    id_responsable: 0,
    nombre: '',
    tipo_res: '',
    email: '',
    genero:'',
    apellido_mat:'',
    apellido_pat:''
  });

  const usuarioActivo = usuarioActual || usuario;
  const fechaNacimiento = new Date(usuarioActivo?.fecha_nac + 'T00:00:00');
// Modal para editar perfil
const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);

const [perfilEditable, setPerfilEditable] = useState({
  nombres: usuarioActivo?.nombres || "",
  apellido_pat: usuarioActivo?.apellido_pat || "", // Aquí aseguramos que se cargue el apellido paterno
  apellido_mat: usuarioActivo?.apellido_mat || "", // Aquí aseguramos que se cargue el apellido materno
  email: usuarioActivo?.email || "",
  fecha_nac: usuarioActivo?.fecha_nac || "",
  genero: usuarioActivo?.genero || "",
  pass_actual: "",
  pass_nueva: "",
  pass_repetir: ""
});


  const calcularEdad = () => {
    if (!usuarioActivo?.fecha_nac) return 0;
    const nacimiento = new Date(usuarioActivo.fecha_nac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleAgregarCaracteristica = () => {
    if (!nuevaCaracteristica.nombre.trim()) return;

    const caracteristica: Caracteristica = {
      id_caracteristica: `custom-${Date.now()}`,
      nombre: nuevaCaracteristica.nombre,
      descripcion: nuevaCaracteristica.descripcion,
      valor_inicial: nuevaCaracteristica.valor_inicial,
      valor_actual: nuevaCaracteristica.valor_inicial
    };

    agregarCaracteristica(caracteristica);
    setNuevaCaracteristica({ nombre: '', descripcion: '', valor_inicial: 5 });
    setMostrarFormCaracteristica(false);
  };
// MiPerfil.tsx
const handleAgregarResponsable = async () => {
  if (!nuevoResponsable.nombre.trim() || !nuevoResponsable.email.trim()) {
    console.log("Nombre o email vacío.");
    return; // Verifica que el nombre y el email no estén vacíos
  }

  // Verificamos que usuarioActivo no sea null
  if (!usuarioActivo) {
    console.log("No hay un usuario activo.");
    alert("No hay un usuario activo.");
    return; // Si no hay usuario, salimos de la función
  }

  console.log("Llamando a crearResponsable..."); // Agregamos un log antes de llamar a la función

  // Solicitar autorización antes de agregar
  solicitarAutorizacion(async () => {
    try {
      // Llamamos a la función de crear responsable desde la API
      console.log("Enviando responsable:", nuevoResponsable); // Verificamos el objeto que estamos enviando
      const newResponsable = await crearResponsable(nuevoResponsable);

      // Verifica si realmente se recibe la respuesta esperada
      console.log("Responsable creado correctamente", newResponsable); // Verifica si la respuesta se recibe correctamente

      // Ahora vinculamos el responsable con el usuario
      const vincularResponse = await vincularResponsableConUsuario(newResponsable.id_responsable, usuarioActivo.id_usuario);

      // Verifica si la función de vinculación se llama correctamente
      console.log("Respuesta de vinculación:", vincularResponse);

      if (vincularResponse.success) {
        // Si la vinculación es exitosa
        console.log("Responsable vinculado correctamente.");
        setResponsable(newResponsable); // Actualiza el estado global con el nuevo responsable
        setNuevoResponsable({
          id_responsable: 0, // Resetear datos del responsable después de agregar
          nombre: '',
          tipo_res: '',
          email: '',
          genero: '',
          apellido_mat: '',
          apellido_pat: ''
        });

        // Cerramos el formulario de agregar responsable
        setMostrarFormResponsable(false);
      } else {
        console.error("Error al vincular el responsable");
        alert("Hubo un problema al vincular el responsable.");
      }
    } catch (error) {
      console.error("Error al agregar el responsable:", error);
      alert("Hubo un problema al agregar el responsable.");
    }
  });
};
const handleEliminarResponsable = async (responsable: Responsable) => {
  if (!responsable || !usuarioActivo) {
    console.log("No hay responsable o usuario activo.");
    return;
  }

  try {
    const response = await eliminarResponsableMonitoreo(responsable.id_responsable, usuarioActivo.id_usuario);
    
    if (response.success) {
      // Si la eliminación es exitosa, actualizamos el estado
      setResponsables((prevResponsables) => prevResponsables.filter(r => r.id_responsable !== responsable.id_responsable));
      alert("Responsable eliminado exitosamente.");
    } else {
      alert("Hubo un problema al eliminar el responsable.");
    }
  } catch (error) {
    console.error("Error al eliminar el responsable:", error);
    alert("Hubo un problema al eliminar el responsable.");
  }
};


const handleEliminarMonitoreo = async (responsable: Responsable) => {
  if (!responsable || !usuarioActivo) {
    console.log("No hay responsable o usuario activo.");
    return;
  }

  // Log de verificación
  console.log("Eliminando monitoreo con id_responsable:", responsable.id_responsable, "y id_usuario:", usuarioActivo.id_usuario);

  try {
    const response = await eliminarResponsableMonitoreo(responsable.id_responsable, usuarioActivo.id_usuario);

    if (response.success) {
      setResponsables((prevResponsables) => prevResponsables.filter(r => r.id_responsable !== responsable.id_responsable));
    } else {
      alert("Hubo un problema al eliminar el monitoreo.");
    }
  } catch (error) {
    console.error("Error al eliminar el monitoreo:", error);
    alert("Hubo un problema al eliminar el monitoreo.");
  }
};


const [modalCodigo, setModalCodigo] = useState(false);
const [codigoAut, setCodigoAut] = useState("");
const [accionPendiente, setAccionPendiente] = useState<null | (() => void)>(null);

const handleGuardarResponsable = async () => {
  try {
    let resultado;

    // Verificar si usuarioActivo es null
    if (!usuarioActivo) {
      console.log("No hay un usuario activo.");
      alert("No hay un usuario activo.");
      return; // Salir de la función si no hay usuario activo
    }

    // SI EL ID ES 0 → CREAR NUEVO RESPONSABLE
    if (nuevoResponsable.id_responsable === 0) {
      resultado = await crearResponsable(nuevoResponsable);
      console.log("Responsable creado correctamente", resultado);  // Verificación

      // Ahora intentamos vincular el responsable con el usuario
      console.log("Enviando solicitud para vincular responsable:", {
        idResponsable: resultado.id_responsable,
        idUsuario: usuarioActivo.id_usuario,
      });

      const vincularResponse = await vincularResponsableConUsuario(resultado.id_responsable, usuarioActivo.id_usuario);
      
      console.log("Respuesta de vinculación:", vincularResponse); // Verificación de la respuesta

      // Verifica que la respuesta tenga la propiedad "id_mon" para confirmar que la vinculación fue exitosa
      if (vincularResponse.id_mon) {
        console.log("Responsable vinculado correctamente.");
        setResponsable(resultado);  // Actualiza el responsable en el estado global
        setNuevoResponsable({
          id_responsable: 0, // Resetear datos del responsable después de agregar
          nombre: '',
          tipo_res: '',
          email: '',
          genero: '',
          apellido_mat: '',
          apellido_pat: ''
        });

        // Cerramos el formulario de agregar responsable
        setMostrarFormResponsable(false);
      } else {
        console.error("Error al vincular el responsable:", vincularResponse);
        alert("Hubo un problema al vincular el responsable.");
      }
    } else {
      // SI TIENE ID → EDITAR
      resultado = await editarResponsable(nuevoResponsable);
      setResponsable(resultado);
      setMostrarFormResponsable(false);
    }

  } catch (error) {
    console.error("Error al guardar el responsable:", error);
    alert("Hubo un problema al guardar el responsable.");
  }
};

const solicitarAutorizacion = async (accion: () => void) => {
  if (!usuarioActivo || !responsable?.id_responsable) return;

  // Solicitar código de autorización
  await solicitarCodigo(usuarioActivo.id_usuario, responsable.id_responsable);

  // Guardar la acción pendiente para ejecutarla luego de la validación
  setAccionPendiente(() => accion);

  // Mostrar el modal de verificación
  setModalCodigo(true);
};

const validar = async () => {
  if (!usuarioActivo || !responsable) return;

  try {
    const data = await validarCodigo(codigoAut);  // ← directamente JSON

    if (!data.success) {
      alert(data.message || "Código inválido o expirado");
      return;
    }

    // Código válido → continuar
    setModalCodigo(false);
    setCodigoAut("");

    if (accionPendiente) accionPendiente();

  } catch (err) {
    console.error(err);
    alert("Error verificando código");
  }
};
const guardarPerfil = async () => {
  // Verifica que la nueva contraseña y la repetida sean iguales
  if (perfilEditable.pass_nueva && perfilEditable.pass_nueva !== perfilEditable.pass_repetir) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // Prepara los datos para enviar
  const data: any = {
    id_usuario: usuarioActivo?.id_usuario,
    nombres: perfilEditable.nombres,
    apellido_pat: perfilEditable.apellido_pat,
    apellido_mat: perfilEditable.apellido_mat,
    email: perfilEditable.email,
    fecha_nac: perfilEditable.fecha_nac,
    genero: perfilEditable.genero
  };

  // Solo incluye las contraseñas si son proporcionadas
  if (perfilEditable.pass_nueva) {
    data.pass_actual = perfilEditable.pass_actual;
    data.pass_nueva = perfilEditable.pass_nueva;
    data.pass_repetir = perfilEditable.pass_repetir;
  }

  try {
    // Llamada al API para editar perfil
    const response = await editarPerfil(data);

    // Verifica si la respuesta es exitosa
    if (response) {
      alert("Perfil actualizado con éxito");
      setMostrarModalPerfil(false);  // Cerrar el modal
    }
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    alert("Hubo un problema al actualizar tu perfil.");
  }
};

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
            Mi Perfil
          </h1>
        </div>

        {/* Información Personal */}
        <div 
          className="rounded-3xl shadow-xl p-8 mb-6 backdrop-blur-xl border-2 transition-all hover:shadow-2xl"
          style={{
            backgroundColor: isDarkTheme(theme) ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
            borderColor: `${themeColors.primary}60`,
            boxShadow: `0 12px 32px ${themeColors.primary}30`
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
              }}
            >
              <User className="text-white" size={40} />
            </div>
            <div>
              <h2 style={{ color: themeColors.textPrimary }}>
                {usuarioActivo?.nombres} {usuarioActivo?.apellido_pat} {usuarioActivo?.apellido_mat}
              </h2>
              <p style={{ color: themeColors.textSecondary }}>
                {calcularEdad()} años
              </p>
            </div>
            <button
  onClick={() => setMostrarModalPerfil(true)}
  className="px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:scale-105 transition-all"
  style={{
    backgroundColor: themeColors.primary,
    color: "white"
  }}
>
  Editar Información
</button>

          </div>

          <div className="space-y-4">
            <div 
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`
              }}
            >
              <Mail style={{ color: themeColors.primary }} size={20} />
              <div>
                <p style={{ color: themeColors.textSecondary }}>Email</p>
                <p style={{ color: themeColors.textPrimary }}>{usuarioActivo?.email}</p>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`
              }}
            >
              <Calendar style={{ color: themeColors.primary }} size={20} />
              <div>
                <p style={{ color: themeColors.textSecondary }}>Fecha de nacimiento</p>
                <p style={{ color: themeColors.textPrimary }}>
  {fechaNacimiento ? 
    fechaNacimiento.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) 
  : '-'}
</p>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`
              }}
            >
              <User style={{ color: themeColors.primary }} size={20} />
              <div>
                <p style={{ color: themeColors.textSecondary }}>Género</p>
                <p style={{ color: themeColors.textPrimary }} className="capitalize">
                  {usuarioActivo?.genero === "F"
  ? "Femenino"
  : usuarioActivo?.genero === "M"
  ? "Masculino"
  : usuarioActivo?.genero}
                </p>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.accent1}10`
              }}
            >
              <Brain style={{ color: themeColors.accent1 }} size={20} />
              <div>
                <p style={{ color: themeColors.textSecondary }}>Nivel TEA</p>
                <p style={{ color: themeColors.textPrimary }}>
                  Nivel {usuarioActivo?.nivel_tea} - {usuarioActivo?.nivel_tea === 1
  ? 'Requiere poco apoyo'
  : 'Requiere apoyo moderado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsable */}
        <div 
          className="rounded-3xl shadow-lg p-8 mb-6 backdrop-blur-xl border"
          style={{
            backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'white',
            borderColor: `${themeColors.primary}20`
          }}
        >
          <div className="flex items-center justify-between mb-6">
  <h2 style={{ color: themeColors.textPrimary }}>Responsables</h2>
  {/* Mostrar siempre el botón para añadir un responsable */}
  <button
  onClick={() => {
    setNuevoResponsable({
      id_responsable: 0,
      nombre: "",
      tipo_res: "",
      email: "",
      genero: "",
      apellido_mat: "",
      apellido_pat: ""
    });

    setMostrarFormResponsable(true);
  }}
  className="flex items-center gap-2 px-4 py-2 text-white rounded-xl transition-all hover:shadow-lg hover:scale-105"
  style={{
    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
  }}
>
  <Plus size={20} />
  <span>Añadir Responsable</span>
</button>

</div>
          {responsables.length > 0 ? (
  responsables.map((responsable) => (
    <div key={responsable.id_responsable} className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.accent1}10`}}>
        <UserCheck style={{ color: themeColors.accent1 }} size={20} />
        <div>
          <p style={{ color: themeColors.textSecondary }}>Nombre</p>
          <p style={{ color: themeColors.textPrimary }}>{responsable.nombre}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.accent1}10` }}>
        <User style={{ color: themeColors.accent1 }} size={20} />
        <div>
          <p style={{ color: themeColors.textSecondary }}>Relación</p>
          <p style={{ color: themeColors.textPrimary }} className="capitalize">
            {responsable?.tipo_res ? responsable.tipo_res : 'No disponible'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.accent1}10` }}>
        <Mail style={{ color: themeColors.accent1 }} size={20} />
        <div>
          <p style={{ color: themeColors.textSecondary }}>Email</p>
          <p style={{ color: themeColors.textPrimary }}>{responsable.email}</p>
        </div>
      </div>
      <button
  className="px-5 py-3 rounded-2xl font-medium shadow-md transition-all 
             hover:scale-105 hover:shadow-xl active:scale-95"
  style={{
    background: `linear-gradient(135deg, ${themeColors.accent1}, ${themeColors.secondary})`,
    color: "white",
    border: `2px solid ${themeColors.accent1}`
  }}
  onClick={() => {
  if (!responsable) return;

  solicitarAutorizacion(() => {
    setNuevoResponsable({
      id_responsable: responsable.id_responsable,
      nombre: responsable.nombre,
      tipo_res: responsable.tipo_res ?? "",
      email: responsable.email,
      genero: responsable.genero ?? "",
      apellido_mat: responsable.apellido_mat ?? "",
      apellido_pat: responsable.apellido_pat ?? ""
    });
    setMostrarFormResponsable(true);
  });
}}

>
  ✏️ Editar responsable
</button>
<button
  className="px-5 py-3 rounded-2xl font-medium shadow-md transition-all 
            hover:scale-105 hover:shadow-xl active:scale-95"
  style={{
    background: `linear-gradient(135deg, ${themeColors.error}, ${themeColors.secondary})`,
    color: "white",
    border: `2px solid ${themeColors.error}`
  }}
onClick={() => {
    solicitarAutorizacion(() => handleEliminarMonitoreo(responsable));  // Pasamos la función de eliminación
  }}
  >
  🗑️ Eliminar responsable
</button>
    </div>
  ))
) : mostrarFormResponsable ? (
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Nombre completo"
      value={nuevoResponsable.nombre}
      onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, nombre: e.target.value })}
      className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
      style={{
        borderColor: themeColors.inputBorder,
        backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
        color: themeColors.textPrimary,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = themeColors.inputFocus;
        e.target.style.outline = 'none';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = themeColors.inputBorder;
      }}
    />
    <select
      value={nuevoResponsable.tipo_res}
      onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, tipo_res: e.target.value })}
      className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
      style={{
        borderColor: themeColors.inputBorder,
        backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
        color: themeColors.textPrimary,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = themeColors.inputFocus;
        e.target.style.outline = 'none';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = themeColors.inputBorder;
      }}
    >
      <option value="">Selecciona relación...</option>
      <option value="padre">Padre</option>
      <option value="madre">Madre</option>
      <option value="tutor">Tutor/a</option>
      <option value="terapeuta">Terapeuta</option>
      <option value="otro">Otro</option>
    </select>
    <input
      type="email"
      placeholder="Email"
      value={nuevoResponsable.email}
      onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, email: e.target.value })}
      className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
      style={{
        borderColor: themeColors.inputBorder,
        backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
        color: themeColors.textPrimary,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = themeColors.inputFocus;
        e.target.style.outline = 'none';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = themeColors.inputBorder;
      }}
    />
    <div className="flex gap-3">
      <button
        onClick={handleAgregarResponsable}
        className="flex-1 text-white py-3 rounded-xl transition-all hover:shadow-xl hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
        }}
      >
        Guardar
      </button>
      <button
        onClick={() => setMostrarFormResponsable(false)}
        className="px-6 py-3 rounded-xl border-2 transition-all hover:scale-105"
        style={{
          backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
          color: themeColors.textPrimary,
          borderColor: themeColors.inputBorder,
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
) : (
  <p style={{ color: themeColors.textSecondary }} className="text-center py-8">
    No tienes un responsable asignado
  </p>
)}
          
        </div>

        {/* Características */}
        <div 
          className="rounded-3xl shadow-lg p-8 mb-6 backdrop-blur-xl border"
          style={{
            backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'white',
            borderColor: `${themeColors.primary}20`
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: themeColors.textPrimary }}>
              Mis Características ({caracteristicas.length})
            </h2>
            <button
              onClick={() => setMostrarFormCaracteristica(!mostrarFormCaracteristica)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-xl transition-all hover:shadow-lg hover:scale-105"
              style={{
                background: mostrarFormCaracteristica 
                  ? `linear-gradient(135deg, ${themeColors.error}, ${themeColors.secondary})`
                  : `linear-gradient(135deg, ${themeColors.accent1}, ${themeColors.accent2})`
              }}
            >
              {mostrarFormCaracteristica ? <X size={20} /> : <Plus size={20} />}
              <span>{mostrarFormCaracteristica ? 'Cancelar' : 'Añadir'}</span>
            </button>
          </div>

          {mostrarFormCaracteristica && (
            <div 
              className="mb-6 p-6 rounded-2xl space-y-4"
              style={{
                backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`
              }}
            >
              <input
                type="text"
                placeholder="Nombre de la característica"
                value={nuevaCaracteristica.nombre}
                onChange={(e) => setNuevaCaracteristica({ ...nuevaCaracteristica, nombre: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
                style={{
                  borderColor: themeColors.inputBorder,
                  backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
                  color: themeColors.textPrimary
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = themeColors.inputFocus;
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = themeColors.inputBorder;
                }}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={nuevaCaracteristica.descripcion}
                onChange={(e) => setNuevaCaracteristica({ ...nuevaCaracteristica, descripcion: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
                style={{
                  borderColor: themeColors.inputBorder,
                  backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
                  color: themeColors.textPrimary
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = themeColors.inputFocus;
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = themeColors.inputBorder;
                }}
              />
              <div>
                <label style={{ color: themeColors.textPrimary }} className="block mb-2">
                  Valor inicial: {nuevaCaracteristica.valor_inicial}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={nuevaCaracteristica.valor_inicial}
                  onChange={(e) => setNuevaCaracteristica({ ...nuevaCaracteristica, valor_inicial: parseInt(e.target.value) })}
                  className="w-full"
                  style={{
                    accentColor: themeColors.primary
                  }}
                />
              </div>
              <button
                onClick={handleAgregarCaracteristica}
                className="w-full text-white py-3 rounded-xl transition-all hover:shadow-xl hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                }}
              >
                Guardar característica
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caracteristicas.map((car) => (
              <div 
                key={car.id_caracteristica} 
                className="p-4 rounded-2xl"
                style={{
                  backgroundColor: theme === 'diseno2' ? themeColors.background : `${themeColors.primary}10`
                }}
              >
                <h3 style={{ color: themeColors.textPrimary }} className="mb-1">
                  {car.nombre}
                </h3>
                <p style={{ color: themeColors.textSecondary }} className="mb-3">
                  {car.descripcion}
                </p>
                <div className="flex items-center gap-2">
                  <div 
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: `${themeColors.secondary}20` }}
                  >
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${car.valor_actual * 10}%`,
                        background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.accent1})`
                      }}
                    />
                  </div>
                  <span style={{ color: themeColors.primary }}>
                    {car.valor_actual}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div 
          className="rounded-3xl shadow-lg p-8 mb-6 backdrop-blur-xl border"
          style={{
            backgroundColor: theme === 'diseno2' ? `${themeColors.cardBg}E6` : 'white',
            borderColor: `${themeColors.primary}20`
          }}
        >
          <h2 style={{ color: themeColors.textPrimary }} className="mb-6">
            Estadísticas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              className="rounded-2xl p-6 text-center border-2 hover:scale-105 transition-all"
              style={{
                background: theme === 'diseno3' 
                  ? `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.primary}10)`
                  : `linear-gradient(135deg, ${themeColors.primary}15, ${themeColors.primary}05)`,
                borderColor: `${themeColors.primary}30`
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md"
                style={{ backgroundColor: themeColors.primary }}
              >
                <MessageCircle className="text-white" size={24} />
              </div>
              <p style={{ color: themeColors.primary }}>{chats.length}</p>
              <p style={{ color: themeColors.textSecondary }} className="mt-1">
                Conversaciones
              </p>
            </div>

            <div 
              className="rounded-2xl p-6 text-center border-2 hover:scale-105 transition-all"
              style={{
                background: theme === 'diseno3'
                  ? `linear-gradient(135deg, ${themeColors.accent1}20, ${themeColors.accent1}10)`
                  : `linear-gradient(135deg, ${themeColors.accent1}15, ${themeColors.accent1}05)`,
                borderColor: `${themeColors.accent1}30`
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md"
                style={{ backgroundColor: themeColors.accent1 }}
              >
                <Target className="text-white" size={24} />
              </div>
              <p style={{ color: themeColors.accent1 }}>
                {caracteristicas.length}
              </p>
              <p style={{ color: themeColors.textSecondary }} className="mt-1">
                Características
              </p>
            </div>

            <div 
              className="rounded-2xl p-6 text-center col-span-2 md:col-span-1 border-2 hover:scale-105 transition-all"
              style={{
                background: theme === 'diseno3'
                  ? `linear-gradient(135deg, ${themeColors.secondary}20, ${themeColors.secondary}10)`
                  : `linear-gradient(135deg, ${themeColors.secondary}15, ${themeColors.secondary}05)`,
                borderColor: `${themeColors.secondary}30`
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md"
                style={{ backgroundColor: themeColors.secondary }}
              >
                <Send className="text-white" size={24} />
              </div>
              <p style={{ color: themeColors.secondary }}>
                {chats.reduce((acc, chat) => acc + chat.mensajes.filter(m => m.fuente === "USUARIO").length, 0)}
              </p>
              <p style={{ color: themeColors.textSecondary }} className="mt-1">
                Mensajes enviados
              </p>
            </div>
          </div>
        </div>

        {/* Botón volver */}
        <button
          onClick={() => setCurrentScreen('menu-principal')}
          className="w-full py-4 px-6 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] border"
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
      {isDarkTheme(theme) && <BackgroundBubbles />}

      {modalCodigo && (
  <div 
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    style={{
      zIndex: 999999 // El modal tiene z-index bajo mientras se valida
    }}
  >
    <div 
      className="rounded-2xl p-8 w-80 text-center shadow-2xl"
      style={{
        backgroundColor: theme === 'diseno2' ? "#1e1e1ee6" : "white",
        border: "2px solid rgba(255,255,255,0.15)",
        zIndex: 999 // Este z-index puede quedarse bajo para que no sobrepase el formulario
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'diseno2' ? "#fff" : themeColors.primary }}>
        Verificar autorización
      </h2>

      <p className="text-sm mb-4" style={{ color: theme === 'diseno2' ? "#ddd" : "#555" }}>
        Ingresa el código que se envió a tu responsable.
      </p>

      <input
        type="text"
        maxLength={6}
        value={codigoAut}
        onChange={(e) => setCodigoAut(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 text-center tracking-widest text-lg mb-4"
        style={{
          borderColor: themeColors.primary,
          backgroundColor: theme === 'diseno2' ? "#2a2a2a" : "#fff",
          color: themeColors.textPrimary
        }}
      />

      <div className="flex gap-3">
        <button onClick={validar} className="px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all">
          Validar código
        </button>
        <button onClick={() => setModalCodigo(false)} className="flex-1 py-3 rounded-xl border" style={{ borderColor: themeColors.inputBorder, color: themeColors.textPrimary, backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white' }}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{mostrarFormResponsable && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 999999 }}>
    <div
      className="rounded-2xl p-8 w-80 text-center shadow-2xl"
      style={{
        backgroundColor: theme === 'diseno2' ? "#1e1e1ee6" : "white",
        border: "2px solid rgba(255,255,255,0.15)"
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'diseno2' ? "#fff" : themeColors.primary }}>
        Crear/Editar Responsable
      </h2>

      {/* Nombre Completo */}
      <input
        type="text"
        placeholder="Nombre completo"
        value={nuevoResponsable.nombre}
        onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, nombre: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
        style={{
          borderColor: themeColors.inputBorder,
          backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
          color: themeColors.textPrimary
        }}
        onFocus={(e) => {
          e.target.style.borderColor = themeColors.inputFocus;
          e.target.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = themeColors.inputBorder;
        }}
      />

      {/* Apellido Paterno */}
      {/* Apellido paterno */}
<input
  type="text"
  placeholder="Apellido paterno"
  value={nuevoResponsable.apellido_pat}
  onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, apellido_pat: e.target.value })}
  className="w-full px-4 py-3 rounded-xl border-2 mb-3"
  style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
/>

{/* Apellido materno */}
<input
  type="text"
  placeholder="Apellido materno"
  value={nuevoResponsable.apellido_mat}
  onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, apellido_mat: e.target.value })}
  className="w-full px-4 py-3 rounded-xl border-2 mb-3"
  style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
/>


      {/* Género */}
      <select
        value={nuevoResponsable.genero}
        onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, genero: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
        style={{
          borderColor: themeColors.inputBorder,
          backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
          color: themeColors.textPrimary
        }}
        onFocus={(e) => {
          e.target.style.borderColor = themeColors.inputFocus;
          e.target.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = themeColors.inputBorder;
        }}
      >
        <option value="">Selecciona Género...</option>
        <option value="F">Femenino</option>
        <option value="M">Masculino</option>
        <option value="Otro">Otro</option>
      </select>

      {/* Relación (tipo_res) */}
      <select
        value={nuevoResponsable.tipo_res}
        onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, tipo_res: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
        style={{
          borderColor: themeColors.inputBorder,
          backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
          color: themeColors.textPrimary
        }}
        onFocus={(e) => {
          e.target.style.borderColor = themeColors.inputFocus;
          e.target.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = themeColors.inputBorder;
        }}
      >
        <option value="">Selecciona Relación...</option>
        <option value="padre">Padre</option>
        <option value="madre">Madre</option>
        <option value="tutor">Tutor/a</option>
        <option value="terapeuta">Terapeuta</option>
        <option value="otro">Otro</option>
      </select>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={nuevoResponsable.email}
        onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, email: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
        style={{
          borderColor: themeColors.inputBorder,
          backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
          color: themeColors.textPrimary
        }}
        onFocus={(e) => {
          e.target.style.borderColor = themeColors.inputFocus;
          e.target.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = themeColors.inputBorder;
        }}
      />

      {/* Botones */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleGuardarResponsable}
          className="flex-1 text-white py-3 rounded-xl transition-all hover:shadow-xl hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
          }}
        >
          Guardar
        </button>
        <button
          onClick={() => setMostrarFormResponsable(false)}
          className="px-6 py-3 rounded-xl border-2 transition-all hover:scale-105"
          style={{
            backgroundColor: theme === 'diseno2' ? themeColors.cardBg : 'white',
            color: themeColors.textPrimary,
            borderColor: themeColors.inputBorder
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
{mostrarModalPerfil && (
  <div 
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    style={{ zIndex: 999999 }}
  >
    <div 
      className="rounded-2xl p-8 w-96 shadow-2xl"
      style={{
        backgroundColor: theme === 'diseno2' ? "#1e1e1ee6" : "white",
        border: "2px solid rgba(255,255,255,0.15)"
      }}
    >
      <h2 className="text-xl font-bold mb-4"
          style={{ color: theme === 'diseno2' ? "#fff" : themeColors.primary }}>
        Editar Información Personal
      </h2>

      {/* Nombres */}
      <input
        type="text"
        placeholder="Nombres"
        value={perfilEditable.nombres}
        onChange={(e) => setPerfilEditable({ ...perfilEditable, nombres: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 mb-3"
        style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
      />

      <input
  type="text"
  placeholder="Apellido paterno"
  value={perfilEditable.apellido_pat}
  onChange={(e) => setPerfilEditable({ ...perfilEditable, apellido_pat: e.target.value })}
  className="w-full px-4 py-3 rounded-xl border-2 mb-3"
  style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
/>

<input
  type="text"
  placeholder="Apellido materno"
  value={perfilEditable.apellido_mat}
  onChange={(e) => setPerfilEditable({ ...perfilEditable, apellido_mat: e.target.value })}
  className="w-full px-4 py-3 rounded-xl border-2 mb-3"
  style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
/>

      {/* Email */}
      <input
        type="email"
        placeholder="Correo electrónico"
        value={perfilEditable.email}
        onChange={(e) => setPerfilEditable({ ...perfilEditable, email: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 mb-3"
        style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
      />

      {/* Fecha nacimiento */}
      <input
        type="date"
        value={perfilEditable.fecha_nac}
        onChange={(e) => setPerfilEditable({ ...perfilEditable, fecha_nac: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 mb-3"
        style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
      />

      {/* Género */}
      <select
        value={perfilEditable.genero}
        onChange={(e) => setPerfilEditable({ ...perfilEditable, genero: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border-2 mb-4"
        style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
      >
        <option value="">Selecciona género...</option>
        <option value="F">Femenino</option>
        <option value="M">Masculino</option>
        <option value="Otro">Otro</option>
      </select>

      {/* CAMBIAR CONTRASEÑA */}
      <details className="mb-4">
        <summary
          className="cursor-pointer font-semibold mb-2"
          style={{ color: themeColors.primary }}
        >
          Cambiar contraseña
        </summary>

        <div className="mt-2 space-y-3">
          <input
            type="password"
            placeholder="Contraseña actual"
            value={perfilEditable.pass_actual || ""}
            onChange={(e) => setPerfilEditable({ ...perfilEditable, pass_actual: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2"
            style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={perfilEditable.pass_nueva || ""}
            onChange={(e) => setPerfilEditable({ ...perfilEditable, pass_nueva: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2"
            style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
          />

          <input
            type="password"
            placeholder="Repetir nueva contraseña"
            value={perfilEditable.pass_repetir || ""}
            onChange={(e) => setPerfilEditable({ ...perfilEditable, pass_repetir: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2"
            style={{ borderColor: themeColors.inputBorder, backgroundColor: "#fff" }}
          />
        </div>
      </details>

      {/* BOTONES */}
      <div className="flex gap-3">
        <button
           onClick={guardarPerfil}
          className="flex-1 py-3 rounded-xl text-white"
          style={{ backgroundColor: themeColors.primary }}
        >
          Guardar Cambios
        </button>

        <button
          onClick={() => setMostrarModalPerfil(false)}
          className="flex-1 py-3 rounded-xl border"
          style={{ borderColor: themeColors.inputBorder, color: themeColors.textPrimary }}
        >
          Cancelar
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}
