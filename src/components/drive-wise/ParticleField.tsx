export default function ParticleField() {
  // 24 subtle floating particles rendered as pure divs
  const particles = Array.from({ length: 24 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent" />
      {particles.map((_, i) => {
        const size = 2 + Math.random() * 4;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 8;
        const dur = 10 + Math.random() * 14;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-primary/50 blur-[1px]"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              animation: `float ${dur}s ease-in-out ${delay}s infinite`,
              opacity: 0.4 + Math.random() * 0.4,
            }}
          />
        );
      })}
      <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
    </div>
  );
}
