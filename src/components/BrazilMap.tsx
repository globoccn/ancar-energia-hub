import { shoppings } from "@/data/mock/shoppings";
import type { Shopping } from "@/types";

// Mapa estilizado do Brasil: posiciona shoppings dentro de uma bbox retangular
// baseada em lat/lng reais, sobre um SVG simplificado do território.
const BOUNDS = { minLng: -74, maxLng: -34, minLat: -34, maxLat: 6 };

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * w;
  const y = h - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * h;
  return { x, y };
}

const STATE_COLOR: Record<string, string> = {
  SP: "var(--accent-blue)",
  RJ: "var(--accent-yellow)",
  CE: "var(--accent-green)",
  RN: "var(--accent-purple)",
  MT: "var(--accent-yellow)",
  RO: "var(--accent-cyan)",
};

// Path aproximado (silhueta simplificada) do Brasil — decorativo
const BRAZIL_PATH =
  "M 118 32 L 148 22 L 168 30 L 192 20 L 224 26 L 252 20 L 274 40 L 288 66 L 296 96 L 320 118 L 336 148 L 340 178 L 320 208 L 316 240 L 296 270 L 268 296 L 246 316 L 210 322 L 178 332 L 152 316 L 132 296 L 118 268 L 108 232 L 118 198 L 104 168 L 84 138 L 74 106 L 78 74 L 96 48 Z";

export function BrazilMap({ items = shoppings }: { items?: Shopping[] }) {
  const w = 420;
  const h = 360;
  const grouped: Record<string, Shopping[]> = {};
  items.forEach((s) => {
    grouped[s.stateCode] = grouped[s.stateCode] || [];
    grouped[s.stateCode].push(s);
  });

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <radialGradient id="brazil-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="oklch(0.32 0.06 240)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.18 0.03 260)" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <path d={BRAZIL_PATH} fill="url(#brazil-glow)" stroke="oklch(0.55 0.06 220 / 40%)" strokeWidth={1.2} />

        {items.map((s) => {
          const { x, y } = project(s.latitude, s.longitude, w, h);
          const color = STATE_COLOR[s.stateCode] || "var(--accent-cyan)";
          return (
            <g key={s.id}>
              <circle cx={x} cy={y} r={9} fill={color} opacity={0.18} />
              <circle cx={x} cy={y} r={4} fill={color}>
                <title>{`${s.code} · ${s.name} — ${s.city}/${s.stateCode}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        {Object.entries(grouped)
          .sort(([, a], [, b]) => b.length - a.length)
          .map(([uf, list]) => (
            <div key={uf} className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: STATE_COLOR[uf] || "var(--accent-cyan)" }} />
              <span>{uf} ({list.length})</span>
            </div>
          ))}
      </div>
    </div>
  );
}
