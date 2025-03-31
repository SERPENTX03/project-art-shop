"use client";

import { CiSearch } from "react-icons/ci";

const Search = () => {
  return (
    <>
      <CiSearch size={24} color="gray" className="absolute left-22" />
      <input
        type="text"
        placeholder="SEARCH HERE"
        className="input-custom ml-20 pl-10 relative pr-4 py-2 w-full  rounded-full "
      />
    </>
  );
};
export default Search;
