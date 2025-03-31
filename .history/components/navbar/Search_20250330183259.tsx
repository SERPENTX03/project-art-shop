"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

import { CiSearch } from "react-icons/ci";

interface SearchProps {
  refetchProducts: () => Promise<void>;
}

const Search = ({ refetchProducts }: SearchProps) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(() => {
      router.refresh();
    }, 300); // debounce 300ms

    return () => clearTimeout(delay);
  }, [search]);
  return (
    <>
      <CiSearch size={24} color="gray" className="absolute left-22" />
      <input
        type="text"
        placeholder="SEARCH HERE"
        className="input-custom ml-20 pl-10 relative pr-4 py-2 w-full  rounded-full "
        value={search || ""}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  );
};
export default Search;
