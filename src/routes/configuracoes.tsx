import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ui-helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { shoppings } from "@/data/mock/shoppings";
import { USE_MOCK_DATA } from "@/config";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações" }] }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const [useMock, setUseMock] = useState(USE_MOCK_DATA);
  const [integrationUrl, setIntegrationUrl] = useState("https://dados.exemplo.com/portfolio");
  const [emissionFactor, setEmissionFactor] = useState("0.084");
  const [refresh, setRefresh] = useState("30");

  return (
    <div className="space-y-4">
      <PageHeader title="Configurações" subtitle="Ajuste parâmetros do sistema e integrações" />

      <Tabs defaultValue="shoppings">
        <TabsList className="flex-wrap">
          <TabsTrigger value="shoppings">Shoppings</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="alertas">Limites de alertas</TabsTrigger>
          <TabsTrigger value="emissoes">Fator de emissão</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="instrumentos">Disponibilidade</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="shoppings" className="mt-4">
          <div className="panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Sigla</th>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">Cidade</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-right">Cobertura</th>
                </tr>
              </thead>
              <tbody>
                {shoppings.map((s) => (
                  <tr key={s.id} className="border-t border-border/30">
                    <td className="p-3 font-medium">{s.code}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3 text-muted-foreground">{s.city}</td>
                    <td className="p-3 text-muted-foreground">{s.state}</td>
                    <td className="p-3 text-right metric-value">
                      {s.dataAvailability.coveragePct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="metas" className="mt-4">
          <div className="panel grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
            <Field label="Meta eficiência (kW/TR)" defaultValue="0.65" />
            <Field label="Meta redução consumo (%)" defaultValue="8" />
            <Field label="Meta ESG Score" defaultValue="85" />
            <Field label="Meta CO₂ evitado (t/ano)" defaultValue="12500" />
            <Field label="Meta economia (R$/ano)" defaultValue="4200000" />
            <Field label="Meta energia renovável (%)" defaultValue="45" />
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="mt-4">
          <div className="panel grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
            <Field label="Delta T mínimo (°C)" defaultValue="5.0" />
            <Field label="Consumo acima do baseline (%)" defaultValue="15" />
            <Field label="Aproximação máxima (°C)" defaultValue="5.5" />
            <Field label="Eficiência máxima aceitável (kW/TR)" defaultValue="0.85" />
            <Field label="Cobertura mínima (%)" defaultValue="80" />
            <Field label="Tempo máximo sem leitura (min)" defaultValue="10" />
          </div>
        </TabsContent>

        <TabsContent value="emissoes" className="mt-4">
          <div className="panel space-y-3 p-4">
            <Field
              label="Fator de emissão da rede (t CO₂ / MWh)"
              value={emissionFactor}
              onChange={setEmissionFactor}
            />
            <p className="text-xs text-muted-foreground">
              Base ONS. Aplicado em todas as métricas de CO₂ evitado e emissões.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="mt-4">
          <div className="panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">E-mail</th>
                  <th className="p-3 text-left">Perfil</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Alex Gomes", "alex@empresa.com.br", "Administrador"],
                  ["Marina Souza", "marina@empresa.com.br", "Analista"],
                  ["Rafael Lima", "rafael@empresa.com.br", "Operador"],
                  ["Camila Torres", "camila@empresa.com.br", "Visualização"],
                ].map(([n, e, p]) => (
                  <tr key={e} className="border-t border-border/30">
                    <td className="p-3">{n}</td>
                    <td className="p-3 text-muted-foreground">{e}</td>
                    <td className="p-3">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="unidades" className="mt-4">
          <div className="panel grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
            {[
              ["Energia", "MWh"],
              ["Potência", "kW"],
              ["Eficiência", "kW/TR"],
              ["Temperatura", "°C"],
              ["Vazão", "L/s"],
              ["Emissões", "t CO₂"],
            ].map(([k, v]) => (
              <div key={k}>
                <Label className="text-xs text-muted-foreground">{k}</Label>
                <Input defaultValue={v} className="mt-1" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="instrumentos" className="mt-4">
          <div className="panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Shopping</th>
                  <th className="p-3 text-center">Chillers</th>
                  <th className="p-3 text-center">Periféricos</th>
                  <th className="p-3 text-center">Temperaturas</th>
                  <th className="p-3 text-center">Vazão</th>
                  <th className="p-3 text-right">Cobertura</th>
                </tr>
              </thead>
              <tbody>
                {shoppings.map((s) => (
                  <tr key={s.id} className="border-t border-border/30">
                    <td className="p-3">
                      {s.code} · {s.name}
                    </td>
                    <td className="p-3 text-center">{s.dataAvailability.chillers ? "✓" : "—"}</td>
                    <td className="p-3 text-center">
                      {s.dataAvailability.perifericos ? "✓" : "—"}
                    </td>
                    <td className="p-3 text-center">
                      {s.dataAvailability.temperaturas ? "✓" : "—"}
                    </td>
                    <td className="p-3 text-center">{s.dataAvailability.vazao ? "✓" : "—"}</td>
                    <td className="p-3 text-right metric-value">
                      {s.dataAvailability.coveragePct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="integracao" className="mt-4">
          <div className="panel space-y-4 p-4">
            <div className="flex items-center justify-between rounded-md bg-muted/20 p-3">
              <div>
                <div className="text-sm font-medium">Usar dados mockados</div>
                <div className="text-xs text-muted-foreground">
                  Quando desativado, a aplicação consulta a fonte de dados configurada.
                </div>
              </div>
              <Switch checked={useMock} onCheckedChange={setUseMock} />
            </div>
            <Field
              label="Endpoint de integração"
              value={integrationUrl}
              onChange={setIntegrationUrl}
            />
            <Field
              label="Intervalo de atualização (segundos)"
              value={refresh}
              onChange={setRefresh}
            />
            <div className="flex justify-end">
              <Button onClick={() => toast.success("Configurações salvas (demo)")}>Salvar</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aparencia" className="mt-4">
          <div className="panel space-y-3 p-4">
            <div className="text-sm text-muted-foreground">
              O tema desta aplicação é fixado em modo escuro corporativo. Ajustes de densidade e
              destaques adicionais poderão ser configurados aqui.
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/20 p-3">
              <span className="text-sm">Densidade compacta</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/20 p-3">
              <span className="text-sm">Animações de gráficos</span>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        defaultValue={defaultValue}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-1"
      />
    </div>
  );
}
