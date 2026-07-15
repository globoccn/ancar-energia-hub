import { Bell, Calendar, ChevronDown, GitCompareArrows, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { formatRelative } from "@/utils/format";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { shoppings } from "@/data/mock/shoppings";

export function TopBar() {
  const { lastUpdate } = useAutoRefresh();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar shopping ou métrica..."
            className="h-9 pl-9 bg-card/60 border-border/60"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 bg-card/60">
              Todos os Shoppings <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-80 w-64 overflow-y-auto">
            <DropdownMenuLabel>Selecionar shopping</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Todos os Shoppings</DropdownMenuItem>
            {shoppings.map((s) => (
              <DropdownMenuItem key={s.id}>
                <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">{s.code}</span>
                {s.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 bg-card/60">
              <Calendar className="h-3.5 w-3.5 opacity-70" /> Hoje <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Personalizado"].map((p) => (
              <DropdownMenuItem key={p}>{p}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="h-9 gap-2 bg-card/60">
          <GitCompareArrows className="h-3.5 w-3.5 opacity-70" /> Comparar
        </Button>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-green)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-green)]" />
            </span>
            <span className="text-xs text-muted-foreground">Sistema Operacional</span>
          </div>

          <div className="hidden text-xs text-muted-foreground md:block">
            Atualizado {formatRelative(lastUpdate.toISOString())}
          </div>

          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-red)]" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted/60">
                <Avatar className="h-8 w-8 border border-border/60">
                  <AvatarFallback className="bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] text-xs font-semibold text-foreground">
                    AG
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left leading-tight md:block">
                  <div className="text-xs font-medium">Alex G.</div>
                  <div className="text-[10px] text-muted-foreground">Administrador</div>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
