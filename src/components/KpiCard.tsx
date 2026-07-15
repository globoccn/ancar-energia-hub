import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Accent = "cyan" | "blue" | "green" | "yellow" | "purple";

const accentMap: Record<Accent, { icon: string; grad: string; stroke: string; fill: string }> = {
  cyan: { icon: "text-[var(--accent-cyan)]", grad: "from-[var(--accent-cyan)]/25", stroke: "var(--accent-cyan)", fill: "var(--accent-cyan)" },
  blue: { icon: "text-[var(--accent-blue)]", grad: "from-[var(--accent-blue)]/25", stroke: "var(--accent-blue)", fill: "var(--accent-blue)" },
  green: { icon: "text-[var(--accent-green)]", grad: "from-[var(--accent-green)]/25", stroke: "var(--accent-green)", fill: "var(--accent-green)" },
  yellow: { icon: "text-[var(--accent-yellow)]", grad: "from-[var(--accent-yellow)]/25", stroke: "var(--accent-yellow)", fill: "var(--accent-yellow)" },
  purple: { icon: "text-[var(--accent-purple)]", grad: "from-[var(--accent-purple)]/25", stroke: "var(--accent-purple)", fill: "var(--accent-purple)" },
};

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  accent?: Accent;
  series?: number[];
  invertDelta?: boolean; // se true, delta negativo é bom
}

export function KpiCard({ icon: Icon, label, value, unit, delta, deltaLabel = "vs ontem", accent = "cyan", series, invertDelta }: Props) {
  const a = accentMap[accent];
  const chartData = (series ?? [3, 5, 4, 7, 6, 8, 6, 9, 7, 10, 8, 11]).map((v, i) => ({ i, v }));
  const positive = delta !== undefined ? (invertDelta ? delta < 0 : delta > 0) : true;
  const gradId = `kpi-grad-${accent}-${label.replace(/\s+/g, "")}`;

  return (
    <div className="panel relative overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${a.grad} to-transparent border border-border/40`}>
          <Icon className={`h-5 w-5 ${a.icon}`} strokeWidth={2} />
        </div>
        <div className="h-12 w-24 opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={a.fill} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={a.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={a.stroke} strokeWidth={1.6} fill={`url(#${gradId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="metric-value text-2xl md:text-3xl">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {delta !== undefined && (
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5 text-[var(--accent-green)]" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-[var(--accent-red)]" />
            )}
            <span className={positive ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}>
              {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">{deltaLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
