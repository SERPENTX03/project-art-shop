import { fetchGalleryById } from "@/actions/gallery";
import GalleryCarousel from "@/components/slideshow/SlidesGalleries";
import { Separator } from "@/components/ui/separator";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const galleryId = await fetchGalleryById(id);
  return (
    <section className="my-10">
      <Separator className="my-10" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Carousel */}
          <GalleryCarousel images={galleryId.images} />

          {/* Info */}
          <div className="flex-1 h-full w-full">
            <div className="flex flex-col justify-between">
              <h1 className="text-3xl font-bold">{galleryId.title}</h1>
              <p className="mt-2 text-muted-foreground">
                {galleryId.description}
              </p>
              <p className="mt-4 text-2xl text-blue-500 font-semibold">
                {galleryId.price}฿
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GalleryId;
