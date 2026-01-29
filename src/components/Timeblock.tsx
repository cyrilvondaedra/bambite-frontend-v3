export default function TimeBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;

  return (
    <div className="flex flex-col items-center">
      <span
        className="font-serif text-3xl md:text-4xl font-light heading2 tabular-nums"
        style={{ minWidth: "2ch", textAlign: "center" }}
      >
        {String(safe).padStart(2, "0")}
      </span>

      <span className="text-[10px] uppercase tracking-ultra-wide heading2">
        {label}
      </span>
    </div>
  );
}
