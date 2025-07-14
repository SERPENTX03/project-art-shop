import { fetchAllGalleries } from "@/actions/gallery";
import Image from "next/image";
import ViewMoreButton from "./PendingButton";
import AddBacket from "./AddBacket";
import { auth } from "@clerk/nextjs/server";
import { SignUpButton } from "@clerk/nextjs";
import { SlBasket } from "react-icons/sl";
import ToggleFavorite from "./ToggleFavorite";
import { GrFavorite } from "react-icons/gr";

const CardBestSeller = async () => {
  const galleries = await fetchAllGalleries();
  const { userId } = await auth();
  const isBestSeller = galleries
    .filter((b) => b.soldCount > 0)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);
  return (
    <>
      {isBestSeller.map((art, index) => (
        <div className="h-80 relative" key={index}>
          <Image
            className="w-full h-40 rounded-lg object-cover"
            src={art.images[0]}
            alt={art.title}
            width={200}
            height={200}
            priority
          />
          {userId ? (
            <>
              <div className="absolute top-2 right-2">
                <div className="flex gap-2">
                  <AddBacket gallery={art} />
                  <ToggleFavorite galleryId={art.id} />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute top-2 right-2  ">
              <div className="flex gap-2">
                <SignUpButton mode="modal">
                  <SlBasket
                    size={35}
                    className="border cursor-pointer p-1 rounded-xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out"
                  />
                </SignUpButton>
                <SignUpButton mode="modal">
                  <GrFavorite
                    size={35}
                    className=" border cursor-pointer p-1 rounded-xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out"
                  />
                </SignUpButton>
              </div>
            </div>
          )}
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
