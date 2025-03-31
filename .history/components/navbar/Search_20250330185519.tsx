"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";

import { CiSearch } from "react-icons/ci";

const Search = () => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const router = useRouter();

  const [localSearch, setLocalSearch] = useState(search || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSearch(search || "");
  }, [search]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (search !== localSearch) {
        setSearch(localSearch);
        router.refresh();
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localSearch]);
  return (
    <>
      <CiSearch size={24} color="gray" className="absolute left-22" />
      <input
        type="text"
        placeholder="SEARCH HERE"
        className="input-custom ml-20 pl-10 relative pr-4 py-2 w-full  rounded-full "
        value={localSearch || ""}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </>
  );
};
export default Search;
