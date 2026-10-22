import { cn } from "@/lib/utils";

export function Glass({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/40 bg-white/40 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10",
        className,
      )}
      {...props}
    />
  );
}

export function LevelDots({ level, className }: { level: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-1", className)} aria-label={`Level ${level}`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={cn("size-1.5 rounded-full bg-current", n > level && "opacity-25")} />
      ))}
    </span>
  );
}

export function PrimaryButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "h-14 w-full rounded-2xl bg-foreground text-base font-semibold text-background shadow-lg transition active:scale-[0.97] disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
