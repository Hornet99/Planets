import { useState, useEffect, useRef, useCallback } from 'react';
import { planets, Planet } from './data/planets';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const minDimension = Math.min(width, height);
        setScale(minDimension / 900);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handlePlanetClick = useCallback((planet: Planet) => {
    setSelectedPlanet(prev => prev?.id === planet.id ? null : planet);
  }, []);

  const speedOptions = [0.25, 0.5, 1, 2, 4, 8];

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative flex flex-col">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        <Stars />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-3 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          🌌 Интерактивная Солнечная система
        </h1>
        <p className="text-gray-400 text-sm mt-1">Нажмите на планету для подробной информации</p>
      </div>

      {/* Solar System Container */}
      <div ref={containerRef} className="relative flex-1 flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: `${900 * scale}px`,
            height: `${900 * scale}px`,
          }}
        >
          {/* Sun */}
          <div
            className="absolute rounded-full cursor-pointer"
            style={{
              width: `${50 * scale}px`,
              height: `${50 * scale}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle at 30% 30%, #fff7a0, #ffd700, #ff8c00, #ff4500)',
              boxShadow: '0 0 40px #ffd700, 0 0 80px #ff8c00, 0 0 120px #ff4500',
              animation: isPlaying ? `pulse 3s ease-in-out infinite` : 'none',
            }}
            onClick={() => setSelectedPlanet(null)}
          />

          {/* Orbits and Planets */}
          {planets.map((planet) => (
            <OrbitAndPlanet
              key={planet.id}
              planet={planet}
              scale={scale}
              isPlaying={isPlaying}
              speed={speed}
              isSelected={selectedPlanet?.id === planet.id}
              isHovered={hoveredPlanet === planet.id}
              onClick={() => handlePlanetClick(planet)}
              onMouseEnter={() => setHoveredPlanet(planet.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
            />
          ))}
        </div>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <InfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
      )}

      {/* Controls */}
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Пауза
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Воспроизвести
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">Скорость:</span>
            <div className="flex gap-1">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    speed === s
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => { setSpeed(1); setIsPlaying(true); }}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-sm font-medium transition-all duration-200"
          >
            ↺ Сброс
          </button>
        </div>
      </div>
    </div>
  );
}

// Stars background component
function Stars() {
  const stars = useRef(
    Array.from({ length: 200 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      animDelay: Math.random() * 3,
    }))
  );

  return (
    <>
      {stars.current.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${2 + star.animDelay}s ease-in-out infinite`,
            animationDelay: `${star.animDelay}s`,
          }}
        />
      ))}
    </>
  );
}

// Orbit and Planet component
function OrbitAndPlanet({
  planet,
  scale,
  isPlaying,
  speed,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  planet: Planet;
  scale: number;
  isPlaying: boolean;
  speed: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const orbitRadius = planet.orbitRadius * scale;
  const planetSize = planet.radius * scale * 2;
  const duration = planet.orbitDuration / speed;

  return (
    <>
      {/* Orbit ring */}
      <div
        className="absolute rounded-full border border-gray-600/30"
        style={{
          width: `${orbitRadius * 2}px`,
          height: `${orbitRadius * 2}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderColor: isSelected ? `${planet.color}40` : undefined,
        }}
      />

      {/* Planet orbit animation wrapper */}
      <div
        className="absolute"
        style={{
          width: `${orbitRadius * 2}px`,
          height: `${orbitRadius * 2}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: isPlaying ? `orbit ${duration}s linear infinite` : 'none',
        }}
      >
        {/* Planet */}
        <div
          className="absolute cursor-pointer transition-transform duration-200"
          style={{
            width: `${planetSize}px`,
            height: `${planetSize}px`,
            left: '50%',
            top: '-50%',
            transform: 'translate(-50%, -50%)',
            background: planet.gradient,
            borderRadius: '50%',
            boxShadow: isSelected
              ? `0 0 15px ${planet.color}, 0 0 30px ${planet.color}50`
              : isHovered
              ? `0 0 10px ${planet.color}80`
              : `0 0 5px ${planet.color}40`,
            animation: isPlaying ? `counter-orbit ${duration}s linear infinite` : 'none',
            zIndex: isSelected || isHovered ? 10 : 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Saturn rings */}
          {planet.id === 'saturn' && (
            <div
              className="absolute"
              style={{
                width: `${planetSize * 1.8}px`,
                height: `${planetSize * 0.5}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(-20deg)',
                border: `2px solid ${planet.color}80`,
                borderRadius: '50%',
                boxShadow: `inset 0 0 5px ${planet.color}40`,
              }}
            />
          )}

          {/* Planet label on hover */}
          {isHovered && !isSelected && (
            <div
              className="absolute text-white text-xs font-medium whitespace-nowrap pointer-events-none bg-black/70 px-2 py-1 rounded"
              style={{
                top: `${planetSize + 5}px`,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {planet.nameRu}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Info Panel component
function InfoPanel({ planet, onClose }: { planet: Planet; onClose: () => void }) {
  return (
    <div className="absolute top-16 right-4 z-20 w-80 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-slideIn">
      {/* Header */}
      <div
        className="p-4 relative"
        style={{
          background: `linear-gradient(135deg, ${planet.color}20, transparent)`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ background: planet.gradient, boxShadow: `0 0 20px ${planet.color}50` }}
          >
            <span className="drop-shadow-lg">{planet.emoji}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{planet.nameRu}</h2>
            <p className="text-gray-400 text-sm">{planet.name}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="p-4 space-y-3">
        <InfoRow icon="📏" label="Радиус" value={planet.realRadius} />
        <InfoRow icon="☀️" label="Расстояние от Солнца" value={planet.distanceFromSun} />
        <InfoRow icon="🔄" label="Орбитальный период" value={planet.orbitalPeriod} />
      </div>

      {/* Description */}
      <div className="px-4 pb-4">
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
          <p className="text-gray-300 text-sm leading-relaxed">{planet.description}</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
        <p className="text-white font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}

export default App;
