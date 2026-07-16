import { useMemo, useState } from "react";
import { shoppings } from "@/data/mock/shoppings";
import {
  BRAZIL_MAP_BOUNDS,
  BRAZIL_MAP_HEIGHT,
  BRAZIL_MAP_WIDTH,
  BRAZIL_OUTLINE_PATH,
  BRAZIL_STATE_PATHS,
} from "@/data/brazilMapPaths";
import type { Shopping } from "@/types";

const STATE_COLOR: Record<string, string> = {
  SP: "var(--accent-blue)",
  RJ: "var(--accent-yellow)",
  CE: "var(--accent-green)",
  RN: "var(--accent-purple)",
  MT: "var(--accent-orange)",
  RO: "var(--accent-cyan)",
};

const CLUSTER_OFFSETS = [
  { x: -8, y: -7 },
  { x: 7, y: -7 },
  { x: -10, y: 7 },
  { x: 9, y: 7 },
  { x: 0, y: -13 },
  { x: 0, y: 13 },
];

function project(lat: number, lng: number) {
  const x =
    ((lng - BRAZIL_MAP_BOUNDS.minLng) / (BRAZIL_MAP_BOUNDS.maxLng - BRAZIL_MAP_BOUNDS.minLng)) *
    BRAZIL_MAP_WIDTH;
  const y =
    ((BRAZIL_MAP_BOUNDS.maxLat - lat) / (BRAZIL_MAP_BOUNDS.maxLat - BRAZIL_MAP_BOUNDS.minLat)) *
    BRAZIL_MAP_HEIGHT;
  return { x, y };
}

type Marker = Shopping & { markerX: number; markerY: number; color: string };

function makeMarkers(items: Shopping[]): Marker[] {
  const byState = new Map<string, Shopping[]>();
  items.forEach((shopping) => {
    const current = byState.get(shopping.stateCode) ?? [];
    current.push(shopping);
    byState.set(shopping.stateCode, current);
  });

  return Array.from(byState.entries()).flatMap(([stateCode, stateItems]) =>
    stateItems
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((shopping, index) => {
        const base = project(shopping.latitude, shopping.longitude);
        const offset =
          stateItems.length > 1 ? CLUSTER_OFFSETS[index % CLUSTER_OFFSETS.length] : null;
        return {
          ...shopping,
          markerX: base.x + (offset?.x ?? 0),
          markerY: base.y + (offset?.y ?? 0),
          color: STATE_COLOR[stateCode] ?? "var(--accent-cyan)",
        };
      }),
  );
}

export function BrazilMap({ items = shoppings }: { items?: Shopping[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const value: Record<string, Shopping[]> = {};
    items.forEach((shopping) => {
      value[shopping.stateCode] = value[shopping.stateCode] ?? [];
      value[shopping.stateCode].push(shopping);
    });
    return value;
  }, [items]);

  const markers = useMemo(() => makeMarkers(items), [items]);
  const hovered = markers.find((marker) => marker.id === hoveredId);

  const tooltipWidth = 168;
  const tooltipHeight = 46;
  const tooltipX = hovered
    ? Math.min(Math.max(hovered.markerX - tooltipWidth / 2, 8), BRAZIL_MAP_WIDTH - tooltipWidth - 8)
    : 0;
  const tooltipY = hovered
    ? hovered.markerY > 64
      ? hovered.markerY - tooltipHeight - 13
      : hovered.markerY + 14
    : 0;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${BRAZIL_MAP_WIDTH} ${BRAZIL_MAP_HEIGHT}`}
        className="max-h-[286px] w-full overflow-visible"
        role="img"
        aria-label="Distribuição dos shoppings no Brasil"
        onMouseLeave={() => setHoveredId(null)}
      >
        <defs>
          <radialGradient id="brazil-map-fill" cx="62%" cy="42%" r="72%">
            <stop offset="0%" stopColor="oklch(0.29 0.07 233)" stopOpacity="0.9" />
            <stop offset="68%" stopColor="oklch(0.225 0.045 250)" stopOpacity="0.94" />
            <stop offset="100%" stopColor="oklch(0.185 0.032 260)" stopOpacity="0.98" />
          </radialGradient>
          <filter id="map-marker-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="black" floodOpacity="0.24" />
          </filter>
          <clipPath id="brazil-map-clip">
            <path d={BRAZIL_OUTLINE_PATH} />
          </clipPath>
        </defs>

        <path
          d={BRAZIL_OUTLINE_PATH}
          fill="url(#brazil-map-fill)"
          stroke="oklch(0.62 0.085 220 / 62%)"
          strokeWidth={1.15}
          vectorEffect="non-scaling-stroke"
          filter="url(#map-shadow)"
        />

        <g clipPath="url(#brazil-map-clip)" opacity={0.72}>
          {BRAZIL_STATE_PATHS.map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="oklch(0.52 0.06 225 / 58%)"
              strokeWidth={0.65}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {markers.map((marker) => {
          const active = marker.id === hoveredId;
          return (
            <g
              key={marker.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredId(marker.id)}
              onFocus={() => setHoveredId(marker.id)}
              tabIndex={0}
              role="button"
              aria-label={`${marker.code}, ${marker.city}/${marker.stateCode}`}
            >
              <circle
                cx={marker.markerX}
                cy={marker.markerY}
                r={active ? 10 : 8}
                fill={marker.color}
                opacity={active ? 0.3 : 0.18}
                filter="url(#map-marker-glow)"
              />
              <circle
                cx={marker.markerX}
                cy={marker.markerY}
                r={active ? 4.7 : 3.7}
                fill={marker.color}
                stroke="oklch(0.98 0.01 240 / 62%)"
                strokeWidth={active ? 1.4 : 0.8}
              />
            </g>
          );
        })}

        {hovered && (
          <g transform={`translate(${tooltipX} ${tooltipY})`} pointerEvents="none">
            <rect
              width={tooltipWidth}
              height={tooltipHeight}
              rx={8}
              fill="oklch(0.17 0.035 260 / 96%)"
              stroke="oklch(0.52 0.07 225 / 72%)"
              strokeWidth={0.8}
              filter="url(#map-shadow)"
            />
            <circle cx={13} cy={15} r={3.2} fill={hovered.color} />
            <text x={22} y={18} fill="oklch(0.96 0.01 240)" fontSize={11} fontWeight={700}>
              {hovered.code}
            </text>
            <text x={12} y={34} fill="oklch(0.72 0.02 245)" fontSize={9.5}>
              {hovered.city}/{hovered.stateCode}
            </text>
          </g>
        )}
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-x-3 gap-y-1.5 text-[10px] text-muted-foreground">
        {Object.entries(grouped)
          .sort(([, a], [, b]) => b.length - a.length)
          .map(([uf, list]) => (
            <div key={uf} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{
                  color: STATE_COLOR[uf] ?? "var(--accent-cyan)",
                  background: "currentColor",
                }}
              />
              <span>
                {uf} ({list.length})
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
