import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bolt, Droplet, Gauge, Leaf, DollarSign, ChevronRight, AlertTriangle, Settings2, TrendingUp, TrendingDown } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Legend, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { dashboardService } from "@/services/dashboardService";
import type { PortfolioKpi, EnergyDataPoint, RankingItem, Shopping, Insight, ESGMetrics } from "@/types";
import { KpiCard } from "@/components/KpiCard";
import { ShoppingCard } from "@/components/ShoppingCard";
import { BrazilMap } from "@/components/BrazilMap";
import { PageHeader, LoadingBlock } from "@/components/ui-helpers";
import { formatNumber, formatRelative } from "@/utils/format";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { Link } from "@tanstack/react-router";
import { StatusDot } from "@/components/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Visão Geral — Ancar" }, { name: "description", content: "Visão geral do portfólio energético e ESG dos shoppings Ancar." }] }),
  component: OverviewPage,
});

function OverviewPage() {
  const { tick, lastUpdate } = useAutoRefresh();
  const [data, setData] = useState<{
    kpi: PortfolioKpi; series: EnergyDataPoint[]; ranking: RankingItem[];
    shoppings: Shopping[]; insights: Insight[]; esg: ESGMetrics;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    dashboardService.getPortfolioOverview().then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
  }, [tick]);

  if (!data) {
    return (
      <>
        <PageHeader title="Portfólio de Shoppings" subtitle="Carregando dados..." />
        <LoadingBlock h={480} />
      </>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Portfólio de Shoppings"
        subtitle="Monitoramento em tempo real · dados via WebCTRL // REST API"
        right={<div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent-cyan)]" /> Atualizado {formatRelative(lastUpdate.toISOString())}</div>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard icon={Bolt} label="Potência Total" value={formatNumber(data.kpi.potenciaTotalMW, { maximumFractionDigits: 1 })} unit="MW" delta={data.kpi.deltaPotencia} accent="cyan" />
        <KpiCard icon={Droplet} label="Consumo Hoje" value={formatNumber(data.kpi.consumoHojeMWh)} unit="MWh" delta={data.kpi.deltaConsumo} accent="blue" invertDelta />
        <KpiCard icon={Gauge} label="Eficiência Média" value={formatNumber(data.kpi.eficienciaMediaKWTR, { maximumFractionDigits: 2 })} unit="kW/TR" delta={data.kpi.deltaEficiencia} accent="green" invertDelta />
        <KpiCard icon={Leaf} label="CO₂ Evitado" value={formatNumber(data.kpi.co2EvitadoT, { maximumFractionDigits: 1 })} unit="t" delta={data.kpi.deltaCO2} accent="yellow" />
        <KpiCard icon={DollarSign} label="Economia Estimada" value={`R$${formatNumber(data.kpi.economiaEstimadaBRL)}`} unit="mil" delta={data.kpi.deltaEconomia} accent="purple" />
      </div>

      {/* Chart + Ranking */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="panel p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Eficiência e Consumo</h3>
              <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--accent-green)]" /> Eficiência (kW/TR)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--accent-blue)]" /> Consumo (MWh)</span>
              </div>
            </div>
            <select className="rounded-md border border-border/60 bg-card/60 px-2 py-1 text-xs text-foreground">
              <option>24h</option><option>7 dias</option><option>30 dias</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <ComposedChart data={data.series}>
                <defs>
                  <linearGradient id="consumoArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.35 0.03 260 / 30%)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="l" stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="r" orientation="right" stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "oklch(0.20 0.03 260)", border: "1px solid oklch(0.35 0.03 260)", borderRadius: 8 }} />
                <Area yAxisId="r" type="monotone" dataKey="consumo" stroke="var(--accent-blue)" strokeWidth={2} fill="url(#consumoArea)" />
                <Line yAxisId="l" type="monotone" dataKey="eficiencia" stroke="var(--accent-green)" strokeWidth={2} dot={{ r: 2.5, fill: "var(--accent-green)" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Ranking dos Shoppings</h3>
            <span className="text-xs text-muted-foreground">Eficiência (kW/TR)</span>
          </div>
          <div className="space-y-2.5">
            {data.ranking.slice(0, 8).map((r) => (
              <Link
                key={r.shoppingId}
                to="/shoppings/$shoppingId"
                params={{ shoppingId: r.shoppingId }}
                className="flex items-center gap-3 rounded-md px-1 py-1 text-sm hover:bg-muted/30"
              >
                <span className="w-4 text-right text-xs text-muted-foreground">{r.position}</span>
                <span className="min-w-0 flex-1 truncate">{r.name} <span className="text-muted-foreground">({r.code})</span></span>
                <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-muted/50 sm:block">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-cyan)]" style={{ width: `${Math.min(100, (r.value / 1.2) * 100)}%` }} />
                </div>
                <span className="metric-value w-12 text-right text-xs">{formatNumber(r.value, { maximumFractionDigits: 2 })}</span>
                <StatusDot status={r.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio + Map + Insights + ESG */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="panel p-4 xl:col-span-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Visão do Portfólio <span className="ml-1 text-xs font-normal text-muted-foreground">({data.shoppings.length} Shoppings)</span></h3>
            <Link to="/shoppings" className="text-xs text-[var(--accent-cyan)] hover:underline">Ver todos</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.shoppings.slice(0, 6).map((s) => <ShoppingCard key={s.id} shopping={s} />)}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Exibindo 6 de {data.shoppings.length} shoppings</div>
        </div>

        <div className="panel p-4 xl:col-span-3">
          <h3 className="mb-3 text-sm font-semibold">Mapa / Distribuição</h3>
          <BrazilMap items={data.shoppings} />
        </div>

        <div className="panel p-4 xl:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Oportunidades / Insights</h3>
          <div className="space-y-2">
            {data.insights.map((i) => (
              <div key={i.id} className="group flex cursor-pointer items-start gap-2 rounded-md border border-border/40 bg-muted/20 p-2.5 hover:border-[var(--accent-cyan)]/50">
                <div className="mt-0.5">
                  {i.icon === "warning" && <AlertTriangle className="h-4 w-4 text-[var(--accent-yellow)]" />}
                  {i.icon === "settings" && <Settings2 className="h-4 w-4 text-[var(--accent-cyan)]" />}
                  {i.icon === "trend" && <TrendingUp className="h-4 w-4 text-[var(--accent-green)]" />}
                  {i.icon === "trending-down" && <TrendingDown className="h-4 w-4 text-[var(--accent-purple)]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium leading-tight">{i.title}</div>
                  <div className="text-[11px] text-muted-foreground">{i.subtitle}</div>
                  {i.detail && <div className="mt-0.5 text-[11px] text-[var(--accent-cyan)]">{i.detail}</div>}
                </div>
                <ChevronRight className="h-3.5 w-3.5 self-center text-muted-foreground group-hover:text-foreground" />
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">ESG Score Médio</h3>
          </div>
          <div className="relative mx-auto grid h-40 w-40 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.28 0.03 260)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent-green)" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={`${(data.esg.esgScore / 100) * 264} 264`} />
            </svg>
            <div className="text-center">
              <div className="metric-value text-3xl">{data.esg.esgScore}</div>
              <div className="text-[10px] text-muted-foreground">de 100</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <ScoreLine label="Ambiental" value={data.esg.ambiental} color="var(--accent-green)" />
            <ScoreLine label="Social" value={data.esg.social} color="var(--accent-cyan)" />
            <ScoreLine label="Governança" value={data.esg.governanca} color="var(--accent-purple)" />
          </div>
          <Link to="/esg" className="mt-3 block rounded-md border border-border/50 bg-muted/20 px-3 py-1.5 text-center text-xs hover:border-[var(--accent-cyan)]/50">Ver detalhamento</Link>
        </div>
      </div>
    </div>
  );
}

function ScoreLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}</span>
      <span className="metric-value">{value}</span>
    </div>
  );
}
