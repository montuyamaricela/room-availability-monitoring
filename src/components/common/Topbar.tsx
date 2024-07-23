"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModalMenu } from "../common/ModalMenu";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const pathname = usePathname();

  return (
    <div
      className={`flex items-center bg-primary-green text-white ${pathname.includes("signup") || pathname.includes("signin") || pathname.includes("resetpassword") ? "hidden" : "block"}`}
    >
      <div className="container mx-auto py-5">
        <Link href="/" className="font-bold">
          BULACAN STATE UNIVERSITY
        </Link>
      </div>
      <ModalMenu />
    </div>
  );
}
