/**
 * Crop marks institucionais nos 4 cantos do stage.
 * Protótipo: 24×24 SVG centrado em (36, 36) de cada canto, traço rgba(10,42,95,0.40).
 * Visíveis só em md+ (decoração desktop).
 */
export function CropMarks() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none absolute inset-0 z-0"
    >
      {/* top-left: x at 24, y at 24 (center at 36 - 12) */}
      <svg width="24" height="24" className="absolute" style={{ left: 24, top: 24 }}>
        <line x1="12" y1="12" x2="24" y2="12" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
        <line x1="12" y1="12" x2="12" y2="24" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
      </svg>
      {/* top-right */}
      <svg width="24" height="24" className="absolute" style={{ right: 24, top: 24 }}>
        <line x1="12" y1="12" x2="0" y2="12" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
        <line x1="12" y1="12" x2="12" y2="24" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
      </svg>
      {/* bottom-left */}
      <svg width="24" height="24" className="absolute" style={{ left: 24, bottom: 24 }}>
        <line x1="12" y1="12" x2="24" y2="12" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
        <line x1="12" y1="12" x2="12" y2="0" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
      </svg>
      {/* bottom-right */}
      <svg width="24" height="24" className="absolute" style={{ right: 24, bottom: 24 }}>
        <line x1="12" y1="12" x2="0" y2="12" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
        <line x1="12" y1="12" x2="12" y2="0" stroke="rgba(10,42,95,0.40)" strokeWidth="1" />
      </svg>
    </div>
  );
}
