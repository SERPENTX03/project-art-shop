import { fetchAllGalleries, fetchGalleriesByCategory } from "@/actions/gallery";
import Image from "next/image";

type CardTrendingProps = {
  category?: string;
};

const CardTrending = async ({ category }: CardTrendingProps) => {
  console.log(category);
  const galleries =
    category && category !== "ALL"
      ? await fetchGalleriesByCategory(category)
      : await fetchAllGalleries();

  return (
    <>
      {galleries.slice(0, 4).map((art, index) => (
        <div className="h-80" key={index}>
          <Image
            className="w-full h-40 rounded-2xl"
            objectFit="cover"
            src={art.images[0]}
            alt={art.title}
            width={200}
            height={200}
            priority
          />
          <div className="flex flex-col h-34 justify-between">
            <div className="text-center">
              <h1 className="mt-2">{art.title}</h1>
              <p>{art.description}</p>
            </div>
            <div className="flex justify-center">
              <button className="button-custom py-1.5 px-3">View more</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default CardTrending;
