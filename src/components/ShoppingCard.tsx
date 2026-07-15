import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import type { Shopping } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNumber } from "@/utils/format";

export function ShoppingCard({ shopping }: { shopping: Shopping }) {
  return (
    <Link
      to="/shoppings/$shoppingId"
      params={{ shoppingId: shopping.id }}
      className="panel group block p-4 transition-all hover:border-[var(--accent-cyan)]/50 hover:shadow-[0_0_0_1px_var(--accent-cyan)]/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-border/50 bg-gradient-to-br from-[var(--accent-blue)]/15 to-transparent">
            <Building2 className="h-4 w-4 text-[var(--accent-blue)]" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-foreground">{shopping.name}</div>
            <div className="text-[11px] text-muted-foreground">
              <span className="rounded bg-muted/60 px-1.5 py-0.5 font-medium text-foreground/80">{shopping.code}</span>
              <span className="ml-2">{shopping.city}/{shopping.stateCode}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={shopping.status} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Metric value={formatNumber(shopping.powerKW / 1000, { maximumFractionDigits: 2 })} unit="MW" label="Potência" />
        <Metric value={formatNumber(shopping.efficiencyKWTR, { maximumFractionDigits: 2 })} unit="kW/TR" label="Eficiência" />
        <Metric value={String(shopping.esgScore)} unit="ESG" label="Score" />
      </div>
    </Link>
  );
}

function Metric({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="rounded-md bg-muted/25 py-2">
      <div className="metric-value text-base leading-none">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{unit}</div>
      <div className="text-[10px] text-muted-foreground/70">{label}</div>
    </div>
  );
}
