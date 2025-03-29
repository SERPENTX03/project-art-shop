import { fetchGalleryById } from "@/actions/gallery";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const galleryId = await fetchGalleryById(id);
  return (
    <section className="my-10">
      <Separator className="my-10" />
      <Card className="border-gray-200 h-[70vh]">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center  w-full h-full p-20">
            <Image
              src={galleryId.images[0]}
              alt={galleryId.title}
              width={400}
              height={400}
              className="w-full h-full rounded-3xl"
              objectFit="cover"
            />
          </div>
          <div className="w-full h-full border">
            <h1>{galleryId.title}</h1>
            <p>{galleryId.description}</p>
            <p>{galleryId.price}</p>
          </div>
        </div>
      </Card>
    </section>
  );
};
export default GalleryId;
