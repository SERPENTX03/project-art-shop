"use client";
import { SlArrowDown } from "react-icons/sl";
import { useState } from "react";

const categories = ["ALL", "DIGITAL ART", "DRAWINGS", "PHOTOGRAPHY"];

const FilterCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  return (
    <>
      <section className="mt-10">
        <div className="flex flex-wrap justify-center gap-6 py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`button-custom py-2 px-6 ${
                selectedCategory === cat ? "bg-black text-white" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
    </>
  );
};
export default FilterCategories;
