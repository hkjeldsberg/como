import { cn } from "@/lib/utils";
import type { PlayerNumber } from "@/lib/types";

export const PLAYER_BG: Record<PlayerNumber, string> = { 1: "bg-clay-p1", 2: "bg-clay-p2" };

/** Neumorphic clay surface. */
export function Clay({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-[32px] bg-clay-card shadow-clay-lg", className)} {...props} />;
}

/** Circle avatar filled with the player's color. */
export function Avatar({
  player,
  emoji,
  className,
}: {
  player: PlayerNumber;
  emoji: string;
  className?: string;
}) {
  return (
    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-lg", PLAYER_BG[player], className)}>
      {emoji}
    </span>
  );
}

/** Three 14px level dots, filled with the given color class, empty ones in track. */
export function LevelDots({ level, fill = "bg-clay-ink", className }: { level: number; fill?: string; className?: string }) {
  return (
    <span className={cn("inline-flex gap-1.5", className)} aria-label={`Nivel ${level}`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={cn("size-3.5 rounded-full", n <= level ? fill : "bg-clay-track")} />
      ))}
    </span>
  );
}

export function ClayButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "h-16 w-full rounded-3xl bg-clay-surface text-lg font-semibold text-clay-ink shadow-clay-sm transition-shadow active:shadow-clay-pressed disabled:text-clay-muted disabled:active:shadow-clay-sm",
        className,
      )}
      {...props}
    />
  );
}
