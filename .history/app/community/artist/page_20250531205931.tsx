import { fetchArtist } from "@/actions/artist";
import { fetchPostByArtist } from "@/actions/post";
import CreatePostForm from "@/components/community/artist/CreatePostFormArtist";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SlArrowDown } from "react-icons/sl";

const CommunityArtistPage = async () => {
  const { userId } = await auth();
  if (!userId) return notFound();

  const artist = await fetchArtist(userId);
  if (!artist) return notFound();

  const posts = await fetchPostByArtist(artist.id); // ต้องเขียน Action นี้

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
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

      {/* Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">ยังไม่มีโพสต์</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              {post.content && <p className="mb-2">{post.content}</p>}
              {post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Post image ${index + 1}`}
                      width={300}
                      height={300}
                      className="rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* POST Form */}
      <div className="border border-slate-500 rounded-xl p-4 mt-6">
        <CreatePostForm />
      </div>
    </div>
  );
};

export default CommunityArtistPage;
