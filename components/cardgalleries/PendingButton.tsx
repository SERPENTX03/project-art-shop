"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ViewMoreButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(() => {
      router.push(`/gallery/${id}`);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="button-custom py-1.5 px-3 disabled:opacity-50"
    >
      {isPending ? "Loading..." : "View more"}
    </button>
  );
}
