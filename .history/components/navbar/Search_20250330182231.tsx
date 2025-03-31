"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

import { CiSearch } from "react-icons/ci";

const Search = () => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (search) {
      router.replace(`?search=${search}`);
    }
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
