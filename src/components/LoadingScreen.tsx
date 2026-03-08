export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
      {/* Logo mark animation */}
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center">
          <span className="text-2xl font-black text-primary animate-pulse">ن</span>
        </div>
        {/* Orbiting ring */}
        <div className="absolute -inset-2">
          <div className="w-[72px] h-[72px] border-2 border-transparent border-t-primary/40 border-r-primary/15 rounded-2xl animate-spin" style={{ animationDuration: '1.2s' }} />
        </div>
      </div>
      
      {/* Loading dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/40"
            style={{
              animation: 'bounceSubtle 0.6s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
