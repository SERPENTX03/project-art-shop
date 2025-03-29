"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "Categoryies ALL",
  "DIGITAL ART",
  "DRAWINGS",
  "PHOTOGRAPHY",
];

export default function FilterCategories({ selected }: { selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "Categoryies ALL") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <section className="mt-10">
      <div className="flex flex-wrap justify-center gap-6 py-4">
        {/* Dropdown Select */}
        <Select
          onValueChange={handleSelect}
          defaultValue={selected || "Categoryies ALL"}
        >
          <SelectTrigger className="w-[200px] bg-primary text-lg text-text py-5">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/*  หมวดหมู่ */}
        {categories
          .filter((cat) => cat !== "Categoryies ALL")
          .map((cat) => (
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
