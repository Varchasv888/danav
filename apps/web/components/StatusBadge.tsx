import clsx from "clsx";

const TONE: Record<string, string> = {
  open: "bg-primary-soft text-primary",
  posted: "bg-primary-soft text-primary",
  partial: "bg-accent-soft text-accent",
  received: "bg-surface-2 text-success",
  billed: "bg-surface-2 text-success",
  delivered: "bg-surface-2 text-success",
  invoiced: "bg-surface-2 text-success",
  closed: "bg-surface-2 text-muted",
  cancelled: "bg-danger-soft text-danger",
  accepted: "bg-accent-soft text-accent",
  converted: "bg-surface-2 text-success",
  declined: "bg-surface-2 text-muted",
  expired: "bg-surface-2 text-muted",
  planned: "bg-surface-2 text-text",
  released: "bg-primary-soft text-primary",
  completed: "bg-surface-2 text-success",
  paid: "bg-surface-2 text-success",
  void: "bg-danger-soft text-danger",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={clsx("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", TONE[status] ?? "bg-surface-2 text-muted")}>{label}</span>;
}
