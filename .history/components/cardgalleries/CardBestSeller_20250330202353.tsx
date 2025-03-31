import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";
import Link from "next/link";

const CardBestSeller = async () => {
  const galleries = await fetchAllGalleries();
  const isBestSeller = galleries
    .filter((b) => b.soldCount > 0)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);
  return (
    <>
      {isBestSeller.map((art, index) => (
        <div className="h-80" key={index}>
          <Image
            className="w-full h-40 rounded-lg"
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
              <p className="text-right text-xl text-[#123458]">{art.price} ฿</p>{" "}
              <Link
                href={`/gallery/${art.id}`}
                className="button-custom py-1.5 px-3"
              >
                View more
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default CardBestSeller;
