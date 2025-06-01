import { fetchArtist } from "@/actions/artist";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SlArrowDown } from "react-icons/sl";

const CommunityArtistPage = async () => {
  const { userId } = await auth();
  if (!userId) return notFound();
  const artist = await fetchArtist(userId);
  return (
    <div>
      <nav className="flex relative justify-between mt-10 border border-slate-500 h-20 rounded-full">
        {/* Image */}
        <div className="absolute left-0 top-0 h-full w-20 z-10">
          <Image
            src={artist?.avatar || "/default-avatar.png"}
            alt="AvatarArtist"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="ml-24 my-2">
          <p className="text-2xl">{artist?.name}</p>
          <p className="text-sm font-bold">{artist?.bio}</p>
        </div>

        <div className=" absolute right-0 top-0 border border-slate-500 h-full w-[80px] rounded-full flex justify-center items-center text-2xl">
          <span className="mr-1">CM</span>
          <SlArrowDown size={18} />
        </div>
      </nav>
      {/* POST */}
      <div className="flex px-10 relative justify-between mt-10 border border-slate-500 h-20 rounded-full">
        <div className="border-r "></div>
      </div>
    </div>
  );
};
export default CommunityArtistPage;
