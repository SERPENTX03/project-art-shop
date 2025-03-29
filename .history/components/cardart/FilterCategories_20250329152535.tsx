"use client";

type FilterCategoriesProps = {
  selected: string;
  onSelect: (value: string) => void;
};

const categories = ["ALL", "DIGITAL ART", "DRAWINGS", "PHOTOGRAPHY"];

export default function FilterCategories({
  selected,
  onSelect,
}: FilterCategoriesProps) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap justify-center gap-6 py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
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
