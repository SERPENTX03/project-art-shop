import { fetchArtist } from "@/actions/artist";
import { fetchPostsByArtist } from "@/actions/post";
import CreatePostBar from "@/components/community/artist/CreatePostBar";
import PostFeed from "@/components/community/artist/FeedPostArtist";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SlArrowDown } from "react-icons/sl";

const CommunityArtistPage = async () => {
  const { userId } = await auth();
  if (!userId) return notFound();

  const artist = await fetchArtist(userId);
  if (!artist) return notFound();

  const posts = await fetchPostsByArtist(artist.id); // ต้องเขียน Action นี้

  return (
    <div>
      {/* Artist Profile Nav */}
      <nav className="flex relative justify-between mt-10 border border-slate-500 h-20 rounded-full px-6">
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

        <div className="absolute right-0 top-0 h-full w-[80px] rounded-full flex justify-center items-center text-2xl border border-slate-500">
          <span className="mr-1">CM</span>
          <SlArrowDown size={18} />
        </div>
      </nav>

      <PostFeed posts={posts} avatar={artist.avatar} />

      <CreatePostBar />
    </div>
  );
};

export default CommunityArtistPage;
