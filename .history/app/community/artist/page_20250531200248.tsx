import { fetchAvatarArtist } from "@/actions/artist";
import Image from "next/image";
import { SlArrowDown } from "react-icons/sl";

const CommunityArtistPage = async () => {
  const avatar = await fetchAvatarArtist();
  console.log(avatar);
  return (
    <nav className="flex relative justify-between mt-10 border border-slate-500 h-20 rounded-full">
      {/* Image */}
      <div className="absolute left-0 top-0 h-full w-20 z-10">
        <Image
          src={avatar || "/default-avatar.png"}
          alt="AvatarArtist"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="border h-full w-[80px] rounded-full flex justify-center items-center text-2xl">
        <span className="mr-1">EN</span>
        <SlArrowDown size={18} />
      </div>
      dsd
    </nav>
  );
};
export default CommunityArtistPage;
