import { fetchGalleryById } from "@/actions/gallery";
import BreadcrumComponent from "@/components/galleryById/Breadcrumb";
import FetchGalleryById from "@/components/galleryById/FetchGalleryById";
import BuyNowButton from "@/components/galleryById/payment/BuyNowButton";
import GalleryCarousel from "@/components/galleryById/slideshow/SlidesGalleries";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth();
  const { id } = await params;
  const galleryId = await fetchGalleryById(id);
  console.log(galleryId);
  return (
    <section className="mt-5">
      <BreadcrumComponent />
      <Separator className="mt-5 " />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Carousel */}
          <GalleryCarousel images={galleryId.images} />

          {/* Info */}
          <div className="flex-1 w-full py-4">
            <div className=" h-full  flex flex-col  justify-between">
              <FetchGalleryById
                title={galleryId.title}
                price={galleryId.price}
                description={galleryId.description}
                quantity={galleryId.quantity}
              />
              <div></div>

              <BuyNowButton
                product={{
                  id: galleryId.id,
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
