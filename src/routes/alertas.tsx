import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { dashboardService } from "@/services/dashboardService";
import type { Alert, AlertSeverity, AlertStatus } from "@/types";
import { PageHeader } from "@/components/ui-helpers";
import { alertStatusLabel, formatDateTime, severityLabel } from "@/utils/format";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [{ title: "Central de Alertas — Ancar" }] }),
  component: AlertasPage,
});

const sevIcon = (s: AlertSeverity) =>
  s === "critico" ? (
    <AlertOctagon className="h-4 w-4 text-[var(--accent-red)]" />
  ) : s === "atencao" ? (
    <AlertTriangle className="h-4 w-4 text-[var(--accent-yellow)]" />
  ) : (
    <Info className="h-4 w-4 text-[var(--accent-cyan)]" />
  );

function AlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [severity, setSeverity] = useState<"todos" | AlertSeverity>("todos");
  const [status, setStatus] = useState<"todos" | AlertStatus>("todos");
  const [q, setQ] = useState("");

  useEffect(() => {
    dashboardService.getAlerts().then(setAlerts);
  }, []);

  const filtered = useMemo(
    () =>
      alerts.filter((a) => {
        if (severity !== "todos" && a.severity !== severity) return false;
        if (status !== "todos" && a.status !== status) return false;
        const ql = q.toLowerCase();
        if (
          ql &&
          !(
            a.title.toLowerCase().includes(ql) ||
            a.shoppingName.toLowerCase().includes(ql) ||
            a.equipment.toLowerCase().includes(ql)
          )
        )
          return false;
        return true;
      }),
    [alerts, severity, status, q],
  );

  const counts = {
    total: alerts.length,
    critico: alerts.filter((a) => a.severity === "critico").length,
    atencao: alerts.filter((a) => a.severity === "atencao").length,
    novo: alerts.filter((a) => a.status === "novo").length,
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Central de Alertas" subtitle={`${counts.total} eventos registrados`} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total" value={counts.total} color="var(--accent-cyan)" />
        <Stat label="Críticos" value={counts.critico} color="var(--accent-red)" />
        <Stat label="Atenção" value={counts.atencao} color="var(--accent-yellow)" />
        <Stat label="Novos" value={counts.novo} color="var(--accent-green)" />
      </div>

      <div className="panel flex flex-wrap items-center gap-2 p-3">
        <input
          placeholder="Buscar por título, shopping ou equipamento"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-9 min-w-64 flex-1 rounded-md border border-border/60 bg-background/60 px-3 text-sm"
        />
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as "todos" | AlertSeverity)}
          className="h-9 rounded-md border border-border/60 bg-background/60 px-2 text-sm"
        >
          <option value="todos">Todas as severidades</option>
          <option value="informativo">Informativo</option>
          <option value="atencao">Atenção</option>
          <option value="critico">Crítico</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "todos" | AlertStatus)}
          className="h-9 rounded-md border border-border/60 bg-background/60 px-2 text-sm"
        >
          <option value="todos">Todos os status</option>
          <option value="novo">Novo</option>
          <option value="em_analise">Em análise</option>
          <option value="reconhecido">Reconhecido</option>
          <option value="resolvido">Resolvido</option>
        </select>
      </div>

      <div className="panel divide-y divide-border/40">
        {filtered.map((a) => (
          <div key={a.id} className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-muted/20">
            <div className="col-span-1 pt-0.5">{sevIcon(a.severity)}</div>
            <div className="col-span-8 md:col-span-6">
              <div className="text-sm font-medium">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.description}</div>
              <div className="mt-1 text-[11px] text-[var(--accent-cyan)]">→ {a.recommendation}</div>
            </div>
            <div className="col-span-3 hidden text-xs md:block">
              <div className="font-medium">{a.shoppingName}</div>
              <div className="text-muted-foreground">
                {a.shoppingCode} · {a.equipment}
              </div>
            </div>
            <div className="col-span-3 flex flex-col items-end gap-1 text-xs md:col-span-2">
              <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px]">
                {severityLabel(a.severity)}
              </span>
              <span className="rounded border border-border/50 px-1.5 py-0.5 text-[10px]">
                {alertStatusLabel(a.status)}
              </span>
              <span className="text-muted-foreground">{formatDateTime(a.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="panel p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <span className="metric-value text-2xl" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}
