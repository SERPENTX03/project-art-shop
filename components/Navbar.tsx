import { NavLink } from "@/utils/Navlink";
import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { SlArrowDown } from "react-icons/sl";

const Navbar = () => {
  return (
    <nav className="flex justify-between mt-10 border-2 border-slate-500 h-20 rounded-full">
      {/* Image */}
      <div className="h-full w-40">
        <Image
          src="/images/profile.png"
          alt="profiles"
          className="h-full w-20"
          width={100}
          height={100}
          objectFit="cover"
          priority
        />
      </div>
      {/* Search */}
      <div className="flex items-center h-full w-full mx-10">
        <CiSearch size={24} />
        <span>SEARCH HERE</span>
      </div>
      {/* NavLink */}
      <ul className="flex items-center space-x-10">
        {NavLink.map((nav, index) => (
          <Link key={index} href={nav.href}>
            {nav.label}
          </Link>
        ))}
        <div className="border h-full w-[80px] rounded-full flex justify-center items-center text-2xl">
          <span className="mr-1">EN</span>
          <SlArrowDown size={18} />
        </div>
      </ul>
    </nav>
  );
};
export default Navbar;
