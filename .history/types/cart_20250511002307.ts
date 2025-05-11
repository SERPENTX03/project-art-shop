export type CartItem = {
  id: string;
  quantity: number;
  gallery: {
    title: string;
    price: number;
    images: string[];
    description: string | null;
  };
};
