import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, User, Calendar, Mail, Lock, UserCircle2 } from 'lucide-react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';
import { crearUsuario } from '../api/api';

let contrasenaTemp = '';

export const getContrasenaTemp = () => contrasenaTemp;

export default function Registro() {
  const { setUsuario, setCurrentScreen, usuarios, theme, setUsuarioActual, usuarioActual } = useApp();
  const themeColors = getThemeColors(theme);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    genero: '',
    email: '',
    contrasena: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    // DATA PARA BACKEND
    const payload = {
      nombres: formData.nombres,
      apellido_pat: formData.apellidoPaterno,
      apellido_mat: formData.apellidoMaterno,
      fecha_nac: formData.fechaNacimiento,
      nivel_tea: 1,
      email: formData.email,
      password: formData.contrasena,
      genero: formData.genero.charAt(0).toUpperCase(),
      pais: "Bolivia"
    };

    // CREAR EN BACKEND
    const nuevoUsuario = await crearUsuario(payload);

    // 🔥 🔥 🔥 ESTA ES LA LÍNEA IMPORTANTE 🔥 🔥 🔥
    setUsuarioActual(nuevoUsuario);

    // SI QUIERES, elimina la otra
    // setUsuario(nuevoUsuario);

    // SIGUIENTE PANTALLA
    setCurrentScreen("configuracion-inicial");

  } catch (err: any) {
    setError("Error al registrarse");
  }
};


  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-6 bg-gradient-to-br ${themeColors.backgroundGradient} relative overflow-hidden`}
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundBubbles />
      </div>

      <div 
        className="w-full max-w-2xl backdrop-blur-xl rounded-3xl shadow-2xl p-10 relative z-10 border hover:scale-[1.01] transition-transform duration-300"
        style={{ 
          backgroundColor: isDarkTheme(theme) ? `${themeColors.cardBg}E6` : `${themeColors.cardBg}F5`,
          borderColor: `${themeColors.primary}50`,
          boxShadow: `0 40px 80px -20px ${themeColors.primary}60, 0 20px 40px -10px ${themeColors.primary}50, 0 10px 20px -5px ${themeColors.primary}40, 0 0 0 2px ${themeColors.primary}30, inset 0 2px 4px rgba(255, 255, 255, 0.3)`,
          transform: 'translateZ(50px) translateY(-10px)'
        }}
      >
        <div className="text-center mb-10">
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl transition-all hover:scale-105 duration-500 cursor-pointer relative group"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
            }}
          >
            <Sparkles 
              className="text-white transition-transform group-hover:rotate-12 duration-500" 
              size={36} 
            />
          </div>
          <h1 style={{ color: themeColors.textPrimary }} className="mb-3">
            Crear cuenta
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            Completa tus datos para comenzar
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 rounded-2xl border animate-shake"
            style={{ 
              backgroundColor: `${themeColors.error}10`,
              borderColor: `${themeColors.error}40`
            }}
          >
            <p style={{ color: themeColors.error }} className="text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label 
              htmlFor="nombres" 
              className="flex items-center gap-2 mb-3"
              style={{ color: themeColors.textPrimary }}
            >
              <User 
                size={18} 
                className="transition-all group-hover:scale-110 duration-300" 
                style={{ color: themeColors.primary }} 
              />
              Nombres
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
              style={{ 
                borderColor: themeColors.inputBorder,
                backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
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
              placeholder="Juan Carlos"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group">
              <label 
                htmlFor="apellidoPaterno" 
                className="flex items-center gap-2 mb-3"
                style={{ color: themeColors.textPrimary }}
              >
                <UserCircle2 
                  size={18} 
                  className="transition-all group-hover:scale-110 duration-300" 
                  style={{ color: themeColors.secondary }} 
                />
                Apellido paterno
              </label>
              <input
                type="text"
                id="apellidoPaterno"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
                style={{ 
                  borderColor: themeColors.inputBorder,
                  backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
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
                placeholder="García"
              />
            </div>

            <div className="group">
              <label 
                htmlFor="apellidoMaterno" 
                className="flex items-center gap-2 mb-3"
                style={{ color: themeColors.textPrimary }}
              >
                <UserCircle2 
                  size={18} 
                  className="transition-all group-hover:scale-110 duration-300" 
                  style={{ color: themeColors.accent1 }} 
                />
                Apellido materno
              </label>
              <input
                type="text"
                id="apellidoMaterno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
                style={{ 
                  borderColor: themeColors.inputBorder,
                  backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
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
                placeholder="López"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group">
              <label 
                htmlFor="fechaNacimiento" 
                className="flex items-center gap-2 mb-3"
                style={{ color: themeColors.textPrimary }}
              >
                <Calendar 
                  size={18} 
                  className="transition-all group-hover:scale-110 duration-300" 
                  style={{ color: themeColors.accent2 }} 
                />
                Fecha de nacimiento
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
                style={{ 
                  borderColor: themeColors.inputBorder,
                  backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
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

            <div className="group">
              <label 
                htmlFor="genero" 
                className="block mb-3"
                style={{ color: themeColors.textPrimary }}
              >
                Género
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
                style={{ 
                  borderColor: themeColors.inputBorder,
                  backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
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
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decir">Prefiero no decir</option>
              </select>
            </div>
          </div>

          <div className="group">
            <label 
              htmlFor="email" 
              className="flex items-center gap-2 mb-3"
              style={{ color: themeColors.textPrimary }}
            >
              <Mail 
                size={18} 
                className="transition-all group-hover:scale-110 duration-300" 
                style={{ color: themeColors.accent3 }} 
              />
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
              style={{ 
                borderColor: themeColors.inputBorder,
                backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
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
              placeholder="tu@email.com"
            />
          </div>

          <div className="group">
            <label 
              htmlFor="contrasena" 
              className="flex items-center gap-2 mb-3"
              style={{ color: themeColors.textPrimary }}
            >
              <Lock 
                size={18} 
                className="transition-all group-hover:scale-110 duration-300" 
                style={{ color: themeColors.primary }} 
              />
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
              style={{ 
                borderColor: themeColors.inputBorder,
                backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] mt-8 flex items-center justify-center gap-2 group relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
            }}
          >
            <span className="relative z-10">
              Crear cuenta
            </span>
            <div 
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            ></div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="mb-4" style={{ color: themeColors.textSecondary }}>
            ¿Ya tienes cuenta?
          </p>
          <button
            onClick={() => setCurrentScreen('login')}
            className="w-full py-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ 
              backgroundColor: theme === 'diseno3' ? themeColors.background : 'white',
              color: themeColors.primary,
              borderColor: themeColors.inputBorder
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = themeColors.primary;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${themeColors.primary}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = themeColors.inputBorder;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
