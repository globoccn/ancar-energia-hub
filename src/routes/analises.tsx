import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { dashboardService } from "@/services/dashboardService";
import type { Shopping } from "@/types";
import { PageHeader } from "@/components/ui-helpers";

export const Route = createFileRoute("/analises")({
  head: () => ({ meta: [{ title: "Análises" }] }),
  component: AnalisesPage,
});

const PALETTE = [
  "var(--accent-cyan)",
  "var(--accent-green)",
  "var(--accent-blue)",
  "var(--accent-yellow)",
  "var(--accent-purple)",
];

function AnalisesPage() {
  const [shoppings, setShoppings] = useState<Shopping[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [metric, setMetric] = useState<"consumo" | "eficiencia">("consumo");
  const [series, setSeries] = useState<
    { id: string; code: string; series: { time: string; consumo: number; eficiencia: number }[] }[]
  >([]);

  useEffect(() => {
    dashboardService.getShoppings().then((list) => {
      setShoppings(list);
      setSelected(list.slice(0, 4).map((s) => s.id));
    });
  }, []);

  useEffect(() => {
    if (selected.length === 0) {
      setSeries([]);
      return;
    }
    dashboardService.getAnalytics({ shoppingIds: selected, metric }).then(setSeries);
  }, [selected, metric]);

  const combined = useMemo(() => {
    if (series.length === 0) return [];
    const times = series[0].series.map((p) => p.time);
    return times.map((t, i) => {
      const row: Record<string, number | string> = { time: t };
      series.forEach((s) => {
        row[s.code] = s.series[i][metric];
      });
      return row;
    });
  }, [series, metric]);

  const scatterData = shoppings.map((s) => ({
    x: s.thermalLoadTR ?? 0,
    y: s.efficiencyKWTR,
    z: s.powerKW,
    name: s.code,
  }));
  const deltaTData = shoppings.map((s) => ({ code: s.code, deltaT: s.deltaT ?? 0 }));

  // heatmap: 7 dias x 6 shoppings selecionados
  const heatmapDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const heatShoppings = shoppings.filter((s) => selected.includes(s.id));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Análises"
        subtitle="Compare múltiplos shoppings e métricas em qualquer período"
      />

      <div className="panel flex flex-wrap items-center gap-3 p-3">
        <div className="flex flex-wrap gap-1">
          {shoppings.map((s) => {
            const on = selected.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() =>
                  setSelected((prev) =>
                    prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                  )
                }
                className={`rounded-md border px-2 py-1 text-xs ${on ? "border-[var(--accent-cyan)]/50 bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)]" : "border-border/50 text-muted-foreground hover:text-foreground"}`}
              >
                {s.code}
              </button>
            );
          })}
        </div>
        <div className="ml-auto inline-flex rounded-md border border-border/60 bg-card/60 p-0.5">
          {["consumo", "eficiencia"].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m as "consumo" | "eficiencia")}
              className={`rounded px-3 py-1 text-xs capitalize ${metric === m ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <select className="h-9 rounded-md border border-border/60 bg-card/60 px-2 text-sm">
          {["24h", "7 dias", "30 dias", "Personalizado"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="panel p-4">
          <h3 className="mb-3 text-sm font-semibold">
            Comparação — {metric === "consumo" ? "Consumo" : "Eficiência"}
          </h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={combined}>
                <CartesianGrid
                  stroke="oklch(0.35 0.03 260 / 25%)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="time" stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <YAxis stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.03 260)",
                    border: "1px solid oklch(0.35 0.03 260)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {series.map((s, i) => (
                  <Line
                    key={s.id}
                    type="monotone"
                    dataKey={s.code}
                    stroke={PALETTE[i % PALETTE.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4">
          <h3 className="mb-3 text-sm font-semibold">Consumo real vs. baseline</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={combined}>
                <CartesianGrid
                  stroke="oklch(0.35 0.03 260 / 25%)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="time" stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <YAxis stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.03 260)",
                    border: "1px solid oklch(0.35 0.03 260)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {series.slice(0, 3).map((s, i) => (
                  <Bar
                    key={s.id}
                    dataKey={s.code}
                    fill={PALETTE[i % PALETTE.length]}
                    radius={[3, 3, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4">
          <h3 className="mb-3 text-sm font-semibold">Eficiência vs. Carga térmica</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid stroke="oklch(0.35 0.03 260 / 25%)" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Carga TR"
                  stroke="oklch(0.6 0.02 250)"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="kW/TR"
                  stroke="oklch(0.6 0.02 250)"
                  tick={{ fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 260]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.03 260)",
                    border: "1px solid oklch(0.35 0.03 260)",
                    borderRadius: 8,
                  }}
                />
                <Scatter data={scatterData} fill="var(--accent-cyan)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4">
          <h3 className="mb-3 text-sm font-semibold">Delta T por shopping</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={deltaTData}>
                <CartesianGrid
                  stroke="oklch(0.35 0.03 260 / 25%)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="code" stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 10 }} />
                <YAxis stroke="oklch(0.6 0.02 250)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.03 260)",
                    border: "1px solid oklch(0.35 0.03 260)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="deltaT" fill="var(--accent-yellow)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel p-4">
        <h3 className="mb-3 text-sm font-semibold">Heatmap semanal — Consumo (MWh)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-muted-foreground">Shopping</th>
                {heatmapDays.map((d) => (
                  <th key={d} className="p-2 text-center text-muted-foreground">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatShoppings.map((s, si) => (
                <tr key={s.id}>
                  <td className="p-2 font-medium">{s.code}</td>
                  {heatmapDays.map((_, di) => {
                    const v = (((si * 7 + di) * 13) % 20) + 4; // pseudo
                    const intensity = Math.min(1, v / 22);
                    return (
                      <td key={di} className="p-1">
                        <div
                          className="h-8 rounded"
                          style={{ background: `oklch(0.5 0.15 220 / ${0.15 + intensity * 0.7})` }}
                          title={`${v} MWh`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
