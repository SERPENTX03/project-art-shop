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
  avatar: string;
}

export default function PostFeed({ posts, avatar }: PostProps) {
  if (!posts.length) {
    return <p className="text-gray-500 text-center mt-10">ยังไม่มีโพสต์</p>;
  }

  return (
    <div className="space-y-4 py-4 max-w-3xl mx-auto">
      {posts.map((post) => (
        <div
          key={post.id}
          className="relative border rounded-lg p-4 bg-primary/70 shadow-sm space-y-2"
        >
          {/*  Avatar มุมขวาบน */}
          <div className="absolute top-2 left-full w-10 h-10">
            <Image
              src={avatar || "/default-avatar.png"}
              alt="Artist Avatar"
              fill
              className="rounded-full object-cover ml-2"
            />
          </div>

          {post.content && (
            <p className="mb-1 text-white whitespace-pre-line">
              {post.content}
            </p>
          )}

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

          {post.Reaction.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.Reaction.map((r, i) => (
                <span
                  key={i}
                  className="text-lg bg-white text-primary px-2 py-0.5 rounded-full"
                >
                  {r.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
