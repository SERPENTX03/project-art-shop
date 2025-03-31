"use client";

import { parseAsInteger, useQueryState } from "nuqs";

import { CiSearch } from "react-icons/ci";

const Search = () => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const [count, setCount] = useQueryState(
    "count",
    parseAsInteger.withDefault(0)
  );

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
