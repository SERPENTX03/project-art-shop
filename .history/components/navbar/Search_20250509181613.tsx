"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";

const Search = () => {
  const router = useRouter();
  const [search] = useQueryState("search", {
    defaultValue: "",
  });

  const [localSearch, setLocalSearch] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSearch(search || "");
  }, [search]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (search !== localSearch) {
        const params = new URLSearchParams(window.location.search);
        params.set("search", localSearch);
        router.push(`/?${params.toString()}`);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localSearch, router, search]);

  if (!hasMounted) return null;

  return (
    <>
      <CiSearch size={24} color="gray" className="absolute left-22" />
      <input
        type="text"
        placeholder="SEARCH HERE"
        className="input-custom ml-20 pl-10 relative pr-4 py-2 w-full rounded-full"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </>
  );
};

export default Search;
