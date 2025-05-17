"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Checkrole = ({ role }: { role: string | undefined }) => {
  const router = useRouter();

  useEffect(() => {
    if (role) {
      router.push(role === "ADMIN" ? "/admin" : "/");
    }
  }, [router, role]);

  return <></>;
};
export default Checkrole;
