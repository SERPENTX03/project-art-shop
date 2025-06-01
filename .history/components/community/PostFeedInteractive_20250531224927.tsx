"use client";

import { toggleReaction } from "@/actions/reactToPost";
import { togglePollVote } from "@/actions/poll"; // ✅ ต้องสร้าง action นี้
import Image from "next/image";
import { useState, useTransition } from "react";

const defaultEmojis = ["❤️", "😂", "👍", "😮", "😢"];

type Post = {
  id: string;
  content: string | null;
  images: string[];
  Reaction: { emoji: string }[];
  PollQuestion?: {
    id: string;
    question: string;
    options: {
      id: string;
      text: string;
      votes: { id: string }[];
    }[];
  }[];
};

interface Props {
  posts: Post[];
  avatar: string;
}

export default function PostFeedInteractive({ posts, avatar }: Props) {
  const [optimistic, setOptimistic] = useState<Record<string, string[]>>({});
  const [voted, setVoted] = useState<Record<string, string>>({}); // questionId -> optionId
  const [isPending, startTransition] = useTransition();

  const handleReact = (postId: string, emoji: string) => {
    startTransition(async () => {
      const result = await toggleReaction(postId, emoji);
      setOptimistic((prev) => {
        const current = new Set(prev[postId] || []);
        if (result.removed) current.delete(emoji);
        else current.add(emoji);
        return { ...prev, [postId]: Array.from(current) };
      });
    });
  };

  const handleVote = (questionId: string, optionId: string) => {
    startTransition(async () => {
      await togglePollVote(optionId);
      setVoted((prev) => ({ ...prev, [questionId]: optionId }));
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto px-16 pb-32 space-y-6 max-w-3xl mx-auto">
      {posts.map((post) => {
        const emojiCount: Record<string, number> = {};
        for (const r of post.Reaction) {
          emojiCount[r.emoji] = (emojiCount[r.emoji] || 0) + 1;
        }
        for (const emoji of optimistic[post.id] || []) {
          emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
        }

        return (
          <div key={post.id} className="space-y-2">
            <div className="relative border rounded-lg p-4 bg-primary/70 shadow-sm space-y-4">
              {/* Avatar */}
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

              {/* ✅ Poll */}
              {post.PollQuestion?.map((q) => {
                const totalVotes = q.options.reduce(
                  (sum, o) => sum + o.votes.length,
                  0
                );
                return (
                  <div
                    key={q.id}
                    className="space-y-2 bg-white/10 p-3 rounded-lg"
                  >
                    <p className="text-white font-medium text-base">
                      {q.question}
                    </p>
                    {q.options.map((opt) => {
                      const count = opt.votes.length;
                      const percent = totalVotes
                        ? Math.round((count / totalVotes) * 100)
                        : 0;
                      const isVoted = voted[q.id] === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleVote(q.id, opt.id)}
                          className={`w-full text-left p-1 rounded-md ${
                            isVoted
                              ? "bg-green-500/20 ring-2 ring-green-400"
                              : "hover:bg-white/20"
                          }`}
                          disabled={isPending}
                        >
                          <div className="flex justify-between text-white text-sm">
                            <span>{opt.text}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-3 mt-1 mb-1">
                            <div
                              className="bg-green-400 h-3 rounded-full transition-all duration-300"
                              style={{
                                width: percent === 0 ? "4%" : `${percent}%`,
                                minWidth: percent === 0 ? "16px" : undefined,
                              }}
                            />
                          </div>
                        </button>
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

            {/* Emoji bar */}
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
