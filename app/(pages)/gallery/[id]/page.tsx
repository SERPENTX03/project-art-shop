import { fetchGalleryById } from "@/actions/gallery";
import AddtoCart from "@/components/galleryById/AddtoCart";
import BreadcrumComponent from "@/components/galleryById/Breadcrumb";
import FetchGalleryById from "@/components/galleryById/FetchGalleryById";
import LinkToCart from "@/components/galleryById/LinkToCart";
import GalleryCarousel from "@/components/galleryById/slideshow/SlidesGalleries";
import { Separator } from "@/components/ui/separator";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const gallery = await fetchGalleryById(id);
  return (
    <section className="mt-6">
      <BreadcrumComponent title={gallery.title} />
      <Separator className="my-3 " />
      <div className="max-w-7xl mx-auto px-6 mt-14">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Carousel */}
          <GalleryCarousel images={gallery.images} />

          {/* Info */}
          <div className="flex-1 w-full py-4">
            <div className=" h-full  flex flex-col  justify-between">
              <FetchGalleryById
                title={gallery.title}
                price={gallery.price}
                description={gallery.description}
                quantity={gallery.quantity}
                imageSize={gallery.imageSize || ""}
              />
              <div></div>
              <div className="flex gap-2">
                <AddtoCart gallery={gallery} />
                <LinkToCart id={gallery.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ดัน Footer เผื่อ Content ในอนาคต */}
      <div className="mb-40"></div>
    </section>
  );
};
export default GalleryId;
