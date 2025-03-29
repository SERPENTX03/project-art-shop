import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";

const CardTrending = async () => {
  const galleries = await fetchAllGalleries();

  return (
    <>
      {galleries.map((art, index) => {
        return (
          <div key={index}>
            <Image
              src={art.images[0].slice(0, 4)}
              alt={art.title}
              width={200}
              height={200}
            />
          </div>
        );
      })}
    </>
  );
};
export default CardTrending;
