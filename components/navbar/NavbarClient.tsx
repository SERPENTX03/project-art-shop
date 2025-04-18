"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { NavLink } from "@/utils/Navlink";
import { useEffect, useState } from "react";

const NavbarClient = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/checkadmin");
        const data = await res.json();
        setRole(data.role);

        if (data.role === "ADMIN") {
          router.push("/admin/galleries");
        }
      } catch (error) {
        console.error("Failed to fetch role", error);
      }
    };

    fetchRole();
  }, [router]);

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
