// Componente de iluminación suave para el diseño 3
export default function LightGlows() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Resplandor turquesa superior izquierda */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, #5DC9D6 0%, transparent 70%)',
          animationDuration: '4s'
        }}
      />
      
      {/* Resplandor coral derecha */}
      <div 
        className="absolute top-1/4 right-0 w-80 h-80 rounded-full blur-3xl opacity-25 animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, #FF9F99 0%, transparent 70%)',
          animationDelay: '1s',
          animationDuration: '5s'
        }}
      />
      
      {/* Resplandor violeta inferior */}
      <div 
        className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, #D8A7FF 0%, transparent 70%)',
          animationDelay: '2s',
          animationDuration: '6s'
        }}
      />
      
      {/* Resplandor verde menta centro */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-15 animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, #A0E2D5 0%, transparent 70%)',
          animationDelay: '3s',
          animationDuration: '7s'
        }}
      />
      
      {/* Pequeños destellos */}
      <div 
        className="absolute top-20 right-1/3 w-32 h-32 rounded-full blur-2xl opacity-40 animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, #5A92F6 0%, transparent 60%)',
          animationDuration: '3s'
        }}
      />
      
      <div 
        className="absolute bottom-32 right-20 w-40 h-40 rounded-full blur-2xl opacity-35 animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, #5DC9D6 0%, transparent 60%)',
          animationDelay: '1.5s',
          animationDuration: '4s'
        }}
      />
    </div>
  );
}
