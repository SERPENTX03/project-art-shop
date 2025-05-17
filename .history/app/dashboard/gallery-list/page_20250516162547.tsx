import { fetchGalleryByUserId } from "@/actions/gallery";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const GalleryList = async () => {
  const { userId } = await auth();
  if (!userId) {
    notFound();
  }
  const galleries = await fetchGalleryByUserId(userId);

  return (
    <div>
      <GalleryList galleries={galleries} />
    </div>
  );
};
export default GalleryList;
