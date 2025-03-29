import { fetchGalleryById } from "@/actions/gallery";
import { Card } from "@/components/ui/card";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const galleryId = fetchGalleryById(id);
  return (
    <section className="mt-10">
      <Card className="border-gray-200 " />
    </section>
  );
};
export default GalleryId;
