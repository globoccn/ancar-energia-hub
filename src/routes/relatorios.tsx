import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Send,
  Trophy,
  AlertTriangle,
  Leaf,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui-helpers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — Ancar" }] }),
  component: RelatoriosPage,
});

const reports = [
  {
    id: "diario",
    icon: CalendarClock,
    title: "Diário",
    desc: "Consolidado das últimas 24 horas de operação.",
    color: "var(--accent-cyan)",
  },
  {
    id: "semanal",
    icon: CalendarClock,
    title: "Semanal",
    desc: "Comparativo de eficiência e consumo dos últimos 7 dias.",
    color: "var(--accent-blue)",
  },
  {
    id: "mensal",
    icon: CalendarClock,
    title: "Mensal",
    desc: "Relatório executivo com KPIs e evolução mensal.",
    color: "var(--accent-purple)",
  },
  {
    id: "ranking",
    icon: Trophy,
    title: "Ranking",
    desc: "Ranking consolidado por métrica e período.",
    color: "var(--accent-yellow)",
  },
  {
    id: "esg",
    icon: Leaf,
    title: "ESG",
    desc: "Indicadores ambientais, sociais e de governança.",
    color: "var(--accent-green)",
  },
  {
    id: "eficiencia",
    icon: Gauge,
    title: "Eficiência",
    desc: "Análise detalhada de eficiência por shopping.",
    color: "var(--accent-cyan)",
  },
  {
    id: "alertas",
    icon: AlertTriangle,
    title: "Alertas",
    desc: "Histórico completo de alertas e resoluções.",
    color: "var(--accent-red)",
  },
  {
    id: "qualidade",
    icon: ShieldCheck,
    title: "Qualidade dos Dados",
    desc: "Cobertura e disponibilidade dos instrumentos.",
    color: "var(--accent-purple)",
  },
];

function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Relatórios" subtitle="Geração e agendamento de relatórios executivos" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((r) => (
          <div key={r.id} className="panel flex flex-col p-4">
            <div className="flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-lg border border-border/50"
                style={{ background: `color-mix(in oklab, ${r.color} 15%, transparent)` }}
              >
                <r.icon className="h-4 w-4" style={{ color: r.color }} />
              </div>
              <div>
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => toast.info(`Visualizando: ${r.title}`)}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Visualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => toast.success(`PDF ${r.title} exportado (demo)`)}
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" /> PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => toast.success(`Excel ${r.title} exportado (demo)`)}
              >
                <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => toast.info(`Envio agendado: ${r.title}`)}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" /> Agendar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
