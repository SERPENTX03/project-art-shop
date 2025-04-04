import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";
import ViewMoreButton from "./PendingButton";

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
            className="w-full h-40 rounded-lg object-cover"
            src={art.images[0]}
            alt={art.title}
            width={200}
            height={200}
            priority
          />
          <div className="flex flex-col h-34 justify-between">
            <div className="text-center">
              <h1 className="mt-2">{art.title}</h1>
              <div className=" flex flex-col justify-center items-center ">
                <div className="w-full max-w-[200px]">
                  <p className="text-sm text-muted-foreground break-words">
                    {art.description?.slice(0, 50)}
                  </p>{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between px-2">
              <p className="text-right text-xl text-[#123458]">{art.price} ฿</p>{" "}
              <ViewMoreButton id={art.id} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default CardBestSeller;
