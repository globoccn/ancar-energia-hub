import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dashboardService } from "@/services/dashboardService";
import type { ESGMetrics, RankingItem } from "@/types";
import { PageHeader } from "@/components/ui-helpers";
import { Droplet, Leaf, Recycle, Shield, Users, Zap } from "lucide-react";
import { formatNumber } from "@/utils/format";

export const Route = createFileRoute("/esg")({
  head: () => ({ meta: [{ title: "Indicadores ESG" }] }),
  component: ESGPage,
});

function ESGPage() {
  const [esg, setEsg] = useState<ESGMetrics | null>(null);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  useEffect(() => {
    dashboardService.getESGMetrics().then(setEsg);
    dashboardService.getRanking("esg").then(setRanking);
  }, []);
  if (!esg) return null;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Indicadores ESG"
        subtitle="Ambiental · Social · Governança — dados demonstrativos"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Card
          icon={<Zap className="h-4 w-4 text-[var(--accent-cyan)]" />}
          label="Energia consumida"
          value={`${formatNumber(esg.energiaConsumidaMWh)} MWh`}
        />
        <Card
          icon={<Zap className="h-4 w-4 text-[var(--accent-green)]" />}
          label="Energia economizada"
          value={`${formatNumber(esg.energiaEconomizadaMWh)} MWh`}
        />
        <Card
          icon={<Leaf className="h-4 w-4 text-[var(--accent-yellow)]" />}
          label="Emissões"
          value={`${formatNumber(esg.emissoesT)} t CO₂`}
        />
        <Card
          icon={<Leaf className="h-4 w-4 text-[var(--accent-green)]" />}
          label="Emissões evitadas"
          value={`${formatNumber(esg.emissoesEvitadasT)} t CO₂`}
        />
        <Card
          icon={<Zap className="h-4 w-4 text-[var(--accent-purple)]" />}
          label="Intensidade energética"
          value={`${esg.intensidadeEnergetica} kWh/m²`}
        />
        <Card
          icon={<Shield className="h-4 w-4 text-[var(--accent-blue)]" />}
          label="Progresso da meta"
          value={`${esg.metaProgressoPct}%`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="panel p-4 xl:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Ranking ESG por shopping</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={ranking.map((r) => ({ code: r.code, esg: r.value }))}>
                <CartesianGrid
                  stroke="oklch(0.35 0.03 260 / 25%)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="code" stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 10 }} />
                <YAxis stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.03 260)",
                    border: "1px solid oklch(0.35 0.03 260)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="esg" radius={[4, 4, 0, 0]} fill="var(--accent-green)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4">
          <h3 className="mb-3 text-sm font-semibold">ESG Score consolidado</h3>
          <div className="relative mx-auto grid h-44 w-44 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="oklch(0.28 0.03 260)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--accent-green)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(esg.esgScore / 100) * 264} 264`}
              />
            </svg>
            <div className="text-center">
              <div className="metric-value text-4xl">{esg.esgScore}</div>
              <div className="text-xs text-muted-foreground">de 100</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="metric-value">{esg.ambiental}</div>
              <div className="text-muted-foreground">Ambiental</div>
            </div>
            <div>
              <div className="metric-value">{esg.social}</div>
              <div className="text-muted-foreground">Social</div>
            </div>
            <div>
              <div className="metric-value">{esg.governanca}</div>
              <div className="text-muted-foreground">Governança</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Card
          icon={<Zap className="h-4 w-4 text-[var(--accent-green)]" />}
          label="Energia renovável"
          value={`${esg.energiaRenovavelPct}%`}
          demo
        />
        <Card
          icon={<Droplet className="h-4 w-4 text-[var(--accent-cyan)]" />}
          label="Água"
          value={`${formatNumber(esg.aguaM3)} m³`}
          demo
        />
        <Card
          icon={<Recycle className="h-4 w-4 text-[var(--accent-yellow)]" />}
          label="Resíduos"
          value={`${esg.residuosT} t`}
          demo
        />
        <Card
          icon={<Users className="h-4 w-4 text-[var(--accent-purple)]" />}
          label="Social"
          value={`${esg.social} pts`}
          demo
        />
        <Card
          icon={<Shield className="h-4 w-4 text-[var(--accent-blue)]" />}
          label="Governança"
          value={`${esg.governanca} pts`}
          demo
        />
      </div>
    </div>
  );
}

function Card({
  icon,
  label,
  value,
  demo,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  demo?: boolean;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="metric-value mt-2 text-xl">{value}</div>
      {demo && (
        <div className="mt-1 text-[10px] text-muted-foreground/80">dados demonstrativos</div>
      )}
    </div>
  );
}
