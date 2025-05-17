// data/DataTimelineStatus.ts
import { Clock, Hammer, Truck, CheckCircle } from "lucide-react";
import type { DeliveryStatus as PrismaDeliveryStatus } from "@prisma/client";

export const TIMELINE_STEPS: {
  status: PrismaDeliveryStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "PENDING",
    label: "Awaiting Payment",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    status: "PROCESSING",
    label: "Preparing",
    icon: <Hammer className="w-5 h-5" />,
  },
  {
    status: "SHIPPED",
    label: "Shipping",
    icon: <Truck className="w-5 h-5" />,
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];
