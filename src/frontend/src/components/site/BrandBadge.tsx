export default function BrandBadge() {
  return (
    <a href="#home" className="flex items-center gap-3 group">
      <img
        src="/assets/generated/loura-logo.dim_512x512.png"
        alt="Loura Earth Mover"
        className="h-10 w-10 transition-transform group-hover:scale-105"
      />
      <div className="flex flex-col">
        <span className="font-display text-xl font-bold text-foreground leading-tight">
          Loura
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Earth Mover
        </span>
      </div>
    </a>
  );
}

