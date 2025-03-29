import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";

const CardTrending = async () => {
  const galleries = await fetchAllGalleries();

  return (
    <section>
      <h1 className="text-2xl font-semibold">TRENDING</h1>
      {galleries.map((art, index) => {
        return (
          <div key={index}>
            <Image src={art.images} alt={art.title} width={200} height={200} />
          </div>
        );
      })}
    </section>
  );
};
export default CardTrending;
