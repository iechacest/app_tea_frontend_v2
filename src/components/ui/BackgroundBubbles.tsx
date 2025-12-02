export default function BackgroundBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Burbujas flotantes GRANDES y VISIBLES */}
      <div 
        className="absolute top-10 left-20 w-40 h-40 rounded-full opacity-60 animate-bounce border-4"
        style={{ 
          backgroundColor: '#D3A1FF',
          borderColor: '#E0C4FF',
          animationDuration: '3s',
          boxShadow: `0 8px 32px rgba(211, 161, 255, 0.6)`
        }}
      ></div>
      <div 
        className="absolute top-40 right-32 w-48 h-48 rounded-full opacity-65 animate-bounce border-4"
        style={{ 
          backgroundColor: '#A8C6FF',
          borderColor: '#C0D8FF',
          animationDelay: '1s',
          animationDuration: '4s',
          boxShadow: `0 8px 32px rgba(168, 198, 255, 0.7)`
        }}
      ></div>
      <div 
        className="absolute bottom-20 left-16 w-44 h-44 rounded-full opacity-60 animate-bounce border-4"
        style={{ 
          backgroundColor: '#D3A1FF',
          borderColor: '#E5B8FF',
          animationDelay: '2s',
          animationDuration: '3.5s',
          boxShadow: `0 8px 32px rgba(211, 161, 255, 0.6)`
        }}
      ></div>
      <div 
        className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full opacity-70 animate-bounce border-4"
        style={{ 
          backgroundColor: '#68A9FF',
          borderColor: '#88BDFF',
          animationDelay: '0.5s',
          animationDuration: '4.5s',
          boxShadow: `0 8px 32px rgba(104, 169, 255, 0.7)`
        }}
      ></div>
      <div 
        className="absolute bottom-1/3 right-1/4 w-52 h-52 rounded-full opacity-65 animate-bounce border-4"
        style={{ 
          backgroundColor: '#D3A1FF',
          borderColor: '#E8CCFF',
          animationDelay: '1.5s',
          animationDuration: '5s',
          boxShadow: `0 8px 32px rgba(211, 161, 255, 0.7)`
        }}
      ></div>
      <div 
        className="absolute top-2/3 right-16 w-36 h-36 rounded-full opacity-60 animate-bounce border-4"
        style={{ 
          backgroundColor: '#68A9FF',
          borderColor: '#90C0FF',
          animationDelay: '2.5s',
          animationDuration: '3s',
          boxShadow: `0 8px 32px rgba(104, 169, 255, 0.6)`
        }}
      ></div>
      
      {/* Burbujas medianas adicionales */}
      <div 
        className="absolute top-1/4 right-1/3 w-28 h-28 rounded-full opacity-70 animate-pulse border-4"
        style={{ 
          backgroundColor: '#A8C6FF',
          borderColor: '#C8DCFF',
          animationDuration: '2s',
          boxShadow: `0 4px 16px rgba(168, 198, 255, 0.8)`
        }}
      ></div>
      <div 
        className="absolute bottom-1/4 left-1/2 w-32 h-32 rounded-full opacity-65 animate-pulse border-4"
        style={{ 
          backgroundColor: '#68A9FF',
          borderColor: '#98BFFF',
          animationDelay: '1s',
          animationDuration: '2.5s',
          boxShadow: `0 4px 16px rgba(104, 169, 255, 0.7)`
        }}
      ></div>
      <div 
        className="absolute top-1/2 left-20 w-24 h-24 rounded-full opacity-70 animate-pulse border-4"
        style={{ 
          backgroundColor: '#D3A1FF',
          borderColor: '#E8CBFF',
          animationDelay: '0.5s',
          animationDuration: '3s',
          boxShadow: `0 4px 16px rgba(211, 161, 255, 0.8)`
        }}
      ></div>
    </div>
  );
}
