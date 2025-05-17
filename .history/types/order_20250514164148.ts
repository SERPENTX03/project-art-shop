import { OrderItem } from "@prisma/client";

export interface OrderItemWithRelation extends OrderItem {
  gallery: {
    title: string;
    images: string[];
  };
  order: {
    createdAt: Date;
  };
}
