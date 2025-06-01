"use client";

import { toggleReaction } from "@/actions/reactToPost";
import Image from "next/image";
import { useState, useTransition } from "react";

const defaultEmojis = ["❤️", "😂", "👍", "😮", "😢"];

type Post = {
  id: string;
  content: string | null;
  images: string[];
  Reaction: { emoji: string }[];
};

interface Props {
  posts: Post[];
  avatar: string;
}

export default function PostFeedInteractive({ posts, avatar }: Props) {
  const [optimistic, setOptimistic] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const handleReact = (postId: string, emoji: string) => {
    startTransition(async () => {
      const result = await toggleReaction(postId, emoji);

      setOptimistic((prev) => {
        const current = new Set(prev[postId] || []);
        if (result.removed) {
          current.delete(emoji);
        } else {
          current.add(emoji);
        }
        return {
          ...prev,
          [postId]: Array.from(current),
        };
      });
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto px-16 pb-32 space-y-6 max-w-3xl mx-auto">
      {posts.map((post) => {
        const emojiCount: Record<string, number> = {};

        // นับจำนวนจากฐานข้อมูล
        for (const r of post.Reaction) {
          emojiCount[r.emoji] = (emojiCount[r.emoji] || 0) + 1;
        }

        // เพิ่ม optimistic reaction
        for (const emoji of optimistic[post.id] || []) {
          emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
        }

        return (
          <div key={post.id} className="space-y-2">
            <div className="relative border rounded-lg p-4 bg-primary/70 shadow-sm space-y-2">
              <div className="absolute top-2 left-full w-10 h-10">
                <Image
                  src={avatar}
                  alt="Artist Avatar"
                  fill
                  className="rounded-full object-cover ml-1"
                />
              </div>

              {post.content && (
                <p className="text-white whitespace-pre-line">{post.content}</p>
              )}

              {post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img}
                      alt={`Post image ${i + 1}`}
                      width={300}
                      height={300}
                      className="rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Emoji bar with count */}
            <div className="flex gap-2 px-2 flex-wrap">
              {defaultEmojis.map((emoji) => {
                const isActive =
                  post.Reaction.some((r) => r.emoji === emoji) ||
                  (optimistic[post.id] || []).includes(emoji);

                const count = emojiCount[emoji] || 0;

                return (
                  <button
                    key={emoji}
                    onClick={() => handleReact(post.id, emoji)}
                    disabled={isPending}
                    className={`text-sm px-2 py-0.5 rounded-full border flex items-center gap-1 transition ${
                      isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-primary hover:bg-slate-200"
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    {count > 0 && <span className="font-medium">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
