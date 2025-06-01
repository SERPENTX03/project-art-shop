"use client";

import { toggleReaction } from "@/actions/reactToPost";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

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

      toast.success(result.removed ? "ลบ emoji แล้ว" : "เพิ่ม emoji แล้ว");
    });
  };

  return (
    <div className="space-y-6 py-4 max-w-3xl mx-auto">
      {posts.map((post) => {
        const baseReacts = post.Reaction.map((r) => r.emoji);
        const localReacts = optimistic[post.id] || [];
        const mergedReacts = Array.from(
          new Set([...baseReacts, ...localReacts])
        );

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

            {/* Emoji bar (outside post box) */}
            <div className="flex gap-2 px-2 flex-wrap">
              {defaultEmojis.map((emoji) => {
                const isActive =
                  baseReacts.includes(emoji) || localReacts.includes(emoji);
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReact(post.id, emoji)}
                    disabled={isPending}
                    className={`text-lg px-2 py-0.5 rounded-full border transition ${
                      isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-primary hover:bg-slate-200"
                    }`}
                  >
                    {emoji}
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
