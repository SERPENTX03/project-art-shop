"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = ["ALL", "DIGITAL ART", "DRAWINGS", "PHOTOGRAPHY"];

export default function FilterCategories({ selected }: { selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "ALL") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <section className="mt-10">
      <div className="flex flex-wrap justify-center gap-6 py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className={`button-custom py-2 px-6 ${
              selected === cat ? "bg-black text-white" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}
