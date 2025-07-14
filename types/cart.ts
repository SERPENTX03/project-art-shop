export type CartItem = {
  id: string;
  quantity: number;
  gallery: {
    id: string;
    title: string;
    price: number;
    images: string[];
    description: string | null;
    quantity: number;
    imageSize: number;
  };
};
