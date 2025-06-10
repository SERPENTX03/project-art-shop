"use client";

import Image from "next/image";

type Post = {
  id: string;
  content: string | null;
  images: string[];
  Reaction: { emoji: string }[];
  PollQuestion?: {
    question: string;
    options: {
      text: string;
      votes: { id: string }[];
    }[];
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
    <div className="h-[calc(100vh-80px)] overflow-y-auto px-14 pb-32 space-y-6 max-w-3xl mx-auto">
      {posts.map((post) => {
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
            <div className="relative border rounded-lg p-4 bg-primary/70 shadow-sm space-y-4">
              {/* Avatar มุมขวาบน */}
              <div className="absolute top-2 left-full w-10 h-10">
                <Image
                  src={avatar || "/images/default-avatar.png"}
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

              {/*  Poll */}
              {post.PollQuestion?.map((q, qi) => {
                const totalVotes = q.options.reduce(
                  (sum, o) => sum + o.votes.length,
                  0
                );

                return (
                  <div
                    key={qi}
                    className="space-y-2 bg-white/20 p-3 rounded-lg"
                  >
                    <p className="text-white font-medium text-base">
                      {q.question}
                    </p>
                    {q.options.map((opt, oi) => {
                      const count = opt.votes.length;
                      const percent = totalVotes
                        ? Math.round((count / totalVotes) * 100)
                        : 0;

                      return (
                        <div key={oi}>
                          <div className="flex justify-between text-white text-sm">
                            <span>{opt.text}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-3 mt-1 mb-2">
                            <div
                              className="bg-blue-400 h-3 rounded-full transition-all duration-300"
                              style={{
                                width: percent === 0 ? "4%" : `${percent}%`,
                                minWidth: percent === 0 ? "16px" : undefined,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {totalVotes > 0 && (
                      <p className="text-xs text-white/60 text-right">
                        รวมทั้งหมด {totalVotes} โหวต
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Emoji */}
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
