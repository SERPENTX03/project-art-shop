"use client";

import { toggleReaction } from "@/actions/reactToPost";
import { togglePollVote } from "@/actions/poll";
import { getPostsByArtist } from "@/actions/post";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { Post } from "@/types/post";

const defaultEmojis = ["❤️", "😂", "👍", "😮", "😢"];

export default function PostFeedInteractive({
  artistId,
  avatar,
  userId,
}: {
  artistId: string;
  avatar: string | null;
  userId: string | null;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [optimistic] = useState<Record<string, string[]>>({});
  const [voted, setVoted] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const data = await getPostsByArtist(artistId);
      const voteStatus: Record<string, string> = {};

      data.forEach((post) => {
        post.PollQuestion?.forEach((q) => {
          q.options.forEach((opt) => {
            if (opt.votes.some((v) => v.userId === userId)) {
              voteStatus[q.id] = "voted";
            }
          });
        });
      });

      setPosts(data);
      setVoted(voteStatus);
      setIsLoading(false);
    };

    fetchPosts();
  }, [artistId, userId]);

  const refreshPosts = () => {
    startTransition(async () => {
      const data = await getPostsByArtist(artistId);
      const voteStatus: Record<string, string> = {};

      data.forEach((post) => {
        post.PollQuestion?.forEach((q) => {
          q.options.forEach((opt) => {
            if (opt.votes.some((v) => v.userId === userId)) {
              voteStatus[q.id] = "voted";
            }
          });
        });
      });

      setPosts(data);
      setVoted(voteStatus);
    });
  };

  const handleReact = async (postId: string, emoji: string) => {
    await toggleReaction(postId, emoji);
    refreshPosts();
  };

  const handleVote = async (questionId: string, optionId: string) => {
    await togglePollVote(optionId);
    refreshPosts();
  };

  if (isLoading)
    return <p className="text-center text-gray-500 mt-10">กำลังโหลดโพสต์...</p>;

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto px-16 pb-32 space-y-6 max-w-3xl mx-auto">
      {posts.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          ศิลปินยังไม่มีโพสต์ในขณะนี้
        </p>
      ) : (
        <>
          {posts.map((post) => {
            const isQuestion =
              post.PollQuestion && post.PollQuestion.length > 0;

            const emojiCount: Record<string, number> = {};
            for (const r of post.Reaction) {
              emojiCount[r.emoji] = (emojiCount[r.emoji] || 0) + 1;
            }
            for (const emoji of optimistic[post.id] || []) {
              emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
            }

            return (
              <div
                key={post.id}
                className={
                  isQuestion ? "max-w-md mx-auto space-y-2" : "space-y-2"
                }
              >
                <div className="relative border rounded-lg p-4 bg-primary/60 shadow-sm space-y-4">
                  {isQuestion ? (
                    <div className="flex justify-center">
                      <div className="relative w-14 h-14 mb-2">
                        <Image
                          src={avatar || "/images/default-avatar.png"}
                          alt="Artist Avatar"
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-2 mr-4 right-full w-10 h-10">
                      <Image
                        src={avatar || "/images/default-avatar.png"}
                        alt="Artist Avatar"
                        fill
                        className="rounded-full object-cover ml-1"
                      />
                    </div>
                  )}

                  {post.content && (
                    <p className="text-white whitespace-pre-line">
                      {post.content}
                    </p>
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

                  {/* PollQuestion เหมือนเดิม */}
                  {post.PollQuestion?.map((q) => {
                    const totalVotes = q.options.reduce(
                      (sum, o) => sum + o.votes.length,
                      0
                    );
                    const hasVoted = voted[q.id] !== undefined;

                    return (
                      <div key={q.id} className="space-y-2 p-3 rounded-lg">
                        <p className="text-white font-medium text-base">
                          {q.question}
                        </p>

                        {hasVoted ? (
                          <>
                            {q.options.map((opt) => {
                              const count = opt.votes.length;
                              const percent = totalVotes
                                ? Math.round((count / totalVotes) * 100)
                                : 0;
                              return (
                                <div key={opt.id}>
                                  <div className="flex justify-between text-white text-sm">
                                    <span>{opt.text}</span>
                                    <span>{percent}%</span>
                                  </div>
                                  <div className="w-full bg-white/20 rounded-full h-3 mt-1 mb-2">
                                    <div
                                      className="h-3 rounded-full transition-all duration-300 bg-blue-400"
                                      style={{
                                        width:
                                          percent === 0 ? "4%" : `${percent}%`,
                                        minWidth:
                                          percent === 0 ? "16px" : undefined,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            <p className="text-xs text-white/60 text-right">
                              รวมทั้งหมด {totalVotes} โหวต
                            </p>
                          </>
                        ) : (
                          <>
                            {q.options.map((opt) => (
                              <label
                                key={opt.id}
                                className={`flex items-center space-x-2 text-white cursor-pointer px-2 py-1 rounded-md ${
                                  selectedOptions[q.id] === opt.id
                                    ? "bg-white/30"
                                    : "hover:bg-white/10"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={opt.id}
                                  checked={selectedOptions[q.id] === opt.id}
                                  onChange={() =>
                                    setSelectedOptions((prev) => ({
                                      ...prev,
                                      [q.id]: opt.id,
                                    }))
                                  }
                                  className="form-radio accent-primary"
                                />
                                <span>{opt.text}</span>
                              </label>
                            ))}

                            <button
                              onClick={() =>
                                handleVote(q.id, selectedOptions[q.id])
                              }
                              disabled={!selectedOptions[q.id]}
                              className="mt-2 bg-white hover:bg-gray-200 text-primary w-full px-4 py-2 rounded-full text-sm transition"
                            >
                              VOTE
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Emoji reactions */}
                <div className="flex gap-2 px-2 flex-wrap">
                  {defaultEmojis.map((emoji) => {
                    const isActive =
                      posts.some(
                        (p) =>
                          p.id === post.id &&
                          p.Reaction.some((r) => r.emoji === emoji)
                      ) || (optimistic[post.id] || []).includes(emoji);

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
                        {count > 0 && (
                          <span className="font-medium">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
