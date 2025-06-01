import { fetchArtist } from "@/actions/artist";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { SlArrowDown } from "react-icons/sl";

const CommunityArtistPage = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const avatar = await fetchArtist(userId);
  return (
    <nav className="flex relative justify-between mt-10 border border-slate-500 h-20 rounded-full">
      {/* Image */}
      <div className="absolute left-0 top-0 h-full w-20 z-10">
        <Image
          src={avatar?.avatar || "/default-avatar.png"}
          alt="AvatarArtist"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p>{avatar?.name}</p>
      </div>

      <div className=" absolute right-0 top-0 border border-slate-500 h-full w-[80px] rounded-full flex justify-center items-center text-2xl">
        <span className="mr-1">CM</span>
        <SlArrowDown size={18} />
      </div>
    </nav>
  );
};
export default CommunityArtistPage;
