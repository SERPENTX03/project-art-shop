import { fetchGalleryById } from "@/actions/gallery";
import { Card } from "@/components/ui/card";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const galleryId = fetchGalleryById(id);
  return (
    <section>
      <Card className="border" />
    </section>
  );
};
export default GalleryId;
