"use client";

import { useQueryState } from "nuqs";

import { CiSearch } from "react-icons/ci";

interface SearchProps {
  refetchProducts: () => Promise<void>;
}

const Search = ({ refetchProducts }: SearchProps) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setTimeout(() => {
      refetchProducts();
    }, 300);
  };

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
