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
  const [selected, setSelected] = useState<Record<string, string>>({});

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
        className="cursor-pointer bg-zinc-700 rounded-t-3xl py-3 px-4 text-center shadow-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoIosArrowUp className="text-white mx-auto transition-transform duration-300 group-hover:scale-150" />
        <p className="text-white text-sm">
          Your vote means a lot to me—please support me!
        </p>
      </div>

      {/* Poll Section */}
      <div
        className={`transition-all duration-500 bg-neutral-600 text-white overflow-hidden rounded-t-xl ${
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

              {hasVoted ? (
                q.options.map((opt) => {
                  const count = opt.votes.length;
                  const percent = totalVotes
                    ? Math.round((count / totalVotes) * 100)
                    : 0;

                  return (
                    <div key={opt.id}>
                      <div className="flex justify-between text-sm">
                        <span>{opt.text}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 mt-1 mb-2">
                        <div
                          className="h-3 rounded-full bg-blue-400 transition-all duration-300"
                          style={{
                            width: percent === 0 ? "4%" : `${percent}%`,
                            minWidth: percent === 0 ? "16px" : undefined,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center space-x-2 text-white cursor-pointer px-2 py-1 rounded-md ${
                        selected[q.id] === opt.id
                          ? "bg-white/30"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt.id}
                        checked={selected[q.id] === opt.id}
                        onChange={() =>
                          setSelected((prev) => ({
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
                    disabled={!selected[q.id]}
                    onClick={() => handleVote(selected[q.id], q.id)}
                    className="mt-3 bg-white text-primary font-medium px-4 py-2 rounded-full w-full transition hover:bg-gray-200"
                  >
                    โหวต
                  </button>
                </>
              )}
              {hasVoted && (
                <p className="text-xs text-right text-white/60">
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
