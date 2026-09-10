import { clsx } from "clsx";

const tone = {
  information: "bg-saffron-100 text-maroon-800",
  important: "bg-maroon-50 text-maroon-800",
  urgent: "bg-maroon-600 text-white",
  scheduled: "bg-leaf-50 text-leaf-700",
  updated: "bg-saffron-100 text-maroon-800",
  cancelled: "bg-zinc-200 text-zinc-800",
  completed: "bg-zinc-100 text-zinc-700",
  full: "bg-maroon-50 text-maroon-800",
  closed: "bg-zinc-200 text-zinc-800",
  open: "bg-leaf-50 text-leaf-700",
  waitlisted: "bg-saffron-100 text-maroon-800"
};

export function StatusBadge({ value, label }: { value: keyof typeof tone; label?: string }) {
  return <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize", tone[value])}>{label ?? value.replace("_", " ")}</span>;
}
