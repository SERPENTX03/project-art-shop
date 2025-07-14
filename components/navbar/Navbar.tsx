import { SlArrowDown } from "react-icons/sl";
import { SignedOutProfile, SignInBtn } from "./Auth";
import NavbarClient from "./NavbarClient";
import Search from "./Search";
import BasketOrder from "./BasketOrder";
import FavoliteCount from "./FavoliteCount";

const Navbar = async () => {
  return (
    <nav className="flex relative justify-between mt-10 border border-slate-500 h-20 rounded-full">
      {/* Image */}
      <div className="absolute left-0 top-0 h-full w-20 z-10">
        <SignedOutProfile />
      </div>
      {/* Search */}
      <div className="flex items-center h-full w-full mx-10 relative">
        <Search />
      </div>
      {/* NavLink */}
      <ul className="flex items-center space-x-10">
        <NavbarClient />
        <FavoliteCount />
        <BasketOrder />

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
