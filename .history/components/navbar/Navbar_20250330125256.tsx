import { CiSearch } from "react-icons/ci";
import { SlArrowDown } from "react-icons/sl";
import { SignedOutProfile, SignInBtn } from "./Auth";
import NavbarClient from "../NavbarClient";

const Navbar = async () => {
  return (
    <nav className="flex relative justify-between mt-10 border border-slate-500 h-20 rounded-full">
      {/* Image */}
      <div className="absolute left-0 top-0 h-full w-20 z-10">
        <SignedOutProfile />
      </div>
      {/* Search */}
      <div className="flex items-center h-full w-full mx-10 relative">
        <CiSearch size={24} color="gray" className="absolute left-22" />
        <input
          type="text"
          placeholder="SEARCH HERE"
          className="input-custom ml-20 pl-10 relative pr-4 py-2 w-full  rounded-full "
        />
      </div>
      {/* NavLink */}
      <ul className="flex items-center space-x-10">
        <NavbarClient />
        <SignInBtn />
        <div className="border h-full w-[80px] rounded-full flex justify-center items-center text-2xl">
          <span className="mr-1">EN</span>
          <SlArrowDown size={18} />
        </div>
      </ul>
    </nav>
  );
};
export default Navbar;
