"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavLink } from "@/data/Navlink";

const NavbarClient = () => {
  const pathname = usePathname();

  return (
    <>
      {NavLink.map((nav, index) => (
        <li key={index}>
          <Link
            href={nav.href}
            className={`relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-current after:transition-all hover:after:w-full ${
              pathname === nav.href ? "after:w-full font-semibold" : ""
            }`}
          >
            {nav.label}
          </Link>
        </li>
      ))}
    </>
  );
};

export default NavbarClient;
