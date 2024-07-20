"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModalMenu } from "../common/ModalMenu";

export default function Topbar() {
  const pathname = usePathname();

  return (
    <div
      className={`bg-primary-green text-white flex items-center ${pathname.includes("signup") || pathname.includes("signin") || pathname.includes("resetpassword") ? "hidden" : "block"}`}
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
