import { fetchGalleryByUserId } from "@/actions/gallery";

const GalleryList = async () => {
  const galleries = await fetchGalleryByUserId(userId);

  return (
    <div>
      <GalleryList galleries={galleries} />
    </div>
  );
};
export default GalleryList;
