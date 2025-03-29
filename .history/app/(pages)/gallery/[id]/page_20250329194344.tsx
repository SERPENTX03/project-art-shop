import { fetchGalleryById } from "@/actions/gallery";

const GalleryId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const galleryId = fetchGalleryById(id);
  return <div>{(await galleryId).images}</div>;
};
export default GalleryId;
