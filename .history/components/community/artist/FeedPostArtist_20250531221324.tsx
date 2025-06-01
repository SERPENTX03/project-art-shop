"use client";

import Image from "next/image";

type Post = {
  id: string;
  content: string | null;
  images: string[];
  Reaction: {
    emoji: string;
  }[];
};

interface PostProps {
  posts: Post[];
  avatar: string | null;
}

const defaultEmojis = ["❤️", "😂", "👍", "😮", "😢"];

export default function PostFeed({ posts, avatar }: PostProps) {
  if (!posts.length) {
    return <p className="text-gray-500 text-center mt-10">ยังไม่มีโพสต์</p>;
  }

  return (
    <div className="space-y-6 py-4 max-w-3xl mx-auto">
      {posts.map((post) => {
        // 👉 สร้าง count map
        const emojiCount: Record<string, number> = {};
        for (const r of post.Reaction) {
          emojiCount[r.emoji] = (emojiCount[r.emoji] || 0) + 1;
        }

        const emojisToShow =
          Object.keys(emojiCount).length > 0
            ? Object.keys(emojiCount)
            : defaultEmojis;

        return (
          <div key={post.id} className="space-y-2">
            <div className="relative border rounded-lg p-4 bg-primary/70 shadow-sm space-y-2">
              {/* Avatar มุมขวาบน */}
              <div className="absolute top-2 left-full w-10 h-10">
                <Image
                  src={avatar || "/default-avatar.png"}
                  alt="Artist Avatar"
                  fill
                  className="rounded-full object-cover ml-1"
                />
              </div>

              {/* Content */}
              {post.content && (
                <p className="text-white whitespace-pre-line">{post.content}</p>
              )}

              {/* Images */}
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

            <div className="flex justify-end flex-wrap gap-2 px-2">
              {emojisToShow.map((emoji) => (
                <span
                  key={emoji}
                  className="text-sm px-2 py-0.5 rounded-full border bg-slate-100 text-primary flex items-center gap-1"
                >
                  <span className="text-lg">{emoji}</span>
                  {emojiCount[emoji] && (
                    <span className="font-medium">{emojiCount[emoji]}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
