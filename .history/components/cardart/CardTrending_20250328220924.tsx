import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";

const CardTrending = async () => {
  const galleries = await fetchAllGalleries();

  return (
    <>
      {galleries.slice(0, 4).map((art, index) => (
        <div className="h-80 border" key={index}>
          <Image
            className="w-full rounded-2xl"
            src={art.images[0]}
            alt={art.title}
            width={200}
            height={200}
          />
        </div>
      ))}
    </>
  );
};
export default CardTrending;
