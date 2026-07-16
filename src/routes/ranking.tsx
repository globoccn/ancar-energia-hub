import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboardService";
import type { RankingItem } from "@/types";
import { PageHeader } from "@/components/ui-helpers";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNumber } from "@/utils/format";
import { TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — Ancar" }] }),
  component: RankingPage,
});

type Metric =
  "eficiencia" | "consumo" | "economia" | "esg" | "qualidade" | "alertas" | "disponibilidade";
const METRICS: { key: Metric; label: string }[] = [
  { key: "eficiencia", label: "Eficiência" },
  { key: "consumo", label: "Consumo" },
  { key: "economia", label: "Economia" },
  { key: "esg", label: "ESG" },
  { key: "qualidade", label: "Qualidade dos dados" },
  { key: "alertas", label: "Alertas" },
  { key: "disponibilidade", label: "Disponibilidade" },
];

function RankingPage() {
  const [metric, setMetric] = useState<Metric>("eficiencia");
  const [period, setPeriod] = useState("Últimos 30 dias");
  const [items, setItems] = useState<RankingItem[]>([]);
  useEffect(() => {
    dashboardService.getRanking(metric).then(setItems);
  }, [metric]);

  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Ranking"
        subtitle="Compare o desempenho de todos os shoppings do portfólio"
      />

      <div className="panel flex flex-wrap items-center gap-2 p-3">
        <div className="inline-flex flex-wrap gap-1 rounded-md border border-border/60 bg-card/60 p-1">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`rounded px-3 py-1 text-xs ${metric === m.key ? "bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="ml-auto h-9 rounded-md border border-border/60 bg-card/60 px-2 text-sm"
        >
          {["Hoje", "Últimos 7 dias", "Últimos 30 dias", "Este mês"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="panel divide-y divide-border/40">
        {items.map((r) => (
          <div
            key={r.shoppingId}
            className="grid grid-cols-12 items-center gap-3 px-4 py-3 hover:bg-muted/20"
          >
            <div className="col-span-1 text-sm text-muted-foreground">#{r.position}</div>
            <div className="col-span-4">
              <div className="text-sm font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.code}</div>
            </div>
            <div className="col-span-4 hidden md:block">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)]"
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="col-span-2 text-right metric-value text-sm">
              {formatNumber(r.value, { maximumFractionDigits: 2 })}{" "}
              <span className="text-xs text-muted-foreground">{r.unit}</span>
            </div>
            <div className="col-span-1 flex items-center justify-end gap-1 text-xs">
              {r.trend >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-[var(--accent-green)]" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-[var(--accent-red)]" />
              )}
              <span
                className={r.trend >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}
              >
                {r.trend > 0 ? "+" : ""}
                {r.trend}%
              </span>
            </div>
            <div className="col-span-12 flex justify-end md:col-span-12 md:mt-0">
              <StatusBadge status={r.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
