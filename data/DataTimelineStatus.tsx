// data/DataTimelineStatus.ts
import {
  Clock,
  Hammer,
  Truck,
  CheckCircle,
  CornerDownLeft,
  ThumbsUp,
  Undo2,
  BadgeCheck,
  XCircle,
} from "lucide-react";

import type {
  DeliveryStatus as PrismaDeliveryStatus,
  ReturnStatus as PrismaReturnStatus,
} from "@prisma/client";

export const DELIVERY_TIMELINE: {
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
  { status: "SHIPPED", label: "Shipping", icon: <Truck className="w-5 h-5" /> },
  {
    status: "DELIVERED",
    label: "Delivered",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

export const RETURN_TIMELINE: {
  status: PrismaReturnStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "REQUESTED",
    label: "Return Requested",
    icon: <CornerDownLeft className="w-5 h-5" />,
  },
  {
    status: "APPROVED",
    label: "Approved",
    icon: <ThumbsUp className="w-5 h-5" />,
  },
  {
    status: "RECEIVED",
    label: "Item Received",
    icon: <Undo2 className="w-5 h-5" />,
  },
  {
    status: "REFUNDED",
    label: "Refunded",
    icon: <BadgeCheck className="w-5 h-5" />,
  },
  {
    status: "REJECTED",
    label: "Rejected",
    icon: <XCircle className="w-5 h-5" />,
  },
];
