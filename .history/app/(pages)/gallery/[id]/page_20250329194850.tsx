import { fetchGalleryById } from "@/actions/gallery";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const galleryId = await fetchGalleryById(id);
  return (
    <section className="my-10">
      <Card className="border-gray-200 h-[70vh]">
        <div className="flex justify-between items-center">
          <div className="w-full h-full p-16">
            <Image
              src={galleryId.images[0]}
              alt={galleryId.title}
              width={400}
              height={400}
              className="w-full h-full"
              objectFit="cover"
            />
          </div>
          <div>
            <h1>{galleryId.title}</h1>
          </div>
        </div>
      </Card>
    </section>
  );
};
export default GalleryId;
