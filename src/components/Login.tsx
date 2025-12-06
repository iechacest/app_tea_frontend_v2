import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, Eye, EyeOff, Palette, Sparkles, Mail, Lock, Zap } from 'lucide-react';
import { getThemeColors, isDarkTheme } from '../config/themes';
import BackgroundBubbles from './ui/BackgroundBubbles';
import { loginUsuario } from "../api/api"; 
import { Unlock } from 'lucide-react';

export default function Login() {
  const {
    setCurrentScreen,
    usuarios,
    setUsuarioActual,
    setTheme,
    setFontSize,
    setNivelTEA,
    setUsuario,
    setResponsable,
    setCaracteristicas,
    theme
  } = useApp();
  
  const themeColors = getThemeColors(theme);
  
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "",
  });
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const data = await loginUsuario(formData.email, formData.contrasena);
    const usuario = data.usuario;

    // Guardar token
    localStorage.setItem("token", data.token);

    // Setear usuario global
    setUsuarioActual(usuario);

    // Configurar el tema del usuario guardado en backend
    setTheme(usuario.theme);
    setFontSize(usuario.fontSize);
    setNivelTEA(usuario.nivelTEA);

    // Guardar datos base
    setUsuario({
      id_usuario: usuario.id_usuario,
      nombres: usuario.nombres,
      apellido_mat: usuario.apellido_mat,
      apellido_pat: usuario.apellido_pat,
      fecha_nac: usuario.fecha_nac,
      genero: usuario.genero,
      email: usuario.email,
      pais: usuario.pais,
      nivel_tea: usuario.nivel_tea
    });

    setResponsable(usuario.responsable || null);
    setCaracteristicas(usuario.caracteristicas || []);

    // 👉 REDIRECCIÓN CORRECTA
    setCurrentScreen("menu-principal");

  } catch (err: any) {
    setError(err.message);
  }
};


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-6 bg-gradient-to-br ${themeColors.backgroundGradient} relative overflow-hidden`}
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Glassmorphism background elements */}
      <BackgroundBubbles />

      <div 
        className="w-full max-w-md backdrop-blur-xl rounded-3xl shadow-2xl p-10 relative z-10 border hover:scale-[1.01] transition-transform duration-300"
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
            Agente TEA
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            Inicia sesión para continuar
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
            <p style={{ color: themeColors.error }} className="text-center">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label
              htmlFor="email"
              className="flex items-center gap-2 mb-3 transition-all"
              style={{ color: themeColors.textPrimary }}
            >
              <Mail 
                size={18} 
                className="transition-all group-hover:scale-110 duration-300" 
                style={{ color: themeColors.primary }} 
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
                backgroundColor: isDarkTheme(theme) ? themeColors.background : 'white',
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
              className="flex items-center gap-2 mb-3 transition-all"
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
              className="w-full px-4 py-3.5 rounded-xl border transition-all duration-300 focus:scale-[1.01]"
              style={{ 
                borderColor: themeColors.inputBorder,
                backgroundColor: isDarkTheme(theme) ? themeColors.background : 'white',
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-4 rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] mt-8 flex items-center justify-center gap-2 group relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Iniciar sesión
              <Zap className="group-hover:scale-110 transition-transform duration-300" size={18} />
            </span>
            <div 
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            ></div>
          </button>
        </form>

        <div className="flex justify-center mt-6 animate-fadeIn">
  <button
    type="button"
    onClick={() => ""}
    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.05] hover:shadow-lg focus:outline-none"
    style={{
      color: themeColors.primary,
      backgroundColor: 'white',
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
    }}
  >
    <Unlock size={18} className="transition-transform duration-300 group-hover:rotate-12" />
    ¿Olvidaste tu contraseña?
  </button>
</div>

        <div className="mt-8 text-center">
          <p className="mb-4" style={{ color: themeColors.textSecondary }}>
            ¿No tienes cuenta?
          </p>
          <button
            onClick={() => setCurrentScreen("registro")}
            className="w-full py-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ 
              backgroundColor: isDarkTheme(theme) ? themeColors.background : 'white',
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
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
