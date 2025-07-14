import { OrderItem, ReturnStatus } from "@prisma/client";

export interface OrderItemWithRelation extends OrderItem {
  gallery: {
    title: string;
    images: string[];
    artist?: {
      phone?: string | null;
    } | null;
  };
  order: {
    createdAt: Date;
  };
  returnStatus: ReturnStatus | null;
}
