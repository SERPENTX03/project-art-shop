"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { NavLink } from "@/utils/Navlink";
import { useEffect } from "react";

const NavbarClient = ({ role }: { role: string | undefined }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (role) {
      router.push(role === "ADMIN" ? "/admin" : "/");
    }
  }, [router, role]);

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
