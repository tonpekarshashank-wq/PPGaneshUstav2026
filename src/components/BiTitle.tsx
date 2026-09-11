export function BiTitle({ en, mr, size = "card" }: { en: string; mr: string; size?: "card" | "page" }) {
  return (
    <div>
      <div lang="mr" className="font-devDisplay" data-size={size}>{mr}</div>
      <div lang="en" className="text-ink-soft text-[13px] font-semibold leading-snug">{en}</div>
    </div>
  );
}
