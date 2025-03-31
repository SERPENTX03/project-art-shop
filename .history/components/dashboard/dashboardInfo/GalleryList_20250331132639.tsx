import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type Gallery = {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  soldCount: number;
  status: string;
  images: string[];
};

type GalleryListProps = {
  galleries: Gallery[];
};

const GalleryList = ({ galleries }: GalleryListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mt-10">🖼️ Your Galleries</h2>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <Card key={gallery.id}>
            <CardContent className="p-4">
              <Image
                src={gallery.images[0]}
                alt={gallery.title}
                width={500}
                height={300}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-md font-bold mt-2">{gallery.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {gallery.description}
              </p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span>💰 {gallery.price}฿</span>
                <span>📦 {gallery.quantity} in stock</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sold: {gallery.soldCount} | Status: {gallery.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
