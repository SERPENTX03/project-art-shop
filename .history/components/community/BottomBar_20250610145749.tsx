"use client";

import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { getPostsByArtist } from "@/actions/post";
import { togglePollVote } from "@/actions/poll";
import type { Post } from "@/types/post";

export default function BottomBar({
  artistId,
  userId,
}: {
  artistId: string;
  userId: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [latestPoll, setLatestPoll] = useState<Post | null>(null);
  const [voted, setVoted] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLatestPoll = async () => {
      const posts = await getPostsByArtist(artistId);
      const pollPost = posts.find((p) => p.PollQuestion?.length > 0);
      const voteStatus: Record<string, string> = {};

      pollPost?.PollQuestion?.forEach((q) => {
        q.options.forEach((opt) => {
          if (opt.votes.some((v) => v.userId === userId)) {
            voteStatus[q.id] = "voted";
          }
        });
      });

      setVoted(voteStatus);
      setLatestPoll(pollPost || null);
    };

    fetchLatestPoll();
  }, [artistId, userId]);

  const handleVote = async (optionId: string, questionId: string) => {
    await togglePollVote(optionId);
    const posts = await getPostsByArtist(artistId);
    const pollPost = posts.find((p) => p.PollQuestion?.length > 0);
    setLatestPoll(pollPost || null);

    setVoted((prev) => ({
      ...prev,
      [questionId]: "voted",
    }));
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      {/* Toggle Button */}
      <div
        className="cursor-pointer bg-neutral-600 rounded-t-3xl py-3 px-4 text-center shadow-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoIosArrowUp className="text-white mx-auto transition-transform duration-300 group-hover:scale-150" />
        <p className="text-white text-sm">
          Your vote means a lot to me—please support me!
        </p>
      </div>

      {/* Poll Section */}
      <div
        className={`transition-all duration-500 px-20 bg-neutral-600 text-white overflow-hidden ${
          isOpen ? "max-h-[500px] p-6" : "max-h-0 p-0"
        }`}
      >
        {latestPoll?.PollQuestion?.map((q) => {
          const totalVotes = q.options.reduce(
            (sum, o) => sum + o.votes.length,
            0
          );
          const hasVoted = voted[q.id];

          return (
            <div key={q.id} className="space-y-4">
              <p className="text-center text-lg font-medium">{q.question}</p>

              {q.options.map((opt) => {
                const count = opt.votes.length;
                const percent = totalVotes
                  ? Math.round((count / totalVotes) * 100)
                  : 0;

                const isSelected =
                  hasVoted && opt.votes.some((v) => v.userId === userId);

                return (
                  <div
                    key={opt.id}
                    className={`relative group flex items-center justify-between gap-4 px-4 py-3 rounded-xl transition cursor-pointer border border-white/10 ${
                      isSelected
                        ? "bg-blue-500/20 border-blue-400"
                        : hasVoted
                        ? "bg-white/5"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => !hasVoted && handleVote(opt.id, q.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "border-blue-400 bg-blue-400"
                            : "border-white/40"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-white text-sm">{opt.text}</span>
                    </div>

                    {hasVoted && (
                      <span className="text-sm text-white/80">{percent}%</span>
                    )}

                    {hasVoted && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    )}
                  </div>
                );
              })}

              {hasVoted && (
                <p className="text-xs text-white/60 text-right">
                  รวมทั้งหมด {totalVotes} โหวต
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
