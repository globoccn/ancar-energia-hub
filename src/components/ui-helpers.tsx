import { Skeleton } from "@/components/ui/skeleton";

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent-green)]" />
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

export function LoadingBlock({ h = 240 }: { h?: number }) {
  return <Skeleton className="w-full" style={{ height: h }} />;
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-1 p-10 text-center">
      <div className="text-sm font-medium">{title}</div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
  );
}
