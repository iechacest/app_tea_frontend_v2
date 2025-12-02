import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { applyFontSize } from './config/fontSize';
import Login from './components/Login';
import Registro from './components/Registro';
import ConfiguracionInicial from './components/ConfiguracionInicial';
import AnadirResponsable from './components/AnadirResponsable';
import CaracteristicasIniciales from './components/CaracteristicasIniciales';
import MenuPrincipal from './components/MenuPrincipal';
import SeleccionChat from './components/SeleccionChat';
import ListaChats from './components/ListaChats';
import Chat from './components/Chat';
import MiInforme from './components/MiInforme';
import MiPerfil from './components/MiPerfil';
import Configuracion from './components/Configuracion';

function AppContent() {
  const { currentScreen, theme, fontSize } = useApp();

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  return (
    <div className="min-h-screen" data-theme={theme}>
      {currentScreen === 'login' && <Login />}
      {currentScreen === 'registro' && <Registro />}
      {currentScreen === 'configuracion-inicial' && <ConfiguracionInicial />}
      {currentScreen === 'anadir-responsable' && <AnadirResponsable />}
      {currentScreen === 'caracteristicas-iniciales' && <CaracteristicasIniciales />}
      {currentScreen === 'menu-principal' && <MenuPrincipal />}
      {currentScreen === 'seleccion-chat' && <SeleccionChat />}
      {currentScreen === 'lista-chats' && <ListaChats />}
      {currentScreen === 'chat' && <Chat />}
      {currentScreen === 'mi-informe' && <MiInforme />}
      {currentScreen === 'mi-perfil' && <MiPerfil />}
      {currentScreen === 'configuracion' && <Configuracion />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}