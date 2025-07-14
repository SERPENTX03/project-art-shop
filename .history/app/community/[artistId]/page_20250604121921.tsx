import { fetchAllArtist, fetchArtistById } from "@/actions/artist";
import PostFeedInteractive from "@/components/community/PostFeedInteractive";
import Image from "next/image";
import { notFound } from "next/navigation";
import BottomBar from "@/components/community/BottomBar";
import { auth } from "@clerk/nextjs/server";
import ChannalArtist from "@/components/community/ChannalArtist";

interface ArtistByParamProps {
  params: {
    artistId: string;
  };
}

const ArtistByParam = async ({ params }: ArtistByParamProps) => {
  const { artistId } = await params;
  const { userId } = await auth();

  const artist = await fetchArtistById(artistId);
  const artists = await fetchAllArtist();

  if (!artists) return notFound();
  if (!artist) return notFound();

  return (
    <div>
      {/* Artist Profile Nav */}
      <nav className="flex relative justify-between mt-10 border border-slate-500 h-20 rounded-full px-6">
        <div className="absolute left-0 top-0 h-full w-20 z-10">
          <Image
            src={artist.avatar || "/images/default-avatar.png"}
            alt="AvatarArtist"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="ml-24 my-2">
          <p className="text-2xl">{artist.name}</p>
          <p className="text-sm font-bold">{artist.bio}</p>
        </div>

        <ChannalArtist artists={artists} />
      </nav>

      {/* Post Feed */}
      <div className="mt-6">
        <PostFeedInteractive
          userId={userId}
          artistId={artist.id}
          avatar={artist.avatar}
        />
      </div>

      <BottomBar />
    </div>
  );
};

export default ArtistByParam;
