import { OrderItem, ReturnStatus } from "@prisma/client";

export interface OrderItemWithRelation extends OrderItem {
  gallery: {
    title: string;
    images: string[];
    shop?: {
      phone?: string | null;
    } | null;
  };
  order: {
    createdAt: Date;
  };
  returnStatus?: ReturnStatus | null;
}
