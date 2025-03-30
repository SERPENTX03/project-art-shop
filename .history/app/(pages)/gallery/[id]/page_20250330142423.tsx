import { fetchGalleryById } from "@/actions/gallery";
import BuyNowButton from "@/components/payment/BuyNowButton";
import GalleryCarousel from "@/components/slideshow/SlidesGalleries";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth();
  const { id } = await params;
  const galleryId = await fetchGalleryById(id);
  console.log(galleryId);
  return (
    <section className="my-10">
      <Separator className="my-10" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Carousel */}
          <GalleryCarousel images={galleryId.images} />

          {/* Info */}
          <div className="flex-1 w-full py-4">
            <div className=" h-full  flex flex-col  justify-between">
              <div>
                <h1 className="text-3xl font-bold">{galleryId.title}</h1>
                <p className="mt-4 text-3xl text-blue-500 font-semibold">
                  {galleryId.price}฿
                </p>
                <p className="mt-2 text-muted-foreground">
                  {galleryId.description}
                </p>
              </div>
              <div></div>

              <BuyNowButton
                product={{
                  title: galleryId.title,
                  description: galleryId.description || "",
                  price: galleryId.price,
                  clerkId: userId,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GalleryId;
