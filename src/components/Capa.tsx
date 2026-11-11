interface Props {
  titulo: string;
  matiz: number;
  rotulo?: string;
  /** Um id único para os gradientes do SVG. */
  id: string;
}

/** Capa gerada em SVG a partir dos dados do episódio: sem imagem baixada e sem direitos de terceiros. */
export function Capa({ titulo, matiz, rotulo, id }: Props) {
  const g = `capa-${id}`;
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${g}-fundo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${matiz} 85% 22%)`} />
          <stop offset="1" stopColor={`hsl(${matiz + 18} 70% 8%)`} />
        </linearGradient>
        <radialGradient id={`${g}-luz`} cx="0.78" cy="0.3" r="0.6">
          <stop offset="0" stopColor={`hsl(${matiz} 100% 62%)`} stopOpacity="0.55" />
          <stop offset="1" stopColor={`hsl(${matiz} 100% 62%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${g}-fundo)`} />
      <rect width="320" height="180" fill={`url(#${g}-luz)`} />
      <path
        d="M214 34h30c32 0 54 22 54 56s-22 56-54 56h-30z"
        fill="none"
        stroke={`hsl(${matiz} 100% 70%)`}
        strokeOpacity="0.35"
        strokeWidth="14"
        strokeLinejoin="round"
      />
      {rotulo && (
        <text x="18" y="30" fill="#ffffff" fontSize="11" fontWeight="800" letterSpacing="2" fontFamily="'Manrope Variable', sans-serif">
          {rotulo.toUpperCase()}
        </text>
      )}
      <foreignObject x="16" y="92" width="200" height="80">
        <div
          style={{
            color: '#fff',
            font: "800 17px/1.15 'Manrope Variable', sans-serif",
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {titulo}
        </div>
      </foreignObject>
    </svg>
  );
}
