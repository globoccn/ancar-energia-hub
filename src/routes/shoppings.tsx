import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Table as TableIcon, Search } from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import type { Shopping } from "@/types";
import { PageHeader, LoadingBlock } from "@/components/ui-helpers";
import { ShoppingCard } from "@/components/ShoppingCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, formatRelative } from "@/utils/format";

export const Route = createFileRoute("/shoppings")({
  head: () => ({
    meta: [
      { title: "Shoppings" },
      { name: "description", content: "Portfólio de shoppings monitorados." },
    ],
  }),
  component: ShoppingsPage,
});

const STATES = ["Todos", "SP", "RJ", "CE", "RN", "MT", "RO"];
const STATUS_OPTS = ["Todos", "otimo", "bom", "atencao", "critico"];
const QUALITIES = ["Todos", "alta", "media", "baixa"];
const EFF_BUCKETS = ["Todos", "≤ 0,65", "0,65 – 0,80", "> 0,80"];

function ShoppingsPage() {
  const [list, setList] = useState<Shopping[]>([]);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [q, setQ] = useState("");
  const [state, setState] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [quality, setQuality] = useState("Todos");
  const [eff, setEff] = useState("Todos");

  useEffect(() => {
    dashboardService.getShoppings().then(setList);
  }, []);

  const filtered = useMemo(() => {
    return list.filter((s) => {
      const ql = q.toLowerCase().trim();
      if (ql && !s.name.toLowerCase().includes(ql) && !s.code.toLowerCase().includes(ql))
        return false;
      if (state !== "Todos" && s.stateCode !== state) return false;
      if (status !== "Todos" && s.status !== status) return false;
      if (quality !== "Todos" && s.dataQuality !== quality) return false;
      if (eff === "≤ 0,65" && s.efficiencyKWTR > 0.65) return false;
      if (eff === "0,65 – 0,80" && (s.efficiencyKWTR < 0.65 || s.efficiencyKWTR > 0.8))
        return false;
      if (eff === "> 0,80" && s.efficiencyKWTR <= 0.8) return false;
      return true;
    });
  }, [list, q, state, status, quality, eff]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Shoppings"
        subtitle={`${filtered.length} de ${list.length} exibidos`}
        right={
          <div className="inline-flex rounded-md border border-border/60 bg-card/60 p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs ${view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs ${view === "table" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            >
              <TableIcon className="h-3.5 w-3.5" /> Tabela
            </button>
          </div>
        }
      />

      {/* Filtros */}
      <div className="panel p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou sigla"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-9 pl-9 bg-background/60"
            />
          </div>
          <Select label="Estado" value={state} onChange={setState} options={STATES} />
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTS}
            labelMap={{ otimo: "Ótimo", bom: "Bom", atencao: "Atenção", critico: "Crítico" }}
          />
          <Select
            label="Qualidade"
            value={quality}
            onChange={setQuality}
            options={QUALITIES}
            labelMap={{ alta: "Alta", media: "Média", baixa: "Baixa" }}
          />
          <Select label="Eficiência" value={eff} onChange={setEff} options={EFF_BUCKETS} />
        </div>
      </div>

      {list.length === 0 ? (
        <LoadingBlock h={400} />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <ShoppingCard key={s.id} shopping={s} />
          ))}
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shopping</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Potência</TableHead>
                <TableHead className="text-right">Consumo</TableHead>
                <TableHead className="text-right">Eficiência</TableHead>
                <TableHead className="text-right">ESG</TableHead>
                <TableHead className="text-right">Cobertura</TableHead>
                <TableHead className="text-right">Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      to="/shoppings/$shoppingId"
                      params={{ shoppingId: s.id }}
                      className="flex items-center gap-2 hover:text-[var(--accent-cyan)]"
                    >
                      <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium">
                        {s.code}
                      </span>
                      <span className="font-medium">{s.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.city}/{s.stateCode}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-right metric-value">
                    {formatNumber(s.powerKW / 1000, { maximumFractionDigits: 2 })} MW
                  </TableCell>
                  <TableCell className="text-right metric-value">
                    {formatNumber(s.consumptionMWh, { maximumFractionDigits: 1 })} MWh
                  </TableCell>
                  <TableCell className="text-right metric-value">
                    {formatNumber(s.efficiencyKWTR, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right metric-value">{s.esgScore}</TableCell>
                  <TableCell className="text-right">{s.dataAvailability.coveragePct}%</TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {formatRelative(s.lastUpdate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  labelMap,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labelMap?: Record<string, string>;
}) {
  return (
    <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-border/60 bg-background/60 px-2 text-sm text-foreground"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labelMap?.[o] ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}
