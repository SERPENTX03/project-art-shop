import { fetchGalleryById } from "@/actions/gallery";
import AddtoCart from "@/components/galleryById/AddtoCart";
import BreadcrumComponent from "@/components/galleryById/Breadcrumb";
import FetchGalleryById from "@/components/galleryById/FetchGalleryById";
// import BuyNowButton from "@/components/galleryById/payment/BuyNowButton";
// import OmiseQrDialog from "@/components/galleryById/payment/OmiseQr";
import GalleryCarousel from "@/components/galleryById/slideshow/SlidesGalleries";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// import { auth } from "@clerk/nextjs/server";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  // const { userId } = await auth();
  const { id } = await params;
  const galleryId = await fetchGalleryById(id);
  return (
    <section className="mt-5">
      <BreadcrumComponent title={galleryId.title} />
      <Separator className="my-3 " />
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
              <div className="flex gap-2">
                <AddtoCart galleryId={galleryId} />
                <Link
                  className="button-custom h-[50px] w-full flex items-center justify-center gap-2"
                  href={`/cart`}
                >
                  สั่งสินค้า
                </Link>
                {/* Omise */}
                {/* <OmiseQrDialog
                  amount={galleryId.price}
                  description={galleryId.title}
                  userId={userId || ""}
                  galleryId={galleryId.id}
                />
                <BuyNowButton
                  product={{
                    id: galleryId.id,
                    title: galleryId.title,
                    description: galleryId.description || "",
                    price: galleryId.price,
                    clerkId: userId,
                  }}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GalleryId;
