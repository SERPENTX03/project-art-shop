import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props {
  gallery: {
    id: string;
    title: string;
    price: number;
    images: string[];
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
  updateStatus: (id: string, status: "APPROVED" | "REJECTED") => void;
}

export default function GalleryCard({ gallery, updateStatus }: Props) {
  return (
    <Card className="p-4">
      <CardContent className="flex flex-col gap-2">
        <Image
          src={gallery.images[0]}
          alt={gallery.title}
          className="w-full h-40 object-cover rounded"
          width={200}
          height={200}
        />
        <h2 className="text-lg font-semibold truncate">{gallery.title}</h2>
        <p className="text-sm text-muted-foreground">
          Price: {gallery.price.toFixed(2)}฿
        </p>
        <Badge
          variant={
            gallery.status === "APPROVED"
              ? "default"
              : gallery.status === "REJECTED"
              ? "destructive"
              : "outline"
          }
        >
          {gallery.status}
        </Badge>
        {gallery.status === "PENDING" && (
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => updateStatus(gallery.id, "APPROVED")}
              size="sm"
            >
              Approve
            </Button>
            <Button
              onClick={() => updateStatus(gallery.id, "REJECTED")}
              size="sm"
              variant="destructive"
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
