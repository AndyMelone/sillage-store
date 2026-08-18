import type { HttpTypes } from "@medusajs/types";

type OrderStatus = HttpTypes.StoreOrder["status"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  completed: "Terminée",
  draft: "Brouillon",
  archived: "Archivée",
  canceled: "Annulée",
  requires_action: "Action requise",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  draft: "bg-secondary text-muted-foreground",
  archived: "bg-secondary text-muted-foreground",
  canceled: "bg-red-100 text-red-700",
  requires_action: "bg-amber-100 text-amber-700",
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function getOrderStatusColor(status: OrderStatus): string {
  return STATUS_COLORS[status] ?? "bg-secondary text-muted-foreground";
}
