export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-border" />
      <span className="eyebrow">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
