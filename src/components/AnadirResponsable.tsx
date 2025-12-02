import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus } from 'lucide-react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';
import LightGlows from './ui/LightGlows';
import { crearResponsableBD } from "../api/api";
import { vincularResponsable } from '../api/api';
export default function AnadirResponsable() {
  const { setResponsable, setCurrentScreen, theme, usuarioActual } = useApp();
  const themeColors = getThemeColors(theme);

  const [formData, setFormData] = useState({
  nombre: '',
  apellido_pat: '',
  apellido_mat: '',
  relacion: '',
  email: ''
});
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!usuarioActual) {
    alert("No se encontró el usuario actual.");
    return;
  }

  try {
    // 1️⃣ CREAR RESPONSABLE
    const payloadResponsable = {
      nombre: formData.nombre,
      apellido_pat: formData.apellido_pat,
      apellido_mat: formData.apellido_mat,
      tipo_res: formData.relacion,
      email: formData.email,
      genero: null,
      id_usuario: usuarioActual!.id_usuario
    };

    const nuevoResponsable = await crearResponsableBD(payloadResponsable);
    console.log("Responsable creado:", nuevoResponsable);

    // 2️⃣ CREAR MONITOREA (vincular responsable con usuario)
    const payloadMonitorea = {
      id_usuario: usuarioActual!.id_usuario,
      id_responsable: nuevoResponsable.id_responsable
    };

    await vincularResponsable(payloadMonitorea);
    console.log("Monitorea creado:", payloadMonitorea);

    // 3️⃣ Guardarlo en contexto
    setResponsable(nuevoResponsable);

    // 4️⃣ Ir a siguiente pantalla
    setCurrentScreen("caracteristicas-iniciales");

  } catch (error) {
    console.error("Error completo al añadir responsable:", error);
    alert("No se pudo guardar el responsable ni vincularlo.");
  }
};


  const handleOmitir = () => {
    setResponsable(null);
    setCurrentScreen('caracteristicas-iniciales');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const payload = {
  nombre: formData.nombre,
  apellido_pat: formData.apellido_pat,
  apellido_mat: formData.apellido_mat,
  tipo_res: formData.relacion,
  email: formData.email,
  genero: null,
  id_usuario: usuarioActual!.id_usuario
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
        className="w-full max-w-md rounded-3xl shadow-2xl p-8 relative z-10 backdrop-blur-xl border hover:scale-[1.01] transition-transform duration-300"
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
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 style={{ color: themeColors.textPrimary }} className="mb-2">
            Añadir responsable
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            Un adulto recibirá tus informes de progreso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
<div>
  <label htmlFor="nombre" style={{ color: themeColors.textPrimary }} className="block mb-2">
    Nombre
  </label>
  <input
    type="text"
    id="nombre"
    name="nombre"
    value={formData.nombre}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
    style={{
      borderColor: themeColors.inputBorder,
      backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
      color: themeColors.textPrimary
    }}
  />
</div>

{/* Apellido paterno */}
<div>
  <label htmlFor="apellido_pat" style={{ color: themeColors.textPrimary }} className="block mb-2">
    Apellido paterno
  </label>
  <input
    type="text"
    id="apellido_pat"
    name="apellido_pat"
    value={formData.apellido_pat}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
    style={{
      borderColor: themeColors.inputBorder,
      backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
      color: themeColors.textPrimary
    }}
  />
</div>

{/* Apellido materno */}
<div>
  <label htmlFor="apellido_mat" style={{ color: themeColors.textPrimary }} className="block mb-2">
    Apellido materno
  </label>
  <input
    type="text"
    id="apellido_mat"
    name="apellido_mat"
    value={formData.apellido_mat}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
    style={{
      borderColor: themeColors.inputBorder,
      backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
      color: themeColors.textPrimary
    }}
  />
</div>


          <div>
            <label htmlFor="relacion" style={{ color: themeColors.textPrimary }} className="block mb-2">
              Relación
            </label>
            <select
              id="relacion"
              name="relacion"
              value={formData.relacion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
              style={{
                borderColor: themeColors.inputBorder,
                backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
                color: themeColors.textPrimary
              }}
              onFocus={(e) => {
                e.target.style.borderColor = themeColors.inputFocus;
                e.target.style.boxShadow = `0 0 0 4px ${themeColors.inputFocus}15`;
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = themeColors.inputBorder;
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Selecciona...</option>
              <option value="padre">Padre</option>
              <option value="madre">Madre</option>
              <option value="tutor">Tutor/a</option>
              <option value="terapeuta">Terapeuta</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" style={{ color: themeColors.textPrimary }} className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:scale-[1.01]"
              style={{
                borderColor: themeColors.inputBorder,
                backgroundColor: theme === 'diseno2' ? themeColors.background : 'white',
                color: themeColors.textPrimary
              }}
              onFocus={(e) => {
                e.target.style.borderColor = themeColors.inputFocus;
                e.target.style.boxShadow = `0 0 0 4px ${themeColors.inputFocus}15`;
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = themeColors.inputBorder;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <button
              type="submit"
              className="w-full text-white py-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
              }}
            >
              Guardar responsable
            </button>
            
            <button
              type="button"
              onClick={handleOmitir}
              className="w-full py-4 rounded-xl border-2 transition-all hover:shadow-xl hover:scale-[1.02]"
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
              Omitir por ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
