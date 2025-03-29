import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";

const CardTrending = async () => {
  const galleries = await fetchAllGalleries();

  return (
    <>
      {galleries.slice(0, 4).map((art, index) => (
        <div key={index}>
          <h2>{art.title}</h2>
          <Image src={art.images[0]} alt={art.title} width={200} height={200} />
        </div>
      ))}
    </>
  );
};
export default CardTrending;
